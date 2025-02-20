import React from "react";
import {  Box, Typography } from "@mui/material";
import ProductCarousel from "./popularProducts";

const Home = () => {

    return (
      <div className="welcome-container">
        <Box >
        <h1>Welcome</h1>
          <Typography variant="h2" className={"title"}>Welcome to TechStore!</Typography>
          <Typography variant="h5" className={"small-title"}>
            Discover the latest gadgets and accessories at unbeatable prices.
          </Typography>
          <Typography variant="h5" className={"smaller-title"}>
            Discover the latest gadgets
          </Typography>
          <Typography variant="h5" className={"smaller-title"}>
       and accessories at unbeatable prices.
          </Typography>
          <ProductCarousel/>
        </Box>
      </div>
  );
};

export default Home;
