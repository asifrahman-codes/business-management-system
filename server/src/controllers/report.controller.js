const reportService =
  require(
    "../services/report.service"
  );

const asyncHandler = require(
  "../utils/async-handler.util"
);

const getSalesReport =
  asyncHandler(async (req, res) => {
    const {
      startDate,
      endDate,
    } = req.query;

    const report =
      await reportService
        .getSalesReport(
          startDate,
          endDate
        );

    return res.status(200).json({
      success: true,
      data: report,
    });
  });

const getExpenseReport =
  asyncHandler(async (req, res) => {
    const {
      startDate,
      endDate,
    } = req.query;

    const report =
      await reportService
        .getExpenseReport(
          startDate,
          endDate
        );

    return res.status(200).json({
      success: true,
      data: report,
    });
  });

const getProfitReport =
  asyncHandler(async (req, res) => {
    const {
      startDate,
      endDate,
    } = req.query;

    const report =
      await reportService
        .getProfitReport(
          startDate,
          endDate
        );

    return res.status(200).json({
      success: true,
      data: report,
    });
  });

const getMonthlyReport =
  asyncHandler(async (req, res) => {
    const {
      year,
    } = req.query;

    const report =
      await reportService
        .getMonthlyReport(year);

    return res.status(200).json({
      success: true,
      data: report,
    });
  });

const getInventoryReport =
  asyncHandler(async (req, res) => {
    const report =
      await reportService
        .getInventoryReport();

    return res.status(200).json({
      success: true,
      data: report,
    });
  });

module.exports = {
  getSalesReport,
  getExpenseReport,
  getProfitReport,
  getMonthlyReport,
  getInventoryReport,
};