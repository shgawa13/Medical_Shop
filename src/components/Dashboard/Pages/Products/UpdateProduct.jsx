import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../DashboardComponents/DataContext";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Textarea,
  Checkbox,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProducts } = useData();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://med-api-wine.vercel.app/api/products/${id}`
        );

        if (!response.ok) throw new Error();

        const data = await response.json();
        const product = data.product || data.data || data;

        setFormData({
          Name: product.Name ?? product.name ?? "",
          Description: product.Description ?? product.description ?? "",
          Price: product.Price?.toString() ?? product.price?.toString() ?? "",
          Amount:
            product.Amount?.toString() ?? product.amount?.toString() ?? "",
          Category: product.Category ?? product.category ?? "non-electronic",
          Image: product.Image ?? product.image ?? "",
        });

        setImagePreview(product.Image ?? product.image ?? "");
      } catch {
        toast.error("Failed to load product");
        navigate("/Dashboard/Products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  /* ================= HELPERS ================= */
  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Name.trim()) newErrors.Name = "Name required";
    if (!formData.Description.trim())
      newErrors.Description = "Description required";
    if (!formData.Price || Number(formData.Price) <= 0)
      newErrors.Price = "Invalid price";
    if (formData.Amount === "" || Number(formData.Amount) < 0)
      newErrors.Amount = "Invalid amount";
    if (!formData.Image.trim()) newErrors.Image = "Image required";
    else if (!isValidUrl(formData.Image)) newErrors.Image = "Invalid image URL";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= HANDLERS ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));

    if (name === "Image" && isValidUrl(value)) {
      setImagePreview(value);
    }
  };

  const handleCategoryChange = (checked) => {
    setFormData((p) => ({
      ...p,
      Category: checked ? "electronic" : "non-electronic",
    }));
  };

  /* ================= UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setUpdating(true);

      const payload = {
        ...formData,
        Price: Number(formData.Price),
        Amount: Number(formData.Amount),
      };

      const response = await fetch(
        `https://med-api-wine.vercel.app/api/products/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error();

      toast.success("Product updated");
      fetchProducts();
      navigate("/Dashboard/Products");
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!window.confirm("Delete product permanently?")) return;

    try {
      const response = await fetch(
        `https://med-api-wine.vercel.app/api/products/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error();

      toast.success("Product deleted");
      navigate("/Dashboard/Products");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  /* ================= JSX ================= */
  return (
    <div className="p-4 md:p-6">
      <Button variant="text" onClick={() => navigate("/Dashboard/Products")}>
        <ArrowLeftIcon className="h-4 w-4 inline mr-1" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* FORM */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader shadow={false}>
              <Typography variant="h4">Edit Product</Typography>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardBody className="grid gap-5">
                <Input
                  label="Product Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  error={!!errors.Name}
                />

                <Textarea
                  label="Description"
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  error={!!errors.Description}
                />

                <Input
                  type="number"
                  label="Price"
                  name="Price"
                  value={formData.Price}
                  onChange={handleInputChange}
                  error={!!errors.Price}
                />

                <Input
                  type="number"
                  label="Amount"
                  name="Amount"
                  value={formData.Amount}
                  onChange={handleInputChange}
                  error={!!errors.Amount}
                />

                <Input
                  label="Image URL"
                  name="Image"
                  value={formData.Image}
                  onChange={handleInputChange}
                  icon={<PhotoIcon className="h-5 w-5" />}
                  error={!!errors.Image}
                />

                <Checkbox
                  checked={formData.Category === "electronic"}
                  onChange={(e) => handleCategoryChange(e.target.checked)}
                  label="Electronic product"
                />
              </CardBody>

              <CardFooter className="flex gap-4">
                <Button variant="outlined" color="red" onClick={handleDelete}>
                  Delete
                </Button>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  type="submit"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* PREVIEW */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader shadow={false}>
              <Typography variant="h5">Product Preview</Typography>
            </CardHeader>

            <CardBody className="space-y-4">
              <div className="h-48 rounded border overflow-hidden bg-gray-50">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Image")
                    }
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <PhotoIcon className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>

              <Typography variant="h6">
                {formData.Name || "Product Name"}
              </Typography>

              <Typography color="gray" className="text-sm">
                {formData.Description || "Product description"}
              </Typography>

              <Typography className="font-bold text-green-600">
                {formData.Price
                  ? `${Number(formData.Price).toLocaleString()} USD`
                  : "0 USD"}
              </Typography>

              <Typography className="text-sm">
                Stock: {formData.Amount || 0}
              </Typography>

              <Typography className="text-xs uppercase font-semibold">
                {formData.Category}
              </Typography>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
