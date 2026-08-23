function InventoryStatCard({
  title,
  value,
  icon: Icon,
  iconClassName = "",
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {value ?? 0}
          </h3>
        </div>

        {Icon && (
          <div
            className={`rounded-lg p-3 ${iconClassName}`}
          >
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryStatCard;