import React, { useEffect, useState } from "react";
import { BsGridFill } from "react-icons/bs";
import { ImList } from "react-icons/im";
import { GoTriangleDown } from "react-icons/go";

const ProductBanner = ({ itemsPerPageFromBanner, onSortChange }) => {
  const [gridViewActive, setGridViewActive] = useState(true);
  const [listViewActive, setListViewActive] = useState(false);

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;

    
    let sortBy;
    switch (selectedSort) {
      case "Best Sellers":
        sortBy = ""; 
        break;
      case "New Arrival":
        sortBy = ""; 
        break;
      case "Final Offer":
        sortBy = "Final Offer";
        break;
      default:
        sortBy = ""; 
        break;
    }

    onSortChange(sortBy); 
  };

  useEffect(() => {
    const gridView = document.querySelector(".gridView");
    const listView = document.querySelector(".listView");

    gridView.addEventListener("click", () => {
      setListViewActive(false);
      setGridViewActive(true);
    });
    listView.addEventListener("click", () => {
      setGridViewActive(false);
      setListViewActive(true);
    });

    return () => {
      gridView.removeEventListener("click", () => {});
      listView.removeEventListener("click", () => {});
    };
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
      <div className="flex items-center gap-4">
        <span
          className={`${
            gridViewActive
              ? "bg-primeColor text-white"
              : "border-[1px] border-gray-300 text-[#737373]"
          } w-8 h-8 text-lg flex items-center justify-center cursor-pointer gridView`}
        >
          <BsGridFill />
        </span>
        <span
          className={`${
            listViewActive
              ? "bg-primeColor text-white"
              : "border-[1px] border-gray-300 text-[#737373]"
          } w-8 h-8 text-base flex items-center justify-center cursor-pointer listView`}
        >
          <ImList />
        </span>
      </div>
      <div className="flex items-center gap-2 md:gap-6 mt-4 md:mt-0">
        <div className="flex items-center gap-2 text-base text-[#767676] relative">
          <label className="block">Sort by:</label>
          <select
            onChange={handleSortChange} // Trigger on change
            id="sortOptions"
            className="w-32 md:w-52 border-[1px] border-gray-200 py-1 px-4 cursor-pointer text-primeColor text-base block dark:placeholder-gray-400 appearance-none focus-within:outline-none focus-visible:border-primeColor"
          >
            <option value="Best Sellers">Best Sellers</option>
            <option value="New Arrival">New Arrival</option>
            <option value="Final Offer">Final Offer</option>
          </select>
          <span className="absolute text-sm right-2 md:right-4 top-2.5">
            <GoTriangleDown />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductBanner;

