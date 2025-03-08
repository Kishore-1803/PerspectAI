import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Box, CircularProgress,Stepper, Step, StepLabel } from "@mui/material";
import FileUpload from "../components/Fileupload";
import Suggestions from "../components/Suggestions";
import { motion, AnimatePresence } from "framer-motion";

const Analyze = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = ['Upload Resume', 'AI Processing', 'Review Results'];

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          const increment = Math.random() * (20 - prevProgress / 5);
          const newProgress = prevProgress + increment;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);
      
      setActiveStep(1);
    } else if (analysis) {
      setProgress(100);
      setActiveStep(2);
    } else {
      setProgress(0);
      setActiveStep(0);
    }

    return () => {
      clearInterval(timer);
    };
  }, [loading, analysis]);

  const handleAnalyze = async (file, jobDescription) => {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    try {
      setAnalysis(null);
      setLoading(true);

      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setTimeout(() => {
        setAnalysis(data);
        setLoading(false);
      }, 1000); 
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert(`Failed to analyze resume: ${error.message}`);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const backgroundAnimation = {
    initial: { 
      backgroundPosition: "0% 50%" 
    },
    animate: { 
      backgroundPosition: "100% 50%",
      transition: { 
        repeat: Infinity, 
        repeatType: "mirror", 
        duration: 15,
        ease: "linear"
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={backgroundAnimation}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0F2027, #203A43, #2C5364)",
        backgroundSize: "200% 100%",
        padding: "20px",
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Paper
            elevation={6}
            sx={{
              padding: "30px",
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.85)", 
              borderRadius: "15px",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(90deg, #FFD700, #FF8C00, #FFD700)",
                backgroundSize: "200% 100%",
                animation: "gradient-flow 3s linear infinite",
              },
              "@keyframes gradient-flow": {
                "0%": { backgroundPosition: "0% 50%" },
                "100%": { backgroundPosition: "200% 50%" },
              },
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: "#003366" }}>
              Analyze Your Resume
            </Typography>
            
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              Upload your resume and let AI provide tailored suggestions for improvement.
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            <AnimatePresence mode="wait">
              {!loading && !analysis && (
                <motion.div
                  key="upload"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={containerVariants}
                >
                  <motion.div variants={itemVariants}>
                    <FileUpload onAnalyze={handleAnalyze} />
                  </motion.div>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={containerVariants}
                  style={{ padding: "40px 20px" }}
                >
                  <motion.div variants={itemVariants}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
                        <CircularProgress 
                          variant="determinate" 
                          value={progress}
                          size={80}
                          thickness={4}
                          sx={{ color: "#FFD700" }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="caption" component="div" color="text.secondary" sx={{ fontSize: "1rem" }}>
                            {`${Math.round(progress)}%`}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ mt: 2, color: "#FFD700" }}>
                        Analyzing your resume...
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, color: "text.secondary", maxWidth: "60%", textAlign: "center" }}>
                        Our AI is carefully reviewing your resume and comparing it to the job description to provide tailored recommendations.
                      </Typography>
                    </Box>
                  </motion.div>
                </motion.div>
              )}

              {!loading && analysis && (
                <motion.div
                  key="results"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <Suggestions
                    details={analysis.resume_details}
                    suggestions={analysis.suggestions}
                    scores={analysis.scores || {}}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Paper>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default Analyze;