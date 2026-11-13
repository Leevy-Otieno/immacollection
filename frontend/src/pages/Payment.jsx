import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaLock, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";

const Payment = () => {
  const navigate = useNavigate()
  const [cartData, setCartData] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: '',
    paymentMethod: 'mpesastk'
  })

  const fetchCartProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: 'include',
        headers: {
          "content-type": 'application/json'
        },
      })
      const responseData = await response.json()
      if (responseData.success) {
        setCartData(responseData.data)
      }
    } catch (error) {
      console.error("Error fetching cart for payment", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCartProducts()
  }, [])

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const totalQty = cartData.reduce((acc, curr) => acc + (curr?.quantity || 0), 0)
  const subTotal = cartData.reduce((acc, curr) => acc + ((curr?.quantity || 0) * (curr?.productId?.sellingPrice || 0)), 0)
  const shippingFee = subTotal > 0 ? 250 : 0
  const grandTotal = subTotal + shippingFee

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (formData.paymentMethod === 'mpesastk') {
        const response = await fetch(SummaryApi.mpesaPayment.url, {
          method: SummaryApi.mpesaPayment.method,
          credentials: 'include',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            phone: formData.phone,
            amount: grandTotal,
            shippingDetails: {
              fullName: formData.fullName,
              city: formData.city,
              address: formData.address
            },
            cartItems: cartData
          })
        })

        const responseData = await response.json()

        if (responseData.success) {
          alert(responseData.message)
          navigate('/')
        } else {
          alert(responseData.message || 'Payment initiation failed.')
        }
      } else {
        alert('Order placed successfully with Cash on Delivery!')
        navigate('/')
      }
    } catch (error) {
      alert('Network error connecting to payment gateway.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='bg-slate-50 min-h-screen py-8'>
      <div className='container mx-auto px-4 max-w-6xl'>
        
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6'>
          <div>
            <h1 className='text-xl sm:text-2xl font-bold text-slate-800'>Secure Checkout</h1>
            <p className='text-xs sm:text-sm text-slate-500'>Complete your shipping and payment details below</p>
          </div>
          <div className='flex items-center gap-2 mt-3 sm:mt-0 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-semibold'>
            <FaShieldAlt /> 100% Money Back & Buyer Protection
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          
          <div className='lg:col-span-2 space-y-6'>
            
            <div className='bg-white p-6 rounded-lg shadow-sm border border-slate-200'>
              <h2 className='text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-3'>
                <span className='bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs'>1</span>
                Shipping Address
              </h2>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold uppercase text-slate-600 mb-1'>Full Name</label>
                  <input 
                    type='text' 
                    name='fullName' 
                    value={formData.fullName} 
                    onChange={handleOnChange} 
                    required 
                    placeholder='e.g. John Doe'
                    className='w-full border border-slate-300 rounded p-2.5 text-sm focus:outline-none focus:border-amber-600'
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold uppercase text-slate-600 mb-1'>Phone Number (for M-Pesa STK Push)</label>
                  <input 
                    type='tel' 
                    name='phone' 
                    value={formData.phone} 
                    onChange={handleOnChange} 
                    required 
                    placeholder='0712345678'
                    className='w-full border border-slate-300 rounded p-2.5 text-sm focus:outline-none focus:border-amber-600'
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold uppercase text-slate-600 mb-1'>City / Region</label>
                  <input 
                    type='text' 
                    name='city' 
                    value={formData.city} 
                    onChange={handleOnChange} 
                    required 
                    placeholder='e.g. Nairobi'
                    className='w-full border border-slate-300 rounded p-2.5 text-sm focus:outline-none focus:border-amber-600'
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold uppercase text-slate-600 mb-1'>Street Address / Building</label>
                  <input 
                    type='text' 
                    name='address' 
                    value={formData.address} 
                    onChange={handleOnChange} 
                    required 
                    placeholder='e.g. Moi Avenue, Kimathi House'
                    className='w-full border border-slate-300 rounded p-2.5 text-sm focus:outline-none focus:border-amber-600'
                  />
                </div>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border border-slate-200'>
              <h2 className='text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-3'>
                <span className='bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs'>2</span>
                Payment Method
              </h2>

              <div className='space-y-3'>
                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'mpesastk' ? 'border-amber-600 bg-amber-50/40' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <div className='flex items-center gap-3'>
                    <input 
                      type='radio' 
                      name='paymentMethod' 
                      value='mpesastk' 
                      checked={formData.paymentMethod === 'mpesastk'} 
                      onChange={handleOnChange}
                      className='accent-amber-600 w-4 h-4'
                    />
                    <div>
                      <p className='font-bold text-slate-800 text-sm flex items-center gap-2'>
                        <span className='text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded text-xs'>M-PESA</span> 
                        STK Push / Mobile Money
                      </p>
                      <p className='text-xs text-slate-500'>Instant prompt sent directly to your phone to complete payment</p>
                    </div>
                  </div>
                  <span className='text-xs bg-emerald-600 text-white px-2 py-1 rounded font-medium'>Recommended</span>
                </label>

                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-amber-600 bg-amber-50/40' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <div className='flex items-center gap-3'>
                    <input 
                      type='radio' 
                      name='paymentMethod' 
                      value='cod' 
                      checked={formData.paymentMethod === 'cod'} 
                      onChange={handleOnChange}
                      className='accent-amber-600 w-4 h-4'
                    />
                    <div>
                      <p className='font-bold text-slate-800 text-sm'>Cash on Delivery (COD)</p>
                      <p className='text-xs text-slate-500'>Pay with cash or M-Pesa when your order arrives</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border border-slate-200'>
              <h2 className='text-lg font-bold text-slate-800 mb-2 flex items-center gap-2 border-b pb-3'>
                <span className='bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs'>3</span>
                Product List <span className='text-xs font-normal text-slate-500'>({totalQty} items)</span>
              </h2>

              <div className='divide-y divide-slate-100 max-h-96 overflow-y-auto'>
                {loading ? (
                  <p className='py-4 text-center text-slate-400'>Loading your products...</p>
                ) : cartData.length === 0 ? (
                  <p className='py-4 text-center text-slate-400'>No items found in your cart.</p>
                ) : (
                  cartData.map((item) => {
                    if (!item?.productId) return null;
                    return (
                      <div key={item?._id} className='py-3 flex items-center gap-4'>
                        <div className='w-16 h-16 bg-slate-100 rounded overflow-hidden flex-shrink-0 flex items-center justify-center border'>
                          <img 
                            src={item?.productId?.productImage[0]} 
                            alt={item?.productId?.productName} 
                            className='w-full h-full object-scale-down mix-blend-multiply p-1' 
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h4 className='font-semibold text-sm text-slate-800 truncate'>{item?.productId?.productName}</h4>
                          <p className='text-xs text-slate-500 capitalize'>{item?.productId?.category}</p>
                          <p className='text-xs text-slate-600 mt-1'>Qty: <span className='font-bold'>{item?.quantity}</span></p>
                        </div>
                        <div className='text-right'>
                          <p className='font-bold text-amber-600 text-sm'>
                            {displayINRCurrency(item?.productId?.sellingPrice * item?.quantity)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

          </div>

          <div>
            <div className='bg-white border border-slate-200 rounded-lg shadow-sm p-6 sticky top-4 space-y-4'>
              <h3 className='text-lg font-bold text-slate-800 border-b pb-3'>Order Summary</h3>

              <div className='space-y-2.5 text-sm text-slate-600'>
                <div className='flex justify-between'>
                  <p>Subtotal ({totalQty} items)</p>
                  <p className='font-medium'>{displayINRCurrency(subTotal)}</p>
                </div>
                <div className='flex justify-between'>
                  <p className='flex items-center gap-1'>Shipping Fee <MdLocalShipping /></p>
                  <p className='font-medium'>{displayINRCurrency(shippingFee)}</p>
                </div>
                <div className='border-t pt-3 flex justify-between text-base font-bold text-slate-800'>
                  <p>Total Amount</p>
                  <p className='text-amber-600 text-lg'>{displayINRCurrency(grandTotal)}</p>
                </div>
              </div>

              <button 
                type='submit'
                disabled={submitting || cartData.length === 0}
                className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-lg transition-colors shadow cursor-pointer mt-4 flex items-center justify-center gap-2'
              >
                <FaLock className='text-xs' />
                {submitting ? 'Sending STK Push...' : `Pay ${displayINRCurrency(grandTotal)}`}
              </button>

              <div className='mt-6 pt-4 border-t space-y-2 text-xs text-slate-500'>
                <p className='flex items-center gap-2 font-medium text-slate-700'>
                  <FaCheckCircle className='text-emerald-600' /> Safe and Secure Payments
                </p>
                <p>By placing your order, you agree to IMMA Collections' Terms and Conditions.</p>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Payment