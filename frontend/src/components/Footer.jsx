import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='bg-slate-900 text-slate-300 border-t border-slate-800 tracking-wide mt-12'>
      
      {/* 🚀 ACTION-DRIVEN CALL TO ACTION (CTA) STRIPE */}
      <div className='bg-gradient-to-r from-amber-900 to-amber-950 text-white py-10 px-4 shadow-inner'>
        <div className='container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl'>
          <div>
            <h3 className='text-2xl md:text-3xl font-bold tracking-tight mb-2'>Smell Unforgettable Today</h3>
            <p className='text-amber-100 text-sm md:text-base font-light'>Discover your signature luxury fragrance at unbeatable prices in Nairobi.</p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
            <Link 
              to="/product-category?category=Mens Clothes" 
              className='bg-white text-amber-700 text-center font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-slate-900 hover:text-white transition-all duration-300 text-sm transform hover:-translate-y-0.5'
            >
              Shop Best Sellers
            </Link>
            <a 
              href="https://wa.me" // Replace with your exact business WhatsApp number
              target="_blank" 
              rel="noopener noreferrer" 
              className='bg-slate-900 text-white text-center font-semibold px-6 py-3 rounded-lg shadow-md border border-slate-800 hover:bg-white hover:text-amber-700 transition-all duration-300 text-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5'
            >
              <FaWhatsapp className='text-emerald-400 text-lg' /> Order on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* 📦 CONTENT LINK GRID MATRIX */}
      <div className='container mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl'>
        
        {/* Column 1: Store Bio & Identity */}
        <div className='flex flex-col gap-4'>
          <h2 className='text-white text-xl font-bold tracking-wider'>Imma <span className='text-amber-900'>Collections</span></h2>
          <p className='text-sm text-slate-400 leading-relaxed font-light'>
            Your premier boutique for original designer perfumes, luxury watches, and curated custom gifts delivered directly across Kenya.
          </p>
          {/* Social Icons with Scaling Micro-Interactions */}
          <div className='flex items-center gap-3 mt-2'>
            <a href="#" className='w-9 h-9 bg-slate-800 hover:bg-amber-900 hover:text-white flex items-center justify-center rounded-lg text-slate-400 transition-all duration-300 shadow'><FaFacebookF size={15}/></a>
            <a href="#" className='w-9 h-9 bg-slate-800 hover:bg-amber-900 hover:text-white flex items-center justify-center rounded-lg text-slate-400 transition-all duration-300 shadow'><FaInstagram size={15}/></a>
            <a href="#" className='w-9 h-9 bg-slate-800 hover:bg-amber-900 hover:text-white flex items-center justify-center rounded-lg text-slate-400 transition-all duration-300 shadow'><FaTwitter size={15}/></a>
          </div>
        </div>

        {/* Column 2: Fast Category Links */}
        <div>
          <h4 className='text-white font-semibold text-sm uppercase tracking-widest border-b border-slate-800 pb-3 mb-4'>Shop Categories</h4>
          <ul className='flex flex-col gap-2.5 text-sm'>
            <li><Link to="/product-category?category=Mens Clothes" className='hover:text-amber-900 hover:translate-x-1 inline-block transition-all duration-200 text-slate-400'>Mens Clothes</Link></li>
            <li><Link to="/product-category?category=Shoes & Sneakers" className='hover:text-amber-900 hover:translate-x-1 inline-block transition-all duration-200 text-slate-400'>Shoes & Sneakers</Link></li>
            <li><Link to="/product-category?category=Handbags & Totes" className='hover:text-amber-900 hover:translate-x-1 inline-block transition-all duration-200 text-slate-400'>Handbags & Totes</Link></li>
            <li><Link to="/product-category?category=watches" className='hover:text-amber-900 hover:translate-x-1 inline-block transition-all duration-200 text-slate-400'>Premium Watches</Link></li>
          </ul>
        </div>

        {/* Column 3: Customer Care Policy Links */}
        <div>
          <h4 className='text-white font-semibold text-sm uppercase tracking-widest border-b border-slate-800 pb-3 mb-4'>Support & Help</h4>
          <ul className='flex flex-col gap-2.5 text-sm'>
            {/*  Fixed: Updated path route destination perfectly to single "/about" */}
            <li><Link to="/about" className='hover:text-amber-900 hover:translate-x-1 inline-block transition-all duration-200 text-slate-400'>About Our Store</Link></li>
            <li><Link to="/shipping-policy" className='hover:text-amber-900 hover:translate-x-1 inline-block transition-all duration-200 text-slate-400'>Delivery Policy (Kenya)</Link></li>
            <li><Link to="/return-refund" className='hover:text-amber-900 hover:translate-x-1 inline-block transition-all duration-200 text-slate-400'>Returns & Refunds</Link></li>
            <li><Link to="/terms" className='hover:text-amber-900 hover:translate-x-1 inline-block transition-all duration-200 text-slate-400'>Terms of Service</Link></li>
          </ul>
        </div>

        {/* Column 4: Local Nairobi Location Matrix */}
        <div>
          <h4 className='text-white font-semibold text-sm uppercase tracking-widest border-b border-slate-800 pb-3 mb-4'>Store Contact</h4>
          <ul className='flex flex-col gap-3 text-sm text-slate-400 font-light'>
            <li className='flex items-start gap-3'>
              <FaMapMarkerAlt className='text-amber-900 mt-1 shrink-0' />
              <span>Nairobi Central Business District, Kenya</span>
            </li>
            <li className='flex items-center gap-3'>
              <FaPhoneAlt className='text-amber-900 shrink-0' />
              <a href="tel:+254748583735" className='hover:text-amber-900 transition-colors font-normal'>+254 748 583735</a>
            </li>
            <li className='flex items-center gap-3'>
              <FaEnvelope className='text-amber-900 shrink-0' />
              <a href="mailto:info@yourdomain.com" className='hover:text-amber-900 transition-colors'>info@yourdomain.com</a>
            </li>
          </ul>
        </div>

      </div>

      {/* 🔒 ATTRIBUTION SUB-FOOTER */}
      <div className='bg-slate-950 text-slate-500 text-xs py-5 border-t border-slate-900'>
        <div className='container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left'>
          <p>&copy; {new Date().getFullYear()} Imma Collections Kenya. All rights reserved.</p>
          <p className='font-bold tracking-wide cursor-help transition-all hover:text-white' title="Youtube Channel">
            Powered by LeevyStack.
          </p>
        </div>
      </div>

    </footer>
  )
}

export default Footer
