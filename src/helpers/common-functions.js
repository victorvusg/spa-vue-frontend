import moment from 'moment';

const groupBy = (array, key) => {
  const keys = key.split('.');
  if (keys.length > 1) {
    return array.reduce((result, currentValue) => {
      (result[currentValue[keys[0]][keys[1]]] = result[currentValue[keys[0]][keys[1]]] || [])
        .push(currentValue);
      return result;
    }, {});
  }
  // Return the end result
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
    return result;
  }, {}); // empty object is the initial value for result object
};
const expired = (date) => {
  const expiryDate = moment(date);
  const today = moment(new Date()).local();
  // Het han
  if (expiryDate.diff(today, 'days') < 0) {
    return true;
  }
  return false;
};
const isDifferent = (object1, object2) => {
  const origin = JSON.stringify(object1);
  const currentModified = JSON.stringify(object2);
  if (origin === currentModified) {
    return false;
  }
  return true;
};
export default { groupBy, expired, isDifferent };
