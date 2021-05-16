const log = require("js-logger");

log.useDefaults({
  defaultLevel: log.ALL,
  formatter: function (messages, context) {
    messages.unshift('[', new Date().toLocaleString(), ']');
  },
});

module.exports = log;