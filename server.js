
const ServerMain = require('./ServerMain')
ServerMain.startHttp();
ServerMain.startHttps();

const ServerRs = require('./ServerRs')
ServerRs.startHttp();
ServerRs.startHttps();
