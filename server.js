const express = require('express');
const connectDB = require('./config/db');
const graphqlHTTP = require('express-graphql');
const graphql = require('./graphql');
const bodyparse = require('body-parser')
const isAuth = require('./middleware/is-auth')

const app = express();


connectDB();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
    
  );
  next();
});

app.use(express.json({ extend: false }));

app.use( bodyparse.json())

app.use(isAuth)

app.use(
  '/graphql',
  graphqlHTTP(req => ({
    schema: graphql,
    rootValue: graphql,
    graphiql: true,
    context: {
      auth : req.isAuth,
      userId : req.userId
    },
    customFormatErrorFn(err){
      if(!err.originalError){
        return err
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.'
      const code = err.originalError.code || 500
      return { message: message , status : code , data:data}

    }
  }))
);

app.get('/', (req, res) => res.send('API RUNNING'));

const PORT = process.env.PORT ||  9988;

app.listen(PORT, () => console.log(`Server Started on PORT : ${PORT}`));
