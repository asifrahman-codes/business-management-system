const addToCart = (product) => {
  setCart((currentCart) => {
    const existingItem =
      currentCart.find(
        (item) =>
          item.product === product._id
      );

    if (existingItem) {
      return currentCart.map((item) => {
        if (
          item.product !== product._id
        ) {
          return item;
        }

        const quantity =
          item.quantity + 1;

        return {
          ...item,
          quantity,
          subtotal:
            quantity *
            item.unitPrice,
        };
      });
    }

    return [
      ...currentCart,
      {
        product: product._id,
        name: product.name,
        sku: product.sku,
        unitPrice:
          product.sellingPrice,
        quantity: 1,
        subtotal:
          product.sellingPrice,
      },
    ];
  });
};

const addToCart = (product) => {
  setCart((currentCart) => {
    const existingItem =
      currentCart.find(
        (item) =>
          item.product === product._id
      );

    if (existingItem) {
      if (
        existingItem.quantity >=
        product.quantityInStock
      ) {
        return currentCart;
      }

      const quantity =
        existingItem.quantity + 1;

      return currentCart.map((item) => {
        if (
          item.product !== product._id
        ) {
          return item;
        }

        return {
          ...item,
          quantity,
          subtotal:
            quantity *
            item.unitPrice,
        };
      });
    }

    return [
      ...currentCart,
      {
        product: product._id,
        name: product.name,
        sku: product.sku,
        unitPrice:
          product.sellingPrice,
        quantity: 1,
        subtotal:
          product.sellingPrice,
      },
    ];
  });
};


const increaseQuantity = (
  productId,
  availableStock
) => {
  setCart((currentCart) =>
    currentCart.map((item) => {
      if (
        item.product !== productId
      ) {
        return item;
      }

      if (
        item.quantity >= availableStock
      ) {
        return item;
      }

      const quantity =
        item.quantity + 1;

      return {
        ...item,
        quantity,
        subtotal:
          quantity * item.unitPrice,
      };
    })
  );
};


const decreaseQuantity = (
  productId
) => {
  setCart((currentCart) =>
    currentCart
      .map((item) => {
        if (
          item.product !== productId
        ) {
          return item;
        }

        const quantity =
          item.quantity - 1;

        return {
          ...item,
          quantity,
          subtotal:
            quantity * item.unitPrice,
        };
      })
      .filter(
        (item) => item.quantity > 0
      )
  );
};


const removeFromCart = (
  productId
) => {
  setCart((currentCart) =>
    currentCart.filter(
      (item) =>
        item.product !== productId
    )
  );
};


const clearCart = () => {
  setCart([]);
};

const totalAmount = cart.reduce(
  (total, item) =>
    total + item.subtotal,
  0
);

const totalAmount = cart.reduce(
  (total, item) =>
    total + item.subtotal,
  0
);