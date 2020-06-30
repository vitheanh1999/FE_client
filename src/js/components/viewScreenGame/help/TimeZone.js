export default class TimeZone {
  static formatTime(number, length) {
    let str = `${number}`;
    while (str.length < length) {
      str = `0${str}`;
    }
    return str;
  }

  static getTimeZone() {
    const offset = new Date().getTimezoneOffset();
    return ((offset < 0 ? '+' : '-') // Note the reversed sign!
      + TimeZone.formatTime(parseInt(Math.abs(offset / 60), 10), 2));
    // + TimeZone.formatTime(Math.abs(offset % 60), 2));
  }
}
