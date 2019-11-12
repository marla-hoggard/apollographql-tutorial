const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    launches: [Launch]!
    launch(id: ID!): Launch
    me: User
  }

  type Mutation {
    # if false, booking trips failed -- check errors
    bookTrips(launchIds: [ID]!): TripUpdateReponse!

    # if false, cancellation failed -- check errors
    cancelTrip(launchId: ID!): TripUpdateReponse!

    login(email: String): String # returns login token
  }

  type TripUpdateReponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    email: String!
    trips: [Launch]!
  }

  enum PatchSize {
    SMALL
    LARGE
  }
`;

module.exports = typeDefs;