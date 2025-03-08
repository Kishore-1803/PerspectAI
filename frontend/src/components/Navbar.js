import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button, Container, useScrollTrigger, Slide, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { motion} from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HomeIcon from "@mui/icons-material/Home";

// Hide navbar on scroll down
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const navItems = [
    { name: "Home", path: "/", icon: <HomeIcon fontSize="small" /> },
    { name: "Analyze", path: "/analyze", icon: <AssessmentIcon fontSize="small" /> },
  ];

  const logoVariants = {
    normal: { scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={scrolled ? 4 : 0}
          sx={{
            background: scrolled 
              ? "linear-gradient(135deg, #0F2027, #203A43, #2C5364)"
              : "linear-gradient(135deg, rgba(15, 32, 39, 0.95), rgba(32, 58, 67, 0.95), rgba(44, 83, 100, 0.95))",
            boxShadow: scrolled ? "0px 4px 10px rgba(0, 0, 0, 0.3)" : "none",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
          }}
        >
          <Container maxWidth="lg">
            <Toolbar sx={{ py: 1, justifyContent: "space-between" }}>
              {/* Logo */}
              <motion.div
                initial="normal"
                whileHover="hover"
                variants={logoVariants}
              >
                <RouterLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #FFD700, #FF8C00)",
                        boxShadow: "0 2px 10px rgba(255, 215, 0, 0.3)",
                      }}
                    >
                      <AssessmentIcon sx={{ color: "white" }} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        flexGrow: 1,
                        fontWeight: "bold",
                        background: "linear-gradient(45deg, #FFD700, #FF8C00)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "0.5px",
                      }}
                    >
                      PerspectAI
                    </Typography>
                  </Box>
                </RouterLink>
              </motion.div>

              {/* Desktop Menu */}
              <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <Button
                      component={RouterLink}
                      to={item.path}
                      key={item.name}
                      sx={{
                        color: isActive ? "#FFD700" : "white",
                        mx: 1,
                        fontWeight: isActive ? "bold" : "normal",
                        position: "relative",
                        "&::after": isActive ? {
                          content: '""',
                          position: "absolute",
                          bottom: "5px",
                          left: "25%",
                          width: "50%",
                          height: "3px",
                          backgroundColor: "#FFD700",
                          borderRadius: "3px",
                        } : {},
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                        transition: "all 0.3s",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {item.icon}
                        {item.name}
                      </Box>
                    </Button>
                  );
                })}

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={RouterLink}
                    to="/analyze"
                    variant="contained"
                    sx={{
                      ml: 2,
                      backgroundColor: "rgba(255, 215, 0, 0.8)",
                      color: "#0F2027",
                      fontWeight: "bold",
                      borderRadius: "50px",
                      "&:hover": {
                        backgroundColor: "#FFD700",
                      },
                      px: 3,
                    }}
                  >
                    Get Started
                  </Button>
                </motion.div>
              </Box>

              {/* Mobile Menu Button */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleMobileMenuToggle}
                sx={{ display: { md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{
          sx: {
            width: 250,
            background: "linear-gradient(135deg, #0F2027, #203A43, #2C5364)",
            color: "white",
          }
        }}
      >
        <Box
          sx={{
            py: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3, mt: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(45deg, #FFD700, #FF8C00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI Resume Analyzer
            </Typography>
          </Box>

          <List>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <ListItem
                  key={item.name}
                  component={RouterLink}
                  to={item.path}
                  onClick={handleMobileMenuToggle}
                  sx={{
                    backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
                    borderRadius: "8px",
                    mb: 1,
                    mx: 2,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                    },
                  }}
                >
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    width: "100%",
                    color: isActive ? "#FFD700" : "white",
                  }}>
                    {item.icon}
                    <ListItemText primary={item.name} sx={{ ml: 2 }} />
                  </Box>
                </ListItem>
              );
            })}
          </List>

          <Box sx={{ mt: "auto", mx: "auto", mb: 3 }}>
            <Button
              component={RouterLink}
              to="/analyze"
              variant="contained"
              fullWidth
              onClick={handleMobileMenuToggle}
              sx={{
                backgroundColor: "#FFD700",
                color: "#0F2027",
                fontWeight: "bold",
                borderRadius: "50px",
                "&:hover": {
                  backgroundColor: "#FFC107",
                },
                px: 3,
                mx: 2,
                width: "80%",
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Drawer>
      
      {/* Toolbar to prevent content from going under fixed AppBar */}
      <Toolbar />
    </>
  );
};

export default Navbar;