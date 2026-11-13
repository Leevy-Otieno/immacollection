import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";

const Cart = () => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const context = useContext(Context)
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

    const totalQty = data.reduce((previousValue,currentValue)=> previousValue + currentValue.quantity,0)
    const totalPrice = data.reduce((preve,curr)=> preve + (curr.quantity * curr?.productId?.sellingPrice) ,0)

  return (
    <div className='container mx-auto px-4'>
        
        <div className='text-center text-lg my-3'>
            {
                data.length === 0 && !loading && (
                    <p className='bg-white py-5'>No Data</p>
                )
            }
        </div>

        <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>   
                {/***view product */}
                <div className='w-full max-w-3xl space-y-3'>
                    {
                        loading ? (
                            loadingCart?.map((el,index) => {
                                return(
                                    <div key={el+"Add To Cart Loading"+index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>
                                    </div>
                                )
                            })
                           
                        ) : (
                          data.map((product,index)=>{
                             return(
                             <div key={product?._id+"Add To Cart Loading"} className='w-full bg-white p-4 border border-slate-300 rounded flex gap-4 relative shadow-sm'>
                                {/* Product Image */}
                                <div className='w-28 h-28 lg:w-32 lg:h-32 bg-slate-100 rounded overflow-hidden flex-shrink-0'>
                                    <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                                </div>

                                {/* Product Details */}
                                <div className='flex flex-col justify-between w-full'>
                                    {/**delete product */}
                                    <div className='absolute right-3 top-3 text-amber-600 rounded-full p-2 hover:bg-amber-600 hover:text-white cursor-pointer' onClick={()=>deleteCartProduct(product?._id)}>
                                        <MdDelete/>
                                    </div>

                                    <div>
                                        <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1 font-semibold text-slate-800 pr-8'>{product?.productId?.productName}</h2>
                                        <p className='capitalize text-slate-500 text-sm'>{product?.productId?.category}</p>
                                    </div>

                                    <div className='flex items-center justify-between my-2'>
                                        <p className='text-amber-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                        <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice  * product?.quantity)}</p>
                                    </div>

                                    <div className='flex items-center gap-3'>
                                        <button className='border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={()=>decraseQty(product?._id,product?.quantity)}>-</button>
                                        <span className='font-medium'>{product?.quantity}</span>
                                        <button className='border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={()=>increaseQty(product?._id,product?.quantity)}>+</button>
                                    </div>
                                </div>   
                            </div>
                             )
                          })
                        )
                    }
                </div>


                {/***summary  */}
                <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                        {
                            loading ? (
                            <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse rounded'>
                                
                            </div>
                            ) : (
                                <div className='bg-white border border-slate-200 rounded shadow-sm overflow-hidden'>
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

                                        <button className='bg-blue-600 hover:bg-blue-700 transition-colors p-2 text-white w-full mt-4 rounded font-medium'>Payment</button>
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