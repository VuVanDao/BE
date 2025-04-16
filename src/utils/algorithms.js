/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
export const pagingSkipValue = (page, itemPerPage) => {
  if (!page || !itemPerPage) {
    return 0;
  }
  if (page <= 0 || itemPerPage <= 0) {
    return 0;
  }
  return (page - 1) * itemPerPage;
};
