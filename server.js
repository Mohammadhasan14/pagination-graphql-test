import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();

const typeDefs = gql`
  type Person {
    name: String
    age: Int
  }

  type PageInfo {
    hasNextPage: Boolean
    hasPreviousPage: Boolean
    startCursor: String
    endCursor: String
  }

  type PeopleConnection {
    edges: [PersonEdge]
    pageInfo: PageInfo
  }

  type PersonEdge {
    cursor: String
    node: Person
  }

  type Query {
    people(first: Int, after: String, last: Int, before: String): PeopleConnection
  }
`;

const people = [
    // Array of people data
    { name: 'John', age: 25 },
    { name: 'Emma', age: 32 },
    { name: 'Michael', age: 41 },
    { name: 'Sophia', age: 19 },
    { name: 'David', age: 36 },
    { name: 'Olivia', age: 28 },
    { name: 'Daniel', age: 33 },
    { name: 'Emily', age: 22 },
    { name: 'William', age: 39 },
    { name: 'Isabella', age: 27 },
    { name: 'Alexander', age: 30 },
    { name: 'Ava', age: 23 },
    { name: 'Matthew', age: 29 },
    { name: 'Mia', age: 31 },
    { name: 'James', age: 26 },
    { name: 'Charlotte', age: 20 },
    { name: 'Benjamin', age: 35 },
    { name: 'Liam', age: 24 },
    { name: 'Victoria', age: 37 },
    { name: 'Grace', age: 34 }
];

const resolvers = {
    Query: {
        people: (_, args) => {
            const { first, after, last, before } = args;

            // Applying pagination logic here based on the arguments passed

            // Assuming that the 'people' array is sorted in ascending order of age
            const startIndex = after ? people.findIndex(person => person.age === parseInt(after, 10)) + 1 : 0;
            const endIndex = before ? people.findIndex(person => person.age === parseInt(before, 10)) : people.length;

            const slicedData = people.slice(startIndex, endIndex);

            const edges = slicedData.map(person => ({
                cursor: person.age.toString(),
                node: person,
            }));

            return {
                edges,
                pageInfo: {
                    hasNextPage: endIndex < people.length,
                    hasPreviousPage: startIndex > 0,
                    startCursor: edges.length > 0 ? edges[0].cursor : null,
                    endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                },
            };
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });
// console.log(server)
// console.log(server)
async function startServer() {
    await server.start();
    server.applyMiddleware({ app });
  }


  startServer().then(() => {
    app.listen(3000, () => {
      console.log('Server is listening on port 3000');
    });
  });
