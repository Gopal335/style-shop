import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/DashBoard";
import { AuthProvider } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}