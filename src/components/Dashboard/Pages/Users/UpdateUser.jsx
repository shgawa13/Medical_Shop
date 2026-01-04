import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import { useData } from "../../DashboardComponents/DataContext";
import { IoArrowBackSharp } from "react-icons/io5";

const UpdateUser = () => {
  const { id } = useParams();
  const { usersData, fetchUsers } = useData();

  const [form, setForm] = useState({
    UserID: "",
    UserName: "",
    Email: "",
    IsAdmin: false,
    Password: "",
  });

  useEffect(() => {
    const user = usersData.find((u) => u._id === id);
    if (user) {
      setForm(user);
    }
  }, [id, usersData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://med-api-wine.vercel.app/api/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      toast.success("User updated successfully!");
      console.log("User updated successfully:", result);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Edit User ID: {id}
        </h2>
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
          Update
        </button>
      </form>
    </div>
  );
};
export default UpdateUser;
