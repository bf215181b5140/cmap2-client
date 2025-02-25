import { VrcParameter } from 'cmap2-shared/src/objects/vrcParameter';

export interface TrackedParameterDTO {
  path: VrcParameter['path'];
  value: VrcParameter['value'];
  frequency: number;
  lastActivity: number;
  buffered: boolean;
}

export class TrackedParameter {
  value: VrcParameter['value'];
  frequency: number;
  lastActivity: number;
  buffered: boolean = false;

  constructor(value: VrcParameter['value']) {
    this.value = value;
    this.frequency = 1;
    this.lastActivity = Date.now();
  }

  public setValue(value: VrcParameter['value']) {
    this.value = value;
    if (!this.buffered) this.frequency++;
    this.lastActivity = Date.now();
  }

  public setBuffered(buffered: boolean) {
    this.buffered = buffered;
    if (!buffered) this.frequency = Math.max(0, this.frequency - 1);
  }
}
