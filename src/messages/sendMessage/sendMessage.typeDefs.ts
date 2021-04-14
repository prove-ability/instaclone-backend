import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    sendMessage(payload: String!, userId: Int, roomId: Int): MutationResponse!
  }
`;
