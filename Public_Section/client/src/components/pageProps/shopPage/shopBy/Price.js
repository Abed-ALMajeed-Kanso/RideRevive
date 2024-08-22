import React, { useState } from "react";
import NavTitle from "./NavTitle";
import { useDispatch, useSelector } from "react-redux";
import { togglePriceRange } from "../../../../redux/orebiSlice";

const Price = () => {
  const [showPriceRanges, setShowPriceRanges] = useState(true);

  const priceList = [
    {
      _id: 950,
      priceOne: 0.0,
      priceTwo: 30.0,
    },
    {
      _id: 951,
      priceOne: 30.0,
      priceTwo: 60.0,
    },
    {
      _id: 952,
      priceOne: 60.0,
      priceTwo: 90.0,
    },
    {
      _id: 953,
      priceOne: 90.0,
      priceTwo: 120.0,
    },
  ];

  const checkedPriceRanges = useSelector(
    (state) => state.orebiReducer.checkedPriceRanges
  );
  const dispatch = useDispatch();

  const handleTogglePriceRange = (range) => {
    dispatch(togglePriceRange(range));
  };

  return (
    <div className="cursor-pointer">
      <div onClick={() => setShowPriceRanges(!showPriceRanges)} className="cursor-pointer">
        <NavTitle title="View Price Ranges" icons={true} />
      </div>
      {showPriceRanges && (
        <div className="font-titleFont">
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {priceList.map((item) => (
              <li
                key={item._id}
                className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
              >
                <input
                  type="checkbox"
                  id={item._id}
                  checked={checkedPriceRanges.some((r) => r._id === item._id)}
                  onChange={() => handleTogglePriceRange(item)}
                />
                ${item.priceOne.toFixed(2)} - ${item.priceTwo.toFixed(2)}
              </li>
            ))}
            <li onClick={() => console.log(checkedPriceRanges)}></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Price;

