# app.py
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_pymongo import PyMongo
from datetime import datetime, timedelta
import requests
import json
import os
import random
import uuid
import re
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'development-secret-key')

# MongoDB configuration  
app.config["MONGO_URI"] = os.getenv('MONGO_URI')
mongo = PyMongo(app)

# Groq API configuration
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

# Add error checking
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in environment variables")
if not app.config["MONGO_URI"]:
    raise ValueError("MONGO_URI not found in environment variables")
GROQ_MODEL = "llama3-70b-8192"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Quiz level configuration
QUIZ_LEVELS = {
    1: {'questions': 5, 'points': 50},
    2: {'questions': 10, 'points': 100},
    3: {'questions': 15, 'points': 150},
    4: {'questions': 20, 'points': 200},
    5: {'questions': 25, 'points': 250},
}

# States of India for the quiz
STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
]

# Union Territories
UNION_TERRITORIES = [
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
]

# Categories for the quiz
CATEGORIES = [
    "State Formation",
    "Chief Ministers",
    "Political Parties",
    "State Leaders",
    "State Reorganization",
    "Regional Movements"
]

# Define difficulty levels
DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"]

# State capitals for the memory game
STATE_CAPITALS = {
    "Andhra Pradesh": "Amaravati",
    "Arunachal Pradesh": "Itanagar",
    "Assam": "Dispur",
    "Bihar": "Patna",
    "Chhattisgarh": "Raipur",
    "Goa": "Panaji",
    "Gujarat": "Gandhinagar",
    "Haryana": "Chandigarh",
    "Himachal Pradesh": "Shimla",
    "Jharkhand": "Ranchi",
    "Karnataka": "Bengaluru",
    "Kerala": "Thiruvananthapuram",
    "Madhya Pradesh": "Bhopal",
    "Maharashtra": "Mumbai",
    "Manipur": "Imphal",
    "Meghalaya": "Shillong",
    "Mizoram": "Aizawl",
    "Nagaland": "Kohima",
    "Odisha": "Bhubaneswar",
    "Punjab": "Chandigarh",
    "Rajasthan": "Jaipur",
    "Sikkim": "Gangtok",
    "Tamil Nadu": "Chennai",
    "Telangana": "Hyderabad",
    "Tripura": "Agartala",
    "Uttar Pradesh": "Lucknow",
    "Uttarakhand": "Dehradun",
    "West Bengal": "Kolkata",
    "Delhi": "New Delhi",
    "Puducherry": "Puducherry",
    "Jammu and Kashmir": "Srinagar/Jammu",
    "Ladakh": "Leh",
    "Chandigarh": "Chandigarh",
    "Lakshadweep": "Kavaratti",
    "Andaman and Nicobar Islands": "Port Blair",
    "Dadra and Nagar Haveli and Daman and Diu": "Daman"
}

# Fallback timeline events if API fails
TIMELINE_EVENTS = [
    {"year": 1947, "event": "India gains independence. Provinces reorganized into states."},
    {"year": 1950, "event": "Constitution of India comes into effect."},
    {"year": 1953, "event": "Andhra State created from Madras State as the first linguistic state."},
    {"year": 1956, "event": "States Reorganization Act creates 14 states and 6 union territories based on language."},
    {"year": 1960, "event": "Bombay State split into Gujarat and Maharashtra."},
    {"year": 1963, "event": "Nagaland becomes the 16th state of India."},
    {"year": 1966, "event": "Punjab divided into Punjab and Haryana; Chandigarh becomes a union territory."},
    {"year": 1971, "event": "Himachal Pradesh gains full statehood."},
    {"year": 1972, "event": "Manipur, Tripura, and Meghalaya become full states."},
    {"year": 1975, "event": "Sikkim joins India as the 22nd state."},
    {"year": 1987, "event": "Goa becomes a state; Arunachal Pradesh and Mizoram also gain statehood."},
    {"year": 2000, "event": "Chhattisgarh, Uttarakhand, and Jharkhand are formed."},
    {"year": 2014, "event": "Telangana becomes the 29th state, carved out from Andhra Pradesh."},
    {"year": 2019, "event": "Jammu & Kashmir and Ladakh become union territories."}
]

# Helper function to extract JSON from LLM response
def extract_json_from_text(text):
    # Clean the text to handle potential formatting issues
    # Find JSON-like content between curly braces
    match = re.search(r'({[\s\S]*})', text)
    if match:
        json_str = match.group(1)
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            # If direct parsing fails, try to clean up the JSON string
            cleaned_json = re.sub(r'```json|```', '', json_str).strip()
            try:
                return json.loads(cleaned_json)
            except:
                pass
    
    # Fallback to a more structured approach if regex fails
    try:
        return json.loads(text)
    except:
        # If all else fails, create a fallback question
        return {
            "question": "What state was formed from Andhra Pradesh in 2014?",
            "options": ["Telangana", "Karnataka", "Odisha", "Tamil Nadu"],
            "correct_answer": 0,
            "explanation": "Telangana was formed on June 2, 2014, as the 29th state of India, carved out from the northwestern part of Andhra Pradesh.",
            "image_prompt": "Map showing the separation of Telangana from Andhra Pradesh"
        }

# Helper function to get appropriate image URL
def get_image_url(state, category, subcategory=None):
    """Get a relevant image URL based on state and category"""
    # Base backup image - always works
    default_image = "https://upload.wikimedia.org/wikipedia/commons/e/e0/India_states_and_union_territories_map.svg"
    
    # Category specific images (verified links)
    category_images = {
        'state-formation': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/India_states_and_union_territories_map.svg',
        'chief-ministers': 'https://upload.wikimedia.org/wikipedia/commons/5/55/Parliament_of_India.jpg',
        'political-parties': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/India_states_and_union_territories_map.svg',
        'state-leaders': 'https://upload.wikimedia.org/wikipedia/commons/5/55/Parliament_of_India.jpg',
        'state-reorganization': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/India_states_and_union_territories_map.svg',
        'regional-movements': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/India_states_and_union_territories_map.svg'
    }
    
    # Choose an appropriate image based on category
    category_key = category.replace(' ', '-').lower()
    if category_key in category_images:
        return category_images[category_key]
    else:
        return default_image

@app.route('/')
def index():
    return render_template('welcome.html')

@app.route('/set_name', methods=['POST'])
def set_name():
    player_name = request.form.get('player_name', 'Guest')
    
    # Generate a user ID if not exists
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
        
    session['username'] = player_name
    
    # Create a user in the database or update existing one
    # Explicitly set initial values for new users
    mongo.db.users.update_one(
        {'_id': session['user_id']},
        {
            '$set': {
                'username': player_name,
                'last_played': datetime.now(),
                'score': 0,  # Explicitly set initial score
                'level': 1,  # Explicitly set initial level
                'streak': 0  # Explicitly set initial streak
            },
            '$setOnInsert': {
                'created_at': datetime.now(),
                'badges': [],
                'completed_states': {},
                'quiz_progress': {
                    'current_level': 1,
                    'questions_answered': 0
                }
            }
        },
        upsert=True
    )
    
    return redirect(url_for('home'))

@app.route('/home')
def home():
    if 'user_id' not in session:
        return redirect(url_for('index'))
        
    return render_template('index.html', 
                           states=STATES, 
                           union_territories=UNION_TERRITORIES, 
                           categories=CATEGORIES,
                           username=session.get('username', 'Guest'))

@app.route('/game')
def game():
    if 'user_id' not in session:
        return redirect(url_for('index'))
        
    state = request.args.get('state', 'All States')
    category = request.args.get('category', 'State Formation')
    difficulty = request.args.get('difficulty', 'Medium')
    
    # Check if user played today, if not reset streak
    user = mongo.db.users.find_one({'_id': session['user_id']})
    last_played = user.get('last_played')
    
    if last_played:
        last_played = last_played.replace(tzinfo=None) if hasattr(last_played, 'replace') else last_played
        yesterday = datetime.now() - timedelta(days=1)
        if last_played < yesterday:
            # Reset streak if not played yesterday
            mongo.db.users.update_one(
                {'_id': session['user_id']},
                {'$set': {'streak': 0}}
            )
    
    return render_template('game.html', state=state, category=category, difficulty=difficulty)

@app.route('/memory_game')
def memory_game():
    if 'user_id' not in session:
        return redirect(url_for('index'))
        
    difficulty = request.args.get('difficulty', 'Medium')
    
    # Set number of pairs based on difficulty
    if difficulty == 'Easy':
        num_pairs = 6
    elif difficulty == 'Medium':
        num_pairs = 10
    else:  # Hard
        num_pairs = 15
    
    # Select random states for the memory game
    all_regions = STATES + UNION_TERRITORIES
    selected_regions = random.sample(all_regions, num_pairs)
    
    # Create pairs (state-capital)
    pairs = []
    for region in selected_regions:
        pairs.append({
            'id': region.lower().replace(' ', '_'),
            'state': region,
            'capital': STATE_CAPITALS.get(region, "Unknown")
        })
    
    return render_template('memory_game.html', pairs=pairs, difficulty=difficulty)

@app.route('/word_scramble')
def word_scramble():
    if 'user_id' not in session:
        return redirect(url_for('index'))
        
    difficulty = request.args.get('difficulty', 'Medium')
    
    # Generate word scramble data
    words = []
    
    if difficulty == 'Easy':
        # Select states with shorter names
        short_states = [state for state in STATES if len(state) <= 8]
        selected_states = random.sample(short_states, min(10, len(short_states)))
        words = [{'word': state, 'hint': f"State of India"} for state in selected_states]
    
    elif difficulty == 'Medium':
        # Mix of states and capitals
        selected_states = random.sample(STATES, 5)
        selected_capitals = [STATE_CAPITALS[state] for state in selected_states]
        
        words = [{'word': state, 'hint': f"State of India"} for state in selected_states]
        words += [{'word': capital, 'hint': f"Capital city"} for capital in selected_capitals]
    
    else:  # Hard
        # More complex mix with longer words
        long_states = [state for state in STATES if len(state) > 8]
        complex_capitals = [cap for state, cap in STATE_CAPITALS.items() if len(cap) > 8]
        
        selected_states = random.sample(long_states, min(5, len(long_states)))
        selected_capitals = random.sample(complex_capitals, min(5, len(complex_capitals)))
        
        words = [{'word': state, 'hint': f"State of India"} for state in selected_states]
        words += [{'word': capital, 'hint': f"Capital city"} for capital in selected_capitals]
    
    # Scramble the words
    for word_obj in words:
        original = word_obj['word'].replace(' ', '')
        letters = list(original.lower())
        random.shuffle(letters)
        word_obj['scrambled'] = ''.join(letters)
    
    # Shuffle the list so the words appear in random order
    random.shuffle(words)
    
    return render_template('word_scramble.html', words=words, difficulty=difficulty)

@app.route('/timeline_game')
def timeline_game():
    if 'user_id' not in session:
        return redirect(url_for('index'))
        
    difficulty = request.args.get('difficulty', 'Medium')
    
    return render_template('timeline_game.html', difficulty=difficulty)

@app.route('/api/user_stats')
def user_stats():
    # Get current user stats
    user = mongo.db.users.find_one({'_id': session['user_id']})
    
    if not user:
        # Return default values for new users, including username
        return jsonify({
            'username': session.get('username', 'Guest'),
            'streak': 0,
            'score': 0,
            'level': 1,
            'badges': [],
            'quiz_progress': {
                'current_level': 1,
                'questions_answered': 0
            }
        })
    
    return jsonify({
        'username': user.get('username', 'Guest'),
        'streak': user.get('streak', 0),
        'score': user.get('score', 0),
        'level': user.get('level', 1),
        'badges': user.get('badges', []),
        'quiz_progress': user.get('quiz_progress', {
            'current_level': 1,
            'questions_answered': 0
        })
    })

@app.route('/api/generate_question', methods=['POST'])
def generate_question():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not logged in'}), 401
            
        data = request.json
        state = data.get('state', 'All States')
        category = data.get('category', 'State Formation')
        difficulty = data.get('difficulty', 'Medium')
        
        # Check for recent questions to avoid duplicates
        recent_questions = list(mongo.db.questions.find({
            'state': state,
            'category': category,
            'difficulty': difficulty,
            'created_at': {'$gte': datetime.now() - timedelta(days=1)}
        }))
        
        # If we have recent questions, randomly select one that hasn't been answered by this user
        if recent_questions and random.random() < 0.7:  # 70% chance to use existing question
            # Get questions this user hasn't answered
            answered_ids = [q['question_id'] for q in mongo.db.answer_history.find({
                'user_id': session['user_id']
            })]
            
            unanswered = [q for q in recent_questions if str(q['_id']) not in answered_ids]
            
            if unanswered:
                selected = random.choice(unanswered)
                question_data = selected['question_data']
                question_data['_id'] = str(selected['_id'])
                return jsonify(question_data)
        
        # If no suitable questions found or we want a new one, generate a new question
        # Add subcategories to make questions more diverse
        subcategories = {
            'State Formation': [
                'Formation date', 'Parent states', 'Reorganization act', 
                'Formation movement', 'Border disputes', 'First government'
            ],
            'Chief Ministers': [
                'First CM', 'Longest-serving CM', 'Female CMs', 
                'Notable policies', 'Political background', 'Term highlights'
            ],
            'Political Parties': [
                'Ruling parties', 'Regional parties', 'Electoral history',
                'Coalition governments', 'Political dynasties', 'Landmark elections'
            ],
            'State Leaders': [
                'Freedom fighters', 'Social reformers', 'Movement leaders',
                'Literary figures', 'Cultural icons', 'Administrative leaders'
            ],
            'State Reorganization': [
                'Boundary commission', 'Language-based reorganization', 
                'Bifurcation reasons', 'Post-reorganization challenges',
                'Capital cities', 'Resource sharing'
            ],
            'Regional Movements': [
                'Language movements', 'Tribal identity', 'Separatist movements',
                'Autonomy demands', 'Student movements', 'Cultural preservation'
            ]
        }
        
        # Select a random subcategory
        selected_subcategory = random.choice(subcategories.get(category, ['General']))
        
        # Generate question prompt based on category and subcategory
        if state == 'All States':
            state_scope = "any Indian state"
        else:
            state_scope = state
        
        prompt = f"""Generate a multiple-choice question about {state_scope} related to {category}, 
        specifically focusing on {selected_subcategory} at {difficulty} difficulty level.

        Make sure this question is unique and educational. Include accurate historical details.
        """
        
        prompt += """
        Format your response as a JSON object with these fields:
        1. question: The question text
        2. options: Array of 4 options
        3. correct_answer: The index (0-3) of the correct option
        4. explanation: Brief explanation of the correct answer with historical facts
        5. image_prompt: A detailed prompt to generate an image relevant to this question (person, place, state symbol, etc.)
        
        Only respond with the JSON object, no additional text or formatting.
        """
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {GROQ_API_KEY}'
        }
        
        payload = {
            'model': GROQ_MODEL,
            'messages': [
                {
                    'role': 'system', 
                    'content': 'You are a helpful assistant that generates quiz questions about the formation and leadership of Indian states. You must respond only with JSON objects that match the user\'s requested format. Do not include additional text, markdown formatting, or code blocks.'
                },
                {'role': 'user', 'content': prompt}
            ],
            'temperature': 0.9,  # Increased temperature for more variation
            'max_tokens': 500
        }
        
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        result = response.json()
        content = result['choices'][0]['message']['content']
        
        # Extract JSON data using the helper function
        question_data = extract_json_from_text(content)
        
        # Verify required fields
        required_fields = ['question', 'options', 'correct_answer', 'explanation', 'image_prompt']
        for field in required_fields:
            if field not in question_data:
                raise ValueError(f"Missing required field: {field}")
        
        # Generate an image URL - use category-based images only, no emblems
        image_url = get_image_url(state, category, selected_subcategory)
        question_data['image_url'] = image_url
        
        # Store the question in the database for reference
        question_id = mongo.db.questions.insert_one({
            'question_data': question_data,
            'state': state,
            'category': category,
            'subcategory': selected_subcategory,
            'difficulty': difficulty,
            'created_at': datetime.now()
        }).inserted_id
        
        question_data['_id'] = str(question_id)
        
        return jsonify(question_data)
    
    except Exception as e:
        print(f"Error generating question: {str(e)}")
        # Create a fallback question
        fallback = {
            "question": f"Which of the following is related to {state if state != 'All States' else 'Indian states'}?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": 0,
            "explanation": "We apologize for the technical difficulty. Here's a placeholder question.",
            "image_prompt": "Map of India",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/e/e0/India_states_and_union_territories_map.svg"
        }
        
        return jsonify(fallback)

@app.route('/api/submit_answer', methods=['POST'])
def submit_answer():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not logged in'}), 401
            
        data = request.json
        question_id = data.get('question_id')
        selected_answer = data.get('selected_answer')
        correct_answer = data.get('correct_answer')
        time_taken = data.get('time_taken', 30)  # in seconds
        state = data.get('state', 'All States')
        category = data.get('category', 'State Formation')
        difficulty = data.get('difficulty', 'Medium')
        
        # Handle the case where selected_answer is null (timed out)
        if selected_answer is None:
            is_correct = False
            selected_answer = -1  # Use -1 to indicate no selection
        else:
            is_correct = selected_answer == correct_answer
        
        # Calculate points based on difficulty and time taken
        points = 0
        if is_correct:
            if difficulty == 'Easy':
                base_points = 10
            elif difficulty == 'Medium':
                base_points = 20
            else:  # Hard
                base_points = 30
                
            # Time bonus (faster = more points, max 30 seconds considered)
            time_factor = max(0, 1 - (time_taken / 30))
            time_bonus = int(base_points * time_factor)
            
            points = base_points + time_bonus
        
        # Update user stats
        user = mongo.db.users.find_one({'_id': session['user_id']})
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        current_streak = user.get('streak', 0)
        current_score = user.get('score', 0)
        
        # Update streak only if correct
        new_streak = current_streak + 1 if is_correct else 0
        
        # Check for streak-based badges
        badges = user.get('badges', [])
        if new_streak >= 5 and 'streak_5' not in badges:
            badges.append('streak_5')
        if new_streak >= 10 and 'streak_10' not in badges:
            badges.append('streak_10')
        
        # Update state completion tracking
        completed_states = user.get('completed_states', {})
        if state not in completed_states:
            completed_states[state] = 0
        
        if is_correct:
            completed_states[state] += 1
        
        # Check for state mastery badges
        state_key = state.replace(" ", "_").lower()
        if completed_states[state] >= 10 and f'master_{state_key}' not in badges:
            badges.append(f'master_{state_key}')
        
        # Track quiz progress
        quiz_progress = user.get('quiz_progress', {})
        current_quiz_level = quiz_progress.get('current_level', 1)
        questions_answered = quiz_progress.get('questions_answered', 0)
        
        # Update quiz progress if answer is correct
        if is_correct:
            questions_answered += 1
            
        # Check for quiz level completion
        level_completed = False
        new_quiz_level = current_quiz_level
        bonus_points = 0
        
        if questions_answered >= QUIZ_LEVELS.get(current_quiz_level, {}).get('questions', 1000):
            # Level completed, award bonus points
            bonus_points = QUIZ_LEVELS.get(current_quiz_level, {}).get('points', 0)
            points += bonus_points
            new_quiz_level = current_quiz_level + 1
            level_completed = True
            
            # Add badge for quiz level completion
            if f'quiz_level_{current_quiz_level}' not in badges:
                badges.append(f'quiz_level_{current_quiz_level}')
            
            # Reset questions for next level
            questions_answered = 0
        
        # Update user record
        mongo.db.users.update_one(
            {'_id': session['user_id']},
            {
                '$set': {
                    'streak': new_streak,
                    'last_played': datetime.now(),
                    'completed_states': completed_states,
                    'badges': badges,
                    'quiz_progress': {
                        'current_level': new_quiz_level,
                        'questions_answered': questions_answered
                    }
                },
                '$inc': {'score': points}
            }
        )
        
        # Record this answer in history
        mongo.db.answer_history.insert_one({
            'user_id': session['user_id'],
            'question_id': question_id,
            'selected_answer': selected_answer,
            'correct_answer': correct_answer,
            'is_correct': is_correct,
            'points': points,
            'time_taken': time_taken,
            'state': state,
            'category': category,
            'difficulty': difficulty,
            'timestamp': datetime.now()
        })
        
        # Get updated user data for response
        updated_user = mongo.db.users.find_one({'_id': session['user_id']})
        
        # Check if user has earned a new level
        level_threshold = 100  # Points needed per level
        new_level = (updated_user['score'] // level_threshold) + 1
        
        if new_level > user.get('level', 1):
            mongo.db.users.update_one(
                {'_id': session['user_id']},
                {'$set': {'level': new_level}}
            )
            level_up = True
        else:
            level_up = False
        
        return jsonify({
            'is_correct': is_correct,
            'points_earned': points,
            'bonus_points': bonus_points,
            'new_score': updated_user['score'],
            'new_streak': new_streak,
            'level_up': level_up,
            'new_level': new_level if level_up else None,
            'quiz_level_completed': level_completed,
            'new_quiz_level': new_quiz_level if level_completed else None,
            'questions_to_next_level': QUIZ_LEVELS.get(new_quiz_level, {}).get('questions', 0) - questions_answered,
            'new_badges': [b for b in badges if b not in user.get('badges', [])]
        })
    except Exception as e:
        print(f"Error submitting answer: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/submit_game_score', methods=['POST'])
def submit_game_score():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not logged in'}), 401
            
        data = request.json
        game_type = data.get('game_type')  # 'memory', 'word_scramble', 'timeline'
        score = data.get('score', 0)
        time_taken = data.get('time_taken', 0)  # in seconds
        difficulty = data.get('difficulty', 'Medium')
        
        # Calculate points based on difficulty and time
        if difficulty == 'Easy':
            base_points = 10
        elif difficulty == 'Medium':
            base_points = 20
        else:  # Hard
            base_points = 30
            
        # Adjust points based on game-specific logic
        if game_type == 'memory':
            # For memory game, score is the number of matches
            points = score * base_points
            
            # Time bonus (only for memory game)
            if time_taken > 0:
                # Calculate reference time based on difficulty
                if difficulty == 'Easy':
                    reference_time = 180  # 3 minutes
                elif difficulty == 'Medium':
                    reference_time = 120  # 2 minutes
                else:  # Hard
                    reference_time = 90  # 1.5 minutes
                
                time_factor = max(0, 1 - (time_taken / reference_time))
                time_bonus = int(points * time_factor)
                points += time_bonus
        
        elif game_type == 'word_scramble':
            points = score * base_points
            
            # Add time bonus
            if time_taken > 0:
                # Calculate reference time based on difficulty
                if difficulty == 'Easy':
                    reference_time = 300  # 5 minutes
                elif difficulty == 'Medium':
                    reference_time = 240  # 4 minutes
                else:  # Hard
                    reference_time = 180  # 3 minutes
                
                time_factor = max(0, 1 - (time_taken / reference_time))
                time_bonus = int(points * time_factor)
                points += time_bonus
                
        else:  # timeline
            # For timeline game, score is the number of correct placements
            points = score * base_points
        
        # Update user stats
        user = mongo.db.users.find_one({'_id': session['user_id']})
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        current_score = user.get('score', 0)
        
        # Check for game-specific badges
        badges = user.get('badges', [])
        if points >= 100 and f'{game_type}_master' not in badges:
            badges.append(f'{game_type}_master')
        
        # Update user record
        mongo.db.users.update_one(
            {'_id': session['user_id']},
            {
                '$set': {
                    'last_played': datetime.now(),
                    'badges': badges
                },
                '$inc': {'score': points}
            }
        )
        
        # Record this game result
        mongo.db.game_history.insert_one({
            'user_id': session['user_id'],
            'game_type': game_type,
            'score': score,
            'points': points,
            'time_taken': time_taken,
            'difficulty': difficulty,
            'timestamp': datetime.now()
        })
        
        # Get updated user data for response
        updated_user = mongo.db.users.find_one({'_id': session['user_id']})
        
        # Check if user has earned a new level
        level_threshold = 100  # Points needed per level
        new_level = (updated_user['score'] // level_threshold) + 1
        
        if new_level > user.get('level', 1):
            mongo.db.users.update_one(
                {'_id': session['user_id']},
                {'$set': {'level': new_level}}
            )
            level_up = True
        else:
            level_up = False
        
        return jsonify({
            'points_earned': points,
            'new_score': updated_user['score'],
            'level_up': level_up,
            'new_level': new_level if level_up else None,
            'new_badges': [b for b in badges if b not in user.get('badges', [])]
        })
    except Exception as e:
        print(f"Error submitting game score: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/timeline_events')
def timeline_events():
    try:
        # Check if we already have generated events in the database
        events_doc = mongo.db.timeline_events.find_one({'created_at': {'$gte': datetime.now() - timedelta(days=1)}})
        
        if events_doc and 'events' in events_doc:
            return jsonify(events_doc['events'])
        
        # Generate new timeline events
        prompt = """
        Generate a chronological list of 14 key events in the formation and reorganization of Indian states from 1947 to 2019.
        Each event should include the exact year and a brief description of what happened.
        
        Format your response as a JSON array of objects, where each object has:
        1. "year": The year as a number (e.g., 1956)
        2. "event": A concise description of the event (30-50 words)
        
        Events should include major state formations, reorganizations, and key legislative acts.
        Ensure chronological order and historical accuracy.
        """
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {GROQ_API_KEY}'
        }
        
        payload = {
            'model': GROQ_MODEL,
            'messages': [
                {
                    'role': 'system', 
                    'content': 'You are a helpful assistant specialized in Indian history. Generate accurate historical information in the requested format.'
                },
                {'role': 'user', 'content': prompt}
            ],
            'temperature': 0.3,
            'max_tokens': 800
        }
        
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        result = response.json()
        content = result['choices'][0]['message']['content']
        
        # Extract JSON data
        try:
            # Try to parse as JSON directly
            events = json.loads(content)
        except:
            # If that fails, try to extract JSON from text
            match = re.search(r'(\[.*\])', content, re.DOTALL)
            if match:
                events = json.loads(match.group(1))
            else:
                # Fallback to predefined events
                events = TIMELINE_EVENTS
        
        # Verify events format
        if not isinstance(events, list):
            events = TIMELINE_EVENTS
        else:
            # Ensure each event has required fields
            for event in events:
                if not isinstance(event, dict) or 'year' not in event or 'event' not in event:
                    events = TIMELINE_EVENTS
                    break
        
        # Sort events by year
        events = sorted(events, key=lambda x: x['year'])
        
        # Store in database for reuse
        mongo.db.timeline_events.insert_one({
            'events': events,
            'created_at': datetime.now()
        })
        
        return jsonify(events)
    except Exception as e:
        print(f"Error generating timeline events: {str(e)}")
        # Fallback to predefined events
        return jsonify(TIMELINE_EVENTS)

@app.route('/leaderboard')
def leaderboard():
    try:
        # Get top 20 users by score
        top_users = list(mongo.db.users.find(
            {}, 
            {'username': 1, 'score': 1, 'streak': 1, 'level': 1, 'badges': 1}
        ).sort('score', -1).limit(20))
        
        # Convert ObjectId to string for JSON serialization
        for user in top_users:
            if '_id' in user:
                user['_id'] = str(user['_id'])
        
        return render_template('leaderboard.html', users=top_users)
    except Exception as e:
        print(f"Error loading leaderboard: {str(e)}")
        return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(port=5001,debug=True)