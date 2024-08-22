import React, { useEffect, useState } from 'react';
import type { Customer } from '../types/Customer';
import type { Product } from '../types/Product';
import type { Category } from '../types/Category';
import type { Administrator } from '../types/Administrator';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Home: React.FC = () => {
  const [categoryTotal, setCategoryTotal] = useState<number>(0);
  const [productTotal, setProductTotal] = useState<number>(0);
  const [customerTotal, setCustomerTotal] = useState<number>(0);
  const [admins, setAdmins] = useState<Administrator[]>([]);

  useEffect(() => {
    getCategoryCount();
    getProductCount();
    getCustomerCount();
    getAdminRecords();
  }, []);

  const getAdminRecords = async () => {
    try {
      const response = await fetch(`${apiUrl}/getAdmins`);
      const result: Administrator[] = await response.json();
      setAdmins(result);
    } catch (error) {
      console.error("There was an error fetching the admin records!", error);
    }
  };

  const getCategoryCount = async () => {
    try {
      const response = await fetch(`${apiUrl}/getCategories`);
      const result: Category[] = await response.json();
      setCategoryTotal(result.length);
    } catch (error) {
      console.error("There was an error fetching the categories!", error);
    }
  };

  const getProductCount = async () => {
    try {
      const response = await fetch(`${apiUrl}/getProducts`);
      const result: Product[] = await response.json();
      setProductTotal(result.length);
    } catch (error) {
      console.error("There was an error fetching the products!", error);
    }
  };

  const getCustomerCount = async () => {
    try {
      const response = await fetch(`${apiUrl}/getCustomers`);
      const result: Customer[] = await response.json();
      setCustomerTotal(result.length);
    } catch (error) {
      console.error("There was an error fetching the customers!", error);
    }
  };

  return (
    <div>
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Categories</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{categoryTotal}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Products</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{productTotal}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Customers</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{customerTotal}</h5>
          </div>
        </div>
      </div>
      <div className='mt-4 px-5 pt-3'>
        <h3>List of Admins</h3>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Number</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.Administrator_ID}>
                <td>{a.Administrator_ID}</td>
                <td>{a.Administrator_fullname}</td>
                <td>{a.Administrator_email}</td>
                <td>{a.Administrator_number}</td>
                <td>{a.Administrator_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
