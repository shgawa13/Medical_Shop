import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { useData } from "../../DashboardComponents/DataContext";

const AddNewUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { usersData, fetchUsers } = useData();

  const navigate = useNavigate();
  const [form, setForm] = useState({
    UserName: "",
    Email: "",
    Password: "",
    IsAdmin: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!form.UserName || !form.Email || !form.Password) {
      setError("All fields are required.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(error || "Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        "https://med-api-wine.vercel.app/api/users/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      const result = await response.json();
      toast.success("User added successfully!");
      fetchUsers();
      navigate("/Dashboard/Users");
    } catch (err) {
      console.error("Failed to add user:", err);
      toast.error(err.message || "Failed to add user.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Add New User</h2>
        <Link
          to="/Dashboard/Users"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <IoArrowBackSharp className="mr-1" /> Back to Users
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            User Name
          </label>
          <input
            name="UserName"
            value={form.UserName}
            onChange={handleChange}
            placeholder="User Name"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            name="Email"
            type="email"
            value={form.Email}
            onChange={handleChange}
            placeholder="Email"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            name="Password"
            type="password"
            value={form.Password}
            onChange={handleChange}
            placeholder="Password"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Is Admin</label>
          <input
            type="checkbox"
            name="IsAdmin"
            checked={form.IsAdmin}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddNewUser;
