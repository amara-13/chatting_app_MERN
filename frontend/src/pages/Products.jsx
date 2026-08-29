import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/ProductService";

function Products() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // 1. Fetch all products
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch products.",
        icon: "error",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 3. Create or Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updatedProduct = await updateProduct(editingId, formData);
        setProducts(
          products.map((p) => (p._id === editingId ? updatedProduct : p))
        );
        Swal.fire({
          title: "Product Updated!",
          text: "Product updated successfully.",
          icon: "success",
        });
        setEditingId(null);
      } else {
        const newProduct = await createProduct(formData);
        setProducts([...products, newProduct]);
        Swal.fire({
          title: "Product Added!",
          text: "Product added successfully.",
          icon: "success",
        });
      }

      // Reset form
      setFormData({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to save product.",
        icon: "error",
      });
      console.error(error);
    }
  };

  // 4. Populate form for editing
  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description || "",
    });
  };

  // 5. Delete product with SweetAlert confirmation
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p._id !== id));
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete product.", "error");
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Product Management</h1>
        <p className="text-slate-500 mt-1">Manage and update your inventory</p>
      </div>

      {/* Product Create/Update Form */}
      <ProductForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        editingId={editingId}
      />

      {/* Product List Table */}
      <ProductList
        products={products}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default Products;
