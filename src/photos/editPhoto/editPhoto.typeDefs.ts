import { gql } from "apollo-server-express";

// 보통 Mutation 만 result 을 만들어준다
export default gql`
  type EditPhotoResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    editPhoto(id: Int!, caption: String!): EditPhotoResult
  }
`;
