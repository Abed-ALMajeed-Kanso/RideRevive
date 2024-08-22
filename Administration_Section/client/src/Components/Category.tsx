import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Toast  from './Toast';
import  type { Category }  from '../types/Category';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CategoryComponent: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/getCategories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData: Category[] = await response.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = (category: string) => {
    fetch(`${apiUrl}deleteCategory/${category}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.message) {
          toast.success("Category Deleted Successfully!");
          setTimeout(() => {
            setCategories(categories.filter((cat) => cat.Category !== category));
          }, 2000);
        } else {
          alert(result.error);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleNavigation = (category: Category) => {
    navigate(`/dashboard/edit_category?category=${category.Category}`);
  };

  return (
    <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>
        <h3>Categories List</h3>
      </div>
      <Link to="/dashboard/add_category" className='btn btn-success'>Add Category</Link>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Image</th>
              <th>Description</th>
              <th>State</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category._id}>
                <td>{index + 1}</td>
                <td>{category.Category}</td>
                <td style={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={`${apiUrl}/Categories/${category.Category_image}`}  
                    alt={category.Category}
                    style={{ width: '75px', height: '75px' }}
                  />
                </td>
                <td>{category.Category_description}</td>
                <td>{category.Category_state ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => handleNavigation(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(category.Category)}
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

export default CategoryComponent;
