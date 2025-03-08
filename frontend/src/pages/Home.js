import React, { useEffect } from "react";
import { Typography, Button, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../Home.css";

const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.random() * 30 + 10;
      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * window.innerHeight;
      const opacity = Math.random() * 0.2 + 0.1;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      particle.style.opacity = opacity.toString();
      
      document.getElementById('particles-container').appendChild(particle);
      
      const duration = Math.random() * 15000 + 15000;
      
      setTimeout(() => {
        particle.remove();
      }, duration * 2);
    };
    
    for (let i = 0; i < 15; i++) {
      createParticle();
    }
    
    const interval = setInterval(createParticle, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      } 
    }
  };
  
  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delay: 0.5, 
        duration: 0.8 
      } 
    }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 1, 
        duration: 0.5,
        type: "spring",
        stiffness: 200
      } 
    },
    hover: { 
      scale: 1.1,
      boxShadow: "0px 0px 20px rgba(255, 215, 0, 0.6)",
      transition: { 
        duration: 0.3 
      } 
    },
    tap: { 
      scale: 0.95,
      boxShadow: "0px 0px 10px rgba(255, 215, 0, 0.4)",
    }
  };

  return (
    <Box className="home-container">
      <Box id="particles-container" className="particles-container" />

      <motion.div
        initial="hidden"
        animate="visible"
        className="content-wrapper"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Paper elevation={10} className="paper-container">
            <motion.div variants={titleVariants}>
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                className="title"
              >
                PerspectAI
              </Typography>
            </motion.div>
            
            <motion.div variants={subtitleVariants}>
              <Typography 
                variant="h6" 
                className="subtitle"
              >
                Upload your resume and get AI-powered suggestions to optimize your chances of landing your dream job!
              </Typography>
            </motion.div>
            
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="contained"
                className="get-started-button"
                onClick={() => navigate("/analyze")}
              >
                Get Started 🚀
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <Typography 
                variant="body2" 
                className="footer-text"
              >
                Powered by advanced AI technology
              </Typography>
            </motion.div>
          </Paper>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default Home;