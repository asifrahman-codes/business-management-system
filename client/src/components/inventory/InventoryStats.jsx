import InventoryStatCard from "./InventoryStatCard";

function InventoryStats({ summary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <InventoryStatCard
        type="totalProducts"
        value={summary?.totalProducts ?? 0}
      />

      <InventoryStatCard
        type="lowStockProducts"
        value={summary?.lowStockProducts ?? 0}
      />

      <InventoryStatCard
        type="expiredProducts"
        value={summary?.expiredProducts ?? 0}
      />

      <InventoryStatCard
        type="expiringSoonProducts"
        value={
          summary?.expiringSoonProducts ?? 0
        }
      />
    </div>
  );
}

export default InventoryStats;