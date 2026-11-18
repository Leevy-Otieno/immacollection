import React, { useEffect, useState } from "react";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import UploadProduct from "../components/UploadProduct";
import AdminEditProduct from "../components/AdminEditProduct";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        SummaryApi.allProduct.url || "http://localhost:8080/api/get-product",
        {
          method: "GET",
          credentials: "include",
        },
      );
      const dataResponse = await response.json();
      setAllProduct(dataResponse?.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await fetch("http://localhost:8080/api/delete-product", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ _id: productId }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchAllProduct();
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting product");
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  return (
    <div className="p-4">
      {/* Top Header Bar */}
      <div className="bg-white py-3 px-4 flex justify-between items-center rounded shadow-sm mb-4">
        <h2 className="font-bold text-lg text-slate-800">All Products</h2>
        <button
          className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-all py-1.5 px-4 rounded-full font-medium text-sm"
          onClick={() => setOpenUploadProduct(true)}
        >
          + Upload Product
        </button>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-10 text-slate-500">
          Loading products...
        </div>
      ) : allProduct.length === 0 ? (
        <div className="bg-white p-10 text-center rounded shadow-sm text-slate-500">
          No products found in inventory. Click "+ Upload Product" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[calc(100vh-190px)] overflow-y-auto pb-6">
          {allProduct.map((product, index) => (
            <div
              key={product?._id || index}
              className="bg-white p-4 rounded shadow-sm border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-40 flex justify-center items-center bg-slate-50 rounded mb-3 overflow-hidden">
                  <img
                    src={product?.productImage?.[0]}
                    alt={product?.productName}
                    className="object-contain h-full w-full"
                  />
                </div>
                <h3 className="font-semibold text-slate-800 line-clamp-1">
                  {product?.productName}
                </h3>

                <div className="flex justify-between items-center my-1">
                  <p className="text-xs text-slate-500 capitalize">
                    {product?.category}
                  </p>
                  {product?.productCode && (
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 font-mono">
                      Code: {product.productCode}
                    </span>
                  )}
                </div>

                {/* Size Stock Breakdown */}
                {product?.sizes && (
                  <div className="flex flex-wrap gap-1 my-2">
                    {Object.entries(product.sizes).map(([size, qty]) => (
                      <span
                        key={size}
                        className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700"
                      >
                        {size}:{" "}
                        <strong
                          className={
                            qty === 0 ? "text-red-500" : "text-slate-900"
                          }
                        >
                          {qty}
                        </strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                <div>
                  <p className="text-[10px] text-slate-400 line-through">
                    Ksh {Number(product?.price || 0).toLocaleString()}
                  </p>
                  <p className="font-bold text-orange-600">
                    Ksh {Number(product?.sellingPrice || 0).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 bg-green-100 hover:bg-green-600 rounded-full text-green-700 hover:text-white transition-colors"
                    title="Edit Product"
                    onClick={() => {
                      setEditProductData(product);
                      setOpenEditProduct(true);
                    }}
                  >
                    <MdModeEditOutline />
                  </button>
                  <button
                    className="p-2 bg-red-100 hover:bg-red-600 rounded-full text-red-700 hover:text-white transition-colors"
                    title="Delete Product"
                    onClick={() => handleDeleteProduct(product?._id)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Product Modal */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}

      {/* Edit Product Modal */}
      {openEditProduct && (
        <AdminEditProduct
          onClose={() => setOpenEditProduct(false)}
          productData={editProductData}
          fetchdata={fetchAllProduct}
        />
      )}
    </div>
  );
};

export default AllProducts;
