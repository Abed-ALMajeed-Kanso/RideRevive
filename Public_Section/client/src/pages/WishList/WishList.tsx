import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from 'axios';
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { emptyCart } from "../../assets/images/index";
import ItemWishList from "./ItemWishList";
import { toast } from "react-toastify";
import { Favorite } from '../../types/Favorite';

const apiUrl = process.env.REACT_APP_API_URL;

const WishList: React.FC = () => {
  const dispatch = useDispatch();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const CustomerID = useSelector((state: any) => state.orebiReducer.isAuthenticated);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get<Favorite[]>(`${apiUrl}/favorites/${CustomerID}`);
      const favoriteItems = response.data;

      // Fetch details for each favorite product
      const promises = favoriteItems.map(async (favorite) => {
        try {
          const productResponse = await axios.get(`${apiUrl}/getProductByID/${favorite.Product_ID}`);
          const productDetails = productResponse.data;
          return { ...favorite, ...productDetails };
        } catch (error) {
          console.error(`Error fetching product details for ${favorite.Product_ID}:`, error);
          return { ...favorite }; // Return favorite item with missing details
        }
      });

      // Resolve all promises
      const resolvedFavorites = await Promise.all(promises);
      setFavorites(resolvedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    if (CustomerID) {
      fetchFavorites();
    }
  }, [CustomerID]);

  const handleProductDelete = (productId: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((favorite) => favorite.Product_ID !== productId)
    );
  };

  const handleDeleteAllFavorites = async () => {
    try {
      const response = await axios.get(`${apiUrl}/DeleteAllFavorites`, {
        params: { Customer_ID: CustomerID },
      });
      if (response.status === 200) {
        setFavorites([]);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting all favorites:', error);
      toast.error("Error deleting all favorites");
    }
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Wish List" prevLocation={null}/>
      {favorites.length > 0 ? (
        <div className="pb-20">
          <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-2">Product</h2>
            <h2>Category</h2>
            <h2>Price</h2>
            <h2>You can Afford</h2>
          </div>
          <div className="mt-5">
            {favorites.map((item) => (
              <div key={item.Product_ID}>
                <ItemWishList item={item} onProductDelete={handleProductDelete} />
              </div>
            ))}
          </div>

          <button
            onClick={handleDeleteAllFavorites}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
          >
            Reset Favorites
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={emptyCart}
              alt="emptyCart"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Your Wish List is empty.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Save your favorite products to view them later.
            </p>
            <Link to="/shop">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WishList;
