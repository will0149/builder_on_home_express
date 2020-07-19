const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('../graphql/schemas/schema');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const isAuth = require('./middleware/is-auth');

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

app.use(isAuth);

mongoose.connect('mongodb://localhost:2717/civilJobs', { useFindAndModify: false })

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(8000, () => {
    console.log('Listening on port 8000');
}); 