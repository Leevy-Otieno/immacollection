import React, { useEffect, useState } from "react";
import image1 from "../assest/banner/image1.jpeg";
import image2 from "../assest/banner/image2.jpeg";
import image3 from "../assest/banner/image3.jpeg";
import image4 from "../assest/banner/image4.jpeg";
import image5 from "../assest/banner/image5.jpeg";
import image6 from "../assest/banner/image6.jpeg";
import image7 from "../assest/banner/image7.jpeg";
import image9 from "../assest/banner/image9.jpeg";
import image10 from "../assest/banner/imag10.jpeg";
import image8 from "../assest/banner/imag8.jpeg";

import image11 from "../assest/banner/image11.jpeg";
import image12 from "../assest/banner/image12.jpeg";
import image13 from "../assest/banner/image13.jpeg";
import image14 from "../assest/banner/image14.jpeg";
import image15 from "../assest/banner/image15.jpeg";
import image16 from "../assest/banner/image16.jpeg";
import image17 from "../assest/banner/image17.jpeg";
import image18 from "../assest/banner/image18.jpeg";
import image19 from "../assest/banner/image19.jpeg";


import image1Mobile from "../assest/banner/image1_mobile.jpeg";
import image2Mobile from "../assest/banner/image2_mobile.jpeg";
import image3Mobile from "../assest/banner/image3_mobile.jpeg";
import image4Mobile from "../assest/banner/image4_mobile.jpeg";
import image5Mobile from "../assest/banner/image5_mobile.jpeg";
import image6Mobile from "../assest/banner/image6_mobile.jpeg";
import image7mobile from "../assest/banner/image7_mobile.jpeg";
import image8mobile from "../assest/banner/image8_mobile.jpeg";
import image9mobile from "../assest/banner/image9_mobile.jpeg";
import image10mobile from "../assest/banner/image10_mobile.jpeg";
import image11mobile from "../assest/banner/image11_mobile.jpeg";
import image12mobile from "../assest/banner/image12_mobile.jpeg";
import image13mobile from "../assest/banner/image13_mobile.jpeg";
import image14mobile from "../assest/banner/image14_mobile.jpeg";
import image15mobile from "../assest/banner/image15_mobile.jpeg";
import image16mobile from "../assest/banner/image16_mobile.jpeg";
import image17mobile from "../assest/banner/image17_mobile.jpeg";
import image18mobile from "../assest/banner/image18_mobile.jpeg";
import image19mobile from "../assest/banner/image19_mobile.jpeg";


import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const desktopImages = [image1, image2, image3, image4, image5, image6, image7,  image9,image8,image10,  image11, image12, image13, image14, image15, image16, image17, image18, image19];

  const mobileImages = [
    image1Mobile,
    image2Mobile,
    image3Mobile,
    image4Mobile,
    image5Mobile,
    image6Mobile,
    image7mobile,
    image8mobile,
    image9mobile,
    image10mobile,
    image11mobile,
    image12mobile,
    image13mobile,
    image14mobile,
    image15mobile,
    image16mobile,
    image17mobile,
    image18mobile,
    image19mobile
  ];

  const nextImage = () => {
    if (desktopImages.length - 1 > currentImage) {
      setCurrentImage((preve) => preve + 1);
    }
  };

  const preveImage = () => {
    if (currentImage != 0) {
      setCurrentImage((preve) => preve - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (desktopImages.length - 1 > currentImage) {
        nextImage();
      } else {
        setCurrentImage(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImage]);

  return (
    <div className="container mx-auto px-4 rounded ">
      <div className="h-56 md:h-72 w-full bg-slate-200 relative">
        <div className="absolute z-10 h-full w-full md:flex items-center hidden ">
          <div className=" flex justify-between w-full text-2xl">
            <button
              onClick={preveImage}
              className="bg-white shadow-md rounded-full p-1"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={nextImage}
              className="bg-white shadow-md rounded-full p-1"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/**desktop and tablet version */}
        <div className="hidden md:flex h-full w-full overflow-hidden">
          {desktopImages.map((imageURl, index) => {
            return (
              <div
                className="w-full h-full min-w-full min-h-full transition-all"
                key={imageURl}
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
              >
                <img src={imageURl} className="w-full h-full" />
              </div>
            );
          })}
        </div>

        {/**mobile version */}
        <div className="flex h-full w-full overflow-hidden md:hidden">
          {mobileImages.map((imageURl, index) => {
            return (
              <div
                className="w-full h-full min-w-full min-h-full transition-all"
                key={imageURl}
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
              >
                <img src={imageURl} className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;
