import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  type { Order }  from '../types/Order';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const ViewCustomerOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const query = new URLSearchParams(window.location.search);
                const customerID = query.get("id");
                if (!customerID) {
                    navigate(`/dashboard/customer`);
                    return;
                }
                const response = await fetch(`${apiUrl}/getOrdersByCustomerID?Customer_ID=${customerID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const ordersData: Order[] = await response.json();
                console.log('Fetched Orders:', ordersData); 
                setOrders(ordersData);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, [navigate]);

    const handleNavigation = (id: number): void => {
        navigate(`/dashboard/order_details?id=${id}`);
    };

    return (
        <div className='px-5 mt-3'>
            <div className='d-flex justify-content-center'>
                <h3>Orders List</h3>
            </div>
            <div className='mt-3'>
                {orders.length === 0 ? (
                    <div className='d-flex justify-content-center'>
                        <h4>The User Did not Order Anything Yet</h4>
                    </div>
                ) : (
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Order ID</th>
                                <th>Order Date</th>
                                <th>Payment Method</th>
                                <th>Total Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order._id}>
                                    <td>{index + 1}</td>
                                    <td>{order.Order_ID}</td>
                                    <td>{new Date(order.Order_Date).toLocaleDateString()}</td>
                                    <td>{order.Order_payment_method}</td>
                                    <td>{order.Order_total_price}</td>
                                    <td>
                                        <button
                                            className="btn btn-info btn-sm me-2"
                                            onClick={() => handleNavigation(order.Order_ID)}
                                        >
                                            View Order Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ViewCustomerOrders;

