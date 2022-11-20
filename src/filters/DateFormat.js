import moment from 'moment';

export default function (uxTimestamp) {
  const date = moment(Number(uxTimestamp), 'x').format('DD/MM/YYYY | kk:mm');
  return date.replace('|', 'lúc');
}
