const { logEvents } = require("./logger");

// this will override default express error handling, by have err, req, res, and next
const errorHandler = (err, req, res, next) => {
  logEvents(
    // req.url is the url we are req, and headers.origin is the url where its being req from
    // and the errLog.log being the name of the logFileName to be passed into logEvents middleware func
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );
  console.log(err.stack);

  // server error
  // if there is a statusCode set ? (then) return that status code (res.statusCode)
  // otherwise the status is 500, server error
  const status = res.statusCode ? res.statusCode : 500;

  // status() sets a HTTP status on the response (as a Javascript object on the server side)
  // setting the status to whatever our ternery determined
  res.status(status);

  // rtkq isError: true
  res.json({ message: err.message, isError: true });
};

module.exports = errorHandler;
