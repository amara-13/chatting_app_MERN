import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import Swal from "sweetalert2";
// import Product from "../../backend/models/Product";
import {
    getProducts,
    deleteProduct,
    updateProduct,
    createProduct,
} from "./services/ProductService";

// function App() {

//     const [formData, setFormData] = useState({
//         name: "",
//         price: "",
//         category: "",
//         description:"",
//         stock: ""
//     });
//     const [products, setProducts] = useState([]);
//     const [editingId,setEditingId] = useState(null);

//     const handleEdit = (product)=>{
//         setEditingId(product._id);
//         setFormData({
//             name:product.name,
//             price:product.price,
//             category:product.category,
//             stock:product.stock,
//             description:product.description
//         });
//     };

//     const handleChange = (e) => {

//         const { name, value } = e.target;

//         setFormData({
//             ...formData,
//             [name]: value
//         });
//     };

//       const fetchProduct = async()=>{
//         const response = await axios.get(API_URL);
//         setProducts(response.data.data);
//     };
//     useEffect(()=>{
//         fetchProduct();
//     },[]);

//     // create 
//     const handleSubmit = async(e)=>{
//         e.preventDefault();
//         try{
//             if(editingId){
//                 // update
//                 const response = await axios.put(`${API_URL}/${editingId}`,formData);
//                setProducts(
//                 products.map((product)=>product._id===editingId?response.data.data:product)
//                );
//                setEditingId(null);           

//             }else{


//             const response = await axios.post(API_URL,formData);
//             setProducts([...products,response.data.data]);
//             setFormData({
//                 name:"",
//                 price:"",
//                 category:"",
//                 description:"",
//                 stock:""
//         });
//     }
//         }catch(error){
//             console.log(error);
//         }
//     };
// //    delete
// const handleDelete = async(id)=>{
//     try{
//         await axios.delete(`${API_URL}/${id}`);
//         setProducts(
//             products.filter((product)=>product._id!==id));

//     }catch(error){
//         console.log(error);
//     }
// };

// // update
// // const handleUpdate = async(id)=>{
// //     try{
// //         await axios.put(`${API_URL}/${id}`);
// //         setProducts([

// //         ])
// //     }
// // }
//     return (
//         <div>
//             <h1>Product CRUD</h1>
// <form onSubmit={handleSubmit}>
//             <input
//                 name="name"
//                 placeholder="Product name"
//                 value={formData.name}
//                 onChange={handleChange}
//             />

//             <input
//                 name="price"
//                 type="number"
//                 placeholder="Price"
//                 value={formData.price}
//                 onChange={handleChange}
//             />

//             <input
//                 name="category"
//                 placeholder="Category"
//                 value={formData.category}
//                 onChange={handleChange}
//             />

//             <input
//                 name="stock"
//                 placeholder="Stock"
//                 type="number"
//                 value={formData.stock}
//                 onChange={handleChange}
//             />
//              <input
//                 name="description"
//                 placeholder="Description"
//                 value={formData.description}
//                 onChange={handleChange}
//             />
//             <button type="submit">{editingId?"Update Product":"Add Product"}</button>
//             </form>

//             <pre>
//                 {JSON.stringify(formData, null, 2)}
//             </pre>
//              {products.map((product) => (
//                 <div key={product._id}>
//                     <h3>{product.name}</h3>
//                     <p>Price: {product.price}</p>
//                     <p>Category: {product.category}</p>
//                     <p>Stock: {product.stock}</p>
//                     <button onClick={()=>handleDelete(product._id)}>Delete</button>
//                  <button onClick={()=>handleEdit(product)}>Edit</button>
//                 </div>
//             ))}
//         </div>
//     );

// }
function App() {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: ""
    });
    const [products, setProducts] = useState([]);

    const [editingId, setEditingId] = useState(null);

    // GET PRODUCTS
    const fetchProduct = async () => {

        try {

            const data = await getProducts();
            setProducts(data);

        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Something went wrong while fetching the products.",
                icon: "error"
            });
            console.log(error);

        }
    };
    useEffect(() => {
        fetchProduct();
    }, []);


    // HANDLE INPUT
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // CREATE / UPDATE
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                const updatedProduct = await updateProduct(editingId, formData)

                setProducts(
                    products.map((product) =>
                        product._id === editingId
                            ? updatedProduct
                            : product
                    )
                );
                Swal.fire({
                    title: "Product Updated!",
                    text: "Product has been updated successfully.",
                    icon: "success",
                    confirmButtonText: "OK"
                });
                setEditingId(null);

            } else {

                const newProduct = await createProduct(formData);

                setProducts([
                    ...products,
                    newProduct
                ]);
                Swal.fire({
                    title: "Product Added!",
                    text: "Product has been added successfully.",
                    icon: "success",
                    confirmButtonText: "OK"
                });
            }


            setFormData({
                name: "",
                price: "",
                category: "",
                stock: "",
                description: ""
            });


        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Something went wrong while saving the product.",
                icon: "error"
            });

            console.log(error);

        }
    };

    // EDIT
    const handleEdit = (product) => {

        setEditingId(product._id);

        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock,
            description: product.description

        });
    };

    // DELETE
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to undo this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, delete it!"
        });
        if (result.isConfirmed) {

            try {

                await deleteProduct(id);

                setProducts(
                    products.filter(
                        (product) => product._id !== id
                    )
                );
                Swal.fire({
                    title: "Deleted!",
                    text: "Product has been deleted.",
                    icon: "success"
                });

            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "Something went wrong while deleting the product.",
                    icon: "error"
                });
                console.log(error);

            }
        };
    }

    return (
        <div className="p-5 ">
            <h1>Product CRUD</h1>
            <ProductForm formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                editingId={editingId}
            />
            <ProductList
                products={products}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </div>
    );
}

export default App;
