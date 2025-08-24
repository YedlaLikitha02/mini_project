document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loadingIndicator = document.getElementById('loading-indicator');
    const questionContainer = document.getElementById('question-container');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackMessage = document.getElementById('feedback-message');
    const explanation = document.getElementById('explanation');
    let nextButton = document.getElementById('next-button');  // Changed from const to let
    const currentScoreElement = document.getElementById('current-score');
    const questionNumberElement = document.getElementById('question-number');
    
    // Variables
    let currentQuestion = null;
    let selectedOption = null;
    let currentScore = 0;
    let isAnswerSubmitted = false;
    
    // Initialize quiz
    loadQuestion();
    
    // Function to load a new question
    function loadQuestion() {
        // Reset state
        isAnswerSubmitted = false;
        selectedOption = null;
        
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        questionContainer.style.display = 'none';
        feedbackContainer.style.display = 'none';
        nextButton.style.display = 'none';
        
        // Fetch a new question from the server
        fetch('/get_question')
            .then(response => response.json())
            .then(data => {
                // Store current question
                currentQuestion = data;
                
                // Update the UI
                questionText.textContent = data.question;
                
                // Clear previous options
                optionsContainer.innerHTML = '';
                
                // Add options
                data.options.forEach((option, index) => {
                    const optionButton = document.createElement('button');
                    optionButton.className = 'option-button';
                    optionButton.textContent = option;
                    optionButton.dataset.index = index;
                    optionButton.dataset.value = option;
                    
                    optionButton.addEventListener('click', selectOption);
                    
                    optionsContainer.appendChild(optionButton);
                });
                
                // Hide loading indicator and show question
                loadingIndicator.style.display = 'none';
                questionContainer.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching question:', error);
                questionText.textContent = 'Error loading question. Please try again.';
                loadingIndicator.style.display = 'none';
                questionContainer.style.display = 'block';
            });
    }
    
    // Function to handle option selection
    function selectOption(event) {
        // If answer already submitted, don't allow further selections
        if (isAnswerSubmitted) {
            return;
        }
        
        // Remove selection from all options
        const allOptions = optionsContainer.querySelectorAll('.option-button');
        allOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Select current option
        event.target.classList.add('selected');
        selectedOption = event.target.dataset.value;
        
        // Submit answer
        submitAnswer();
    }
    
    // Function to submit the answer
    function submitAnswer() {
        if (!selectedOption || isAnswerSubmitted) {
            return;
        }
        
        isAnswerSubmitted = true;
        
        // Send answer to server
        fetch('/submit_answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                answer: selectedOption
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Update score if correct
            if (data.is_correct) {
                currentScore++;
                currentScoreElement.textContent = currentScore;
            }
            
            // Show feedback
            showFeedback(data.is_correct, data.correct_answer);
            
            // Show next button or redirect if finished
            if (data.finished) {
                nextButton.textContent = 'View Results';
                // Remove old event listeners by cloning and replacing
                const newButton = nextButton.cloneNode(true);
                nextButton.parentNode.replaceChild(newButton, nextButton);
                nextButton = newButton;
                
                nextButton.addEventListener('click', function() {
                    window.location.href = '/results';
                });
            } else {
                nextButton.textContent = 'Next Question';
                // Remove old event listeners by cloning and replacing
                const newButton = nextButton.cloneNode(true);
                nextButton.parentNode.replaceChild(newButton, nextButton);
                nextButton = newButton;
                
                nextButton.addEventListener('click', function() {
                    // Update question number
                    const newQuestionNumber = parseInt(questionNumberElement.textContent) + 1;
                    questionNumberElement.textContent = newQuestionNumber;
                    
                    // Load next question
                    loadQuestion();
                });
            }
            
            nextButton.style.display = 'inline-block';
        })
        .catch(error => {
            console.error('Error submitting answer:', error);
            feedbackMessage.textContent = 'Error submitting answer. Please try again.';
            feedbackMessage.className = 'error';
            feedbackContainer.style.display = 'block';
        });
    }
    
    // Function to show feedback
    function showFeedback(isCorrect, correctAnswer) {
        // Set feedback message
        if (isCorrect) {
            feedbackMessage.textContent = 'Correct! Well done.';
            feedbackMessage.className = 'correct';
        } else {
            feedbackMessage.textContent = `Incorrect. The correct answer is: ${correctAnswer}`;
            feedbackMessage.className = 'incorrect';
        }
        
        // Display explanation if available
        if (currentQuestion.explanation) {
            explanation.textContent = currentQuestion.explanation;
        } else {
            explanation.textContent = '';
        }
        
        // Mark correct and incorrect options
        const allOptions = optionsContainer.querySelectorAll('.option-button');
        allOptions.forEach(option => {
            if (option.dataset.value === correctAnswer) {
                option.classList.add('correct');
            } else if (option.classList.contains('selected')) {
                option.classList.add('incorrect');
            }
            
            // Disable all options
            option.disabled = true;
        });
        
        // Show feedback container
        feedbackContainer.style.display = 'block';
    }
    
    // Better way to handle next button click events
    // Instead of a separate event listener that tries to clone the button
    // We'll clear and add event listeners in the submitAnswer function above
});