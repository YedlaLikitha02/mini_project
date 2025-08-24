import os
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv("OPENAI_API_KEY")
print(f"Using API key starting with: {api_key[:8]}...")

try:
    # Initialize client
    client = openai.OpenAI(api_key=api_key)
    
    # Test API connection
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say hello!"}
        ],
        max_tokens=10
    )
    
    # Print response
    print("API connection successful!")
    print(f"Response: {response.choices[0].message.content}")
    
except Exception as e:
    print(f"Error testing OpenAI API: {e}")