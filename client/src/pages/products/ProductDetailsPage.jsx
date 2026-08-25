import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  deleteProduct,
  getProductById,
} from "../../services/productService";

import PageContainer from "../../components/ui/PageContainer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatCurrency } from "../../utils/formatCurrency";

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);

        setProduct(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      navigate("/products");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

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

  if (!product) {
    return null;
  }

  return (
    <PageContainer>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {product.name}
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Product details
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/products/${id}/edit`}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Detail
          label="Product Name"
          value={product.name}
        />

        <Detail
          label="SKU"
          value={product.sku}
        />

        <Detail
          label="Cost Price"
          value={formatCurrency(product.costPrice)}
        />

        <Detail
          label="Selling Price"
          value={formatCurrency(product.sellingPrice)}
        />

        <Detail
          label="Quantity in Stock"
          value={product.quantityInStock}
        />

        <Detail
          label="Reorder Level"
          value={product.reorderLevel}
        />

        <Detail
          label="Unit"
          value={product.unit}
        />

        <Detail
          label="Expiry Date"
          value={
            product.expiryDate
              ? new Date(
                  product.expiryDate
                ).toLocaleDateString()
              : "No expiry date"
          }
        />

        <Detail
          label="Category"
          value={
            product.category?.name ||
            product.category ||
            "-"
          }
        />

        <Detail
          label="Supplier"
          value={
            product.supplier?.name ||
            product.supplier ||
            "-"
          }
        />
      </div>
    </PageContainer>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
}

export default ProductDetailsPage;