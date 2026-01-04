import { useState, useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "../../DashboardComponents/DataContext";

const TABLE_HEAD = [
  "ID",
  "Image",
  "Name",
  "Category",
  "Price",
  "Amount",
  "Actions",
];

const ProductsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { productsData, fetchProducts } = useData();
  const navigate = useNavigate();

  // Fix: Ensure productsData is always treated as an array
  const safeProductsData = useMemo(() => {
    if (!productsData) return [];
    // If productsData is an object with a "products" property
    if (productsData.products && Array.isArray(productsData.products)) {
      return productsData.products;
    }
    // If productsData is directly an array
    if (Array.isArray(productsData)) {
      return productsData;
    }
    // If it's any other format, return empty array
    console.warn("productsData is not in expected format:", productsData);
    return [];
  }, [productsData]);

  const filteredProducts = useMemo(() => {
    if (!safeProductsData || safeProductsData.length === 0) return [];
    if (!searchTerm.trim()) return safeProductsData;

    const term = searchTerm.toLowerCase();

    return safeProductsData.filter((product) => {
      return (
        (product.Name && String(product.Name).toLowerCase().includes(term)) ||
        (product.Category &&
          String(product.Category).toLowerCase().includes(term)) ||
        (product._id && String(product._id).toLowerCase().includes(term))
      );
    });
  }, [safeProductsData, searchTerm]);

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Invalid product ID");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `https://med-api-wine.vercel.app/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete product: ${errorText}`);
      }

      toast.success("Product deleted successfully");
      // Refresh the product list using DataContext
      await fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (id) => {
    if (!id) {
      toast.error("Invalid product ID");
      return;
    }
    navigate(`/Dashboard/Products/Update/${id}`);
  };

  const clearSearch = () => setSearchTerm("");

  const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryColor = (category) => {
    if (!category) return "gray";
    switch (category.toLowerCase()) {
      case "electronic":
        return "blue";
      case "non-electronic":
        return "green";
      default:
        return "gray";
    }
  };

  const getCategoryLabel = (category) => {
    if (!category) return "N/A";
    return (
      category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")
    );
  };

  // Loading state
  if (productsData === undefined || productsData === null) {
    return (
      <Card className="h-full w-full">
        <CardBody className="flex items-center justify-center py-12">
          <Typography variant="h6" color="blue-gray">
            Loading products...
          </Typography>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full bg-gray-100">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Products Inventory
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Manage all medical products and equipment
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outlined" size="sm" onClick={clearSearch}>
              Clear Search
            </Button>
            <Link to={`/Dashboard/Products/addnew`}>
              <Button
                className="flex items-center gap-3  text-green-800"
                size="sm"
              >
                <PlusIcon strokeWidth={2} className="h-4 w-4" /> Add Product
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full md:w-72">
            <Input
              label="Search by ID, Name or Category"
              name="filter"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              disabled={isDeleting}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        {safeProductsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              No products found
            </Typography>
            <Typography color="gray" className="font-normal">
              Add your first product to get started
            </Typography>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              No matching products found
            </Typography>
            <Typography color="gray" className="font-normal">
              Try a different search term
            </Typography>
          </div>
        ) : (
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => {
                const isLast = index === filteredProducts.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={product._id || index}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-mono text-xs"
                      >
                        {product._id ? product._id.substring(0, 8) : "N/A"}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="relative w-12 h-12 overflow-hidden rounded-md">
                        <img
                          src={product.Image}
                          alt={product.Name || "Product"}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/100x100?text=No+Image";
                            e.target.className =
                              "w-full h-full object-cover bg-gray-100";
                          }}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        {product.Name || "N/A"}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Chip
                        value={getCategoryLabel(product.Category)}
                        color={getCategoryColor(product.Category)}
                        size="sm"
                        className="w-fit"
                      />
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="green"
                        className="font-bold"
                      >
                        {formatPrice(product.Price)}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-2">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`font-bold ${
                            product.Amount <= 5 ? "text-red-600" : ""
                          }`}
                        >
                          {product.Amount || "0"}
                        </Typography>
                        {product.Amount <= 5 && (
                          <span className="inline-flex items-center justify-center w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-2">
                        <Tooltip content="Edit Product">
                          <IconButton
                            variant="text"
                            onClick={() => handleEdit(product._id)}
                            disabled={isDeleting}
                            className="h-8 w-8"
                          >
                            <PencilIcon className="h-4 w-4 text-blue-600" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete Product">
                          <IconButton
                            variant="text"
                            onClick={() => handleDelete(product._id)}
                            disabled={isDeleting}
                            className="h-8 w-8"
                          >
                            <RiDeleteBack2Fill className="h-4 w-4 text-red-600" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page 1 of 1
          {filteredProducts.length > 0 &&
            ` • ${filteredProducts.length} products`}
        </Typography>
        <Typography variant="small" color="blue-gray" className="font-normal">
          Total: {safeProductsData.length || 0} products
        </Typography>
      </CardFooter>
    </Card>
  );
};

export default ProductsList;
