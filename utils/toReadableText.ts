export default function toReadableText(value) {
  if (typeof value === 'object') { return JSON.stringify(value); }
  else { return String(value); }
}