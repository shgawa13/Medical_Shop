import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Textarea,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react";
import { ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useData } from "../../DashboardComponents/DataContext";

const AddProduct = () => {
  const navigate = useNavigate();
  const { fetchProducts } = useData();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Price: "",
    Amount: "",
    Category: "non-electronic",
    Image: "",
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { value: "electronic", label: "Electronic" },
    { value: "non-electronic", label: "Non-Electronic" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = "Product name is required";
    }

    if (!formData.Description.trim()) {
      newErrors.Description = "Description is required";
    }

    if (!formData.Price || parseFloat(formData.Price) <= 0) {
      newErrors.Price = "Price must be greater than 0";
    }

    if (!formData.Amount || parseInt(formData.Amount) < 0) {
      newErrors.Amount = "Amount must be 0 or greater";
    }

    if (!formData.Image.trim()) {
      newErrors.Image = "Image URL is required";
    } else if (!isValidUrl(formData.Image)) {
      newErrors.Image = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Update image preview for image URL
    if (name === "Image" && isValidUrl(value)) {
      setImagePreview(value);
    }
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      Category: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        Price: parseFloat(formData.Price),
        Amount: parseInt(formData.Amount),
      };

      const response = await fetch(
        "https://med-api-wine.vercel.app/api/products/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product");
      }

      await response.json();
      toast.success("Product added successfully!");

      // Refresh products in context
      await fetchProducts();

      // Navigate back to products list
      navigate("/Dashboard/Products");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/Dashboard/Products");
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <Button
          variant="text"
          onClick={handleBack}
          className="flex items-center gap-2 p-0 hover:bg-transparent"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Products
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section - Takes 2/3 of the width */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader
              floated={false}
              shadow={false}
              className="rounded-t-2xl"
            >
              <Typography variant="h4" color="blue-gray">
                Add New Product
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Fill in the product details below
              </Typography>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardBody className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="md:col-span-2">
                    <Input
                      label="Product Name"
                      name="Name"
                      value={formData.Name}
                      onChange={handleInputChange}
                      error={!!errors.Name}
                      size="lg"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    />
                    {errors.Name && (
                      <Typography
                        variant="small"
                        color="red"
                        className="mt-1 flex items-center gap-1 font-normal"
                      >
                        {errors.Name}
                      </Typography>
                    )}
                  </div>
                  {/* Category as Single Checkbox */}
                  <div className="w-full">
                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-blue-gray-50/50 transition-colors duration-200">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.Category === "electronic"}
                          onChange={(e) => {
                            handleSelectChange(
                              e.target.checked ? "electronic" : "non-electronic"
                            );
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-blue-gray-300 rounded-md peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all duration-200 flex items-center justify-center">
                          {formData.Category === "electronic" && (
                            <svg
                              className="w-3.5 h-3.5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          Electronic Product
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal"
                        >
                          {formData.Category === "electronic"
                            ? "This product is electronic"
                            : "This product is non-electronic"}
                        </Typography>
                      </div>
                    </label>
                  </div>
                  {/* Price */}
                  <div>
                    <Input
                      label="Price (USD)"
                      name="Price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.Price}
                      onChange={handleInputChange}
                      error={!!errors.Price}
                      size="lg"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    />
                    {errors.Price && (
                      <Typography
                        variant="small"
                        color="red"
                        className="mt-1 flex items-center gap-1 font-normal"
                      >
                        {errors.Price}
                      </Typography>
                    )}
                  </div>

                  {/* Amount */}
                  <div>
                    <Input
                      label="Amount in Stock"
                      name="Amount"
                      type="number"
                      min="0"
                      value={formData.Amount}
                      onChange={handleInputChange}
                      error={!!errors.Amount}
                      size="lg"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    />
                    {errors.Amount && (
                      <Typography
                        variant="small"
                        color="red"
                        className="mt-1 flex items-center gap-1 font-normal"
                      >
                        {errors.Amount}
                      </Typography>
                    )}
                  </div>

                  {/* Image URL */}
                  <div className="md:col-span-2">
                    <Input
                      label="Image URL"
                      name="Image"
                      value={formData.Image}
                      onChange={handleInputChange}
                      error={!!errors.Image}
                      icon={<PhotoIcon className="h-5 w-5" />}
                      size="lg"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    />
                    {errors.Image && (
                      <Typography
                        variant="small"
                        color="red"
                        className="mt-1 flex items-center gap-1 font-normal"
                      >
                        {errors.Image}
                      </Typography>
                    )}
                    <Typography
                      variant="small"
                      color="gray"
                      className="mt-1 font-normal"
                    ></Typography>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <Textarea
                      label="Description"
                      name="Description"
                      value={formData.Description}
                      onChange={handleInputChange}
                      error={!!errors.Description}
                      rows={4}
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    />
                    {errors.Description && (
                      <Typography
                        variant="small"
                        color="red"
                        className="mt-1 flex items-center gap-1 font-normal"
                      >
                        {errors.Description}
                      </Typography>
                    )}
                  </div>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4">
                    <Typography variant="h6" color="blue-gray" className="mb-2">
                      Image Preview
                    </Typography>
                    <div className="relative w-32 h-32 overflow-hidden rounded-lg border border-blue-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150?text=Invalid+URL";
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardBody>

              <CardFooter className="pt-0 flex gap-4">
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={loading}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  fullWidth
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Adding Product..." : "Add Product"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Preview Section - Takes 1/3 of the width */}
        <div className="lg:col-span-1">
          <Card className="h-full sticky top-6">
            <CardHeader
              floated={false}
              shadow={false}
              className="rounded-t-2xl"
            >
              <Typography variant="h5" color="blue-gray">
                Product Preview
              </Typography>
              <Typography color="gray" className="mt-1 font-normal text-sm">
                This is how your product will appear
              </Typography>
            </CardHeader>

            <CardBody>
              <div className="space-y-6">
                {/* Image Preview */}
                <div className="relative w-full h-48 overflow-hidden rounded-lg border border-blue-gray-200 bg-blue-gray-50/50">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PhotoIcon className="h-12 w-12 text-blue-gray-300" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <Typography variant="h6" color="blue-gray" className="mb-1">
                      {formData.Name || "Product Name"}
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="line-clamp-3"
                    >
                      {formData.Description ||
                        "Product description will appear here"}
                    </Typography>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        Category
                      </Typography>
                      <Typography variant="small" color="gray">
                        {formData.Category === "electronic"
                          ? "Electronic"
                          : "Non-Electronic"}
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        Stock
                      </Typography>
                      <Typography
                        variant="small"
                        className={`font-bold ${
                          formData.Amount && parseInt(formData.Amount) <= 5
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {formData.Amount || "0"} units
                      </Typography>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-blue-gray-100">
                    <Typography
                      variant="h5"
                      color="green"
                      className="font-bold"
                    >
                      {formData.Price
                        ? `${parseFloat(formData.Price).toLocaleString()} USD`
                        : "0 USD"}
                    </Typography>
                    <Typography variant="small" color="gray">
                      Price
                    </Typography>
                  </div>
                </div>
              </div>
            </CardBody>

            <CardFooter className="pt-0">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold mb-1"
                >
                  💡 Quick Tips:
                </Typography>
                <ul className="space-y-1">
                  <li className="text-xs text-gray-600">
                    • Use clear, descriptive names
                  </li>
                  <li className="text-xs text-gray-600">
                    • Add high-quality product images
                  </li>
                  <li className="text-xs text-gray-600">
                    • Keep stock levels updated
                  </li>
                  <li className="text-xs text-gray-600">
                    • Double-check price accuracy
                  </li>
                </ul>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
