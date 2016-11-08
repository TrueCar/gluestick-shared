/* eslint-disable no-console */
//import pino from "pino";
//import expressPinoLogger from "express-pino-logger";

//export const pinoBaseConfig = {
//  name: "GlueStick",
//  safe: true,
//  level: "warn"
//};

const CLI_PARAM_MAP = {
  "logLevel": "level",
  "logPretty": "pretty"
};

export function parseLogOptions(options) {
  const object = JSON.parse(options);
  const result = {};

  Object.entries(CLI_PARAM_MAP).forEach(e => {
    const [key, value] = e;
    if (object.hasOwnProperty(key)) {
      result[value] = object[key];
    }
  });

  return result;
}

function getCliOptions() {
  const cliOptions = process.env.GS_COMMAND_OPTIONS;
  return cliOptions ? parseLogOptions(process.env.GS_COMMAND_OPTIONS) : null;
}

const levels = {
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
};

const defaultLogger = {
  debug: console.log,
  info: console.log,
  warn: console.warn,
  error: console.error
};

class Logger {
  constructor(options, provider=defaultLogger) {
    this.level = options.level || "info";
    this.provider = provider;
  }

  debug(...args) {
    this._log("debug", args);
  }

  info(...args) {
    this._log("info", args);
  }

  warn(...args) {
    this._log("warn", args);
  }

  error(...args) {
    this._log("error", args);
  }

  _log(level, args) {
    // perform level check if using default logger
    if(this.provider === defaultLogger && levels[this.level] > levels[level]) {
      return;
    }

    this.provider[level](...args);
  }
}

const defaultInstance = () => {
  if (typeof(window) === "object") {
    //console.log(">>> In the browser, returning empty");
    return {};
  }
  return new Logger(getCliOptions());
};

function createAppLogger(appConfig) {
  //console.log(">>> Creating app logger with config:", appConfig);
  let appLogger = null;

  if (appConfig) {
    appLogger = appConfig.logging;

    if (typeof(appLogger.create) === "function") {
      const options = getCliOptions();
      appLogger = appLogger.create(options);
    }
  }

  return appLogger;
}

let appLogger;

export default function getLogger(appConfig) {
  if (typeof(window) === "object") {
    //console.log(">>> In the browser");
    return {};
  }

  if (typeof(appLogger) === "undefined") {
    appLogger = createAppLogger(appConfig);
  }

  // If the provider is defined, return that. Otherwise return
  // our own instance.
  return appLogger || defaultInstance;
}

//function getLoggerMiddleware() {
//  return getLogger(true);
//}
