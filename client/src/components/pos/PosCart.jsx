import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
} from "lucide-react";

function PosCart({
  cart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}) {
  return (
    <div className="rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-3 border-b p-5 dark:border-gray-700">
        <ShoppingCart
          size={20}
          className="text-blue-600 dark:text-blue-400"
        />

        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Current Sale
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {cart.length} item
            {cart.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="p-10 text-center">
          <ShoppingCart
            size={40}
            className="mx-auto text-gray-300 dark:text-gray-600"
          />

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Your cart is empty.
          </p>

          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Search and select products to begin a sale.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {cart.map((item) => (
            <div
              key={item._id}
              className="p-4"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {item.sku}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Rs. {item.sellingPrice}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onRemoveItem(item._id)
                  }
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-600">
                  <button
                    type="button"
                    onClick={() =>
                      onDecreaseQuantity(item._id)
                    }
                    className="p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="min-w-10 text-center text-sm font-medium text-gray-900 dark:text-white">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    disabled={
                      item.quantity >=
                      item.quantityInStock
                    }
                    onClick={() =>
                      onIncreaseQuantity(item._id)
                    }
                    className="p-2 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Rs.{" "}
                  {item.sellingPrice *
                    item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PosCart;