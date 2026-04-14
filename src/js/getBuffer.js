export default function getBuffer() {
  const data = '{"data":{"user":{"id":1,"name":"Hitman","level":10}}}';
  const buffer = new ArrayBuffer(data.length * 2);
  const bufferView = new Uint16Array(buffer);
  for (let i = 0; i < data.length; i++) {
    bufferView[i] = data.charCodeAt(i);
  }
  return buffer;
}
