import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  type { Product }  from '../types/Product';
import  type { Order }  from '../types/Order';
import  type { OrderedProduct }  from '../types/Ordered_Products';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const OrderDetails: React.FC = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [products, setProducts] = useState<(Product & { Ordered_Product_Amount: number })[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderAndProducts = async () => {
            try {
                const query = new URLSearchParams(window.location.search);
                const orderID = query.get("id");
                if (!orderID) {
                    navigate(`/dashboard/orders`);
                    return;
                }

                const orderResponse = await fetch(`${apiUrl}/getOrderByID/${orderID}`);
                if (!orderResponse.ok) {
                    throw new Error('Failed to fetch order');
                }
                const orderData: Order = await orderResponse.json();
                setOrder(orderData);

                const orderedProductsResponse = await fetch(`${apiUrl}/getProductIDsByOrderID/${orderID}`);
                if (!orderedProductsResponse.ok) {
                    throw new Error('Failed to fetch ordered products');
                }
                const orderedProducts: OrderedProduct[] = await orderedProductsResponse.json();

                // Fetch product details for each product ID
                const productsData: (Product & { Ordered_Product_Amount: number })[] = await Promise.all(
                    orderedProducts.map(async ({ Product_ID, Product_Amount }) => {
                        const productDetailResponse = await fetch(`${apiUrl}/getProductByID/${Product_ID}`);
                        if (!productDetailResponse.ok) {
                            throw new Error(`Failed to fetch product details for product ID ${Product_ID}`);
                        }
                        const product = await productDetailResponse.json();
                        return { ...product, Ordered_Product_Amount: Product_Amount };
                    })
                );

                setProducts(productsData);

            } catch (error) {
                console.error('Error fetching order and products:', error);
            }
        };

        fetchOrderAndProducts();
    }, [navigate]);

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div className='px-5 mt-3'>
            <div className='d-flex justify-content-center'>
                <h3>Order Details</h3>
            </div>
            <div className='mt-3'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer ID</th>
                            <th>Order Date</th>
                            <th>Payment Method</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{order.Order_ID}</td>
                            <td>{order.Customer_ID}</td>
                            <td>{new Date(order.Order_Date).toLocaleDateString()}</td>
                            <td>{order.Order_payment_method}</td>
                            <td>{order.Order_total_price}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='mt-5'>
                <h4>Products in Order {order.Order_ID}</h4>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Image</th>
                            <th>Category</th>
                            <th>Price of One Unit</th>
                            <th>Amount</th>
                            <th>Price of All Units</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product._id}>
                                <td>{index + 1}</td>
                                <td>{product.Product}</td>
                                <td>
                                    <img
                                        src={`${apiUrl}/Products/${product.Product_image}`}
                                        alt={product.Product}
                                        style={{ width: '75px', height: '75px' }}
                                    />
                                </td>
                                <td>{product.Category}</td>
                                <td>{product.Product_price}</td>
                                <td>{product.Ordered_Product_Amount}</td>
                                <td>{(product.Ordered_Product_Amount * product.Product_price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderDetails;

