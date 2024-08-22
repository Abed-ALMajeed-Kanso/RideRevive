import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsCheckCircleFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Order} from '../../types/Order';

const apiUrl = process.env.REACT_APP_API_URL;

const ViewOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  const CustomerID = useSelector((state: any) => state.orebiReducer.isAuthenticated);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!CustomerID) {
          navigate(`/signin`);
          return;
        }
        const response = await axios.get<Order[]>(`${apiUrl}/getOrdersByCustomerID?Customer_ID=${CustomerID}`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch orders');
        }
        const ordersData = response.data;
        console.log('Fetched Orders:', ordersData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [CustomerID, navigate]);

  const handleNavigation = (id: number) => {
    navigate(`/Customer_order_details?id=${id}`);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 h-full hidden lgl:inline-flex h-full text-white">
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
          <h3 className="text-2xl font-semibold mb-3 text-center text-gray-800">Orders List</h3>
          {orders.length === 0 ? (
            <div className="text-gray-500 text-center">
              <p className="mb-3">No orders found.</p>
              <p>The user has not placed any orders yet.</p>
            </div>
          ) : (
            <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th scope="col" className="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      View Full Order
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order, index) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.Order_ID}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.Order_Date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.Order_payment_method}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.Order_total_price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleNavigation(order.Order_ID)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewOrders;
