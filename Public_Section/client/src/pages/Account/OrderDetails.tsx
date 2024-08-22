import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsCheckCircleFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import  type { Product }  from '../../types/Product';
import  type { Order }  from '../../types/Order';
import  type { OrderedProduct }  from '../../types/Ordered_Products';

const OrderDetails: React.FC = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();
    const CustomerID = useSelector((state: any) => state.orebiReducer.isAuthenticated);

    useEffect(() => {
        const fetchOrderAndProducts = async () => {
            try {
                const query = new URLSearchParams(window.location.search);
                const orderID = query.get("id");
                if (!orderID) {
                    navigate(`/dashboard/orders`);
                    return;
                }

                const orderResponse = await fetch(`http://localhost:8001/getOrderByID/${orderID}`);
                if (!orderResponse.ok) {
                    throw new Error('Failed to fetch order');
                }
                const orderData: Order = await orderResponse.json();
                setOrder(orderData);

                const orderedProductsResponse = await fetch(`http://localhost:8001/getProductIDsByOrderID/${orderID}`);
                if (!orderedProductsResponse.ok) {
                    throw new Error('Failed to fetch ordered products');
                }
                const orderedProducts: OrderedProduct[] = await orderedProductsResponse.json();

                const productsData: Product[] = await Promise.all(
                    orderedProducts.map(async ({ Product_ID, Product_Amount }) => {
                        const productDetailResponse = await fetch(`http://localhost:8001/getProductByID/${Product_ID}`);
                        if (!productDetailResponse.ok) {
                            throw new Error(`Failed to fetch product details for product ID ${Product_ID}`);
                        }
                        const product: Product = await productDetailResponse.json();
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
        <div className="w-full h-screen flex items-center justify-center">
            <div className="w-1/2 h-full hidden lgl:inline-flex text-white">
                <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
                    <Link to="/">
                        <span className="Logo">RideRevive</span>
                    </Link>
                    <div className="flex flex-col gap-1 -mt-1">
                        <h1 className="font-titleFont text-xl font-medium">
                            Stay signed in for more
                        </h1>
                        <p className="text-base">When you sign in, you are with us!</p>
                    </div>
                    <div className="w-[300px] flex items-start gap-3">
                        <span className="text-green-500 mt-1">
                            <BsCheckCircleFill />
                        </span>
                        <p className="text-base text-gray-300">
                            <span className="text-white font-semibold font-titleFont">
                                Get started fast with RideRevive
                            </span>
                            <br />
                            Enjoy a seamless and quick exploration process. Explore our 
                            vast collection of tools and resources.
                        </p>
                    </div>
                    <div className="w-[300px] flex items-start gap-3">
                        <span className="text-green-500 mt-1">
                            <BsCheckCircleFill />
                        </span>
                        <p className="text-base text-gray-300">
                            <span className="text-white font-semibold font-titleFont">
                                Access all RideRevive services
                            </span>
                            <br />
                            Unlock the full potential of RideRevive. Access advanced tools, 
                            and premium support to elevate your satisfaction.
                        </p>
                    </div>
                    <div className="w-[300px] flex items-start gap-3">
                        <span className="text-green-500 mt-1">
                            <BsCheckCircleFill />
                        </span>
                        <p className="text-base text-gray-300">
                            <span className="text-white font-semibold font-titleFont">
                                Trusted by online Shoppers
                            </span>
                            <br />
                            Benefit from our irreplaceable services. 
                            Our platform is trusted by users worldwide for 
                            its reliability and quality.
                        </p>
                    </div>
                    <div className="flex items-center justify-between mt-10">
                        <Link to="/">
                            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
                                © RideRevive
                            </p>
                        </Link>
                        <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
                            Terms
                        </p>
                        <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
                            Privacy
                        </p>
                        <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
                            Security
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Right Section */}
            <div className="w-full lg:w-1/2 h-full relative right-24 pt-10">
                <div className="p-5 bg-white rounded-lg shadow-2xl w-full max-w-3xl">
                    <h3 className="text-2xl font-semibold mb-3 text-center text-gray-800">Order Details</h3>
                    <div className="mt-3">
                        <table className="table-auto w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-300">
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Order Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Payment Method
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Total Price
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.Order_ID}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{new Date(order.Order_Date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.Order_payment_method}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${order.Order_total_price.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-5">
                        <h4 className="text-lg font-semibold mb-3 text-gray-800">Products in Order {order.Order_ID}</h4>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100 border-b border-gray-300">
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Product Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Price of One Unit
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Price of All Units
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300">
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.Product}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <img
                                                    src={`http://localhost:8001/Products/${product.Product_image}`}
                                                    alt={product.Product}
                                                    className="w-16 h-16 object-cover"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.Category}</td>        
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${product.Product_price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.Ordered_Product_Amount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${(product.Ordered_Product_Amount! * product.Product_price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
