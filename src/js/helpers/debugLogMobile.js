import { ENABLE_SHOW_LOG } from '../config/index';

const MAX_LOGS_NUMBER = 1500;

if (ENABLE_SHOW_LOG) {
  console.logs = [];
  console.logsAll = [];
  console.logsError = [];

  console.stdlog = console.log.bind(console);
  console.log = function () {
    console.logs.push(Array.from(arguments));
    console.logsAll.push(Array.from(arguments));

    if (console.logs.length > MAX_LOGS_NUMBER) {
      console.logs.splice(0, 20);
    }
    if (console.logsAll.length > MAX_LOGS_NUMBER) {
      console.logsAll.splice(0, 20);
    }

    console.stdlog(...arguments);
  };

  console.defaultError = console.error.bind(console);
  console.error = function () {
    console.logsAll.push(Array.from(['error:', ...arguments]));
    console.logsError.push(Array.from(['error:', ...arguments]));
    if (console.logsError.length > MAX_LOGS_NUMBER) {
      console.logsError.splice(0, 20);
    }
    if (console.logsAll.length > MAX_LOGS_NUMBER) {
      console.logsAll.splice(0, 20);
    }
    // default &  console.error()
    console.defaultError(...arguments);
  };
}

export const SHOW_DEBUG_LOG = ENABLE_SHOW_LOG;
export const foo = 1;
