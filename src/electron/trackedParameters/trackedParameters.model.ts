import { VrcParameter } from 'cmap2-shared/src/objects/vrcParameter';

export class TrackedParameter {
  private _value: VrcParameter['value'];
  frequency: number;
  lastActivity: number;
  buffered: boolean = false

  constructor(value: VrcParameter['value']) {
    this._value = value;
    this.frequency = 1;
    this.lastActivity = Date.now();
  }

  public set value(value: VrcParameter['value']) {
    this._value = value;
    if (!this.buffered) this.frequency++;
    this.lastActivity = Date.now();
  }

  public get value() {
    return this._value;
  }
}
