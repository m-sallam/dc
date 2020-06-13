const { UserInputError } = require('apollo-server')

const ORDER_ADDED = 'orderAdded'
const ORDER_REMOVED = 'orderRemoved'

const applications = new Set() // assume this is redis or something or similar functionality
const orders = new Set()

const wait = (time) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(), time)
})

module.exports = {
  Query: {
    orders: async (parent, args, ctx) => {
      return Array.from(orders)
    },
  },
  Mutation: {
    addOrder: async (parent, args, { pubSub }) => {
      // orders will still be unique but there will be no errors thrown if an existing order name was added
      orders.add(args.order)
      pubSub.publish(ORDER_ADDED, { orderAdded: args.order })
      return args.order
    },
    apply: async (parent, args, { pubSub }) => {
      if (applications.has(args.order)) return new UserInputError('order no longer exists')
      applications.add(args.order)
      // TODO: remove the the order from the applications after making sure it is no longer available for clients

      orders.delete(args.order)
      pubSub.publish(ORDER_REMOVED, { orderRemoved: args.order })
      return 'applied to order'
    },
    applySlow: async (parent, args, { pubSub }) => {
      await wait (4000)
      if (applications.has(args.order)) return new UserInputError('order no longer exists')
      applications.add(args.order)
      // TODO: remove the the order from the applications after making sure it is no longer available for clients

      orders.delete(args.order)
      pubSub.publish(ORDER_REMOVED, { orderRemoved: args.order })
      return 'applied to order'
    },
  },
  Subscription: {
    orderAdded: {
      subscribe: (parent, args, { pubSub }) => pubSub.asyncIterator(ORDER_ADDED),
    },
    orderRemoved: {
      subscribe: (parent, args, { pubSub }) => pubSub.asyncIterator(ORDER_REMOVED),
    },
  },
}