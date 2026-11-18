import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const UploadProduct = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productCode: "", // For shoe numbers / unique product codes / SKUs
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
    sizesStock: { XS: 0, S: 0, M: 0, L: 0, XL: 0 }, // Size-specific stock counts mapped to schema
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    
    setData((prev) => {
      let updatedSizes = prev.sizesStock;

      // Automatically switch size grid keys when category changes to footwear/sandals/heels
      if (name === "category") {
        const catLower = value.toLowerCase();
        const isFootwear = 
          catLower.includes("shoe") || 
          catLower.includes("sandal") || 
          catLower.includes("heal") || 
          catLower.includes("heel") || 
          catLower.includes("footwear") ||
          catLower.includes("sneaker") ||
          catLower.includes("boot");

        if (isFootwear) {
          updatedSizes = { "EU 38": 0, "EU 39": 0, "EU 40": 0, "EU 41": 0, "EU 42": 0, "EU 43": 0, "EU 44": 0, "EU 45": 0 };
        } else {
          updatedSizes = { XS: 0, S: 0, M: 0, L: 0, XL: 0 };
        }
      }

      return {
        ...prev,
        [name]: value,
        sizesStock: updatedSizes
      };
    });
  };

  // Handle stock changes per size dynamically
  const handleSizeChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      sizesStock: {
        ...prev.sizesStock,
        [name]: Number(value) || 0,
      },
    }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadImageCloudinary = await uploadImage(file);

    setData((prev) => {
      return {
        ...prev,
        productImage: [...prev.productImage, uploadImageCloudinary.url],
      };
    });
  };

  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);

    setData((prev) => {
      return {
        ...prev,
        productImage: [...newProductImage],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(SummaryApi.uploadProduct.url, {
        method: SummaryApi.uploadProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(responseData?.message);
        onClose();
        fetchData();
      }

      if (responseData.error) {
        toast.error(responseData?.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to connect to the server.");
    }
  };

  // Check if category is footwear (shoes, sandals, heels, etc.)
  const categoryLower = data.category.toLowerCase();
  const isFootwearCategory = 
    categoryLower.includes("shoe") || 
    categoryLower.includes("sandal") || 
    categoryLower.includes("heal") || 
    categoryLower.includes("heel") || 
    categoryLower.includes("footwear") ||
    categoryLower.includes("sneaker") ||
    categoryLower.includes("boot");

  const activeSizesList = isFootwearCategory 
    ? ["EU 38", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"]
    : ["XS", "S", "M", "L", "XL"];

  return (
    <div className="fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[85%] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b">
          <h2 className="font-bold text-lg">Upload Product</h2>
          <div
            className="w-fit ml-auto text-2xl hover:text-amber-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        <form
          className="grid p-4 gap-2 overflow-y-scroll h-full pb-5"
          onSubmit={handleSubmit}
        >
          <label htmlFor="productName">Product Name :</label>
          <input
            type="text"
            id="productName"
            placeholder="enter product name"
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="brandName" className="mt-3">
            Brand Name :
          </label>
          <input
            type="text"
            id="brandName"
            placeholder="enter brand name"
            value={data.brandName}
            name="brandName"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="productCode" className="mt-3">
            Shoe / Product Number / SKU :
          </label>
          <input
            type="text"
            id="productCode"
            placeholder="enter shoe number or product code (e.g. SH001)"
            value={data.productCode}
            name="productCode"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="category" className="mt-3">
            Category :
          </label>
          <select
            required
            value={data.category}
            name="category"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          >
            <option value={""}>Select Category</option>
            {productCategory.map((el, index) => {
              return (
                <option value={el.value} key={el.value + index}>
                  {el.label}
                </option>
              );
            })}
          </select>

          <label htmlFor="productImage" className="mt-3">
            Product Image :
          </label>
          <label htmlFor="uploadImageInput">
            <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
              <div className="text-slate-500 flex justify-center items-center flex-col gap-2">
                <span className="text-4xl">
                  <FaCloudUploadAlt />
                </span>
                <p className="text-sm">Upload Product Image</p>
                <input
                  type="file"
                  id="uploadImageInput"
                  className="hidden"
                  onChange={handleUploadProduct}
                />
              </div>
            </div>
          </label>

          <div className="flex flex-wrap gap-2 my-2">
            {data?.productImage[0] ? (
              data.productImage.map((el, index) => {
                return (
                  <div
                    className="relative group"
                    key={el ? `${el}-${index}` : `upload-img-${index}`}
                  >
                    <img
                      src={el}
                      alt="product"
                      width={80}
                      height={80}
                      className="bg-slate-100 border cursor-pointer object-cover w-20 h-20 rounded"
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(el);
                      }}
                    />
                    <div
                      className="absolute bottom-0 right-0 p-1 text-white bg-amber-600 rounded-full hidden group-hover:block cursor-pointer"
                      onClick={() => handleDeleteProductImage(index)}
                    >
                      <MdDelete />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-amber-800 text-xs">
                *Please upload product image
              </p>
            )}
          </div>

          {/* Dynamic Size & Stock Inventory Quantities */}
          <label className="mt-3 font-medium text-slate-700">
            {isFootwearCategory ? "Footwear Size Stock (EU Numbers):" : "Clothing Size Stock:"}
          </label>
          <div className={`grid ${isFootwearCategory ? "grid-cols-4" : "grid-cols-5"} gap-2 bg-slate-50 p-3 border rounded`}>
            {activeSizesList.map((size) => {
              const stockValue = data.sizesStock instanceof Map 
                ? data.sizesStock.get(size) 
                : data.sizesStock?.[size];

              return (
                <div key={size} className="flex flex-col">
                  <label
                    htmlFor={size}
                    className="text-[11px] text-slate-600 font-semibold mb-1 text-center truncate"
                  >
                    {size}
                  </label>
                  <input
                    type="number"
                    id={size}
                    name={size}
                    min="0"
                    value={stockValue !== undefined ? stockValue : 0}
                    onChange={handleSizeChange}
                    className="p-1.5 bg-white border rounded text-center text-sm"
                  />
                </div>
              );
            })}
          </div>

          <label htmlFor="price" className="mt-3">
            Price :
          </label>
          <input
            type="number"
            id="price"
            placeholder="enter price"
            value={data.price}
            name="price"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="sellingPrice" className="mt-3">
            Selling Price :
          </label>
          <input
            type="number"
            id="sellingPrice"
            placeholder="enter selling price"
            value={data.sellingPrice}
            name="sellingPrice"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="description" className="mt-3">
            Description :
          </label>
          <textarea
            className="h-28 bg-slate-100 border resize-none p-2 rounded"
            placeholder="enter product description"
            rows={3}
            onChange={handleOnChange}
            name="description"
            value={data.description}
          ></textarea>

          <button className="px-3 py-2 bg-amber-600 text-white mt-4 mb-10 hover:bg-amber-700 rounded font-semibold">
            Upload Product
          </button>
        </form>
      </div>

      {/*** Display image full screen modal */}
      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  );
};

export default UploadProduct;