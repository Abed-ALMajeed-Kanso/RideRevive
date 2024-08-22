import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Toast from './Toast';
import  type { Category }  from '../types/Category';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const EditCategory: React.FC = () => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryState, setCategoryState] = useState<string>("");
  const [categoryDescription, setCategoryDescription] = useState<string>("");
  const [categoryImage, setCategoryImage] = useState<string>("");
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [errCategoryName, setErrCategoryName] = useState<string>("");
  const [errCategoryState, setErrCategoryState] = useState<string>("");
  const [errCategoryDescription, setErrCategoryDescription] = useState<string>("");
  const [errCategoryImage, setErrCategoryImage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const query = new URLSearchParams(window.location.search);
        const cat = query.get("category");
        const url = `${apiUrl}/getCategoryByName/${cat}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch category data');
        }
        const category: Category = await response.json();
        if (category.Category != null) {
          setCategoryName(category.Category);
          setCategoryState(category.Category_state ? 'Active' : 'Inactive');
          setCategoryDescription(category.Category_description);
          setCategoryImage(category.Category_image);
        } else {
          navigate(`/dashboard/Category`);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };
    fetchCategoryData();
  }, [navigate]);

  const handleCategoryName = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
    setErrCategoryName("");
  };

  const handleCategoryState = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryState(e.target.value);
    setErrCategoryState("");
  };

  const handleCategoryDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryDescription(e.target.value);
    setErrCategoryDescription("");
  };

  const handleCategoryImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewCategoryImage(e.target.files[0]);
      setErrCategoryImage("");
    }
  };

  const handleManageCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categoryName) {
      setErrCategoryName("Enter category name");
      return;
    }

    if (!categoryDescription) {
      setErrCategoryDescription("Enter category description");
      return;
    }

    if (!categoryState) {
      setErrCategoryState("Select category state");
      return;
    }

    const formData = new FormData();
    formData.append('Category', categoryName);
    formData.append('Category_state', categoryState === 'Active' ? 'true' : 'false');
    formData.append('Category_description', categoryDescription);
    if (newCategoryImage) {
      formData.append('Category_image', newCategoryImage);
    }

    try {
      const response = await fetch(`${apiUrl}/updateCategory`, { 
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        toast.success("Category Updated Successfully!");
        setTimeout(() => {
          navigate('/dashboard/category');
        }, 2000);
      } else {
        console.error("Failed to update category.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Category</h3>
        <form className="row g-1" onSubmit={handleManageCategory}>
          <div className="col-12">
            <label htmlFor="inputCategoryName" className="form-label">
              Category Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputCategoryName"
              placeholder="Enter Category Name"
              value={categoryName}
              onChange={handleCategoryName}
              disabled
            />
            {errCategoryName && <div className="text-danger">{errCategoryName}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputCategoryDescription" className="form-label">
              Category Description
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputCategoryDescription"
              placeholder="Enter Category Description"
              value={categoryDescription}
              onChange={handleCategoryDescription}
            />
            {errCategoryDescription && <div className="text-danger">{errCategoryDescription}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputCategoryState" className="form-label">
              Category State
            </label>
            <select
              className="form-control rounded-0"
              id="inputCategoryState"
              value={categoryState}
              onChange={handleCategoryState}
            >
              <option value="">Select State</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errCategoryState && <div className="text-danger">{errCategoryState}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputCategoryImage" className="form-label">
              Category Image
            </label>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={`http://localhost:8001/Categories/${categoryImage}`}
                alt="Current Category"
                style={{ width: '75px', height: '75px', marginRight: '20px', marginBottom: '20px' }}
              />
              {newCategoryImage && (
                <img
                  src={URL.createObjectURL(newCategoryImage)}
                  alt="New Category"
                  style={{ width: '75px', height: '75px' }}
                />
              )}
            </div>
            <input
              type="file"
              className="form-control"
              id="inputCategoryImage"
              onChange={handleCategoryImage}
            />
            {errCategoryImage && <div className="text-danger">{errCategoryImage}</div>}
          </div>
          <div>
            <br />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Update Category
            </button>
            <Toast />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
