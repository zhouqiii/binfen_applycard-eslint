import Vue from 'vue';
import { notNull, getStrByFlexFormat } from './commonBase';

// 金额三位以','分隔
Vue.filter('NumberFormat', (num) => {
  if (!notNull(num)) {
    return '0';
  }
  const numbers = String(num);
  if (numbers.indexOf(',') > 0) {
    return numbers;
  }
  let numReverse;
  let str;
  let strReverse;
  if (numbers.indexOf('.') > 0) { // 有小数点
    const len = numbers.indexOf('.');
    const numBef = numbers.substring(0, len);
    const numAft = numbers.substring(len, numbers.length);
    numReverse = numBef.split('').reverse().join(''); // 将字符串顺序颠倒
    str = getStrByFlexFormat(numReverse, 3, ',');
    strReverse = str.split('').reverse().join(''); // 将字符串顺序颠倒
    strReverse += numAft;
  } else { // 无小数点
    numReverse = numbers.split('').reverse().join(''); // 将字符串顺序颠倒
    str = getStrByFlexFormat(numReverse, 3, ',');
    strReverse = str.split('').reverse().join(''); // 将字符串顺序颠倒
    strReverse += '.00';
  }
  return strReverse;
});

// 数字前加货币单位 ¥ $等,type = 1为单位加在前面,type = 2为单位加在数字后面
Vue.filter('MoneyUnit', (value, unit, type = 1) => {
  if (!notNull(value)) {
    return 0;
  }
  if (type === 2) {
    return `${value} ${unit}`;
  }
  return `${unit} ${value}`;
});

// Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
//   return moment(dataStr).format(pattern)
// })

// Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
//   return moment(dataStr).format(pattern)
// })
