import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import { BsSuitHeartFill } from "react-icons/bs";
import Flex from "../../designLayouts/Flex";
import { useDispatch, useSelector } from "react-redux";
import { signOut, toggleCategory } from '../../../redux/orebiSlice';
import { toast } from "react-toastify";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL; 

const NavigationLinks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.orebiReducer.isAuthenticated !== -1);
  const CustomerID = useSelector((state) => state.orebiReducer.isAuthenticated);
  
  const handleLogout = () => {
    dispatch(signOut());
    navigate("/");
  };

  return (
    <>
      {!isAuthenticated && (
        <>
          <Link to="/signin">
            <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
              Login
            </li>
          </Link>
          <Link to="/signup">
            <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
              Sign Up
            </li>
          </Link>
        </>
      )}
      {isAuthenticated && (
        <>
          <Link to="/ManageAccount">
            <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
              Profile
            </li>
          </Link>
          <Link to="/ViewOrders">
            <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
              Orders
            </li>
          </Link>
          <li
            className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer"
            onClick={handleLogout}
          >
            Log Out
          </li>
        </>
      )}
    </>
  );
};

const HeaderBottom = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const isAuthenticated = useSelector((state) => state.orebiReducer.isAuthenticated !== -1);
  const CustomerID = useSelector((state) => state.orebiReducer.isAuthenticated);
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();
  const ref = useRef();
  const dispatch = useDispatch();
  const location = useLocation();
  const shouldShowList = location.pathname.endsWith('shop');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.body.addEventListener("click", handleClickOutside);
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/getCategories`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Filter categories based on Category_state
        const activeCategories = data.filter(category => category.Category_state);
        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${apiUrl}/getProducts`);
        const items = response.data;

        // Filter products based on Product_state
        const activeProducts = items.filter(item => item.Product_state);
        setAllProducts(activeProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = allProducts.filter((item) =>
      item.Product.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, allProducts]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category) => {
    dispatch(toggleCategory(category));
    navigate(`/shop`);
    setShow(false); 
  };

  const handleAuthCheck = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      toast.error("Please Authenticate First");
    }
  };

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          <div
            onClick={() => setShow(!show)}
            ref={ref}
            className="flex h-14 cursor-pointer items-center gap-2 text-primeColor"
          >
            <HiOutlineMenuAlt4 className="w-5 h-5" />
            <p className="text-[14px] font-normal">Shop by Category</p>
            {show && !shouldShowList && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-36 z-50 bg-primeColor w-auto text-[#767676] h-auto p-4 pb-6"
              >
                {categories.map((category) => (
                  <li
                    key={category.Category}
                    className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.Category}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
          <div className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
            <input
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
              type="text"
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Search your products here"
            />
            <FaSearch className="w-5 h-5" />
            {searchQuery && (
              <div className="w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer">
                {searchQuery &&
                  filteredProducts.map((item) => (
                    <div
                      onClick={() =>
                        navigate(`/product/${item.Product.toLowerCase().split(" ").join("")}`, {
                          state: {
                            item: {
                              _id: item.Product_ID,
                              img: `${apiUrl}/Products/${item.Product_image}`,
                              productName: item.Product,
                              price: item.Product_price.toFixed(2),
                              discount: item.Product_Discount,
                              category: item.Category,
                              amount: item.Product_current_amount,
                            },
                          },
                        }) & setSearchQuery("")
                      }
                      key={item.Product_ID}
                      className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3"
                    >
                      <img
                        className="w-24 h-24 object-cover"
                        src={`${apiUrl}/Products/${item.Product_image}`}
                        alt="productImg"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-lg">{item.Product}</p>
                        <p className="text-sm">
                          Price:{" "}
                          <span className="text-primeColor font-semibold">
                            ${item.Product_price.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            <div onClick={() => setShowUser(!showUser)} className="flex">
              <FaUser />
              <FaCaretDown />
            </div>
            {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-0 z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
              >
                <NavigationLinks />
              </motion.ul>
            )}
            <div onClick={() => handleAuthCheck("/wishlist")}>
              <BsSuitHeartFill />
            </div>
            <div onClick={() => handleAuthCheck("/cart")}>
              <FaShoppingCart />
            </div>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;


