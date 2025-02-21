import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FormGroup, FormControlLabel, Checkbox, Box, Slider, Typography, TextField, Select, MenuItem } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom"; 

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("price-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());
  const [priceRange, setPriceRange] = useState([0, 1799]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if(location.state?.selectedProduct) {
      setSearchQuery(location.state.selectedProduct) // Sets SearchQuery based on location state from the welcome page.
    } 
  },[location.state])

  useEffect(() => {
    if (searchQuery === "") {
      window.history.replaceState({}, document.title); // Clears location state 
    }
  }, [searchQuery]);

  function getItemsPerPage() {
    if (window.innerWidth <= 700) return 4; 
    if (window.innerWidth <= 1024) return 6; 
    if (window.innerWidth <= 1200) return 9; 
    return 18; 
  }

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
      setCurrentPage(1);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const fetchProducts = async () => {
    const response = await axios.get("http://localhost:5000/products");
    setProducts(response.data);
    setFilteredProducts(response.data);
  };

  // **Apply filtering and sorting correctly**
  const filterAndSortProducts = useCallback(() => {
    let updatedProducts = [...products];

    // 1️⃣ **Search by Name**
    if (searchQuery) {
      updatedProducts = updatedProducts.filter(product =>
        product.name.toLowerCase().replace(/\s+/g, '').includes(searchQuery.toLowerCase().replace(/\s+/g, ''))
      );
    }

    // 2️⃣ **Filter by Price Range**
    updatedProducts = updatedProducts.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // 3️⃣ **Filter by Category**
    if (selectedCategories.length > 0) {
      updatedProducts = updatedProducts.filter(product =>
        selectedCategories.includes(product.name)
      );
    }

    // 4️⃣ **Filter by Availability**
    if (availabilityFilter) {
      updatedProducts = updatedProducts.filter(product => product.availability);
    }

    // 5️⃣ **Sort Items**
    if (sortCriteria === "price-asc") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortCriteria === "price-desc") {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortCriteria === "name-asc") {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortCriteria === "name-desc") {
      updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(updatedProducts);
    setCurrentPage(1);
  }, [searchQuery, priceRange, selectedCategories, sortCriteria, availabilityFilter, products]);

  useEffect(() => {
    filterAndSortProducts();
  }, [filterAndSortProducts]);

  // **Handle Category Selection Correctly**
  const handleCategoryChange = (category) => {
    setSelectedCategories(prevCategories =>
      prevCategories.includes(category)
        ? prevCategories.filter(c => c !== category)
        : [...prevCategories, category]
    );
  };

  // this is for the animation used a library i am familiar with to handle the animation and this is a standard variant for a fading effect
  const productGridVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // **Pagination Logic**
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const itemCount = filteredProducts.length;

  // Smaller gridclass for the amount of items to be shown i thought to do it this way due to mobile view having the 
  // filters i wanted to keep the user close to the filters rather than incorporate infinite scrolling in this scenario.
  const gridClass = itemCount <= 5 ? 'very-few-items' : itemCount <= 12 ? 'few-items' : '';
  const isMobile = useMediaQuery('(max-width: 600px)');

  return (
    <div>
    <h1>Products</h1>
    <div className="Products">
 
    {/*Here is used UI material as i am familiar with it and their components were fitting to the exercise. */}
      <Box className="Filter">
      {/* 🔍 Search Bar */}
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* 📌 Sorting Options */}
      <Select
        value={sortCriteria}
        onChange={(e) => setSortCriteria(e.target.value)}
      >
        <MenuItem value="price-asc">Price: Low to High</MenuItem>
        <MenuItem value="price-desc">Price: High to Low</MenuItem>
        <MenuItem value="name-asc">Name: A-Z</MenuItem>
        <MenuItem value="name-desc">Name: Z-A</MenuItem>
      </Select>

      {/* 💰 Price Range Filter */}
     
        <Typography>Price Range:</Typography>
        <Slider
          value={priceRange}
          onChange={(e, newValue) => setPriceRange(newValue)}
          valueLabelDisplay="auto"
          max={1799}
          min={0}
        />


      {/* 🏷️ Category Filters */}
      <FormGroup>
        <Typography>Laptop Brands:</Typography>
        {["Performance Laptop", "Workstation Laptop", "Ultrabook Laptop", "Business Laptop", "Gaming Laptop"].map(category => (
          <FormControlLabel
            key={category}
            control={<Checkbox onChange={() => handleCategoryChange(category)} />}
            label={category}
          />
        ))}
      </FormGroup>

      <FormGroup>
        <Typography>Smartphone Brands:</Typography>
        {["Photography Smartphone", "Flagship Smartphone", "Premium Smartphone", "Compact Smartphone", "Budget Smartphone"].map(category => (
          <FormControlLabel
            key={category}
            control={<Checkbox onChange={() => handleCategoryChange(category)} />}
            label={category}
          />
        ))}
      </FormGroup>

      <FormGroup>
        <Typography>Headphone Brands:</Typography>
        {["Wireless Headphones", "Noise Cancelling Headphones", "Studio Headphones", "Earbuds Pro", "Over-Ear Headphones"].map(category => (
          <FormControlLabel
            key={category}
            control={<Checkbox onChange={() => handleCategoryChange(category)} />}
            label={category}
          />
        ))}
      </FormGroup>

      {/* ✅ Availability Filter */}
      <Typography>Availability:</Typography>
      <FormControlLabel
        control={<Checkbox checked={availabilityFilter} onChange={() => setAvailabilityFilter(!availabilityFilter)} />}
        label="In Stock Only"
      />
      </Box>
      {/* 🛍️ Product List */}
      <motion.div className={`product-grid ${gridClass}`} initial="hidden" animate="visible">
  <AnimatePresence>
    {currentItems.map((product) => (
      <motion.div 
        key={product.id} 
        className="product-card"
        variants={productGridVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      >
        <img src={product.image} alt={product.name} className="images" />
        <h3>{product.name}</h3>
        <p>Price: ${product.price}</p>
        <p>{product.availability ? "In Stock" : "Out of Stock"}</p>
      </motion.div>
    ))}
  </AnimatePresence>
</motion.div>

      {/* ⏭️ Pagination Controls with smoothing animation effect to the top of the page when changing pages. */}

    </div>
    <div className="pagination">
        <button  onClick={() => { 
    window.scrollTo({ top: 0, behavior: "smooth" }); 
    setTimeout(() => setCurrentPage((prev) => Math.max(prev - 1, 1)), 500); 
  }} 
  disabled={currentPage === 1}>
          Previous
        </button>
        {!isMobile && <span> Page {currentPage} of {totalPages} </span>}
        <button onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setTimeout(() => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), 500); }}
         disabled={currentPage === totalPages || totalPages === 0}   >
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;
