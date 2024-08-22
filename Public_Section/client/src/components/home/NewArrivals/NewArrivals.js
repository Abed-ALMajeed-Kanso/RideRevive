import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

const apiUrl = process.env.REACT_APP_API_URL;

const NewArrivals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/getProducts`);
        const products = response.data;

        const filteredProducts = products.filter(product => {
          const productDate = new Date(product.Product_Date);
          const filterDate = new Date("2024-05-31T23:59:59.999Z");
          return product.Product_state && productDate > filterDate;
        });

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

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
      <Heading heading="New Arrivals" />
      <Slider {...settings}>
        {products.map((product) => (
          <div className="px-2" key={product.Product_ID}>
            <Product
              _id={product.Product_ID}
              img={`${apiUrl}/Products/${product.Product_image}`}
              productName={product.Product}
              price={product.Product_price.toFixed(2)}
              discount={product.Product_Discount}
              category={product.Category}
              amount = {product.Product_current_amount}
              date = {product.Product_Date}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewArrivals;



