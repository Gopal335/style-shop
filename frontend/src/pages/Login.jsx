import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post("/auth/signin", form);

    localStorage.setItem("token", res.data.accessToken);

    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email"
        onChange={e=>setForm({...form,email:e.target.value})} />

      <input type="password" placeholder="Password"
        onChange={e=>setForm({...form,password:e.target.value})} />

      <button type="submit">Login</button>
    </form>
  );
}