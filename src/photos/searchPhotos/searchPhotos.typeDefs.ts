import { gql } from "apollo-server-express";

// 페이지네이션 구현해보기

export default gql`
  type Query {
    searchPhotos(keyword: String!): [Photo]
  }
`;
