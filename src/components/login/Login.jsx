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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://med-api-wine.vercel.app/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email: form.email.trim(),
            Password: form.password.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      // ✅ SUCCESS
      console.log("Login success:", data);

      // ✅ STORE TOKEN (VERY IMPORTANT)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      toast.success("Login successful");

      // ✅ NAVIGATE ONCE
      navigate("/Dashboard", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Server connection error");
    }
  };

  return (
    <div className="body-login wrapper">
      <div className="form-box login">
        <form className="formLogin" onSubmit={handleLogin}>
          <Link to="/">
            <FaHome className="ReturnToHome" />
          </Link>

          <h1>Login</h1>

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <FaLock className="icon" />
          </div>

          <div className="remeber-forgot">
            <label>
              <input type="checkbox" /> Remember me
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
