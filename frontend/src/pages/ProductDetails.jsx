import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SummaryApi from '../common'
import { FaStar, FaStarHalf, FaPlus, FaMinus } from "react-icons/fa";
import displayINRCurrency from '../helpers/displayCurrency';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productCode: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
    sizesStock: {}
  })
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const productImageListLoading = new Array(4).fill(null)
  const [activeImage, setActiveImage] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1) // Quantity state added

  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0
  })
  const [zoomImage, setZoomImage] = useState(false)

  const { fetchUserAddToCart } = useContext(Context)
  const navigate = useNavigate()

  const fetchProductDetails = async () => {
    setLoading(true)
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        productId: params?.id
      })
    })
    setLoading(false)
    const dataReponse = await response.json()

    setData(dataReponse?.data)
    setActiveImage(dataReponse?.data?.productImage[0])
    setSelectedSize("") 
    setQuantity(1) // Reset quantity on product switch
  }

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL)
  }

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true)
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height

    setZoomImageCoordinate({ x, y })
  }, [])

  const handleLeaveImageZoom = () => {
    setZoomImage(false)
  }

  // Detect footwear vs clothing sizes dynamically
  const catLower = (data?.category || "").toLowerCase();
  const isFootwear = ["shoe", "sandal", "heal", "heel", "footwear", "sneaker", "boot"].some(k =>
    catLower.includes(k)
  );
  const sizeOptions = isFootwear
    ? ["EU 38", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"]
    : ["XS", "S", "M", "L", "XL"];

  // Quantity increase/decrease handlers
  const handleIncreaseQty = () => {
    const maxStock = selectedSize ? (data?.sizesStock?.[selectedSize] ?? 10) : 10;
    if (quantity < maxStock) {
      setQuantity(prev => prev + 1);
    } else {
      toast.warning(`Maximum available stock for ${selectedSize || 'this size'} is ${maxStock}`);
    }
  };

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async (e, id) => {
    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }
    await addToCart(e, id, selectedSize, quantity)
    if (fetchUserAddToCart) fetchUserAddToCart()
  }

  const handleBuyProduct = async (e, id) => {
    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }
    const res = await addToCart(e, id, selectedSize, quantity)
    if (fetchUserAddToCart) fetchUserAddToCart()
    if (res?.success) {
      navigate("/cart")
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>
        {/***product Image */}
        <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>
          <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative p-2'>
            <img src={activeImage} className='h-full w-full object-scale-down mix-blend-multiply' onMouseMove={handleZoomImage} onMouseLeave={handleLeaveImageZoom} alt="" />

            {zoomImage && (
              <div className='hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0 z-10'>
                <div
                  className='w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150'
                  style={{
                    background: `url(${activeImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}% `
                  }}
                />
              </div>
            )}
          </div>

          <div className='h-full'>
            {loading ? (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {productImageListLoading.map((el, index) => (
                  <div className='h-20 w-20 bg-slate-200 rounded animate-pulse' key={"loadingImage" + index} />
                ))}
              </div>
            ) : (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {data?.productImage?.map((imgURL, index) => (
                  <div className='h-20 w-20 bg-slate-200 rounded p-1' key={imgURL ? `${imgURL}-${index}` : `image-${index}`}>
                    <img src={imgURL} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' onMouseEnter={() => handleMouseEnterProduct(imgURL)} onClick={() => handleMouseEnterProduct(imgURL)} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/***product details */}
        {loading ? (
          <div className='grid gap-1 w-full'>
            <p className='bg-slate-200 animate-pulse h-6 lg:h-8 w-full rounded-full inline-block'></p>
            <h2 className='text-2xl lg:text-4xl font-medium h-6 lg:h-8 bg-slate-200 animate-pulse w-full'></h2>
            <p className='capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8 w-full'></p>
          </div>
        ) : (
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <p className='bg-amber-200 text-amber-600 px-2 rounded-full inline-block w-fit text-sm'>{data?.brandName}</p>
              {data?.productCode && (
                <span className='text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border'>
                  SKU: {data.productCode}
                </span>
              )}
            </div>

            <h2 className='text-2xl lg:text-4xl font-medium text-slate-800'>{data?.productName}</h2>
            <p className='capitalize text-slate-400'>{data?.category}</p>

            <div className='text-amber-600 flex items-center gap-1'>
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalf />
            </div>

            <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1'>
              <p className='text-amber-600 font-bold'>{displayINRCurrency(data.sellingPrice)}</p>
              <p className='text-slate-400 line-through'>{displayINRCurrency(data.price)}</p>
            </div>

            {/* Dynamic Size Selector */}
            <div className='my-2'>
              <p className='text-slate-700 font-semibold text-sm mb-1.5'>
                {isFootwear ? "Select Footwear Size (EU):" : "Select Size:"}{" "}
                {selectedSize ? (
                  <span className='text-amber-600 font-bold ml-1 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded'>
                    {selectedSize} (Chosen)
                  </span>
                ) : (
                  <span className='text-rose-500 text-xs font-normal'>* Please choose a size</span>
                )}
              </p>
              <div className='flex flex-wrap gap-2'>
                {sizeOptions.map((size) => {
                  const stockQty = data?.sizesStock?.[size] ?? 0;
                  const outOfStock = stockQty <= 0;

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "bg-amber-600 text-white border-amber-600 shadow-sm ring-2 ring-amber-300"
                          : outOfStock
                          ? "bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed"
                          : "bg-white text-slate-700 border-slate-300 hover:border-amber-600"
                      }`}
                    >
                      {size}{" "}
                      <span className={`text-xs ml-1 ${selectedSize === size ? "text-amber-100" : "text-slate-400"}`}>
                        {outOfStock ? "(Out)" : `(${stockQty})`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className='my-2 flex items-center gap-4'>
              <p className='text-slate-700 font-semibold text-sm'>Quantity:</p>
              <div className='flex items-center border border-slate-300 rounded overflow-hidden bg-white'>
                <button 
                  onClick={handleDecreaseQty} 
                  className='p-2 bg-slate-50 hover:bg-slate-200 text-slate-600 transition-colors'
                  type='button'
                >
                  <FaMinus size={10} />
                </button>
                <span className='px-4 py-1 text-sm font-bold text-slate-800 min-w-[40px] text-center'>
                  {quantity}
                </span>
                <button 
                  onClick={handleIncreaseQty} 
                  className='p-2 bg-slate-50 hover:bg-slate-200 text-slate-600 transition-colors'
                  type='button'
                >
                  <FaPlus size={10} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center gap-3 my-3'>
              <button 
                className='border-2 border-amber-600 rounded px-4 py-2 min-w-[130px] text-amber-600 font-medium hover:bg-amber-600 hover:text-white transition-colors' 
                onClick={(e) => handleBuyProduct(e, data?._id)}
              >
                Buy Now
              </button>
              <button 
                className='border-2 border-amber-600 rounded px-4 py-2 min-w-[130px] font-medium text-white bg-amber-600 hover:text-amber-600 hover:bg-white transition-colors' 
                onClick={(e) => handleAddToCart(e, data?._id)}
              >
                Add To Cart
              </button>
            </div>

            <div>
              <p className='text-slate-600 font-medium my-1'>Description : </p>
              <p className='text-sm text-slate-600 leading-relaxed'>{data?.description}</p>
            </div>
          </div>
        )}
      </div>

      {data.category && (
        <CategroyWiseProductDisplay category={data?.category} heading={"Recommended Product"} />
      )}
    </div>
  )
}

export default ProductDetails