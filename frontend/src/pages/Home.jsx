import React from "react";
import CategoryList from "../components/CategoryList";
import BannerProduct from "../components/BannerProduct";
import HorizontalCardProduct from "../components/HorizontalCardProduct";
import VerticalCardProduct from "../components/VerticalCardProduct";

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />

      {/* Horizontal Slider Rows */}
      <HorizontalCardProduct
        category={"Mens Clothes"}
        heading={"Mens Clothes"}
      />
      <HorizontalCardProduct
        category={"watches"}
        heading={"Women's Clothes"}
      />

      {/* Vertical Card Grid Rows */}
      <VerticalCardProduct
        category={"Unisex Clothes"}
        heading={"Unisex Clothes"}
      />
      <VerticalCardProduct
        category={"Shoes & Sneakers"}
        heading={"Shoes & Sneakers"}
      />
      <VerticalCardProduct
        category={"Heels & Sandals"}
        heading={"Heels & Sandals"}
      />
      <VerticalCardProduct
        category={"Handbags & Totes"}
        heading={"Handbags & Totes"}
      />
      <VerticalCardProduct
        category={"Backpacks & Shoulder Bags"}
        heading={"Backpacks & Shoulder Bags"}
      />
      <VerticalCardProduct
        category={"for him valentines gift"}
        heading={"For Him Collection"}
      />
      <VerticalCardProduct
        category={"For Her Collection"}
        heading={"For Her Collection"}
      />
      <VerticalCardProduct 
        category={"Complete Outfits"} 
        heading={"Complete Outfits"} 
      />
      <VerticalCardProduct
        category={"love notes & gift cards"}
        heading={"Children Clothes"}
      />
    </div>
  );
};

export default Home;
