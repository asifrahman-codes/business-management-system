const dashboardService = require("../services/dashboard.service");
const asyncHandler = require("../utils/async-handler.util");

const getDashboardSummary = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardSummary();
  
  return res.status(200).json({
    success: true,
    data: stats,
  });
});

module.exports = { getDashboardSummary };