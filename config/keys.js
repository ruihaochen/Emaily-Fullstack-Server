// keys.js - figure out what set of credentials to return
if (process.env.NODE_ENV == 'production'){
  // production version
  module.exports = require('./prod');
}else{
  // development version
  module.exports = require('./dev');
}
