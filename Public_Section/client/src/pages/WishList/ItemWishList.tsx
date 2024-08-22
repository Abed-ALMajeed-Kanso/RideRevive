import React, { useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/orebiSlice";
import { toast } from "react-toastify";
import { Favorite } from '../../types/Favorite';

const apiUrl = process.env.REACT_APP_API_URL;

interface ItemWishListProps {
  item: Favorite;
  onProductDelete: (productId: number) => void;
}

const ItemWishList: React.FC<ItemWishListProps> = ({ item, onProductDelete }) => {
  const dispatch = useDispatch();
  const [productDetails, setProductDetails] = useState<any>(null); // Using `any` here for simplicity
  const CustomerID = useSelector((state: any) => state.orebiReducer.isAuthenticated);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`${apiUrl}/getProductByID/${item.Product_ID}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched product details:', data);
      setProductDetails(data);
    } catch (error) {
      console.error(`Error fetching product details for ${item.Product_ID}:`, error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [item.Product_ID]);

  const handleDelete = async (itemId: number) => {
    try {
      const response = await fetch(`${apiUrl}/Deletefavorites?Customer_ID=${CustomerID}&Product_ID=${itemId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        onProductDelete(itemId);
      } else {
        console.error('Error deleting favorite:', data.message);
      }
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  };

  return (
    <div className="w-full grid grid-cols-5 mb-4 border py-2">
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-4 ml-4">
        <ImCross
          onClick={() => handleDelete(item.Product_ID)}
          className="text-primeColor hover:text-red-500 duration-300 cursor-pointer"
        />
        {productDetails ? (
          <>
            <img className="w-32 h-32" src={`${apiUrl}/Products/${productDetails.Product_image}`} alt="productImage" />
            <h1 className="font-titleFont font-semibold">{productDetails.Product}</h1>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        <div className="flex items-center text-lg font-semibold">
          <p>{productDetails?.Category}</p>
        </div>

        <div className="w-1/5 flex items-center font-titleFont font-bold text-lg">
          <p>${productDetails ? (productDetails.Product_price * (1 - productDetails.Product_Discount / 100)).toFixed(2) : ''}</p>
        </div>

        <div
          onClick={() =>
            productDetails && dispatch(
              addToCart({
                _id: productDetails.Product_ID,
                name: productDetails.Product,
                quantity: 1,
                image: `${apiUrl}/Products/${productDetails.Product_image}`,
                price: productDetails.Product_price,
                discount: productDetails.Product_Discount,
                amount: productDetails.Product_current_amount,
              })
            )
          }
          className="w-1/3 flex items-center font-titleFont font-bold text-lg cursor-pointer hover:text-gray-500 duration-300"
        >
          Add To Cart
        </div>
      </div>
    </div>
  );
};

export default ItemWishList;



