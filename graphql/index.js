import { schemaComposer } from 'graphql-compose';

const queries = require('./Query');
const mutation = require('./mutation');
schemaComposer.Query.addFields(queries);
schemaComposer.Mutation.addFields(mutation);

const graphqlSchema = schemaComposer.buildSchema();
module.exports = graphqlSchema;
