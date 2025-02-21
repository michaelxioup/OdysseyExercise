import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductCarousel = () => {
    const [popularProducts, setPopularProducts] = useState([]);
    const swiperRef = useRef(null);
    const navigate = useNavigate();

      useEffect(() => {
        fetchProducts();
      }, []); 

      // Swiper has an issue with Resizing dev tool of React as such I set up this Resizing function to update the slides per view when changing resolution.
      useEffect(() => {
        const handleResize = () => {
          if (swiperRef.current) {
            swiperRef.current.swiper.update(); // Force update for resizing with dev tools 
          }
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    

    const fetchProducts = async () => {
        const response = await axios.get("http://localhost:5000/popularProducts");
        setPopularProducts(response.data);
      };

  return (
    <div className="carousel-container">
      <h2>🔥 Popular Products</h2>
      {/* Used Swiper Since i am familiar with it to design a popular product carousel */}
      <Swiper 
      ref={swiperRef}
     modules={[Navigation, Pagination, Autoplay]}
    spaceBetween={20}
    slidesPerView={1} // Default for extra small screens
    navigation
    pagination={{ clickable: true }}
    autoplay={{ delay: 3000 }}
    breakpoints={{
        320: { slidesPerView: 1 },  // Very small screens
        480: { slidesPerView: 1 },  // Small phones
        600: { slidesPerView: 2 },  // Larger phones
        768: { slidesPerView: 2 },  // Tablets
        1024: { slidesPerView: 3 }, // Laptops
    }}
    >

        {popularProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="product-card-carousel"  onClick={() => navigate("/products", { state: { selectedProduct: product.name } })}>
              {product.price < 800 && <span className="discount-badge">💰 Sale</span>}
              <img src={product.image} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="view-more-btn"  onClick={() => navigate("/products")}>View More →</button>
    </div>
  );
};

export default ProductCarousel;
