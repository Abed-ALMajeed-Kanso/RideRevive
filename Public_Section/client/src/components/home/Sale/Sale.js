import React from "react";
import { Link } from "react-router-dom";
import {
  saleImgThree,
} from "../../../assets/images/index";
import Image from "../../designLayouts/Image";
import ShopNow from "../../designLayouts/buttons/ShopNow";

const apiUrl = process.env.REACT_APP_API_URL; 

const Sale = () => {
  return (
    <div className="py-20 flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
      {/* Left Section */}
      <div className="bg-[#f3f3f3] w-full md:w-2/3 lg:w-1/2 h-auto flex flex-col justify-center items-center text-black p-6">
        <div className="w-full mb-6">
          <Image className="h-full w-full object-cover" imgSrc={`${apiUrl}/Categories/Tool_Kit.png`} />
        </div>
        <div className="text-left w-full px-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Imprimante Sales
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl mb-6">
            Up to{" "}
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold">
              30%
            </span>{" "}
            sales for all impriamnte
          </p>
          <ShopNow />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col gap-8 lg:gap-12">
        <div className="h-1/2 w-full">
          <Link to="/shop">
            <Image className="h-full w-full object-cover" imgSrc={saleImgThree} />
          </Link>
        </div>
        <div className="bg-[#f3f3f3] w-full h-full flex flex-col justify-center items-center text-black p-6">
          <Link to="/shop" className="w-full">
            <Image
              className="object-cover mx-auto"
              style={{ width: '80%', height: '50%' }}
              imgSrc={`${apiUrl}/Categories/Engine_Oil.png`}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sale;
