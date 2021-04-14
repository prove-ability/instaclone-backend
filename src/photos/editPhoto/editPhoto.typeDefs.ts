import { gql } from "apollo-server-express";

// 보통 Mutation 만 result 을 만들어준다
export default gql`
  type Mutation {
    editPhoto(id: Int!, caption: String!): MutationResponse!
  }
`;
