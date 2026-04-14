export default class ArrayBufferConverter {
  constructor() {
    this.buffer = null;
  }

  load(buffer) {
    if (!(buffer instanceof ArrayBuffer)) {
      throw new Error('Argument must be an ArrayBuffer');
    }
    this.buffer = buffer;
  }

  toString() {
    if (!this.buffer) {
      throw new Error('No buffer loaded. Call load() first.');
    }

    const bufferView = new Uint16Array(this.buffer);
    let result = '';

    for (let i = 0; i < bufferView.length; i++) {
      result += String.fromCharCode(bufferView[i]);
    }

    return result;
  }

  clear() {
    this.buffer = null;
  }

  isLoaded() {
    return this.buffer !== null;
  }

  getBuffer() {
    return this.buffer;
  }
}
