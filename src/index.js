const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('../graphql/schemas/schema');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const isAuth = require('./middleware/is-auth');

app.use(bodyParser.json());

app.use(isAuth);

mongoose.connect('mongodb://localhost:2717/Blogs', { useFindAndModify: false })

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(3000, () => {
    console.log('Listening on port 3000');
}); 