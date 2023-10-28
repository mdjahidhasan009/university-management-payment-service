const getPaginationOptions = (
  options: { page?: number; limit?: number } = {}
): {
  page: number;
  limit: number;
  skip: number;
} => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip
  };
};

export const PaginationHelper = {
  getPaginationOptions
};
