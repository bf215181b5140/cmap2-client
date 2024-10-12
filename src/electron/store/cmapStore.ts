import ElectronStore, { Options } from 'electron-store';

export default class CmapStore<T extends Record<string, any> = Record<string, unknown>> extends ElectronStore<T> {

  constructor(options: Options<T>) {
    super(options);

    if (typeof options.defaults === 'object' && options.defaults !== null) {
      this.setDefaultsForObject(options.defaults, '');
    }
  }

  // Workaround to set all defaults manually because ElectronStore doesn't set defaults properly...
  // https://github.com/sindresorhus/electron-store/issues/92
  private setDefaultsForObject(defaults: Record<string, any>, storePath: string): void {
    Object.keys(defaults).forEach(key => {
      const storeValue = this.get(storePath + key);
      if (storeValue === undefined) {
        this.set(storePath + key, defaults[key]);
      } else if (typeof storeValue === 'object' && storeValue !== null) {
        this.setDefaultsForObject(defaults[key], storePath + key + '.');
      }
    });
  }
}
