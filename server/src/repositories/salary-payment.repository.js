const SalaryPayment = require(
  "../models/salary-payment.model"
);

const createSalaryPayment = async (
  paymentData
) => {
  return await SalaryPayment.create(
    paymentData
  );
};

const getSalaryPayments = async ({
  filter = {},
  skip = 0,
  limit = 10,
}) => {
  const [payments, total] =
    await Promise.all([
      SalaryPayment.find(filter)
        .populate(
          "employee",
          "name position phone email"
        )
        .sort({
          year: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      SalaryPayment.countDocuments(filter),
    ]);

  return {
    payments,
    total,
  };
};

const getSalaryPaymentById = async (
  paymentId
) => {
  return await SalaryPayment.findById(
    paymentId
  ).populate(
    "employee",
    "name position phone email"
  );
};

const getEmployeeSalaryPayments =
  async (
    employeeId,
    { skip = 0, limit = 10 }
  ) => {
    const filter = {
      employee: employeeId,
    };

    const [payments, total] =
      await Promise.all([
        SalaryPayment.find(filter)
          .sort({
            year: -1,
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit),

        SalaryPayment.countDocuments(
          filter
        ),
      ]);

    return {
      payments,
      total,
    };
  };

const updateSalaryPayment = async (
  paymentId,
  paymentData
) => {
  return await SalaryPayment.findByIdAndUpdate(
    paymentId,
    paymentData,
    {
      new: true,
      runValidators: true,
    }
  ).populate(
    "employee",
    "name position phone email"
  );
};

const updateSalaryPaymentStatus =
  async (
    paymentId,
    status
  ) => {
    return await SalaryPayment.findByIdAndUpdate(
      paymentId,
      { status },
      {
        new: true,
        runValidators: true,
      }
    ).populate(
      "employee",
      "name position phone email"
    );
  };

const deleteSalaryPayment = async (
  paymentId
) => {
  return await SalaryPayment.findByIdAndDelete(
    paymentId
  );
};

const findPaymentByEmployeeMonthYear =
  async (
    employee,
    month,
    year,
    excludeId = null
  ) => {
    const filter = {
      employee,
      month,
      year,
    };

    if (excludeId) {
      filter._id = {
        $ne: excludeId,
      };
    }

    return await SalaryPayment.findOne(
      filter
    );
  };

module.exports = {
  createSalaryPayment,
  getSalaryPayments,
  getSalaryPaymentById,
  getEmployeeSalaryPayments,
  updateSalaryPayment,
  updateSalaryPaymentStatus,
  deleteSalaryPayment,
  findPaymentByEmployeeMonthYear,
};