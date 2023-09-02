export const pagination = ({ page = 1, size = 5 }) => {

  if (page <= 0) page = 1;
  if (size <= 0) size = 5;
  const skip = size * (page - 1);

  return { limit:size, skip };
};
