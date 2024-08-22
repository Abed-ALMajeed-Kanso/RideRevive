import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Toast from './Toast';
import  type { Product }  from '../types/Product';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Product: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${apiUrl}/getProducts`); 
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const productsData: Product[] = await response.json();
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = (productID: string): void => {
        fetch(`${apiUrl}/deleteProduct/${productID}`, { method: 'GET' })
            .then((response) => response.json())
            .then((result) => {
                if (result.message) {
                    toast.success("Product Deleted Successfully!");
                    setTimeout(() => {
                        setProducts(products.filter((product) => product.Product_ID !== productID));
                    }, 2000);
                } else {
                    alert(result.error);
                }
            })
            .catch((error) => console.log(error));
    };

    const handleNavigation = (product: Product): void => {
        navigate(`/dashboard/edit_product?id=${product.Product_ID}`);
    };

    return (
        <div className='px-5 mt-3'>
            <div className='d-flex justify-content-center'>
                <h3>Products List</h3>
            </div>
            <Link to="/dashboard/add_product" className='btn btn-success'>Add Product</Link>
            <div className='mt-3'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Category</th>
                            <th>Insertion Date</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>State</th>
                            <th>Amount</th>
                            <th>Current Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product._id}>
                                <td>{index + 1}</td>
                                <td>{product.Product}</td>
                                <td style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img
                                        src={`${apiUrl}/Products/${product.Product_image}`}
                                        alt={product.Product}
                                        style={{ width: '75px', height: '75px' }}
                                    />
                                </td>
                                <td>{product.Category}</td>
                                <td>{new Date(product.Product_Date).toLocaleDateString()}</td> {/* Date formatting */}
                                <td>{product.Product_price + "$"}</td>
                                <td>{product.Product_Discount + "%"}</td>
                                <td>{product.Product_state ? 'Active' : 'Inactive'}</td>
                                <td>{product.Product_amount}</td>
                                <td>{product.Product_current_amount}</td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm me-2"
                                        onClick={() => handleNavigation(product)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => handleDelete(product.Product_ID)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Toast />
            </div>
        </div>
    );
};

export default Product;
