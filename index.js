const { ApolloServer, PubSub } = require('apollo-server')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

// should be replaced with an implementation suitable for production
// see: https://www.apollographql.com/docs/apollo-server/data/subscriptions/#pubsub-implementations
const pubSub = new PubSub()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res, pubSub })
})

server.listen(process.env.PORT || 5000).then(({ url }) => console.log(`Server ready at ${url}. `))

