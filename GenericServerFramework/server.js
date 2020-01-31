// SERVER LAUNCHING CLASS 
class ServerStarter {
    constructor() {
        this.app = express();
        this.app.listen(serverConfigs.port);
    }
}
/* imports and requires */
let app;
const express = require('express');
const sql = require('mysql');
const DBControllerClass = require('./controllers/DBController.js');
const serverConfigs = require('./configs/dev/serverconf.js'); // On other environment chnage dev to require env env 
const dbConfigs = require('./configs/dev/dbconfigs.js');
const serverStarter = new ServerStarter(); // start server 
const dbObj = new DBControllerClass(sql, dbConfigs.connectionCreationConfigs);
// start code from here 

/*GET REQUESTS */
//serverStarter.app.get('/login')













/*POST REQUESTS*/