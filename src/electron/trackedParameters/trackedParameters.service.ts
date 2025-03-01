import { VrcParameter } from 'cmap2-shared/src/objects/vrcParameter';
import { TrackedParameter } from './trackedParameters.model';
import { IPC } from '../ipc/typedIpc.service';
import { BRIDGE } from '../bridge/bridge.service';
import { SETTINGS } from '../store/settings/settings.store';
import { Message } from 'node-osc';
import { UsedAvatarButtonDTO, UsedParameterButtonDTO, UsedPresetButtonDTO } from 'cmap2-shared';

// const ignoredOscParameters = ['/avatar/parameters/VelocityZ', '/avatar/parameters/VelocityY', '/avatar/parameters/VelocityX',
//                               '/avatar/parameters/InStation', '/avatar/parameters/Seated', '/avatar/parameters/Upright',
//                               '/avatar/parameters/AngularY', '/avatar/parameters/Grounded', '/avatar/parameters/Face',
//                               '/avatar/parameters/GestureRightWeight', '/avatar/parameters/GestureRight',
//                               '/avatar/parameters/GestureLeftWeight', '/avatar/parameters/GestureLeft', '/avatar/parameters/Voice',
//                               '/avatar/parameters/Viseme', '/avatar/parameters/VelocityMagnitude'];

export class TrackedParametersService extends Map<VrcParameter['path'], TrackedParameter> {
  private clearOnAvatarChange = SETTINGS.get('trackedParameters').clearOnAvatarChange;
  private blacklist = new Set<string>(SETTINGS.get('trackedParameters').blacklist);
  private ignoredParameters = new Set(['/avatar/parameters/VelocityZ', '/avatar/parameters/VelocityY', '/avatar/parameters/VelocityX',
                                       '/avatar/parameters/AngularY', '/avatar/parameters/Upright',
                                       '/avatar/parameters/GestureRightWeight', '/avatar/parameters/GestureLeftWeight',
                                       '/avatar/parameters/Voice', '/avatar/parameters/Viseme',
                                       '/avatar/parameters/VelocityMagnitude']);

  private resetFrequencyIntervalMs = 2000; // How often do we reset/reduce frequency values

  private bufferFrequencyLimit = Math.floor(this.resetFrequencyIntervalMs / 300); // anything more than once per 400ms gets buffered
  private bufferTimeMs = 1000;

  constructor() {
    super();

    SETTINGS.onChange('trackedParameters', settings => {
      this.clearOnAvatarChange = settings.clearOnAvatarChange;
      this.blacklist = new Set(settings.blacklist);
    });

    BRIDGE.on('osc:vrcParameter', vrcParameter => this.onVrcParameter(vrcParameter));
    BRIDGE.on('socket:applyParameters', callback => callback(this.toVrcParameterList()));
    BRIDGE.on('socket:usedParameterButton', usedParameterButton => this.onUsedParameterButton(usedParameterButton));
    BRIDGE.on('socket:usedPresetButton', usedPresetButton => this.onUsedPresetButton(usedPresetButton));
    BRIDGE.on('socket:usedAvatarButton', usedAvatarButton => this.onUsedAvatarButton(usedAvatarButton));

    IPC.handle('trackedParameters:getIgnoredParameters', async () => Array.from(this.ignoredParameters.values()));
    IPC.handle('trackedParameters:getTrackedParameters', async () => Array.from(this.entries()));
    IPC.handle('trackedParameters:getBufferFrequencyLimit', async () => this.bufferFrequencyLimit);

    setInterval(() => this.resetFrequencies(), this.resetFrequencyIntervalMs);
  }

  /**
   * Main entry method to consume vrcParameters from OSC
   *
   */
  private onVrcParameter(vrcParameter: VrcParameter) {
    // filter ignored parameters
    if (this.ignoredParameters.has(vrcParameter.path)) return;

    // filter blacklisted parameters
    if (this.blacklist.has(vrcParameter.path)) return;

    const trackedParameter = this.setValue(vrcParameter);

    // if it's change avatar parameter then execute that logic to clear parameters
    if (this.clearOnAvatarChange && vrcParameter.path.startsWith('/avatar/change')) this.clearParametersAfterAvatarChange();

    this.bufferAndEmitTrackedParameter(vrcParameter.path, trackedParameter);
  }

  /**
   * Handle tracked parameter buffering and emit them when they're ready
   *
   */
  bufferAndEmitTrackedParameter(path: string, trackedParameter: TrackedParameter) {
    // if it's already buffered return
    if (trackedParameter.buffered) return;

    // check parameter frequency and buffer if needed before sending it over socket
    if (trackedParameter.frequency > this.bufferFrequencyLimit) {
      trackedParameter.setBuffered(true);
      setTimeout(() => {
        // send out value as it will be after timeout and unbuffer parameter
        BRIDGE.emit('trackedParameters:vrcParameter', { path: path, value: trackedParameter.value });
        IPC.emit('trackedParameters:trackedParameter', [path, trackedParameter]);
        trackedParameter.setBuffered(false);
      }, this.bufferTimeMs);
    } else {
      // emit parameter without buffering
      BRIDGE.emit('trackedParameters:vrcParameter', { path: path, value: trackedParameter.value });
      IPC.emit('trackedParameters:trackedParameter', [path, trackedParameter]);
    }
  }

  /**
   * usedParameterButton is received from server when someone presses a button
   *
   * Check if parameter can be used based on current exp
   *
   * Emit button parameter and any additional callback parameters after a delay to vrchat
   *
   */
  private onUsedParameterButton(usedParameterButton: UsedParameterButtonDTO) {
    const canSend = !usedParameterButton.exp || this.consumeExpCost(usedParameterButton.exp.path, usedParameterButton.exp.value);
    if (!canSend) return;

    BRIDGE.emit('osc:sendMessage', new Message(usedParameterButton.path, usedParameterButton.value));

    usedParameterButton.callbackParameters.forEach(cp => {
      setTimeout(() => BRIDGE.emit('osc:sendMessage', new Message(cp.path, cp.value)), 1000 * cp.seconds);
    });
  }

  /**
   * usedPresetButton is received from server when someone presses a preset button
   *
   * Check if preset can be used based on current exp
   *
   * Emit parameters and any additional callback parameters after a delay to vrchat
   *
   */
  private onUsedPresetButton(usedPresetButton: UsedPresetButtonDTO) {
    const canSend = !usedPresetButton.exp || this.consumeExpCost(usedPresetButton.exp.path, usedPresetButton.exp.value);
    if (!canSend) return;

    usedPresetButton.parameters.forEach(p => {
      BRIDGE.emit('osc:sendMessage', new Message(p.path, p.value));
    });

    usedPresetButton.callbackParameters.forEach(cp => {
      setTimeout(() => BRIDGE.emit('osc:sendMessage', new Message(cp.path, cp.value)), 1000 * cp.seconds);
    });
  }

  /**
   * usedAvatarButton is received from server when someone presses an avatar button
   *
   * Emit avatar change parameter to vrchat
   *
   */
  private onUsedAvatarButton(usedAvatarButton: UsedAvatarButtonDTO) {
    BRIDGE.emit('osc:sendMessage', new Message('/avatar/change', usedAvatarButton.vrcAvatarId));
  }

  /**
   * If parameter for exp is avaiable and is a number then reduce it and if it's still a viable value (>=0) emit new exp parameter to vrchat
   *
   */
  private consumeExpCost(path: string, exp: number): boolean {
    const value = this.get(path)?.value;

    if (typeof value !== 'number') return true;

    let newValue = value - exp;
    if (newValue < 0) return false;

    BRIDGE.emit('osc:sendMessage', new Message(path, newValue));
    return true;
  }

  /**
   * Logic for clearing parameters when detecting avatar change parameter
   *
   */
  private clearParametersAfterAvatarChange() {
    // wait time in ms before and after avatar change parameter where we collect avatar parameters
    const waitTime = 300;

    setTimeout(() => {
      // set cutoutTime to 2 * wait time
      const cutoutTime = Date.now() - (waitTime * 2);

      // filter tracked parameters that are older than cutoutTime
      this.forEach((tp, path) => {
        if (tp.lastActivity < cutoutTime) this.delete(path);
      });

      // emit new tracked parameters
      const vrcParameters = this.toVrcParameterList();
      BRIDGE.emit('trackedParameters:vrcParameters', vrcParameters);
      IPC.emit('trackedParameters:trackedParameters', Array.from(this.entries()));

    }, waitTime);
  }

  /**
   * Reset or reduce the frequency number for each tracked parameter
   *
   */
  private async resetFrequencies() {
    // How many frequency points we reduce, calculated to 1 per full second for each second of reset interval (or at least one point)
    const intervalPoints = Math.max(1, Math.floor(this.resetFrequencyIntervalMs / 1000));
    this.forEach(tp => {
      if (tp.buffered) return; // skip if parameter is buffered
      tp.frequency = Math.max(0, tp.frequency - intervalPoints);
    });
  }

  /**
   * Sets the value for vrcParameter in the map while also retreiving TrackedParameter object
   *
   */
  public setValue(vrcParameter: VrcParameter) {
    let param = this.get(vrcParameter.path);
    if (!param) {
      param = new TrackedParameter(vrcParameter.value);
      super.set(vrcParameter.path, param);
    } else {
      param.setValue(vrcParameter.value);
    }
    return param;
  }

  public toVrcParameterList(): VrcParameter[] {
    return [...this.entries()].map(p => ({ path: p[0], value: p[1].value }));
  }
}
