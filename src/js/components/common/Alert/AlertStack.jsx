const alertStack = [];
const alertStackDefault = {
  title: '',
  message: '',
  buttonsText: '',
  buttonsClick: null,
  onClose: null,
  isShow: false,
  onAnimation: false,
};

export default class AlertStack {
  static init() {
    if (alertStack.length < 1) {
      alertStack.push(alertStackDefault);
    }
  }

  static push(newAlert) {
    this.init();
    alertStack.push(newAlert);
  }

  static pop() {
    this.init();
    if (alertStack.length > 1) {
      alertStack.pop();
    }
  }

  static get() {
    this.init();
    return alertStack[alertStack.length - 1];
  }

  static clear() {
    this.init();
    alertStack.splice(1);
  }
}
