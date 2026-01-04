import { useState, useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { useData } from "../../DashboardComponents/DataContext";
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
} from "@material-tailwind/react";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

const TABLE_HEAD = [
  "UserID",
  "UserName",
  "Email",
  "Admin Status",
  "Edit",
  "Delete",
];

const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { usersData, fetchUsers } = useData();

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return usersData || [];

    const term = searchTerm.toLowerCase();

    return (usersData || []).filter((user) => {
      return (
        (user.UserName && String(user.UserName).toLowerCase().includes(term)) ||
        (user.Email && String(user.Email).toLowerCase().includes(term))
      );
    });
  }, [usersData, searchTerm]);

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!userConfirmed) return;

    try {
      const response = await fetch(
        `https://med-api-wine.vercel.app/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentLength = response.headers.get("content-length");
      if (contentLength && parseInt(contentLength) > 0) {
        await response.json();
      }

      toast.success("User deleted successfully");
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  const clearSearch = () => setSearchTerm("");

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Users list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all users
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outlined" size="sm" onClick={clearSearch}>
              View all
            </Button>
            <Link to={`/Dashboard/Users/addnew`}>
              <Button
                className="flex items-center gap-3 text-blue-700"
                size="sm"
              >
                <UserPlusIcon
                  strokeWidth={2}
                  className="h-4 w-4 text-blue-700"
                />
                Add User
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full md:w-72">
            <Input
              label="Search by User Name or Email"
              name="filter"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
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
            {filteredUsers.map((row, index) => {
              const isLast = index === filteredUsers.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={row._id}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row._id || "N/A"}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.UserName || "N/A"}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.Email || "N/A"}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.IsAdmin ? "Admin" : "User"}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Link to={`/Dashboard/Users/Update/${row._id}`}>
                      <Tooltip content="Edit User">
                        <button variant="text">
                          <PencilIcon className="h-6 w-6 text-blue-700" />
                        </button>
                      </Tooltip>
                    </Link>
                  </td>
                  <td className={classes}>
                    <Tooltip content="Delete">
                      <button
                        variant="text"
                        onClick={() => handleDelete(row._id)}
                      >
                        <RiDeleteBack2Fill className="h-6 w-6 text-red-700" />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page 1 of 10
          {filteredUsers.length > 0 ? ` (${filteredUsers.length} total)` : ""}
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            Previous
          </Button>
          <Button variant="outlined" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UsersList;
