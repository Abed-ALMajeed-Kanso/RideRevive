import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";
import { useSelector } from "react-redux";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

function Items({ currentItems }) {
  return (
    <>
      {currentItems.map((product) => (
        <div key={product.Product_ID} className="w-full">
          <Product
            _id={product.Product_ID}
            img={`${apiUrl}/Products/${product.Product_image}`}
            productName={product.Product}
            price={product.Product_price.toFixed(2)}
            discount={product.Product_Discount}
            category={product.Category}
            amount={product.Product_current_amount}
            date = {product.Product_Date}
          />
        </div>
      ))}
    </>
  );
}

const Pagination = ({ itemsPerPage }) => {
  const [itemOffset, setItemOffset] = useState(0);
  const [itemStart, setItemStart] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]); 
  const [pageCount, setPageCount] = useState(0);

  const selectedCategories = useSelector(
    (state) => state.orebiReducer.checkedCategorys
  );
  const selectedPriceRanges = useSelector(
    (state) => state.orebiReducer.checkedPriceRanges
  );

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${apiUrl}/getProducts`);
        const items = response.data.filter(response => response.Product_state);

        // Apply filters
        const filtered = items.filter((item) => {
          const isCategorySelected =
            selectedCategories.length === 0 ||
            selectedCategories.some((category) => category.Category === item.Category);

          const isPriceRangeSelected =
            selectedPriceRanges.length === 0 ||
            selectedPriceRanges.some(
              (range) =>
                item.Product_price >= range.priceOne &&
                item.Product_price <= range.priceTwo
            );

          return isCategorySelected && isPriceRangeSelected;
        });

        // Set filtered items and update page count
        setFilteredItems(filtered);
        setPageCount(Math.ceil(filtered.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchItems();
  }, [itemsPerPage, selectedCategories, selectedPriceRanges]);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredItems.slice(itemOffset, endOffset);

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage;
    const newStart = newOffset + 1; // Adjust the start index

    setItemOffset(newOffset);
    setItemStart(newStart);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
        <Items currentItems={currentItems} />
      </div>
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold font-titleFont py-10"
          activeClassName="bg-black text-white"
        />

        <p className="text-base font-normal text-lightText">
          Products from {itemStart} to {Math.min(endOffset, filteredItems.length)} of{" "}
          {filteredItems.length}
        </p>
      </div>
    </div>
  );
};

export default Pagination;
