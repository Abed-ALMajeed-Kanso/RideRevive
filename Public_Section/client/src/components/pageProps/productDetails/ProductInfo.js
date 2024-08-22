import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToCart } from "../../../redux/orebiSlice";
import { toast } from "react-toastify";

const apiUrl = process.env.REACT_APP_API_URL;

const ProductInfo = ({ productInfo }) => {
  const filterDate = new Date("2024-05-31T23:59:59.999Z");
  const isNew = new Date(productInfo.date) >= filterDate;
  const highlightStyle = {
    color: "#d0121a",
    fontWeight: "bold",
  };

  const isAuthenticated = useSelector((state) => state.orebiReducer.isAuthenticated !== -1);
  const CustomerID = useSelector((state) => state.orebiReducer.isAuthenticated);
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      checkFavorite();
    }
  }, [isAuthenticated]);

  const checkFavorite = async () => {
    try {
      const response = await axios.post(`${apiUrl}/checkFavorite`, { Customer_ID: CustomerID, Product_ID: productInfo.id });
      setIsFavorite(response.data.exists);
    } catch (error) {
      console.error('Error checking favorite status', error);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please Authenticate First");
      return;
    }

    dispatch(
      addToCart({
        _id: productInfo.id,
        name: productInfo.productName,
        quantity: 1,
        image: productInfo.img,
        discount: productInfo.discount,
        price: productInfo.price,
        amount: productInfo.amount,
      })
    );
    toast.success("Product added to cart.");
  };

  const handleAddFavorite = async () => {
    try {
      if(!isAuthenticated){
        toast.error("Please Authenticate First");
        return;
      }
      await axios.post(`${apiUrl}/Addfavorite`, { Customer_ID: CustomerID, Product_ID: productInfo._id });
      setIsFavorite(true);
      toast.success("Product added to WhishList");
    } catch (error) {
      toast.error("" + productInfo._id);
    }
  };

  const handleRemoveFavorite = async () => {
    try {
      await axios.get(`${apiUrl}/Deletefavorites`, { params: { Customer_ID: CustomerID, Product_ID: productInfo._id } });
      setIsFavorite(false);
      toast.success("Product removed from WishList");
    } catch (error) {
      toast.error("Error removing from favorites");
    }
  };

  const renderDescription = () => {
    if (!productInfo.des) {
      return null;
    }

    const description = productInfo.des.split(/:(.*?)-/).map((part, index) => {
      return (
        <span key={index} style={index % 2 === 1 ? highlightStyle : {}}>
          {part}
        </span>
      );
    });

    return <>{description}</>;
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.productName}</h2>
      <p className="text-2xl font-semibold">
        {productInfo.discount > 0 ? (
          <>
            {productInfo.price * (1 - productInfo.discount / 100)}
            <span className="text-xl font-semibold line-through ml-2">{productInfo.price}</span>
            <span className="text-xs ml-2 inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white">
              Discount {productInfo.discount + "%"}
            </span>
          </>
        ) : (
          productInfo.price
        )}
      </p>
      <hr />
      <p className="text-base text-gray-600">{renderDescription()}</p>

      <p className="font-normal text-sm">
        {isFavorite ? (
          <button onClick={handleRemoveFavorite} className="w-full py-4 bg-red-500 hover:bg-red-600 duration-300 text-white text-lg font-titleFont">
            Remove From WishList
          </button>
        ) : (
          <button onClick={handleAddFavorite} className="w-full py-4 bg-green-500 hover:bg-green-600 duration-300 text-white text-lg font-titleFont">
            Add to WishList
          </button>
        )}
      </p>

      <button
        onClick={handleAddToCart}
        className="w-full py-4 bg-blue-500 hover:bg-blue-600 duration-300 text-white text-lg font-titleFont"
      >
        Add to Cart
      </button>

      <hr />

      <p className="font-medium text-lg">
        <span className="font-normal">Category:</span> {productInfo.category}
      </p>
      <p className="font-normal text-sm">
        {isNew ? (
          <span className="text-base font-medium">Discover one of the newest additions to our collection</span>
        ) : (
          <span className="text-base font-medium">Discover our exclusive collection of premium products</span>
        )}
      </p>
    </div>
  );
};

export default ProductInfo;


