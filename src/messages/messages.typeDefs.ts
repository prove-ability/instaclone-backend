import { gql } from "apollo-server-express";

export default gql`
  type Message {
    id: Int!
    payload: String!
    read: Boolean!
    user: User!
    room: Room!
    createdAt: String!
    updatedAt: String!
  }
  type Room {
    id: Int!
    unreadTotal: Int!
    users: [User]
    messages: [Message]
    createdAt: String!
    updatedAt: String!
  }
`;
