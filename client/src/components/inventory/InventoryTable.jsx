import { Link } from "react-router-dom";

const getStockStatus = (
  quantity,
  reorderLevel
) => {
  if (quantity === 0) {
    return {
      label: "Out of Stock",
      className:
        "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
    };
  }

  if (quantity <= reorderLevel) {
    return {
      label: "Low Stock",
      className:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400",
    };
  }

  return {
    label: "In Stock",
    className:
      "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
  };
};

const getExpiryStatus = (expiryDate) => {
  if (!expiryDate) {
    return {
      label: "No Expiry",
      className:
        "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    };
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);

  expiry.setHours(0, 0, 0, 0);

  if (expiry < today) {
    return {
      label: "Expired",
      className:
        "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
    };
  }

  const difference =
    expiry.getTime() - today.getTime();

  const daysRemaining = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  if (daysRemaining <= 30) {
    return {
      label: "Expiring Soon",
      className:
        "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
    };
  }

  return {
    label: "Valid",
    className:
      "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
  };
};

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString();
};

function InventoryTable({ products }) {
  if (!products.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No inventory products found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <tr>
              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Product
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                SKU
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Category
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Stock
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Reorder Level
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Stock Status
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Expiry
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Expiry Status
              </th>

              <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => {
              const stockStatus =
                getStockStatus(
                  product.quantityInStock,
                  product.reorderLevel
                );

              const expiryStatus =
                getExpiryStatus(
                  product.expiryDate
                );

              return (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {product.unit}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {product.sku}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {product.category?.name || "-"}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {product.quantityInStock}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {product.reorderLevel}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${stockStatus.className}`}
                    >
                      {stockStatus.label}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(
                      product.expiryDate
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${expiryStatus.className}`}
                    >
                      {expiryStatus.label}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      to={`/products/${product._id}`}
                      className="rounded-md px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryTable;