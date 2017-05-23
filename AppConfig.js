var filename = './config/config.json';
var fs = require('fs');

var getMongoUrl = function(){
    if (fs.existsSync(filename)) {
        var configAPI = require(filename);
        return configAPI.mongoDBUrl;
    }else{
        return process.env.MONGODB_URL;
    } 
}




module.exports.getMongoUrl = getMongoUrl;