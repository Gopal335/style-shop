import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import VendorPanel from "./VendorPanel";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome {user.name}</h1>

      {user.role === "admin" ? (
        <VendorPanel />
      ) : (
        <div>User Dashboard</div>
      )}
    </div>
  );
}