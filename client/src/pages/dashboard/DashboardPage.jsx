// DashboardPage.jsx
import { useEffect, useState } from "react";
import {
  AlertTriangle, CalendarDays, Package, ShoppingCart, TrendingDown, TrendingUp,
} from "lucide-react";
import { getDashboardSummary } from "../../services/dashboardService";
import PageContainer from "../../components/ui/PageContainer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatCurrency } from "../../utils/formatCurrency";

const TONES = {
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

function StatCard({ card }) {
  const Icon = card.icon;
  const valueClass = card.isProfit
    ? card.value < 0
      ? "text-rose-600 dark:text-rose-400"
      : "text-emerald-600 dark:text-emerald-400"
    : "text-slate-900 dark:text-white";

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {card.title}
          </p>
          <p className={`mt-3 text-2xl font-bold tabular-nums tracking-tight ${valueClass}`}>
            {card.isCurrency ? formatCurrency(card.value) : card.value}
          </p>
          {card.hint && (
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{card.hint}</p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105 ${
            TONES[card.tone] || TONES.slate
          }`}
        >
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getDashboardSummary();
        setDashboard(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage message={error} />
      </PageContainer>
    );
  }

  const financeCards = [
    { title: "Today's Sales", value: dashboard?.todaySales ?? 0, icon: ShoppingCart, isCurrency: true, tone: "indigo" },
    { title: "Monthly Sales", value: dashboard?.monthlySales ?? 0, icon: TrendingUp, isCurrency: true, tone: "emerald" },
    { title: "Monthly Expenses", value: dashboard?.monthlyExpenses ?? 0, icon: TrendingDown, isCurrency: true, tone: "rose" },
    { title: "Net Profit", value: dashboard?.netProfit ?? 0, icon: CalendarDays, isCurrency: true, isProfit: true, tone: "indigo" },
  ];

  const alertCards = [
    { title: "Low Stock Products", value: dashboard?.lowStockCount ?? 0, icon: Package, isCurrency: false, tone: "amber", hint: "Need restocking" },
    { title: "Expiring Products", value: dashboard?.expiryCount ?? 0, icon: AlertTriangle, isCurrency: false, tone: "rose", hint: "Approaching expiry" },
  ];

  return (
    <PageContainer>
      <div className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Overview of your business performance
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
          Financial Summary
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {financeCards.map((card) => (
            <StatCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
          Inventory Alerts
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {alertCards.map((card) => (
            <StatCard key={card.title} card={card} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

export default DashboardPage;
