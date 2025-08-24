from datetime import datetime
from flask_pymongo import PyMongo

# This is a simple interface for the MongoDB user data
# We're not using a formal ORM since PyMongo handles document storage directly

class User:
    """User model for quiz participants"""
    
    def __init__(self, mongo_client):
        """Initialize with a PyMongo client"""
        self.db = mongo_client.db
    
    def create_user(self, username):
        """Create a new user in the database"""
        user_data = {
            "username": username,
            "created_at": datetime.utcnow(),
            "quiz_attempts": []
        }
        
        result = self.db.users.insert_one(user_data)
        return str(result.inserted_id)
    
    def get_user_by_username(self, username):
        """Get a user by username"""
        return self.db.users.find_one({"username": username})
    
    def add_quiz_attempt(self, username, quiz_id, score, total_questions):
        """Add a quiz attempt to a user's record"""
        quiz_attempt = {
            "quiz_id": quiz_id,
            "score": score,
            "total_questions": total_questions,
            "percentage": (score / total_questions) * 100 if total_questions > 0 else 0,
            "completed_at": datetime.utcnow()
        }
        
        self.db.users.update_one(
            {"username": username},
            {"$push": {"quiz_attempts": quiz_attempt}}
        )
        
    def get_user_stats(self, username):
        """Get statistics for a user"""
        user = self.db.users.find_one({"username": username})
        
        if not user or "quiz_attempts" not in user or not user["quiz_attempts"]:
            return {
                "total_quizzes": 0,
                "average_score": 0,
                "highest_score": 0,
                "total_questions_answered": 0
            }
        
        attempts = user["quiz_attempts"]
        total_quizzes = len(attempts)
        total_score = sum(attempt["score"] for attempt in attempts)
        total_questions = sum(attempt["total_questions"] for attempt in attempts)
        highest_score = max(attempt["percentage"] for attempt in attempts)
        
        return {
            "total_quizzes": total_quizzes,
            "average_score": total_score / total_questions * 100 if total_questions > 0 else 0,
            "highest_score": highest_score,
            "total_questions_answered": total_questions
        }