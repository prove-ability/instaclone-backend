export const processHashtags = (caption: String) => {
  const hashtags = caption.match(/#[\w]+/g) || [];
  return hashtags.map((hashtag: any) => ({
    where: { hashtag },
    create: { hashtag },
  }));
};
