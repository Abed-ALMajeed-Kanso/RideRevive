import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Toast from './Toast';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const AddCategory: React.FC = () => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryState, setCategoryState] = useState<string>("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categoryDescription, setCategoryDescription] = useState<string>("");
  const [errCategoryName, setErrCategoryName] = useState<string>("");
  const [errCategoryState, setErrCategoryState] = useState<string>("");
  const [errCategoryImage, setErrCategoryImage] = useState<string>("");
  const [errCategoryDescription, setErrCategoryDescription] = useState<string>("");
  const navigate = useNavigate();
  
  const handleCategoryName = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
    setErrCategoryName("");
  };

  const handleCategoryState = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryState(e.target.value);
    setErrCategoryState("");
  };

  const handleCategoryImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCategoryImage(e.target.files[0]);
      setErrCategoryImage("");
    }
  };

  const handleCategoryDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryDescription(e.target.value);
    setErrCategoryDescription("");
  };

  const handleAddCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categoryName) {
      setErrCategoryName("Enter category name");
      return;
    }

    if (!categoryState) {
      setErrCategoryState("Select category state");
      return;
    }

    if (!categoryDescription) {
      setErrCategoryDescription("Enter category description");
      return;
    }

    if (!categoryImage) {
      setErrCategoryImage("Upload a category image");
      return;
    }

    const formData = new FormData();
    formData.append('Category', categoryName);
    formData.append('Category_state', categoryState === 'Active' ? 'true' : 'false');
    formData.append('Category_description', categoryDescription);
    formData.append('Category_image', categoryImage);

    try {
      const response = await fetch(`${apiUrl}/createCategory`, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (responseData === "categoryExists") {
        setErrCategoryName("Category already exists.");
      } else {
        toast.success("Category Created Successfully!");
        setTimeout(() => {
          navigate('/dashboard/category');
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Create Category</h3>
        <form className="row g-1" onSubmit={handleAddCategory}>
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
              {categoryImage && (
                <img
                  src={URL.createObjectURL(categoryImage)}
                  alt="New Category"
                  style={{ width: '75px', height: '75px', marginBottom: '20px' }}
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
              Create Category
            </button>
          </div>
          <Toast />
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
