import { Link } from "react-router-dom";

const getStockStatus = (
  quantity,
  reorderLevel
) => {
  if (quantity === 0) {
    return {
      label: "Out of Stock",
      className:
        "bg-red-100 text-red-700",
    };
  }

  if (quantity <= reorderLevel) {
    return {
      label: "Low Stock",
      className:
        "bg-yellow-100 text-yellow-700",
    };
  }

  return {
    label: "In Stock",
    className:
      "bg-green-100 text-green-700",
  };
};

const getExpiryStatus = (expiryDate) => {
  if (!expiryDate) {
    return {
      label: "No Expiry",
      className:
        "bg-gray-100 text-gray-600",
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
        "bg-red-100 text-red-700",
    };
  }

  const difference =
    expiry.getTime() - today.getTime();

  const daysRemaining =
    Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );

  if (daysRemaining <= 30) {
    return {
      label: "Expiring Soon",
      className:
        "bg-orange-100 text-orange-700",
    };
  }

  return {
    label: "Valid",
    className:
      "bg-green-100 text-green-700",
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
      <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-gray-500">
          No inventory products found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                Product
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                SKU
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                Category
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                Stock
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                Reorder Level
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                Stock Status
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                Expiry
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                Expiry Status
              </th>

              <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
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
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {product.unit}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {product.sku}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {product.category?.name ||
                      "-"}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {product.quantityInStock}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {product.reorderLevel}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${stockStatus.className}`}
                    >
                      {stockStatus.label}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
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
                      className="rounded-md px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50"
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