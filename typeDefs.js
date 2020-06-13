const { gql } = require('apollo-server')

module.exports = gql`
  type Query {
    orders: [String]
  }

  type Mutation {
    addOrder ( order: String! ): String

    apply ( order: String! ): String

    applySlow ( order: String! ): String
  }

  type Subscription {
    orderAdded: String

    orderRemoved: String
  }

`