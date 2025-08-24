import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Configuration settings for the application"""
    
    # Flask Settings
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key-for-development")
    DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
    
    # MongoDB Settings
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://yedlalikithareddy2104:Likitha0102@cluster.ihmt8jh.mongodb.net/quiz_db")
    
    # Grok API Settings (Updated for console.grok.com)
    GROK_API_KEY = os.getenv("GROK_API_KEY")
    GROK_MODEL = os.getenv("GROK_MODEL", "llama3-70b-8192")  # Updated to currently supported model
    GROK_API_URL = os.getenv("GROK_API_URL", "https://api.groq.com/openai/v1/chat/completions")  # Updated endpoint
    
    # Quiz Settings
    DEFAULT_QUIZ_LENGTH = int(os.getenv("DEFAULT_QUIZ_LENGTH", "10"))
    MAX_QUIZ_LENGTH = int(os.getenv("MAX_QUIZ_LENGTH", "20"))
    
    @classmethod
    def validate_config(cls):
        """Validate that all required configuration is present"""
        required_vars = ["GROK_API_KEY", "MONGO_URI"]
        missing_vars = []
        
        for var in required_vars:
            if not getattr(cls, var):
                missing_vars.append(var)
        
        if missing_vars:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")
        
        return True