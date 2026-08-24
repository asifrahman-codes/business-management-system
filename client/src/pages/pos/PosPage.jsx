import {
  useEffect,
  useState,
} from "react";

import {
  searchProductsForPos,
  createSale,
} from "../../services/sale.service";

import ProductSearch from "../../components/pos/ProductSearch";
import PosCart from "../../components/pos/PosCart";
import CheckoutPanel from "../../components/pos/CheckoutPanel";

function PosPage() {
  const [search, setSearch] =
    useState("");

  const [products, setProducts] =
    useState([]);

  const [cart, setCart] = useState([]);

  const [loadingProducts, setLoadingProducts] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () =>
      clearTimeout(timer);
  }, [search]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

      const response =
        await searchProductsForPos(search);

      setProducts(response.data || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to search products."
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  const addProductToCart = (product) => {
    setSuccessMessage("");

    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (item) =>
            item._id === product._id
        );

      if (existingItem) {
        if (
          existingItem.quantity >=
          existingItem.quantityInStock
        ) {
          return currentCart;
        }

        return currentCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item._id !== productId
        ) {
          return item;
        }

        if (
          item.quantity >=
          item.quantityInStock
        ) {
          return item;
        }

        return {
          ...item,
          quantity:
            item.quantity + 1,
        };
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item._id === productId
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  const removeItem = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item._id !== productId
      )
    );
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      item.sellingPrice *
        item.quantity,
    0
  );

  const handleCheckout = async (
    checkoutData
  ) => {
    try {
      setProcessing(true);
      setError("");
      setSuccessMessage("");

      const saleData = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),

        discount:
          checkoutData.discount,

        tax:
          checkoutData.tax,

        paymentMethod:
          checkoutData.paymentMethod,

        customerName:
          checkoutData.customerName ||
          null,
      };

      const response =
        await createSale(saleData);

      setSuccessMessage(
        `Sale completed successfully. Invoice: ${response.data.invoiceNumber}`
      );

      setCart([]);

      fetchProducts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to complete sale."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Point of Sale
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Search products, manage the cart, and
          complete customer sales.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <ProductSearch
          search={search}
          setSearch={setSearch}
          products={products}
          loading={loadingProducts}
          onAddProduct={addProductToCart}
        />

        <div className="space-y-6">
          <PosCart
            cart={cart}
            onIncreaseQuantity={
              increaseQuantity
            }
            onDecreaseQuantity={
              decreaseQuantity
            }
            onRemoveItem={removeItem}
          />

          <CheckoutPanel
            cart={cart}
            subtotal={subtotal}
            processing={processing}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}

export default PosPage;