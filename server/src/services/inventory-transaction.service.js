const inventoryTransactionRepository =
  require(
    "../repositories/inventory-transaction.repository"
  );

const getQueryOptions =
  require(
    "../utils/query-options"
  );

const AppError =
  require(
    "../utils/app-error.util"
  );

const getInventoryTransactions =
  async (query = {}) => {
    const {
      page,
      limit,
      skip,
    } = getQueryOptions(query);

    const filters = {};

    if (query.product) {
      filters.product =
        query.product;
    }

    if (query.type) {
      filters.type =
        query.type;
    }

    if (query.performedBy) {
      filters.performedBy =
        query.performedBy;
    }

    if (
      query.startDate ||
      query.endDate
    ) {
      filters.createdAt = {};

      if (query.startDate) {
        const startDate =
          new Date(
            query.startDate
          );

        if (
          Number.isNaN(
            startDate.getTime()
          )
        ) {
          throw new AppError(
            "Invalid start date",
            400
          );
        }

        startDate.setHours(
          0,
          0,
          0,
          0
        );

        filters.createdAt.$gte =
          startDate;
      }

      if (query.endDate) {
        const endDate =
          new Date(
            query.endDate
          );

        if (
          Number.isNaN(
            endDate.getTime()
          )
        ) {
          throw new AppError(
            "Invalid end date",
            400
          );
        }

        endDate.setHours(
          23,
          59,
          59,
          999
        );

        filters.createdAt.$lte =
          endDate;
      }

      if (
        filters.createdAt.$gte &&
        filters.createdAt.$lte &&
        filters.createdAt.$gte >
          filters.createdAt.$lte
      ) {
        throw new AppError(
          "Start date must be before end date",
          400
        );
      }
    }

    const {
      transactions,
      total,
    } =
      await inventoryTransactionRepository
        .findMany({
          filters,
          skip,
          limit,
        });

    return {
      transactions,

      pagination: {
        page,
        limit,
        total,

        totalPages:
          Math.ceil(
            total / limit
          ),
      },
    };
  };

module.exports = {
  getInventoryTransactions,
};