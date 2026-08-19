const expenseRepository = require(
  "../repositories/expense.repository"
);

const AppError = require(
  "../utils/app-error.util"
);

const createExpense = async ({
  expenseData,
  userId,
}) => {
  const expense =
    await expenseRepository.createExpense({
      ...expenseData,
      recordedBy: userId,
    });

  return expense;
};

const getExpenses = async ({
  page = 1,
  limit = 10,
  category,
  startDate,
  endDate,
  sortBy = "date",
  sortOrder = "desc",
}) => {
  if (
    !Number.isInteger(page) ||
    page < 1
  ) {
    throw new AppError(
      "Page must be a positive integer",
      400
    );
  }

  if (
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    throw new AppError(
      "Limit must be between 1 and 100",
      400
    );
  }

  if (
    !["asc", "desc"].includes(sortOrder)
  ) {
    throw new AppError(
      "sortOrder must be asc or desc",
      400
    );
  }

  const allowedSortFields = [
    "date",
    "amount",
    "createdAt",
    "title",
  ];

  if (!allowedSortFields.includes(sortBy)) {
    throw new AppError(
      "Invalid sort field",
      400
    );
  }

  const allowedCategories = [
    "RENT",
    "UTILITIES",
    "SALARY",
    "SUPPLIES",
    "MAINTENANCE",
    "TRANSPORT",
    "MARKETING",
    "EQUIPMENT",
    "OTHER",
  ];

  if (
    category &&
    !allowedCategories.includes(category)
  ) {
    throw new AppError(
      "Invalid expense category",
      400
    );
  }

  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (startDate || endDate) {
    filter.date = {};

    if (startDate) {
      filter.date.$gte =
        new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);

      end.setHours(
        23,
        59,
        59,
        999
      );

      filter.date.$lte = end;
    }
  }

  const skip =
    (page - 1) * limit;

  const sort = {
    [sortBy]:
      sortOrder === "asc"
        ? 1
        : -1,
  };

  const {
    expenses,
    total,
  } =
    await expenseRepository.getExpenses({
      filter,
      skip,
      limit,
      sort,
    });

  return {
    expenses,
    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};

const getExpenseById = async (
  expenseId
) => {
  const expense =
    await expenseRepository.getExpenseById(
      expenseId
    );

  if (!expense) {
    throw new AppError(
      "Expense not found",
      404
    );
  }

  return expense;
};

const updateExpense = async (
  expenseId,
  updateData
) => {
  const existingExpense =
    await expenseRepository.getExpenseById(
      expenseId
    );

  if (!existingExpense) {
    throw new AppError(
      "Expense not found",
      404
    );
  }

  const updatedExpense =
    await expenseRepository.updateExpense(
      expenseId,
      updateData
    );

  return updatedExpense;
};

const deleteExpense = async (
  expenseId
) => {
  const existingExpense =
    await expenseRepository.getExpenseById(
      expenseId
    );

  if (!existingExpense) {
    throw new AppError(
      "Expense not found",
      404
    );
  }

  await expenseRepository.deleteExpense(
    expenseId
  );

  return existingExpense;
};

const parseReportDates = ({
  startDate,
  endDate,
}) => {
  let parsedStartDate;
  let parsedEndDate;

  if (startDate) {
    parsedStartDate =
      new Date(startDate);

    if (
      Number.isNaN(
        parsedStartDate.getTime()
      )
    ) {
      throw new AppError(
        "Invalid start date",
        400
      );
    }

    parsedStartDate.setHours(
      0,
      0,
      0,
      0
    );
  }

  if (endDate) {
    parsedEndDate =
      new Date(endDate);

    if (
      Number.isNaN(
        parsedEndDate.getTime()
      )
    ) {
      throw new AppError(
        "Invalid end date",
        400
      );
    }

    parsedEndDate.setHours(
      23,
      59,
      59,
      999
    );
  }

  if (
    parsedStartDate &&
    parsedEndDate &&
    parsedStartDate > parsedEndDate
  ) {
    throw new AppError(
      "Start date cannot be after end date",
      400
    );
  }

  return {
    startDate: parsedStartDate,
    endDate: parsedEndDate,
  };
};

const getExpenseSummary = async ({
  startDate,
  endDate,
}) => {
  const dates =
    parseReportDates({
      startDate,
      endDate,
    });

  return await expenseRepository.getExpenseSummary(
    dates
  );
};

const getExpensesByCategory = async ({
  startDate,
  endDate,
}) => {
  const dates =
    parseReportDates({
      startDate,
      endDate,
    });

  return await expenseRepository.getExpensesByCategory(
    dates
  );
};

const getExpensesByDate = async ({
  startDate,
  endDate,
}) => {
  const dates =
    parseReportDates({
      startDate,
      endDate,
    });

  return await expenseRepository.getExpensesByDate(
    dates
  );
};


module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getExpensesByCategory,
  getExpensesByDate,
  parseReportDates,
};