export default function toReadableText(value) {
  if (typeof value === 'object') {
    // Если это объект или массив, преобразуем в строку без отступов
    return JSON.stringify(value);
  } else {
    // Если это строка, число или другие типы данных, просто преобразуем в строку
    return String(value);
  }
}