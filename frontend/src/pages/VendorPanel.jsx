import axios from "../api/axios";

export default function VendorPanel() {

  const createProduct = async () => {
    await axios.post("/products",
      { name: "Sample", price: 100 },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
  };

  return (
    <div>
      <h2>Vendor Dashboard</h2>
      <button onClick={createProduct}>
        Add Product
      </button>
    </div>
  );
}