import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import VerticalCard from "../components/VerticalCard";
import SummaryApi from "../common";
import { FaFilter, FaXmark } from "react-icons/fa6";

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [selectCategory, setSelectCategory] = useState({});
  const [filterCategoryList, setFilterCategoryList] = useState([]);
  const [sortBy, setSortBy] = useState("");

  // Synchronize filters safely with URL changes
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    const activeCategories = currentParams.getAll("category");

    setFilterCategoryList(activeCategories);

    const updatedObj = {};
    activeCategories.forEach((el) => {
      updatedObj[el] = true;
    });
    setSelectCategory(updatedObj);
  }, [location.search]);

  // Fetch products automatically: handles both all products and filtered categories
  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      if (filterCategoryList.length === 0 && SummaryApi.allProduct) {
        // Fetch all products if available in SummaryApi
        response = await fetch(SummaryApi.allProduct.url, {
          method: SummaryApi.allProduct.method || "GET",
          headers: { "content-type": "application/json" },
        });
      } else {
        // Fetch via filter endpoint (passing empty array fetches all products in most backend controllers)
        response = await fetch(SummaryApi.filterProduct.url, {
          method: SummaryApi.filterProduct.method,
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ category: filterCategoryList }),
        });
      }

      const dataResponse = await response.json();
      setData(dataResponse?.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterCategoryList]);

  // Handle clicking individual category pills
  const handleSelectCategory = (categoryValue) => {
    const nextState = {
      ...selectCategory,
      [categoryValue]: !selectCategory[categoryValue],
    };
    const arrayOfCategory = Object.keys(nextState).filter(
      (key) => nextState[key],
    );

    if (arrayOfCategory.length === 0) {
      navigate(`/product-category`);
    } else {
      const urlFormat = arrayOfCategory.map((el) => `category=${el}`).join("&");
      navigate(`/product-category?${urlFormat}`);
    }
  };

  // Handle "All Products" Button Click (Clears URL parameters and shows everything)
  const handleAllProductsClick = () => {
    setSelectCategory({});
    navigate(`/product-category`);
  };

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);
    if (value === "asc")
      setData((prev) =>
        [...prev].sort(
          (a, b) => (a.sellingPrice || a.price) - (b.sellingPrice || b.price),
        ),
      );
    if (value === "dsc")
      setData((prev) =>
        [...prev].sort(
          (a, b) => (b.sellingPrice || b.price) - (a.sellingPrice || a.price),
        ),
      );
  };

  const isAllSelected = filterCategoryList.length === 0;

  return (
    <div className="container mx-auto p-4 pt-20 lg:pt-28 max-w-7xl">
      {/* PROFESSIONAL HORIZONTAL FILTER & SORT BAR */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Top Row: Title & Sort Dropdown */}
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Catalog
              </span>
              <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                {data.length} items found
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={handleOnChangeSortBy}
                className="text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-amber-800 cursor-pointer"
              >
                <option value="">Featured / Default</option>
                <option value="asc">Price - Low to High</option>
                <option value="dsc">Price - High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Navigation Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
            {/* All Products Default Button */}
            <button
              onClick={handleAllProductsClick}
              className={`text-xs px-4 py-2 rounded-full font-semibold transition-all shrink-0 border ${
                isAllSelected
                  ? "bg-amber-700 text-white border-amber-700 shadow-sm"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
            >
              ✨ All Products
            </button>

            {productCategory.map((categoryName, index) => {
              const isChecked = !!selectCategory[categoryName?.value];
              return (
                <button
                  key={categoryName?.value || index}
                  onClick={() => handleSelectCategory(categoryName?.value)}
                  className={`text-xs px-3.5 py-2 rounded-full font-medium transition-all shrink-0 border capitalize ${
                    isChecked
                      ? "bg-amber-700 text-white border-amber-700 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-500 hover:bg-slate-100"
                  }`}
                >
                  {categoryName?.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER TRIGGER BUTTON */}
      <div className="flex lg:hidden justify-end mb-4">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 text-xs font-medium text-white bg-amber-600 px-4 py-2 rounded-full shadow-sm active:bg-amber-700 transition-colors"
        >
          <FaFilter size={11} /> Filter & Sort Options
        </button>
      </div>

      {/* MAIN PRODUCT CATALOG GRID */}
      <div className="w-full">
        <div className="min-h-[60vh]">
          {loading ? (
            <div className="flex justify-center items-center h-48 text-slate-400 text-sm animate-pulse font-light">
              Loading products...
            </div>
          ) : data.length !== 0 ? (
            <div className="w-full">
              <VerticalCard data={data} loading={loading} />
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[380px]">
              <p className="text-slate-400 text-sm font-medium mb-1">
                No products found.
              </p>
              <button
                onClick={handleAllProductsClick}
                className="mt-3 bg-amber-600 text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-amber-700"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE POPUP MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end lg:hidden">
          <div className="bg-white w-80 h-full p-6 relative flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-5">
                <h2 className="font-bold text-slate-800 text-sm uppercase">
                  Browse & Filter
                </h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <FaXmark size={18} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 border-b pb-2 mb-3">
                  Categories
                </h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      handleAllProductsClick();
                      setMobileFilterOpen(false);
                    }}
                    className={`text-left text-xs px-3 py-2 rounded font-semibold ${isAllSelected ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-700"}`}
                  >
                    ✨ All Products
                  </button>
                  {productCategory.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        handleSelectCategory(cat.value);
                        setMobileFilterOpen(false);
                      }}
                      className={`text-left text-xs px-3 py-2 rounded font-medium capitalize ${selectCategory[cat.value] ? "bg-amber-600 text-white" : "bg-slate-50 text-slate-700"}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg tracking-wider uppercase"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryProduct;
