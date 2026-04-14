import ArrayBufferConverter from './js/ArrayBufferConverter';
import getBuffer from './js/getBuffer';

console.log('=== ArrayBuffer Converter Demo ===\n');

const converter = new ArrayBufferConverter();
const buffer = getBuffer();

console.log('Original buffer:', buffer);
console.log('Buffer byte length:', buffer.byteLength);

converter.load(buffer);
const jsonString = converter.toString();

console.log('\nConverted string:', jsonString);

try {
  const parsedData = JSON.parse(jsonString);
  console.log('\nParsed object:', parsedData);
  console.log('User name:', parsedData.data.user.name);
  console.log('User level:', parsedData.data.user.level);
} catch (error) {
  console.error('Parse error:', error.message);
}

console.log('\n=== Additional Tests ===');
console.log('Is loaded:', converter.isLoaded());

converter.clear();
console.log('After clear - is loaded:', converter.isLoaded());

export default converter;
