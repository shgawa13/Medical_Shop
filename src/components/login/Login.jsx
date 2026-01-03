import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./LoginRegistter.css";
import { FaUser, FaLock, FaHome } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://med-api-wine.vercel.app/api/users/login",
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            Email: form.email.trim(),
            Password: form.password.trim(),
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Login successful", data);
        data["user"]["IsAdmin"] === 1
          ? navigate("/Dashboard")
          : alert("Please constact admin");
        toast.success("Login successful!");
        //  navigate("/Dashboard"); // Redirect after successful login
      } else {
        toast.error(data.message || "Login failed");
        alert(
          `Incorect Email Or Password \n Make sure to login with correct info`
        );
      }
    } catch (error) {
      // console.error("Error connecting to server", error);
      toast.error("Error connecting to server");
    }
  };

  return (
    <div className="body-login wrapper">
      <div className="form-box login">
        <form className="formLogin " onSubmit={handleLogin}>
          <Link to="/">
            <FaHome className="ReturnToHome" />
          </Link>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={handleChange}
              name="email"
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
              name="password"
            />
            <FaLock className="icon" />
          </div>
          <div className="remeber-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            <p>
              Do not have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
