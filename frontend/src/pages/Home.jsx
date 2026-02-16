import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, getImageUrl } from "../services/api";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const products = await fetchProducts();

        const firstProductByCategory = {};
        products.forEach((product) => {
          if (!product.category) return;
          if (!firstProductByCategory[product.category]) {
            firstProductByCategory[product.category] = product;
          }
        });

        const colors = {
          Cake: "bg-gradient-to-b from-pink-50 to-rose-50",
          Cookies: "bg-gradient-to-b from-amber-50 to-orange-50",
          Bread: "bg-gradient-to-b from-yellow-50 to-amber-50",
          Muffin: "bg-gradient-to-b from-violet-50 to-purple-50",
        };

        const icons = {
          Cake: "🎂",
          Cookies: "🍪",
          Bread: "🍞",
          Muffin: "🧁",
        };

        const descriptions = {
          Cake: "Delicious cakes baked fresh every day!",
          Cookies: "Crunchy and sweet cookies for everyone.",
          Bread: "Freshly baked bread for your daily meals.",
          Muffin: "Soft and fluffy muffins with tasty flavors.",
        };

        const builtCategories = Object.keys(firstProductByCategory).map(
          (categoryName) => {
            const product = firstProductByCategory[categoryName];
            return {
              name: categoryName,
              img: getImageUrl(product.img),
              path: `/products?category=${encodeURIComponent(categoryName)}`,
              desc: descriptions[categoryName] || "Delicious treats from our bakery.",
              color: colors[categoryName] || "bg-gradient-to-b from-amber-50 to-orange-50",
              icon: icons[categoryName] || "🍰",
            };
          },
        );

        setCategories(builtCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      
      <div className="absolute top-10 left-5 w-16 h-16 rounded-full bg-amber-200/20 float-slow" />
      <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-rose-200/20 float" />
      <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-yellow-200/20 float-slower" />
      <div className="absolute top-2/3 left-1/4 w-20 h-20 rounded-full bg-pink-200/20 float-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 relative z-10">

        <div className="text-center mb-16 fade-in">
          <div className="inline-block mb-6 relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/40 to-rose-200/40 rounded-full blur-xl pulse-slow" />
            <h2 className="relative text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#C97C5D] via-[#D4A574] to-[#C97C5D] bg-[length:200%_auto] bg-clip-text text-transparent gradient-text">
              Welcome to Our Bakery
            </h2>
          </div>
          
          <div className="relative inline-block max-w-3xl mx-auto">
            <p className="relative text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed slide-up">
              Discover our delicious range of baked goodies made with love and the finest ingredients!
            </p>
            <div className="absolute -bottom-2 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#C97C5D] to-transparent expand-line" />
          </div>

          <div className="mt-8 bounce-subtle">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C97C5D] to-[#D4A574] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-[#C97C5D]/40 group relative overflow-hidden"
            >
              <span className="relative z-10">Explore All Products</span>
              <svg 
                className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574] to-[#C97C5D] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {categories.map((cat, index) => (
            <div
              key={cat.name}
              className={`transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Link
                to={cat.path}
                className="group block h-full card-hover"
              >
                <div className={`h-full overflow-hidden rounded-3xl shadow-xl border border-gray-200/50 ${cat.color} hover:shadow-2xl transition-all duration-500 relative shimmer`}>
                  <div className="relative overflow-hidden h-64">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    <div className="absolute top-4 right-4 z-20">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-2xl">
                        {cat.icon}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 text-center relative">
                    <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#C97C5D] to-transparent" />
                    
                    <h3 className="font-bold text-2xl mb-3 text-gray-800 group-hover:text-[#C97C5D] transition-colors duration-300">
                      {cat.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {cat.desc}
                    </p>
                    
                    <div className="relative inline-flex items-center justify-center">
                      <span className="relative px-6 py-3 bg-white border-2 border-[#C97C5D] text-[#C97C5D] font-semibold rounded-full group-hover:bg-[#C97C5D] group-hover:text-white transition-all duration-300 flex items-center gap-2 overflow-hidden">
                        <span className="relative z-10">Explore</span>
                        <svg 
                          className="w-4 h-4 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div className="absolute inset-0 bg-[#C97C5D] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-10 fade-in" style={{ animationDelay: "0.3s" }}>
            Our Bakery in Numbers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Fresh Items Daily", value: "100+", icon: "🥐" },
              { label: "Happy Customers", value: "5k+", icon: "😊" },
              { label: "Years of Experience", value: "15+", icon: "🏆" },
              { label: "Awards Won", value: "12", icon: "⭐" }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/50 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl card-hover ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${800 + index * 200}ms`,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#C97C5D] to-[#D4A574] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

  

        <div className="mt-16 text-center pulse-slow">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <span className="text-2xl">👨‍🍳</span>
            <span className="text-gray-700 font-medium">
              Freshly baked goods available daily from 6 AM!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;