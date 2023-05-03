import { useState, useEffect } from "react";
import backgroundImage from "./flat.jpg";
const Home = (props) => {

  return <div style={{ backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "93.9vh",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  color: "white",
  fontSize: "6vw",
  textShadow:"8px 8px 8px rgba(0, 0, 0, 0.5)",
  paddingRight:"35%",
  fontFamily: "cursive",
  
   }}>Welcome to NuOrder</div>;
};

export default Home;
