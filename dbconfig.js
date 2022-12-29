const mongodb = require('mongodb');
const mongodbClient = mongodb.MongoClient;
const dbName = 'project';
const dbUrl = 'mongodb+srv://EswarB:Eswarbilla89@eswar.niw4qhq.mongodb.net/?retryWrites=true&w=majority';

module.exports = {dbName,dbUrl,mongodbClient,mongodb}