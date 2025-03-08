import os
import chromadb  # ChromaDB for vector storage
import fitz  # PyMuPDF for PDF parsing
import re
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from google.generativeai import configure, GenerativeModel
from flask_cors import CORS

# Flask app
app = Flask(__name__)
CORS(app)

# Configure Gemini API
configure(api_key="AIzaSyA0AFjEHmFR8XXrgCmL0eq3RleE84YXJoY")
gemini = GenerativeModel("gemini-2.0-flash")  

# Load embedding model
embedding_model = SentenceTransformer("paraphrase-MiniLM-L3-v2")

# Initialize ChromaDB client and collection
chroma_client = chromadb.PersistentClient(path="chroma_db")
resume_collection = chroma_client.get_or_create_collection("resume_embeddings")  # Store past resumes
best_practices_collection = chroma_client.get_or_create_collection("resume_best_practices")  # Best practices

# -------- Helper Functions --------

def extract_text_from_pdf(file):
    """Extracts text from a PDF file."""
    doc = fitz.open(stream=file.read(), filetype="pdf")
    text = []
    for page in doc:
        text.append(page.get_text("text"))
    return "\n".join(text).strip()

def extract_details(text):
    """Extracts Name, Email, and Phone using Regex."""
    email_match = re.search(r"[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    email = email_match.group(0) if email_match else None

    phone_match = re.search(r"\b\d{10,12}\b", text)
    phone = phone_match.group(0) if phone_match else None

    words = text.split()
    name = None
    if len(words) > 1 and words[0][0].isupper() and words[1][0].isupper():
        name = words[0] + " " + words[1]

    return {"name": name, "email": email, "phone": phone}

def store_resume_in_chroma(resume_text):
    """Stores the resume text embedding in ChromaDB for future retrieval."""
    embedding = embedding_model.encode(resume_text).tolist()
    
    # Use hash of resume text as unique ID
    resume_id = str(hash(resume_text))

    resume_collection.add(
        ids=[resume_id],
        embeddings=[embedding],
        documents=[resume_text]
    )

def retrieve_similar_resumes(resume_text, top_n=3):
    """Retrieves similar past resumes from ChromaDB."""
    query_embedding = embedding_model.encode(resume_text).tolist()
    results = resume_collection.query(query_embeddings=[query_embedding], n_results=top_n)
    return results["documents"][0] if results["documents"] else []

def retrieve_best_practices(job_description):
    """Retrieves relevant resume best practices using ChromaDB."""
    query_embedding = embedding_model.encode(job_description).tolist()
    results = best_practices_collection.query(query_embeddings=[query_embedding], n_results=3)
    return results["documents"][0] if results["documents"] else []

def generate_resume_suggestions(resume_text, job_description):
    """Generates resume improvement suggestions using retrieved past resumes and best practices."""
    
    # Retrieve similar past resumes
    similar_resumes = retrieve_similar_resumes(resume_text)
    similar_resumes_text = "\n\n---\n\n".join(similar_resumes) if similar_resumes else "No similar resumes found."

    # Retrieve best practices
    best_practices = retrieve_best_practices(job_description)
    best_practices_text = "\n".join(best_practices) if best_practices else "General best practices include clear formatting, quantified achievements, and relevant keywords."

    prompt_suggestions = f"""
    Analyze the following resume based on the job description and provide actionable suggestions for improvement. 
    Identify areas that need better formatting, relevant keyword inclusion, improved clarity, and overall readability. 
    Avoid including any scores in your response.
    Please format all suggestions like this:
    **Heading 1**

    Description text.
    
    * Bullet point 1
    * Bullet point 2

    **Heading 2**

    More description text.
    
    Resume:
    {resume_text}
    
    Job Description:
    {job_description}
    
    Similar Past Resumes:
    {similar_resumes_text}
    
    Best Practices:
    {best_practices_text}
    """
    
    prompt_scores = f"""
    Evaluate the following resume and provide a score (out of 10) for each category:
    - ATS Parse Rate
    - Repetition
    - Spelling & Grammar
    - Resume Length
    - Hard Skills
    - Soft Skills
    - Design & Readability
    
    Provide the scores in this format:
    ATS Parse Rate: X/10
    Repetition: X/10
    Spelling & Grammar: X/10
    Resume Length: X/10
    Hard Skills: X/10
    Soft Skills: X/10
    Design & Readability: X/10
    
    Resume:
    {resume_text}
    """
    
    suggestions_response = gemini.generate_content(prompt_suggestions)
    scores_response = gemini.generate_content(prompt_scores)
    
    suggestions = suggestions_response.text if suggestions_response else "No suggestions available."
    scores_text = scores_response.text if scores_response else ""
    
    scores = {
        "ATS Parse Rate": 0,
        "Repetition": 0,
        "Spelling & Grammar": 0,
        "Resume Length": 0,
        "Hard Skills": 0,
        "Soft Skills": 0,
        "Design & Readability": 0,
    }
    
    for key in scores.keys():
        match = re.search(rf"{key}: (\d+)/10", scores_text)
        if match:
            scores[key] = int(match.group(1))
    
    return suggestions, scores

# -------- Flask API Endpoints --------

@app.route("/analyze", methods=["POST"])
def analyze_resume():
    """API endpoint to analyze a resume and provide feedback."""
    if "resume" not in request.files or "job_description" not in request.form:
        return jsonify({"error": "Resume and Job Description are required"}), 400

    file = request.files["resume"]
    job_description = request.form["job_description"]

    resume_text = extract_text_from_pdf(file)
    details = extract_details(resume_text)

    # Store resume in ChromaDB for future retrieval
    store_resume_in_chroma(resume_text)

    suggestions, scores = generate_resume_suggestions(resume_text, job_description)

    return jsonify({
        "resume_details": details,
        "suggestions": suggestions,
        "scores": scores
    })

if __name__ == "__main__":
    app.run(debug=True)
