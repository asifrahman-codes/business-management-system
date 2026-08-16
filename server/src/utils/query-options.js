const getQueryOptions = (query) => {
  const page = Math.max(
    parseInt(query.page, 10) || 1,
    1
  );

  const limit = Math.min(
    Math.max(
      parseInt(query.limit, 10) || 10,
      1
    ),
    100
  );

  const skip = (page - 1) * limit;

  const search =
    typeof query.search === "string"
      ? query.search.trim()
      : "";

  const sortBy =
    typeof query.sortBy === "string"
      ? query.sortBy
      : "createdAt";

  const sortOrder =
    query.sortOrder === "asc"
      ? 1
      : -1;

  return {
    page,
    limit,
    skip,
    search,
    sortBy,
    sortOrder,
  };
};

module.exports = getQueryOptions;