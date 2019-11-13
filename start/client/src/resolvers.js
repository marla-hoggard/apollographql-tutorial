import gql from 'graphql-tag';
import { GET_CART_ITEMS } from './pages/cart';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [Launch]
  }
`;

export const schema = gql`
  extend type Launch {
    isInCart: Boolean!
  }
`;

// Each resolver has arguments (parent, args, context, info)
export const resolvers = {
  Launch: {
    isInCart: (launch, _, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
      return cartItems.includes(launch.id);
    },
  },
  Mutation: {
    addOrRemoveFromCart: (_, { id }, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
      const data = {
        cartItems: cartItems.includes(id)
          ? cartItems.filter(i => i !== id) // Remove
          : [...cartItems, id], // Add
      };
      cache.writeQuery({ query: GET_CART_ITEMS, data });
      return data.cartItems;
    }
  },
};