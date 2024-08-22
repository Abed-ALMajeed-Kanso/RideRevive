import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Toast from './Toast';
import  type { Product }  from '../types/Product';
import  type { Category }  from '../types/Category';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const EditProduct: React.FC = () => {
  const [productId, setProductId] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>("");
  const [productState, setProductState] = useState<string>("");
  const [productImage, setProductImage] = useState<string>("");
  const [newProductImage, setNewProductImage] = useState<File | null>(null);
  const [productAmount, setProductAmount] = useState<string>("");
  const [productCurrentAmount, setProductCurrentAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [productDiscount, setProductDiscount] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [errProductName, setErrProductName] = useState<string>("");
  const [errProductPrice, setErrProductPrice] = useState<string>("");
  const [errProductState, setErrProductState] = useState<string>("");
  const [errProductImage] = useState<string>("");
  const [errProductAmount, setErrProductAmount] = useState<string>("");
  const [errProductCurrentAmount, setErrProductCurrentAmount] = useState<string>("");
  const [errCategory, setErrCategory] = useState<string>("");
  const [errProductDiscount, setErrProductDiscount] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const query = new URLSearchParams(window.location.search);
        const productId = query.get("id");
        if (!productId) {
          navigate(`/dashboard/product`);
          return;
        }
        const url = `${apiUrl}/getProductById/${productId}`;
        const response = await fetch(url);
        const product: Product = await response.json();

        if (product) {
          setProductId(product.Product_ID);
          setProductName(product.Product);
          setProductPrice(product.Product_price.toString());
          setProductState(product.Product_state ? "Active" : "Inactive");
          setProductAmount(product.Product_amount.toString());
          setProductCurrentAmount(product.Product_current_amount.toString());
          setCategory(product.Category);
          setProductImage(product.Product_image);
          setProductDiscount(product.Product_Discount.toString());
        } else {
          navigate(`/dashboard/product`);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        navigate(`/dashboard/product`);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/getCategories`); 
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categories: Category[] = await response.json();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProductData();
    fetchCategories();
  }, [navigate]);

  const handleProductName = (e: ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
    setErrProductName("");
  };

  const handleProductPrice = (e: ChangeEvent<HTMLInputElement>) => {
    setProductPrice(e.target.value);
    setErrProductPrice("");
  };

  const handleProductState = (e: ChangeEvent<HTMLSelectElement>) => {
    setProductState(e.target.value);
    setErrProductState("");
  };

  const handleProductImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProductImage(e.target.files[0]);
    }
  };

  const handleProductAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setProductAmount(e.target.value);
    setErrProductAmount("");
  };

  const handleProductCurrentAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setProductCurrentAmount(e.target.value);
    setErrProductCurrentAmount("");
  };

  const handleCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setErrCategory("");
  };

  const handleProductDiscount = (e: ChangeEvent<HTMLInputElement>) => {
    setProductDiscount(e.target.value);
    setErrProductDiscount("");
  };

  const handleManageProduct = async (e: FormEvent) => {
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

    if (Number(productCurrentAmount) > Number(productAmount)) {
      setErrProductCurrentAmount("Current product amount should be less than the total amount");
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

    if (!productDiscount) {
      setErrProductDiscount("Enter product discount");
      return;
    }

    const formData = new FormData();
    formData.append('Product_ID', productId);
    formData.append('Product', productName);
    formData.append('Product_price', productPrice);
    formData.append('Product_state', productState === "Active" ? "1" : "0");
    formData.append('Product_amount', productAmount);
    formData.append('Product_current_amount', productCurrentAmount);
    formData.append('Category', category);
    formData.append('Product_Discount', productDiscount);
    if (newProductImage) {
      formData.append('Product_image', newProductImage);
    }

    try {
      const response = await fetch(`${apiUrl}/updateProduct/${productId}`, {
        method: 'PATCH',
        body: formData,
      });

      const responseData = await response.json();

      if (responseData.message === "ProductExists") {
        setErrProductName("Product name exists. Please choose another name.");
      } else if (responseData.message === "Product updated successfully") {
        toast.success("Product Updated Successfully!");
        setTimeout(() => {
          navigate('/dashboard/product');
        }, 2000);
      } else {
        console.error("Error updating product:", responseData);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Product</h3>
        <form className="row g-1" onSubmit={handleManageProduct}>
          <div className="col-12">
            <label htmlFor="inputProductId" className="form-label">
              Product ID
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputProductId"
              value={productId}
              disabled
            />
          </div>
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
                <option key={cat._id} value={cat.Category}>{cat.Category}</option>
              ))}
            </select>
            {errCategory && <div className="text-danger">{errCategory}</div>}
          </div>
          
          <div className="col-12">
            <label htmlFor="inputProductImage" className="form-label">
              Product Image
            </label>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {productImage && (
                <img
                  src={`${apiUrl}/Products/${productImage}`} 
                  style={{ width: '75px', height: '75px', marginRight: '20px', marginBottom: '20px' }}
                  alt="Product"
                />
              )}
              {newProductImage && (
                <img
                  src={URL.createObjectURL(newProductImage)}
                  alt="New Product"
                  style={{ width: '75px', height: '75px' }}
                />
              )}
            </div>
            <input
              type="file"
              className="form-control"
              id="inputProductImage"
              onChange={handleProductImage}
            />
            {errProductImage && <div className="text-danger">{errProductImage}</div>}
          </div>
          <div>
            <br />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Update Product
            </button>
          </div>
          <Toast />
        </form>
      </div>
    </div>
  );
};

export default EditProduct;

