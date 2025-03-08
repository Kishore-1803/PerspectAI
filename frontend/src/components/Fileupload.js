import React, { useState, useRef } from "react";
import { Button, TextField, Box, Typography, Paper, Chip, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArticleIcon from "@mui/icons-material/Article";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";

const FileUpload = ({ onAnalyze }) => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleAnalyze = () => {
    if (file && jobDescription.trim()) {
      onAnalyze(file, jobDescription);
    } else {
      alert("Please upload a resume and enter a job description.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
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

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(30, 60, 114, 0.2)",
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
        <motion.div variants={itemVariants}>
          <Typography variant="h6" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            Upload Resume & Job Description
            <Tooltip title="For best results, upload a PDF resume and enter the full job description">
              <InfoIcon fontSize="small" sx={{ color: "primary.light", cursor: "help" }} />
            </Tooltip>
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
              border: `2px dashed ${dragActive ? "#1e3c72" : "rgba(0, 0, 0, 0.2)"}`,
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backgroundColor: dragActive ? "rgba(30, 60, 114, 0.05)" : "transparent",
              "&:hover": {
                borderColor: "#1e3c72",
                backgroundColor: "rgba(30, 60, 114, 0.05)",
              },
              height: "150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={handleButtonClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            
            {file ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CheckCircleIcon sx={{ color: "success.main", fontSize: "2.5rem", mb: 1 }} />
                <Typography variant="body1" fontWeight="medium">
                  {file.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(file.size / 1024).toFixed(1)} KB - Click to change
                </Typography>
              </Box>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: "3rem", color: "#1e3c72", mb: 1 }} />
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Drag and drop your PDF resume here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or click to browse files
                </Typography>
              </>
            )}
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <TextField
            label="Job Description"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here to get tailored suggestions..."
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#1e3c72",
                },
                borderRadius: "12px",
              },
            }}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAnalyze}
                disabled={!file || !jobDescription.trim()}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: "bold",
                  borderRadius: "50px",
                  background: "linear-gradient(90deg, #1e3c72, #2a5298)",
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: "0px 4px 10px rgba(30, 60, 114, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #1e3c72, #2a5298)",
                  },
                  "&:disabled": {
                    background: "rgba(0, 0, 0, 0.12)",
                  }
                }}
              >
                Analyze Resume
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default FileUpload;