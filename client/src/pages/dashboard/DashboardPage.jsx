import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { getDashboardSummary } from "../../services/dashboardService";
import PageContainer from "../../components/ui/PageContainer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatCurrency } from "../../utils/formatCurrency";

function DashboardPage() {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getDashboardSummary();

        setDashboard(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage message={error} />
      </PageContainer>
    );
  }

  const cards = [
    {
      title: "Today's Sales",
      value: dashboard?.todaySales ?? 0,
      icon: ShoppingCart,
      isCurrency: true,
    },
    {
      title: "Monthly Sales",
      value: dashboard?.monthlySales ?? 0,
      icon: TrendingUp,
      isCurrency: true,
    },
    {
      title: "Monthly Expenses",
      value: dashboard?.monthlyExpenses ?? 0,
      icon: TrendingDown,
      isCurrency: true,
    },
    {
      title: "Net Profit",
      value: dashboard?.netProfit ?? 0,
      icon: CalendarDays,
      isCurrency: true,
      isProfit: true,
    },
    {
      title: "Low Stock Products",
      value: dashboard?.lowStockCount ?? 0,
      icon: Package,
      isCurrency: false,
    },
    {
      title: "Expiring Products",
      value: dashboard?.expiryCount ?? 0,
      icon: AlertTriangle,
      isCurrency: false,
    },
  ];

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of your business
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {card.title}
                  </p>

                  <p
                    className={`mt-2 text-2xl font-bold ${
                      card.isProfit
                        ? card.value < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {card.isCurrency
                      ? formatCurrency(
                          card.value
                        )
                      : card.value}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                  <Icon
                    size={22}
                    className="text-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}

export default DashboardPage;