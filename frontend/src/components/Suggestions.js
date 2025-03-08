import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, List, ListItem, Divider, Box, Button, Chip} from "@mui/material";
import {Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EqualizerIcon from "@mui/icons-material/Equalizer";

const formatSuggestions = (text) => {
  return text.split("\n").map((line, index) => {
    if (line.startsWith("**") && (line.endsWith("**") || line.includes("**"))) {
      let headingText = line.replace(/\*\*/g, "").trim();
      headingText = headingText
        .replace(/^(Heading|Section)\s*\d+\s*[:.-]?\s*/i, "")
        .replace(/^(Key Point|Point)\s*\d+\s*[:.-]?\s*/i, "")
        .trim();
      
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
        >
          <Typography 
            variant="h6" 
            color="primary" 
            sx={{ 
              mt: 3,
              mb: 1,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&::before": {
                content: '""',
                width: "3px",
                height: "20px",
                backgroundColor: "primary.main",
                borderRadius: "3px",
                marginRight: "8px"
              }
            }}
          >
            {headingText}
          </Typography>
        </motion.div>
      );
    } else if (line.startsWith("* ")) {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.03, duration: 0.3 }}
        >
          <ListItem 
            key={index} 
            sx={{ 
              pl: 2, 
              py: 0.7,
              "&::before": {
                content: '"•"',
                color: "primary.main",
                fontWeight: "bold",
                fontSize: "1.2rem",
                marginRight: "8px"
              }
            }}
          >
            {line.replace("* ", "")}
          </ListItem>
        </motion.div>
      );
    } else if (line.trim() !== "") {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.03, duration: 0.5 }}
        >
          <Typography key={index} variant="body1" sx={{ mt: 1, mb: 1 }}>
            {line}
          </Typography>
        </motion.div>
      );
    }
    return null;
  }).filter(Boolean);
};

const RatingDisplay = ({ score }) => {
  const stars = [];
  const maxStars = 5;
  const normalizedScore = (score / 10) * maxStars;
  
  for (let i = 1; i <= maxStars; i++) {
    if (i <= Math.floor(normalizedScore)) {
      stars.push(<StarIcon key={i} sx={{ color: "#FFD700" }} />);
    } else if (i === Math.ceil(normalizedScore) && !Number.isInteger(normalizedScore)) {
      stars.push(<StarHalfIcon key={i} sx={{ color: "#FFD700" }} />);
    } else {
      stars.push(<StarOutlineIcon key={i} sx={{ color: "#CCCCCC" }} />);
    }
  }
  
  return <Box sx={{ display: "flex" }}>{stars}</Box>;
};

const getColor = (score) => {
  if (score >= 8) return "#4CAF50"; 
  if (score >= 6) return "#2196F3"; 
  if (score >= 4) return "#FF9800"; 
  return "#F44336"; // Red
};

const CustomLegend = ({ payload }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 1, mt: 2 }}>
      {payload.map((entry, index) => (
        <Chip
          key={index}
          label={entry.value}
          sx={{
            backgroundColor: `${entry.color}20`,
            color: entry.color,
            fontWeight: "500",
          }}
        />
      ))}
    </Box>
  );
};

const Suggestions = ({ details, suggestions, scores }) => {
  const [animate, setAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState("radar");

  useEffect(() => {
    setAnimate(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [details, suggestions]);

  if (!suggestions) return null;

  const scoreData = Object.entries(scores || {}).map(([key, value], index) => ({
    category: key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
    score: value,
    fill: getColor(value),
    fullMark: 10,
  }));

  const overallScore = scoreData.length 
    ? (scoreData.reduce((sum, item) => sum + item.score, 0) / scoreData.length).toFixed(1)
    : "N/A";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const CircleGauge = ({ score, category, color }) => {
    const percentage = score * 10; 
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, position: 'relative' }}>
        <motion.svg width="100" height="100" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
          />
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill={color}
          >
            {score}
          </text>
        </motion.svg>
        <Typography variant="body2" sx={{ textAlign: 'center', mt: 1, fontWeight: 'medium', maxWidth: '90px' }}>
          {category}
        </Typography>
      </Box>
    );
  };

  return (
    <motion.div 
      initial="hidden"
      animate={animate ? "visible" : "hidden"}
      variants={containerVariants}
      style={{ padding: "10px", maxWidth: "900px", margin: "auto" }}
    >
      <motion.div variants={itemVariants}>
        <Card 
          sx={{ 
            mb: 3, 
            borderRadius: "12px",
            overflow: "hidden",
            background: "linear-gradient(to right, #1e3c72, #2a5298)",
            boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          }}
        >
          <CardContent sx={{ p: 3, color: "white" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <DescriptionIcon sx={{ fontSize: 32, mr: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Resume Analysis for {details?.name || "N/A"}
              </Typography>
            </Box>
            
            <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)", my: 2 }} />
            
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between" }}>
              <Typography sx={{ mb: { xs: 1, sm: 0 } }}><strong>Email:</strong> {details?.email || "N/A"}</Typography>
              <Typography><strong>Phone:</strong> {details?.phone || "N/A"}</Typography>
              
              {overallScore !== "N/A" && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography><strong>Overall Score:</strong></Typography>
                  <Chip 
                    label={`${overallScore}/10`} 
                    sx={{ 
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: "bold"
                    }} 
                  />
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
      {scores && Object.keys(scores).length > 0 && (
        <motion.div variants={itemVariants}>
          <Card 
            sx={{ 
              mb: 3, 
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: "#f8f9fa",
                borderBottom: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AssessmentIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Resume Scores
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button 
                    variant={activeTab === "radar" ? "contained" : "outlined"}
                    size="small"
                    startIcon={<EqualizerIcon />}
                    onClick={() => setActiveTab("radar")}
                    sx={{ borderRadius: "20px" }}
                  >
                    Radar
                  </Button>
                  <Button 
                    variant={activeTab === "circular" ? "contained" : "outlined"}
                    size="small"
                    startIcon={<AssessmentIcon />}
                    onClick={() => setActiveTab("circular")}
                    sx={{ borderRadius: "20px" }}
                  >
                    Gauge
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ p: 3 }}>
                {activeTab === "radar" ? (
                  <Box sx={{ width: "100%", height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={scoreData}>
                        <PolarGrid stroke="#e0e0e0" />
                        <PolarAngleAxis dataKey="category" tick={{ fill: "#666", fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 10]} tickCount={6} />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                          animationBegin={0}
                          animationDuration={1500}
                          animationEasing="ease-out"
                        />
                        <Legend content={<CustomLegend />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Box>
                    <Box sx={{ 
                      display: "flex", 
                      flexWrap: "wrap", 
                      justifyContent: "center", 
                      alignItems: "center",
                      p: 2 
                    }}>
                      {scoreData.map((item, index) => (
                        <CircleGauge 
                          key={index} 
                          score={item.score} 
                          category={item.category} 
                          color={item.fill} 
                        />
                      ))}
                    </Box>
                    
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                      <Card sx={{ 
                        p: 2, 
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)", 
                        borderRadius: "16px",
                        background: "linear-gradient(to right, #1e3c72, #2a5298)",
                      }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <CircleGauge 
                            score={parseFloat(overallScore)} 
                            category="Overall" 
                            color="#FFD700"
                          />
                          <Box sx={{ color: "white" }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Overall Rating</Typography>
                            <Typography variant="body2">
                              Based on {scoreData.length} different criteria
                            </Typography>
                            <RatingDisplay score={parseFloat(overallScore)} />
                          </Box>
                        </Box>
                      </Card>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <Card 
          sx={{ 
            p: 0, 
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ 
              p: 2, 
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              gap: 1
            }}>
              <TipsAndUpdatesIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Improvement Suggestions
              </Typography>
            </Box>
            
            <Box sx={{ p: 3 }}>
              <List sx={{ p: 0 }}>{formatSuggestions(suggestions)}</List>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginTop: "20px",
          gap: "12px"
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="contained" 
            sx={{ 
              borderRadius: "50px",
              px: 3,
              py: 1,
              background: "linear-gradient(90deg, #1e3c72, #2a5298)",
              boxShadow: "0 4px 10px rgba(30, 60, 114, 0.3)",
            }}
            onClick={() => window.print()}
          >
            Save Results
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="outlined" 
            sx={{ 
              borderRadius: "50px",
              px: 3,
              py: 1,
              borderColor: "#1e3c72",
              color: "#1e3c72"
            }}
            onClick={() => window.location.reload()}
          >
            Start Over
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Suggestions;