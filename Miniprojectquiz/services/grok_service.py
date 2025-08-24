import os
import requests
import random
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Debug: Print API key (first few characters)
api_key = os.getenv("GROK_API_KEY")
if api_key:
    print(f"Using Grok API key starting with: {api_key[:8]}...")
else:
    print("WARNING: No Grok API key found!")

# Updated Grok API endpoint for console.grok.com
GROK_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def generate_quiz_question():
    """
    Generate a quiz question about Indian states formation and leadership using Grok API
    Returns a dictionary with question, options, and correct answer
    """
    # Define topics related to Indian states
    topics = [
        "formation of Indian states after independence",
        "reorganization of Indian states on linguistic basis",
        "Chief Ministers and Governors of Indian states",
        "first Chief Ministers of Indian states",
        "states formation day and significant history",
        "creation of new states in modern India",
        "leadership in Indian states during important historical events",
        "significant leaders who fought for state formation",
        "political movements for creation of Indian states",
        "renaming of Indian states and territories"
    ]
    
    # Randomly select a topic
    selected_topic = random.choice(topics)
    
    # Create the prompt for Grok
    prompt = f"""Generate a multiple-choice quiz question about the {selected_topic}.
    The question should be about specific facts related to formation or leadership of Indian states.
    Return a JSON object with the following format:
    {{
        "question": "The detailed question text here",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "The full text of the correct option",
        "explanation": "A brief explanation about why this answer is correct"
    }}
    Make sure the question is challenging but factually accurate.
    """
    
    try:
        # Debug: Print confirmation before API call
        print("Attempting to call Grok API...")
        
        # Check if API key is available
        if not api_key or api_key == "your-grok-api-key":
            raise ValueError("Invalid API key. Please set a valid Grok API key in your .env file")
        
        # Prepare headers for Grok API (updated for console.grok.com)
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        # Prepare the request payload for Grok API (updated model name)
        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are a knowledgeable assistant that creates quiz questions about Indian states' formation and leadership history. Always respond with valid JSON only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "model": "llama3-70b-8192",  # Updated model to a currently supported one
            "stream": False,
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        # Make the API call to Grok
        response = requests.post(GROK_API_URL, headers=headers, json=payload, timeout=30)
        
        # Check if the request was successful
        if response.status_code != 200:
            print(f"Grok API error: {response.status_code} - {response.text}")
            raise Exception(f"Grok API returned status code: {response.status_code}")
        
        # Parse the response
        response_data = response.json()
        content = response_data['choices'][0]['message']['content']
        print("Successfully received response from Grok API")
        
        # Clean and process the response to ensure it's proper JSON
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        # Parse the JSON response
        question_data = json.loads(content)
        
        # Ensure all required fields are present
        required_fields = ["question", "options", "correct_answer", "explanation"]
        for field in required_fields:
            if field not in question_data:
                raise ValueError(f"Missing field: {field}")
        
        # Validate options
        if not isinstance(question_data["options"], list) or len(question_data["options"]) != 4:
            raise ValueError("Options must be a list of exactly 4 items")
        
        return question_data
        
    except requests.exceptions.Timeout:
        print("Error: Grok API request timed out")
        return get_fallback_question()
    except requests.exceptions.RequestException as e:
        print(f"Error making request to Grok API: {e}")
        return get_fallback_question()
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response from Grok: {e}")
        print(f"Raw content: {content if 'content' in locals() else 'No content'}")
        return get_fallback_question()
    except Exception as e:
        print(f"Error generating question from Grok: {e}")
        return get_fallback_question()

def get_fallback_question():
    """Return a fallback question when API call fails"""
    fallback_questions = [
        {
            "question": "Which Indian state was formed first after independence?",
            "options": ["Andhra Pradesh", "Kerala", "Karnataka", "Maharashtra"],
            "correct_answer": "Andhra Pradesh",
            "explanation": "Andhra Pradesh was formed on October 1, 1953, as the first linguistic state in India."
        },
        {
            "question": "In which year were Indian states reorganized primarily on linguistic basis?",
            "options": ["1947", "1950", "1956", "1960"],
            "correct_answer": "1956",
            "explanation": "The States Reorganisation Act was enacted in 1956, which reorganized state boundaries on linguistic lines."
        },
        {
            "question": "Which modern Indian state was created in 2000 from Bihar?",
            "options": ["Jharkhand", "Chhattisgarh", "Uttarakhand", "Telangana"],
            "correct_answer": "Jharkhand",
            "explanation": "Jharkhand was carved out of Bihar on November 15, 2000."
        },
        {
            "question": "Who was the first Chief Minister of Gujarat?",
            "options": ["Jivraj Narayan Mehta", "Balwantrai Mehta", "Chimanbhai Patel", "Madhavsinh Solanki"],
            "correct_answer": "Jivraj Narayan Mehta",
            "explanation": "Dr. Jivraj Narayan Mehta became the first Chief Minister of Gujarat when the state was formed on May 1, 1960."
        },
        {
            "question": "Which Indian state was renamed from Uttaranchal to its current name in 2007?",
            "options": ["Uttarakhand", "Jharkhand", "Chhattisgarh", "Telangana"],
            "correct_answer": "Uttarakhand",
            "explanation": "Uttaranchal was renamed to Uttarakhand in 2007. The state was carved out of Uttar Pradesh in November 2000."
        },
        {
            "question": "When was Telangana formed as a separate state?",
            "options": ["2012", "2014", "2016", "2018"],
            "correct_answer": "2014",
            "explanation": "Telangana was formed on June 2, 2014, as the 29th state of India, carved out of Andhra Pradesh."
        },
        {
            "question": "Which act led to the reorganization of Indian states in 1956?",
            "options": ["Government of India Act", "States Reorganisation Act", "Indian Independence Act", "Constitution Act"],
            "correct_answer": "States Reorganisation Act",
            "explanation": "The States Reorganisation Act of 1956 reorganized the boundaries of Indian states along linguistic lines."
        },
        {
            "question": "Who was the first Chief Minister of Haryana when it was formed in 1966?",
            "options": ["Bansi Lal", "Bhagwat Dayal Sharma", "Devi Lal", "Om Prakash Chautala"],
            "correct_answer": "Bhagwat Dayal Sharma",
            "explanation": "Bhagwat Dayal Sharma became the first Chief Minister of Haryana when it was carved out of Punjab in 1966."
        }
    ]
    
    return random.choice(fallback_questions)