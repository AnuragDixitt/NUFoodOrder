import { useState, useEffect } from "react";
import backgroundImage1 from '../images/side-view-vegetable.jpg';
import fast from '../images/pf_logo.png';
import food from '../images/food-transformed.jpeg';
import free from '../images/free.jpg';
import hy from '../images/hyg-transformed.jpeg';
import di from '../images/dining.png';
import backgroundImage2 from '../images/chinese.jpg';
import backgroundImage3 from '../images/side-view-rice.jpg';

const backgrounds = [backgroundImage1, backgroundImage2, backgroundImage3];

const Home = (props) => {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return <div style={{ 
  minHeight: "1200px",
   }}>
  <div style={{backgroundImage: `url(${backgrounds[bgIndex]})`,
   backgroundSize: "cover",
   backgroundPosition: "center",
   minHeight: "800px",
   position: "relative",
   animation: "swipe 0.5s linear infinite"
   }}>
    <div style={{ 
      position: "absolute",
      top: 0,
      left: 0,
      height:"100%",
      width:"100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)" ,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontSize: "7vw",
      margin:"0 auto",
      fontFamily: "cursive",// Add this property to set the background color to semi-transparent black
   }}>NuOrder 
   
   </div>

   <div 
   style={{ 
    paddingTop:125,
    position: "absolute",
    top: 0,
    left: 0,
    height:"100%",
    width:"100%",
    // backgroundColor: "rgba(0, 0, 0, 0.5)" ,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontSize: "2vw",
    margin:"0 auto",
    fontFamily: "cursive",// Add this property to set the background color to semi-transparent black
 }}>
   <br /><h4>NIIT's own food ordering app</h4>
   </div>

    </div>
    <div style={{ 
      position: "absolute",
      left: 0,
      right: 0,
      fontSize: "3vw",
      textAlign: "center",
      color:"black",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)"
       }}>Our Services
     </div>
     <div style={{ 
      backgroundColor: "black",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      width: "100%",
      position: "absolute",
      top: "calc(1000px + 20px)",
      bottom: 0,
      left: 0,
      right: 0,
      height:"400px"
    }}><img src={fast} style={{ width: "15%",height:"200px",padding:"0px 0px 0px 40px"}}/>
    <img src={food} style={{ width: "15%",height:"300px",padding:"0px 0px 0px 40px"}}/>
    <img src={hy} style={{ width: "15%",height:"300px",padding:"0px 0px 0px 40px"}}/>
    <img src={di} style={{ width: "15%",height:"300px",padding:"0px 0px 0px 40px"}}/>
    <img src={free} style={{ width: "15%",height:"380px",padding:"0px 40px 0px 0px"}} />
    
  </div>
     
  </div> ;
};

export default Home;
