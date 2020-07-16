const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');

let database = 'Blogs';

async function startDatabase() {
  mongoose.connect('mongodb://localhost:2717/'+database, { useFindAndModify: false });

    mongoose.connection.once('open', () => {
        console.log('conneted to database');
    });

  if (!database) {
    database = connection.db();
  }

  return database;
}

module.exports = startDatabase;