import React, { useState, useEffect } from "react";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategory } from "../../../../redux/orebiSlice";

const apiUrl = process.env.REACT_APP_API_URL; 

const Category = () => {
  const [showCategories, setShowCategories] = useState(true);
  const [categories, setCategories] = useState([]);

  const checkedCategorys = useSelector(
    (state) => state.orebiReducer.checkedCategorys
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/getCategories`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Fetch the data
        
        // Filter the categories based on Category_state
        const activeCategories = data.filter(category => category.Category_state);
        
        // Update state with filtered categories
        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchCategories();
  }, []);
  

  const handleToggleCategory = (category) => {
    dispatch(toggleCategory(category));
  };

  return (
    <div className="w-full">
      <div onClick={() => setShowCategories(!showCategories)} className="cursor-pointer">
        <NavTitle title="Shop by Category" icons={true}  />
      </div>
      {showCategories && (
        <div>
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {categories.map((item) => (
              <li
                key={item.Category}
                className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
              >
                <input
                  type="checkbox"
                  id={item.Category}
                  checked={checkedCategorys.some((b) => b.Category === item.Category)}
                  onChange={() => handleToggleCategory(item)}
                />
                {item.Category}
                {item.icons && (
                  <span
                    onClick={() => setShowCategories(!showCategories)}
                    className="text-[10px] lg:text-xs cursor-pointer text-gray-400 hover:text-primeColor duration-300"
               >
                    <ImPlus />   
                  </span>
                )}
              </li>
            ))}
            <li onClick={() => console.log(checkedCategorys)}></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Category;

