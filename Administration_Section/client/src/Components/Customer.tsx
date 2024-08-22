import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Toast from './Toast';
import type { Customer } from '../types/Customer';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Customer: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/getCustomers`)  
      .then((response) => response.json())
      .then((data: Customer[]) => setCustomers(data))
      .catch((error) => console.log(error));
  }, []);

  const handleDelete = (id: string) => {
    fetch(`${apiUrl}/deleteCustomer/${id}`, { 
      method: 'GET',
    })
    .then((response) => response.json())
    .then((result) => {
      if (result.Status) {
          toast.success("Customer Deleted Successfully!");
          setTimeout(() => {
              setCustomers(customers.filter((customer) => customer.Customer_ID !== id));
          }, 2000);
        } else {
          alert(result.Error);
        }
      })
      .catch((error) => console.log(error));
  };
 
  const handleToggleState = (id: string) => {
    fetch(`${apiUrl}/toggleCustomerState/${id}`, {
      method: 'PATCH',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.Status) {
          toast.success("Action Done Successfully!");
          setCustomers(customers.map((customer) => 
            customer.Customer_ID === id ? { ...customer, Customer_state: !customer.Customer_state } : customer
          ));
        } else {
          alert(result.Error);
        }
      })
      .catch((error) => console.log(error));
};

  
  const handleViewOrders = (id: string): void => {
      navigate(`/dashboard/orders?id=${id}`);
  };

  const renderCustomerState = (state: boolean): string => {
    return state ? "Un Banned" : "Banned";
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Customers List</h3>
      </div>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>State</th>
              <th>Action</th>
              <th>View Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.Customer_ID}>
                <td>{customer.Customer_ID}</td>
                <td>{customer.Customer_fullname}</td>
                <td>{customer.Customer_email}</td>
                <td>{customer.Customer_number}</td>
                <td>{customer.Customer_address}</td>
                <td>{renderCustomerState(customer.Customer_state)}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => handleToggleState(customer.Customer_ID)}
                  >
                    {customer.Customer_state ? "Ban User" : "Unban User"}
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(customer.Customer_ID)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => handleViewOrders(customer.Customer_ID)}
                  >
                    {"View User's Orders"}
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

export default Customer;
