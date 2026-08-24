import { Search, Package } from "lucide-react";

function ProductSearch({
  search,
  setSearch,
  products,
  loading,
  onAddProduct,
}) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Products
        </h2>

        <div className="relative mt-4">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by product name or SKU..."
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="max-h-[650px] overflow-y-auto p-4">
        {loading ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Searching products...
          </p>
        ) : products.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No products found.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {products.map((product) => {
              const isOutOfStock =
                product.quantityInStock <= 0;

              return (
                <button
                  key={product._id}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() =>
                    onAddProduct(product)
                  }
                  className="rounded-lg border p-4 text-left transition hover:border-blue-500 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                      <Package size={18} />
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        isOutOfStock
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isOutOfStock
                        ? "Out of Stock"
                        : `${product.quantityInStock} ${product.unit}`}
                    </span>
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    SKU: {product.sku}
                  </p>

                  <p className="mt-3 text-lg font-bold text-blue-600">
                    Rs. {product.sellingPrice}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductSearch;