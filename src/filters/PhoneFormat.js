// MyFilter.js
export default function (value) {
  const phone = String(value).split('');
  phone.splice(3, 0, ' ');
  phone.splice(7, 0, ' ');
  return phone.join('');
}
