import { Resolver, Resolvers } from "../types";

// computed filed 용 resolver
/**
 * Photo 의 userId 를 받아 User 를 찾아 반환한다
 *
 * @author Bard <hs.jang@atnp.co.kr>
 * @see None
 * @version 1.0 생성
 */
const userResolverFn: Resolver = async ({ userId }, _, { client }) => {
  try {
    const findedUser = await client.user.findUnique({ where: { id: userId } });
    return findedUser;
  } catch {
    return null;
  }
};
/**
 * Photo 의 id 를 받아 Hashtag[] 를 찾아 반환한다
 *
 * @author Bard <hs.jang@atnp.co.kr>
 * @see None
 * @version 1.0 생성
 */
const hashtagsResolverFn: Resolver = async ({ id }, _, { client }) => {
  try {
    const findedHashtags = await client.hashtag.findMany({
      where: {
        photos: {
          some: {
            id,
          },
        },
      },
    });
    return findedHashtags;
  } catch {
    return null;
  }
};
/**
 * Photo 의 id를 받아 Photo[] 를 찾아 반환한다
 *
 * @author Bard <hs.jang@atnp.co.kr>
 * @see None
 * @version 1.0 생성
 */
const photosResolverFn: Resolver = async (
  { id },
  { page },
  { client, loggedInUser }
) => {
  // loggedInUser 을 활용해서 부분적으로 protectd 기능 강화
  try {
    const photos = await client.hashtag.findUnique({ where: { id } }).photos();
    return photos;
  } catch {
    return [];
  }
};
/**
 * 해쉬태그에 속한 사진의 갯수를 반환한다
 *
 * @author Bard <hs.jang@atnp.co.kr>
 * @see None
 * @version 1.0 생성
 */
const totalPhotosResolverFn: Resolver = async ({ id }, _, { client }) => {
  try {
    const totalPhotos = await client.photo.count({
      where: {
        hashtags: {
          some: {
            id,
          },
        },
      },
    });
    return totalPhotos;
  } catch {
    return 0;
  }
};
/**
 * 사진 좋아요 수 구하기
 *
 * @author Bard <hs.jang@atnp.co.kr>
 * @see None
 * @version 1.0 생성
 */
const likesResolverFn: Resolver = async ({ id }, _, { client }) => {
  try {
    const likes = client.like.count({ where: { photoId: id } });
    return likes;
  } catch {
    return 0;
  }
};
/**
 * 사진에 달린 댓글 수 불러오기
 *
 * @author Bard <hs.jang@atnp.co.kr>
 * @see None
 * @version 1.0 생성
 */
const commentNumberResolverFn: Resolver = async (
  { id: photoId },
  _,
  { client }
) => {
  try {
    const comments = await client.comment.count({
      where: {
        photoId,
      },
    });
    return comments;
  } catch {
    return 0;
  }
};
/**
 * 내 사진인지 확인
 *
 * @author Bard <hs.jang@atnp.co.kr>
 * @see None
 * @version 1.0 생성
 */
const isMineResolverFn: Resolver = ({ userId }, _, { loggedInUser }) => {
  if (!loggedInUser) {
    return false;
  }
  const isMine = userId === loggedInUser.id;
  return isMine;
};

const isLikedResolverFn: Resolver = async (
  { id },
  _,
  { client, loggedInUser }
) => {
  if (!loggedInUser) {
    return false;
  }
  const ok = await client.like.findUnique({
    where: {
      photoId_userId: {
        photoId: id,
        userId: loggedInUser.id,
      },
    },
    select: {
      id: true,
    },
  });
  if (ok) {
    return true;
  }
  return false;
};

const commentsResolverFn: Resolver = async ({ id }, _, { client }) =>
  client.comment.findMany({ where: { photoId: id }, include: { user: true } });

// computed filed defs
const resolvers: Resolvers = {
  Photo: {
    user: userResolverFn,
    hashtags: hashtagsResolverFn,
    likes: likesResolverFn,
    commentNumber: commentNumberResolverFn,
    comments: commentsResolverFn,
    isMine: isMineResolverFn,
    isLiked: isLikedResolverFn,
  },
  Hashtag: {
    photos: photosResolverFn,
    totalPhotos: totalPhotosResolverFn,
  },
};

export default resolvers;
