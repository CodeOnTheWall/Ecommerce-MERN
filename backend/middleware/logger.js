// 3rd party middleware
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

// nodejs modules
// The Node.js file system module allows you to work with the file system on your computer
// methods attached with fs i.e. read, create, update, delete, rename files
const fs = require("fs");
const fsPromises = require("fs").promises;
// node:path module provides utilities for working with file and directory paths.
const path = require("path");

// helper function - expecting message, and name of log file to be created
const logEvents = async (message, logFileName) => {
  // new Date object, and formatting it the way i like below, \t is tab
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  // uuid creates a unique id for each log item, \n is line break
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    // existsSync checks if a file already exists in a given path or not
    // if not already there, then mkdir
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    // then append file to logs folder, with the data inside being the logItem itself
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

// custom middleware, needs next to be able to go to next middleware and run that
const logger = (req, res, next) => {
  // headers.origin is where req url originated from, this will be undefined in dev
  // this will be the passed in message, and reqLog.log will be passed in log file name
  // .log is like txt file but its the convention for writing logs
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  // console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logEvents, logger };
