import React from "react";
import Img1 from "../../assets/products/image1.png";
import Img2 from "../../assets/products/image2.png";
import Img3 from "../../assets/products/image3.png";
import Img4 from "../../assets/products/image4.png";
import Img5 from "../../assets/products/image5.png";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Stethoscope",
    rating: 5.0,
    color: "black/ 15$",
    aosDelay: "0",
  },
  {
    id: 2,
    img: Img2,
    title: "Oxygen mask",
    rating: 4.5,
    color: "Green/ 20$",
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    title: "walker",
    rating: 4.1,
    color: "blue/ 28$",
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img4,
    title: "Medical supplies cart",
    rating: 4,
    color: "white/ 18$",
    aosDelay: "600",
  },
  {
    id: 5,
    img: Img5,
    title: "Bed care",
    rating: 4.7,
    color: "white/ 47$",
    aosDelay: "800",
  },
];

const Products = () => {
  return (
    <div className="mt-14 mb-12">
      <div className="">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-lg text-primary">
            Top Selling Products for you
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Products
          </h1>
          <p data-aos="fade-up" className="text-sm text-gray-600">
            Our complete range of reliable medical supplies, equipment, and
            healthcare necessities - fast shipping to all regions
          </p>
        </div>
        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
            {/* card section */}
            {ProductsData.map((data) => (
              <div
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                key={data.id}
                className="space-y-3"
              >
                <img
                  src={data.img}
                  alt=""
                  className="h-[220px] w-[150px] object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{data.title}</h3>
                  <p className="text-sm text-gray-600">{data.color}</p>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>{data.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* view all button */}
          <div className="flex justify-center">
            <button className="text-center mt-10 cursor-pointer bg-primary text-white py-1 px-5 rounded-md">
              Show more
            </button>
            <Link
              to="/.."
              className=" font-bold text-2xl sm:text-3xl flex gap-2"
            >
              Back to main page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
