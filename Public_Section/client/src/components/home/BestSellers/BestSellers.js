import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import Heading from "../Products/Heading";
import SampleNextArrow from "../NewArrivals/SampleNextArrow";
import SamplePrevArrow from "../NewArrivals/SamplePrevArrow";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategory } from "../../../redux/orebiSlice";

const apiUrl = process.env.REACT_APP_API_URL;

const BestSellers = () => {
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkedCategorys = useSelector(
    (state) => state.orebiReducer.checkedCategorys
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/getCategories`);
        const activeCategories = response.data.filter(
          (category) => category.Category_state
        );
        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    dispatch(toggleCategory(category));
    navigate(`/shop?category=${category.Category}`);
  };

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  return (
    <div className="w-full pb-16">
      <Heading heading="Our Categories" />
      <Slider {...settings}>
        {categories.map((category) => (
          <div key={category._id} className="px-2">
            <div
              className="p-5 bg-white rounded-lg shadow-md cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <img
                src={`${apiUrl}/Categories/${category.Category_image}`}
                alt={category.Category}
                className="w-full h-40 object-cover mb-4 rounded-lg"
              />
              <h3 className="text-lg font-semibold mb-2">{category.Category}</h3>
              <p className="text-sm text-gray-500">
                {category.Category_description || "No description available."}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BestSellers;
