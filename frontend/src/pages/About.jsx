import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaGem,
  FaAward,
  FaTruck,
  FaClock,
  FaPhoneAlt,
  FaHome,
} from "react-icons/fa";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-4 lg:pt-8">
      {/* ─── HERO COVER BANNER STRIPE ─── */}
      <div className="bg-slate-900 text-white py-20 px-4 text-center relative overflow-hidden rounded-2xl max-w-6xl mx-auto shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.15),transparent_75%)] animate-pulse duration-4000" />
        <div className="container mx-auto max-w-3xl relative z-10 space-y-4">
          <span className="text-amber-500 font-bold text-xs uppercase tracking-widest block bg-slate-800/60 px-3 py-1 rounded-full w-fit mx-auto border border-slate-700/50">
            CLOTHES • SHOES • BAGS • ELEGANCE
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-black tracking-wide uppercase text-white drop-shadow-md">
            About{" "}
            <span className="text-amber-500 font-light lowercase italic capitalize">
              Imma Collections
            </span>
          </h1>
          <p className="text-slate-200 text-sm md:text-base leading-relaxed font-normal max-w-xl mx-auto px-2">
          Kenya's favourite boutique for stylish clothes, shoes and bags that make you feel confident. From everyday looks to statement pieces, we bring you quality, elegance and affordable fashion — delivered straight to your door.
          </p>
        </div>
      </div>

      {/* ─── HIGH-CONTRAST VISUAL IMAGE CATALOG GRID ─── */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Boutique Display */}
          <div className="group overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
            <div className="h-56 bg-slate-100 overflow-hidden relative shrink-0">
              <img
                src="https://media.istockphoto.com/id/2244684732/photo/3d-render-of-fashion-shop.webp?a=1&b=1&s=612x612&w=0&k=20&c=oz7rFQ_n10LQdp74j_rSugU5EBCPGal-1VMWl2RY25E="
                alt="Luxury Perfume Boutique Aesthetic Display"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white text-xs font-extrabold uppercase tracking-widest drop-shadow">
               OUR BOUTIQUE EXPERIENCE
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between bg-white">
              <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed mb-2">
                Shop in style and find outfits that fit you perfectly. From casual everyday looks to elegant occasion wear, we help you find your perfect fit.
              </p>
              <span className="text-[11px] text-amber-800 font-bold uppercase tracking-wider block mt-2">
                PREMIUM STYLE & QUALITY
              </span>
            </div>
          </div>

          {/* Card 2: Exquisite Vanity Bottle Arrays */}
          <div className="group overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
            <div className="h-56 bg-slate-100 overflow-hidden relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1705675451868-014a161e591b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                alt="Designer Perfume Bottle Display Vanity Elegant"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white text-xs font-extrabold uppercase tracking-widest drop-shadow">
                CURATED COLLECTIONS
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between bg-white">
              <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed mb-2">
                Every single piece in our store is hand-picked for quality, comfort and style. Only the best clothes, shoes and bags make it to Imma Collections.
              </p>
              <span className="text-[11px] text-amber-800 font-bold uppercase tracking-wider block mt-2">
                100% QUALITY CHECKED
              </span>
            </div>
          </div>

          {/* Card 3: Curated Gift Wrapping */}
          <div className="group overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
            <div className="h-56 bg-slate-100 overflow-hidden relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                alt="Luxury Handbags & Totes Packaging Curated"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white text-xs font-extrabold uppercase tracking-widest drop-shadow">
                EASY & FAST DELIVERY
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between bg-white">
              <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed mb-2">
                Order in minutes and get your favourite pieces delivered to your door, safely packed and ready to wear. Shopping with Imma is simple and stress-free.
              </p>
              <span className="text-[11px] text-amber-800 font-bold uppercase tracking-wider block mt-2">
                DELIVERED WITH LOVE & CARE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BRAND CHRONICLE STORY LINE ─── */}
      <div className="container mx-auto px-4 py-8 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl md:text-2xl font-serif font-black text-slate-900 tracking-wide uppercase border-b-2 pb-3 border-amber-500 w-fit">
           CRAFTING UNFORGETTABLE LOOKS
          </h2>
          <p className="text-slate-800 font-medium text-xs md:text-sm leading-relaxed">
            Founded on the principle of style, confidence and quality{" "}
            <span className="font-bold text-slate-950">Imma Collections</span>{" "}
            has grown into one of Nairobi's favourite fashion boutiques. We believe a great outfit is more than just clothes — it's how you express yourself, stand out, and feel confident long after you leave the house.
          </p>
          <p className="text-slate-800 font-medium text-xs md:text-sm leading-relaxed">
           By working directly with trusted suppliers and designers, we bring international fashion trends to Kenya at prices you can afford. From everyday essentials to elegant occasion wear, our collections mix the latest styles with timeless pieces for men and women who love to look good.
          </p>
        </div>

        {/* Decorative Blueprint Block Quotes */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-2xl shadow-md text-center space-y-5 relative min-h-[220px] flex flex-col justify-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-5 py-1.5 rounded-full shadow-md border border-amber-500">
            Our Core Blueprint
          </div>
          <p className="font-serif italic text-base md:text-xl text-slate-100 pt-2 leading-relaxed font-medium drop-shadow-sm">
            "To bring you authentic, quality fashion, remove the stress of shopping, and give you a world-class experience in every order — from our store to your doorstep. We want every customer to feel confident, stylish and valued."
          </p>
          <div className="text-[10px] text-amber-500 font-mono font-bold tracking-widest uppercase pt-2">
            — The Imma Collections Executive Bench
          </div>
        </div>
      </div>

      {/* ─── HIGH-CONTRAST VALUE CARDS MATRIX ─── */}
      <div className="bg-white border-y border-slate-200 py-16 px-4 mt-16 shadow-inner">
        <div className="container mx-auto max-w-6xl space-y-12">
          <h3 className="text-center font-serif text-xl md:text-2xl font-black text-slate-900 tracking-wide uppercase">
            The Pillars of Our Customer Service
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
              <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-xl text-xl shadow">
                <FaGem />
              </div>
              <h4 className="font-black text-xs md:text-sm text-slate-900 tracking-wider uppercase">
                100% Genuine Only
              </h4>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                Zero-tolerance loop for counterfeits or replicas. Every batch
                code stands cataloged for audit trail checks.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
              <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-xl text-xl shadow">
                <FaAward />
              </div>
              <h4 className="font-black text-xs md:text-sm text-slate-900 tracking-wider uppercase">
                Elite Selection Layouts
              </h4>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                We consistently track elite, luxury trends alongside classic
                designer staples to offer the best choices across Kenya.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
              <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-xl text-xl shadow">
                <FaTruck />
              </div>
              <h4 className="font-black text-xs md:text-sm text-slate-900 tracking-wider uppercase">
                Express Distribution
              </h4>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                Same-day messenger runs directly inside the Nairobi CBD area,
                paired with express courier service countrywide.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
              <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-xl text-xl shadow">
                <FaClock />
              </div>
              <h4 className="font-black text-xs md:text-sm text-slate-900 tracking-wider uppercase">
                Consultative Guidance
              </h4>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                Our direct support lines provide real-time recommendations to
                guide you smoothly to your ideal match choice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── DUAL-ACTION CONTEXTUAL CALL TO ACTION ─── */}
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 md:p-10">
          <h3 className="font-serif text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-wide">
            Ready to Begin Your Style Journey?
          </h3>
          <p className="mt-4 text-slate-700 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
           Return to our main shop to explore trending clothes, shoes and bags, or chat directly with our team for help finding your perfect fit.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs transition-colors duration-300"
            >
              <FaHome /> Return to Home
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs transition-colors duration-300"
            >
              <FaPhoneAlt /> Contact Our Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
