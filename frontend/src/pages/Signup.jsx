import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      role: form.role === "vendor" ? "admin" : "user"
    };

    const res = await axios.post("/auth/signup", payload);

    localStorage.setItem("token", res.data.accessToken);

    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name"
        onChange={e=>setForm({...form,name:e.target.value})} />

      <input placeholder="Email"
        onChange={e=>setForm({...form,email:e.target.value})} />

      <input placeholder="Phone"
        onChange={e=>setForm({...form,phone:e.target.value})} />

      <input type="password" placeholder="Password"
        onChange={e=>setForm({...form,password:e.target.value})} />

      <select onChange={e=>setForm({...form,role:e.target.value})}>
        <option value="user">User</option>
        <option value="vendor">Vendor</option>
      </select>

      <button type="submit">Signup</button>
    </form>
  );
}