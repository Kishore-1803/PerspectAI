const BASE_URL = "http://localhost:5000"; // Adjust this if your backend runs on a different port

export const analyzeResume = async (file, jobDescription) => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("job_description", jobDescription);

  try {
    const response = await fetch(`${BASE_URL}/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to analyze resume");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { error: error.message };
  }
};
