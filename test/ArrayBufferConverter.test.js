import ArrayBufferConverter from '../src/js/ArrayBufferConverter';
import getBuffer from '../src/js/getBuffer';

describe('ArrayBufferConverter', () => {
  let converter;
  let buffer;

  beforeEach(() => {
    converter = new ArrayBufferConverter();
    buffer = getBuffer();
  });

  describe('constructor', () => {
    test('should create instance with null buffer', () => {
      expect(converter).toBeInstanceOf(ArrayBufferConverter);
      expect(converter.getBuffer()).toBeNull();
      expect(converter.isLoaded()).toBe(false);
    });
  });

  describe('load method', () => {
    test('should load valid ArrayBuffer', () => {
      converter.load(buffer);
      expect(converter.getBuffer()).toBe(buffer);
      expect(converter.isLoaded()).toBe(true);
    });

    test('should throw error when argument is not ArrayBuffer', () => {
      expect(() => converter.load('not buffer')).toThrow('Argument must be an ArrayBuffer');
      expect(() => converter.load(123)).toThrow('Argument must be an ArrayBuffer');
      expect(() => converter.load(null)).toThrow('Argument must be an ArrayBuffer');
      expect(() => converter.load(undefined)).toThrow('Argument must be an ArrayBuffer');
      expect(() => converter.load({})).toThrow('Argument must be an ArrayBuffer');
      expect(() => converter.load([])).toThrow('Argument must be an ArrayBuffer');
    });

    test('should overwrite existing buffer', () => {
      const firstBuffer = buffer;
      const secondBuffer = getBuffer();

      converter.load(firstBuffer);
      expect(converter.getBuffer()).toBe(firstBuffer);

      converter.load(secondBuffer);
      expect(converter.getBuffer()).toBe(secondBuffer);
      expect(converter.getBuffer()).not.toBe(firstBuffer);
    });
  });

  describe('toString method', () => {
    test('should convert ArrayBuffer to correct string', () => {
      converter.load(buffer);
      const result = converter.toString();

      expect(result).toBe('{"data":{"user":{"id":1,"name":"Hitman","level":10}}}');
      expect(typeof result).toBe('string');
    });

    test('should throw error when no buffer loaded', () => {
      expect(() => converter.toString()).toThrow('No buffer loaded. Call load() first.');
    });

    test('should handle empty buffer', () => {
      const emptyBuffer = new ArrayBuffer(0);
      converter.load(emptyBuffer);
      const result = converter.toString();
      expect(result).toBe('');
    });

    test('should handle buffer with special characters', () => {
      const specialData = '{"test":"special @#$%^&*() chars"}';
      const specialBuffer = new ArrayBuffer(specialData.length * 2);
      const bufferView = new Uint16Array(specialBuffer);
      for (let i = 0; i < specialData.length; i++) {
        bufferView[i] = specialData.charCodeAt(i);
      }

      converter.load(specialBuffer);
      const result = converter.toString();
      expect(result).toBe(specialData);
    });

    test('should handle buffer with Unicode characters', () => {
      const unicodeData = '{"name":"Привет мир 🌍"}';
      const unicodeBuffer = new ArrayBuffer(unicodeData.length * 2);
      const bufferView = new Uint16Array(unicodeBuffer);
      for (let i = 0; i < unicodeData.length; i++) {
        bufferView[i] = unicodeData.charCodeAt(i);
      }

      converter.load(unicodeBuffer);
      const result = converter.toString();
      expect(result).toBe(unicodeData);
    });
  });

  describe('clear method', () => {
    test('should clear loaded buffer', () => {
      converter.load(buffer);
      expect(converter.isLoaded()).toBe(true);

      converter.clear();
      expect(converter.getBuffer()).toBeNull();
      expect(converter.isLoaded()).toBe(false);
    });

    test('should allow clearing when no buffer', () => {
      expect(converter.getBuffer()).toBeNull();
      converter.clear();
      expect(converter.getBuffer()).toBeNull();
    });

    test('should allow loading after clear', () => {
      converter.load(buffer);
      converter.clear();

      expect(() => converter.toString()).toThrow('No buffer loaded. Call load() first.');

      converter.load(buffer);
      expect(converter.toString()).toBe('{"data":{"user":{"id":1,"name":"Hitman","level":10}}}');
    });
  });

  describe('isLoaded method', () => {
    test('should return false initially', () => {
      expect(converter.isLoaded()).toBe(false);
    });

    test('should return true after loading', () => {
      converter.load(buffer);
      expect(converter.isLoaded()).toBe(true);
    });

    test('should return false after clear', () => {
      converter.load(buffer);
      converter.clear();
      expect(converter.isLoaded()).toBe(false);
    });
  });

  describe('getBuffer method', () => {
    test('should return null initially', () => {
      expect(converter.getBuffer()).toBeNull();
    });

    test('should return loaded buffer', () => {
      converter.load(buffer);
      expect(converter.getBuffer()).toBe(buffer);
    });

    test('should return null after clear', () => {
      converter.load(buffer);
      converter.clear();
      expect(converter.getBuffer()).toBeNull();
    });
  });

  describe('integration with getBuffer function', () => {
    test('should correctly convert real buffer from getBuffer', () => {
      const realBuffer = getBuffer();
      converter.load(realBuffer);
      const result = converter.toString();

      expect(result).toBe('{"data":{"user":{"id":1,"name":"Hitman","level":10}}}');

      const parsed = JSON.parse(result);
      expect(parsed.data.user.id).toBe(1);
      expect(parsed.data.user.name).toBe('Hitman');
      expect(parsed.data.user.level).toBe(10);
    });

    test('should handle multiple conversions', () => {
      converter.load(buffer);
      const result1 = converter.toString();
      const result2 = converter.toString();

      expect(result1).toBe(result2);
      expect(result1).toBe('{"data":{"user":{"id":1,"name":"Hitman","level":10}}}');
    });
  });

  describe('edge cases', () => {
    test('should handle buffer with single character', () => {
      const singleChar = 'A';
      const singleBuffer = new ArrayBuffer(singleChar.length * 2);
      const bufferView = new Uint16Array(singleBuffer);
      bufferView[0] = singleChar.charCodeAt(0);

      converter.load(singleBuffer);
      expect(converter.toString()).toBe('A');
    });

    test('should handle buffer with numbers', () => {
      const numberData = '1234567890';
      const numberBuffer = new ArrayBuffer(numberData.length * 2);
      const bufferView = new Uint16Array(numberBuffer);
      for (let i = 0; i < numberData.length; i++) {
        bufferView[i] = numberData.charCodeAt(i);
      }

      converter.load(numberBuffer);
      expect(converter.toString()).toBe('1234567890');
    });

    test('should preserve exact string length', () => {
      converter.load(buffer);
      const result = converter.toString();
      const expected = '{"data":{"user":{"id":1,"name":"Hitman","level":10}}}';

      expect(result.length).toBe(expected.length);
      expect(result).toBe(expected);
    });
  });
});
