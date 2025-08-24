from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv
import sys
import uuid

# Add current directory to path to ensure imports work
sys.path.append(os.path.dirname(os.path.realpath(__file__)))

# Load environment variables and print paths for debugging
print(f"Current working directory: {os.getcwd()}")
print(f"Looking for .env file in: {os.path.join(os.getcwd(), '.env')}")
load_dotenv(verbose=True)  # This will show where it's looking for the .env file

# Print environment variables for debugging
print(f"GROK_API_KEY exists: {'Yes' if os.getenv('GROK_API_KEY') else 'No'}")
if os.getenv('GROK_API_KEY'):
    print(f"GROK_API_KEY starts with: {os.getenv('GROK_API_KEY')[:8]}...")

# Import the service after environment variables are loaded
from services.grok_service import generate_quiz_question

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "default-secret-key")

# MongoDB configuration
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb+srv://yedlalikithareddy2104:Likitha0102@cluster.ihmt8jh.mongodb.net/quiz_db")
mongo = PyMongo(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/start_quiz", methods=["POST"])
def start_quiz():
    # Create a unique session ID for the quiz attempt
    session["quiz_id"] = str(uuid.uuid4())
    session["user_name"] = request.form.get("user_name", "Anonymous")
    session["score"] = 0
    session["question_count"] = 0
    session["max_questions"] = int(request.form.get("num_questions", 10))
    
    # Redirect to the quiz page
    return redirect(url_for("quiz"))

@app.route("/quiz")
def quiz():
    # Check if quiz is in progress
    if "quiz_id" not in session:
        return redirect(url_for("index"))
    
    # Check if we've reached the maximum number of questions
    if session["question_count"] >= session["max_questions"]:
        return redirect(url_for("results"))
    
    return render_template("quiz.html", 
                          question_number=session["question_count"] + 1,
                          total_questions=session["max_questions"])

@app.route("/get_question")
def get_question():
    # Generate a new question using Grok API
    question_data = generate_quiz_question()
    session["current_question"] = question_data
    return jsonify(question_data)

@app.route("/submit_answer", methods=["POST"])
def submit_answer():
    data = request.get_json()
    user_answer = data.get("answer")
    correct_answer = session["current_question"]["correct_answer"]
    
    is_correct = user_answer.lower() == correct_answer.lower()
    
    if is_correct:
        session["score"] = session.get("score", 0) + 1
    
    # Increment question count
    session["question_count"] = session.get("question_count", 0) + 1
    
    # Store answer in database
    mongo.db.quiz_attempts.update_one(
        {"quiz_id": session["quiz_id"]},
        {
            "$set": {
                "user_name": session["user_name"],
                "total_questions": session["max_questions"]
            },
            "$push": {
                "answers": {
                    "question": session["current_question"]["question"],
                    "user_answer": user_answer,
                    "correct_answer": correct_answer,
                    "is_correct": is_correct,
                    "explanation": session["current_question"].get("explanation", "")
                }
            },
            "$inc": {"score": 1 if is_correct else 0}
        },
        upsert=True
    )
    
    return jsonify({
        "is_correct": is_correct, 
        "correct_answer": correct_answer,
        "explanation": session["current_question"].get("explanation", ""),
        "finished": session["question_count"] >= session["max_questions"]
    })

@app.route("/results")
def results():
    # Get quiz results from database
    quiz_result = mongo.db.quiz_attempts.find_one({"quiz_id": session.get("quiz_id")})
    
    if not quiz_result:
        return redirect(url_for("index"))
    
    # Get top scores
    top_scores = list(mongo.db.quiz_attempts.find().sort("score", -1).limit(10))
    
    # Clear session to end quiz
    session.pop("quiz_id", None)
    session.pop("current_question", None)
    
    return render_template("results.html", 
                          result=quiz_result,
                          top_scores=top_scores)

@app.route("/leaderboard")
def leaderboard():
    top_scores = list(mongo.db.quiz_attempts.find().sort("score", -1).limit(10))
    return render_template("leaderboard.html", top_scores=top_scores)

@app.route("/health")
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy", "service": "Grok Quiz App"})

if __name__ == "__main__":
    # Check if we're using a currently supported model
    grok_model = os.getenv("GROK_MODEL", "")
    if grok_model == "mixtral-8x7b-32768":
        print("WARNING: Using decommissioned model 'mixtral-8x7b-32768'!")
        print("Update your .env file to use a currently supported model like 'llama3-70b-8192'")
    
    # Check if Grok API key is set
    if not os.getenv("GROK_API_KEY"):
        print("WARNING: GROK_API_KEY not found in environment variables!")
        print("Please set your Grok API key in the .env file")
    
    app.run(debug=True)