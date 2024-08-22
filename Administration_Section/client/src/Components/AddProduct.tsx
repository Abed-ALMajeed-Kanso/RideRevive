import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Toast from './Toast';
import type { Category } from '../types/Category';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const AddProduct: React.FC = () => {
  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>("");
  const [productState, setProductState] = useState<string>("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productAmount, setProductAmount] = useState<string>("");
  const [productCurrentAmount, setProductCurrentAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [productDiscount, setProductDiscount] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [errProductName, setErrProductName] = useState<string>("");
  const [errProductPrice, setErrProductPrice] = useState<string>("");
  const [errProductState, setErrProductState] = useState<string>("");
  const [errProductImage, setErrProductImage] = useState<string>("");
  const [errProductAmount, setErrProductAmount] = useState<string>("");
  const [errProductCurrentAmount, setErrProductCurrentAmount] = useState<string>("");
  const [errCategory, setErrCategory] = useState<string>("");
  const [errProductDiscount, setErrProductDiscount] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/getCategories` ); 
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categories: Category[] = await response.json();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleProductName = (e: ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
    setErrProductName("");
  };

  const handleProductPrice = (e: ChangeEvent<HTMLInputElement>) => {
    setProductPrice(e.target.value);
    setErrProductPrice("");
  };

  const handleProductAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setProductAmount(e.target.value);
    setErrProductAmount("");
  };

  const handleProductCurrentAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setProductCurrentAmount(e.target.value);
    setErrProductCurrentAmount("");
  };

  const handleProductState = (e: ChangeEvent<HTMLSelectElement>) => {
    setProductState(e.target.value);
    setErrProductState("");
  };

  const handleProductImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
    setErrProductImage("");
  };

  const handleCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setErrCategory("");
  };

  const handleProductDiscount = (e: ChangeEvent<HTMLInputElement>) => {
    setProductDiscount(e.target.value);
    setErrProductDiscount("");
  };

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();

    if (!productName) {
      setErrProductName("Enter product name");
      return;
    }

    if (!productPrice) {
      setErrProductPrice("Enter product price");
      return;
    }

    if (!productAmount) {
      setErrProductAmount("Enter product amount");
      return;
    }

    if (!productCurrentAmount) {
      setErrProductCurrentAmount("Enter current product amount");
      return;
    }

    if (parseInt(productCurrentAmount) > parseInt(productAmount)) {
      setErrProductCurrentAmount("Product current amount should be less than the total amount");
      return;
    }

    if (!productState) {
      setErrProductState("Select product state");
      return;
    }

    if (!category) {
      setErrCategory("Select category");
      return;
    }

    if (!productImage) {
      setErrProductImage("Enter product image");
      return;
    }

    if (!productDiscount) {
      setErrProductDiscount("Enter product discount");
      return;
    }

    const formData = new FormData();
    formData.append('Product', productName);
    formData.append('Product_price', productPrice);
    formData.append('Product_state', productState === "Active" ? 'true' : 'false');
    formData.append('Category', category);
    formData.append('Product_amount', productAmount);
    formData.append('Product_current_amount', productCurrentAmount);
    formData.append('Product_Discount', productDiscount);

    if (productImage) {
      formData.append('Product_image', productImage);
    }

    try {
      const response = await fetch(`${apiUrl}/createProduct`, { 
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (responseData.message === "productExists") {
        setErrProductName("Product already exists.");
      } else if (responseData.message === "Product created successfully") {
        toast.success("Product Created Successfully!");
        setTimeout(() => {
          navigate('/dashboard/product');
        }, 2000);
      } else {
        console.error("Error creating product:", responseData);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Create Product</h3>
        <form className="row g-1" onSubmit={handleAddProduct}>
          <div className="col-12">
            <label htmlFor="inputProductName" className="form-label">
              Product Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputProductName"
              placeholder="Enter Product Name"
              value={productName}
              onChange={handleProductName}
            />
            {errProductName && <div className="text-danger">{errProductName}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputProductPrice" className="form-label">
              Product Price
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputProductPrice"
              placeholder="Enter Product Price"
              value={productPrice}
              onChange={handleProductPrice}
              min="0"
            />
            {errProductPrice && <div className="text-danger">{errProductPrice}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputProductDiscount" className="form-label">
              Product Discount
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputProductDiscount"
              placeholder="Enter Product Discount"
              value={productDiscount}
              onChange={handleProductDiscount}
              min="0"
            />
            {errProductDiscount && <div className="text-danger">{errProductDiscount}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputProductAmount" className="form-label">
              Product Amount
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputProductAmount"
              placeholder="Enter Product Amount"
              value={productAmount}
              onChange={handleProductAmount}
              min="0"
            />
            {errProductAmount && <div className="text-danger">{errProductAmount}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputProductCurrentAmount" className="form-label">
              Current Product Amount
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputProductCurrentAmount"
              placeholder="Enter Current Product Amount"
              value={productCurrentAmount}
              onChange={handleProductCurrentAmount}
              min="0"
            />
            {errProductCurrentAmount && <div className="text-danger">{errProductCurrentAmount}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputProductState" className="form-label">
              Product State
            </label>
            <select
              className="form-control rounded-0"
              id="inputProductState"
              value={productState}
              onChange={handleProductState}
            >
              <option value="">Select State</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errProductState && <div className="text-danger">{errProductState}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputCategory" className="form-label">
              Category
            </label>
            <select
              className="form-control rounded-0"
              id="inputCategory"
              value={category}
              onChange={handleCategory}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.Category}
                </option>
              ))}
            </select>
            {errCategory && <div className="text-danger">{errCategory}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputProductImage" className="form-label">
              Product Image
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputProductImage"
              onChange={handleProductImage}
            />
            {errProductImage && <div className="text-danger">{errProductImage}</div>}
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary rounded-0">
              Add Product
            </button>
          </div>
        </form>
      </div>
      <Toast />
    </div>
  );
};

export default AddProduct;
