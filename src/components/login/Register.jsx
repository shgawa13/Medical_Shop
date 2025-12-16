import "./LoginRegistter.css";
import { useState, useEffect } from "react";
import { FaUser, FaLock, FaEnvelope, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    UserName: "",
    Email: "",
    Password: "",
    IsAdmin: false,
  });

  // Handle changes
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
        "http://localhost/SmartKey/Backend/api/users/",
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        alert("Failed to add user: \nUserName or Email Already Exist");
        throw new Error(response.status);
      }

      // const result = await response.json(); // Fails if response is not valid JSON
      alert("User added successfully");
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };
  return (
    <div className={`body-login wrapper active`}>
      <div className="form-box register">
        <form onSubmit={handleSubmit} className="formRegister">
          <Link to={"/"}>
            {" "}
            <FaHome className="ReturnToHome" />
          </Link>
          <h1>registration </h1>
          <div className="input-box">
            <input
              name="UserName"
              value={form.UserName}
              onChange={handleChange}
              placeholder="User Name"
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              name="Email"
              type="Email"
              value={form.Email}
              onChange={handleChange}
              placeholder="Email"
              required
            />

            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input
              name="Password"
              type="Password"
              value={form.Password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <FaLock className="icon" />
          </div>
          <div className="remeber-forgot">
            <label>
              {" "}
              <input type="checkbox" />I agree to the terms & conditions
            </label>
          </div>
          <button type="submit">register</button>
          <div className="register-link">
            <p>
              already have an account ?<Link to={"/login"}>Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
