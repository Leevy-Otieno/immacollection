import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";

const Cart = () => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const context = useContext(Context)
    const navigate = useNavigate()
    const loadingCart = new Array(4).fill(null)


    const fetchData = async() =>{
        const response = await fetch(SummaryApi.addToCartProductView.url,{
            method : SummaryApi.addToCartProductView.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
        })

        const responseData = await response.json()

        if(responseData.success){
            setData(responseData.data)
        }
    }

    const handleLoading = async() =>{
        await fetchData()
    }

    useEffect(()=>{
        setLoading(true)
        handleLoading()
        setLoading(false)
    },[])


    const increaseQty = async(id,qty) =>{
        const response = await fetch(SummaryApi.updateCartProduct.url,{
            method : SummaryApi.updateCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {  
                    _id : id,
                    quantity : qty + 1
                }
            )
        })

        const responseData = await response.json()

        if(responseData.success){
            fetchData()
        }
    }


    const decraseQty = async(id,qty) =>{
       if(qty >= 2){
            const response = await fetch(SummaryApi.updateCartProduct.url,{
                method : SummaryApi.updateCartProduct.method,
                credentials : 'include',
                headers : {
                    "content-type" : 'application/json'
                },
                body : JSON.stringify(
                    {  
                        _id : id,
                        quantity : qty - 1
                    }
                )
            })

            const responseData = await response.json()

            if(responseData.success){
                fetchData()
            }
        }
    }

    const deleteCartProduct = async(id)=>{
        const response = await fetch(SummaryApi.deleteCartProduct.url,{
            method : SummaryApi.deleteCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {  
                    _id : id,
                }
            )
        })

        const responseData = await response.json()

        if(responseData.success){
            fetchData()
            context.fetchUserAddToCart()
        }
    }

    const totalQty = data.reduce((previousValue,currentValue)=> previousValue + (currentValue?.quantity || 0),0)
    const totalPrice = data.reduce((preve,curr)=> preve + ((curr?.quantity || 0) * (curr?.productId?.sellingPrice || 0)) ,0)

  return (
    <div className='container mx-auto px-4 py-4'>
        
        <div className='text-center text-lg my-3'>
            {
                data.length === 0 && !loading && (
                    <p className='bg-white py-5 shadow-sm rounded'>No Data in Cart</p>
                )
            }
        </div>

        <div className='flex flex-col lg:flex-row gap-10 lg:justify-between'>   
                {/***view product */}
                <div className='w-full max-w-3xl space-y-3'>
                    {
                        loading ? (
                            loadingCart?.map((el,index) => {
                                return(
                                    <div key={"Add To Cart Loading"+index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>
                                    </div>
                                )
                            })
                           
                        ) : (
                          data.map((product)=>{
                             // Skip rendering if the referenced product was deleted from the database
                             if(!product?.productId) return null;

                             return(
                             <div key={product?._id} className='w-full bg-white p-4 border border-slate-200 rounded-lg relative shadow-sm grid grid-cols-[100px_1fr] sm:grid-cols-[130px_1fr] gap-4 items-center'>
                                {/* Delete button */}
                                <button className='absolute right-3 top-3 text-amber-600 rounded-full p-2 hover:bg-amber-600 hover:text-white cursor-pointer transition-colors z-10' onClick={()=>deleteCartProduct(product?._id)}>
                                    <MdDelete size={20}/>
                                </button>

                                {/* Product Image */}
                                <div className='w-full h-24 sm:h-28 bg-slate-100 rounded overflow-hidden flex items-center justify-center'>
                                    <img src={product?.productId?.productImage[0]} alt={product?.productId?.productName} className='w-full h-full object-scale-down mix-blend-multiply p-1' />
                                </div>

                                {/* Product Details Column */}
                                <div className='flex flex-col justify-between h-full py-1 pr-8'>
                                    <div>
                                        <h2 className='text-base sm:text-lg font-semibold text-slate-800 line-clamp-1'>{product?.productId?.productName}</h2>
                                        <p className='capitalize text-slate-500 text-xs sm:text-sm'>{product?.productId?.category}</p>
                                    </div>

                                    <div className='flex items-center justify-between my-2'>
                                        <p className='text-amber-600 font-medium text-sm sm:text-base'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                        <p className='text-slate-700 font-semibold text-sm sm:text-base'>{displayINRCurrency(product?.productId?.sellingPrice  * product?.quantity)}</p>
                                    </div>

                                    <div className='flex items-center gap-3'>
                                        <button className='border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white w-6 h-6 flex justify-center items-center rounded text-sm font-bold' onClick={()=>decraseQty(product?._id,product?.quantity)}>-</button>
                                        <span className='font-medium text-sm px-1'>{product?.quantity}</span>
                                        <button className='border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white w-6 h-6 flex justify-center items-center rounded text-sm font-bold' onClick={()=>increaseQty(product?._id,product?.quantity)}>+</button>
                                    </div>
                                </div>   
                            </div>
                             )
                          })
                        )
                    }
                </div>


                {/***summary  */}
                <div className='w-full max-w-sm'>
                        {
                            loading ? (
                            <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse rounded'></div>
                            ) : (
                                <div className='bg-white border border-slate-200 rounded shadow-sm overflow-hidden sticky top-4'>
                                    <h2 className='text-white bg-amber-600 px-4 py-2 font-semibold'>Summary</h2>
                                    
                                    <div className='p-4 space-y-3'>
                                        <div className='flex items-center justify-between font-medium text-slate-600'>
                                            <p>Quantity</p>
                                            <p>{totalQty}</p>
                                        </div>

                                        <div className='flex items-center justify-between font-medium text-slate-600 border-t pt-2'>
                                            <p className='font-bold text-slate-800'>Total Price</p>
                                            <p className='font-bold text-amber-600'>{displayINRCurrency(totalPrice)}</p>    
                                        </div>

                                        <button 
                                            onClick={() => navigate('/payment')} 
                                            disabled={data.length === 0}
                                            className='bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 transition-colors p-2 text-white w-full mt-4 rounded font-medium cursor-pointer'
                                        >
                                            Proceed to Payment
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                </div>
        </div>
    </div>
  )
}

export default Cart