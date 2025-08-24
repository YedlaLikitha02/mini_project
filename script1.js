document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const startScreen = document.getElementById('startScreen');
    const quizScreen = document.getElementById('quizScreen');
    const resultScreen = document.getElementById('resultScreen');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const timeElement = document.getElementById('time');
    const nextButton = document.getElementById('nextButton');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const usernameInput = document.getElementById('username');
    const resultElement = document.getElementById('result');
    const scoresBody = document.getElementById('scoresBody');

    // Quiz state
    let currentQuestion = 0;
    let score = 0;
    let timer;
    let timeRemaining = 120; // 2 minutes
    let selectedOption = null;
    let quizEnded = false;

    // Questions data
    const questions = [
        {
            question: "Who is the Chief Minister of Uttar Pradesh?",
            options: ["Yogi Adityanath", "Ashok Gehlot", "Mamata Banerjee", "Eknath Shinde"],
            correctAnswer: 0
        },
        {
            question: "Who is the Chief Minister of Maharashtra?",
            options: ["Uddhav Thackeray", "Devendra Fadnavis", "Eknath Shinde", "Ajit Pawar"],
            correctAnswer: 2
        },
        {
            question: "Who is the Chief Minister of Tamil Nadu?",
            options: ["Edappadi K. Palaniswami", "O. Panneerselvam", "M. K. Stalin", "Jayalalithaa"],
            correctAnswer: 2
        },
        {
            question: "Who is the Chief Minister of Gujarat?",
            options: ["Vijay Rupani", "Bhupendrabhai Patel", "Anandiben Patel", "Narendra Modi"],
            correctAnswer: 1
        },
        {
            question: "Who is the Chief Minister of West Bengal?",
            options: ["Buddhadeb Bhattacharjee", "Mamata Banerjee", "Jyoti Basu", "Suvendu Adhikari"],
            correctAnswer: 1
        },
        {
            question: "Who is the Chief Minister of Kerala?",
            options: ["Oommen Chandy", "V. S. Achuthanandan", "Pinarayi Vijayan", "A. K. Antony"],
            correctAnswer: 2
        },
        {
            question: "Who is the Chief Minister of Punjab?",
            options: ["Charanjit Singh Channi", "Amarinder Singh", "Bhagwant Mann", "Parkash Singh Badal"],
            correctAnswer: 2
        },
        {
            question: "Who is the Chief Minister of Karnataka?",
            options: ["B. S. Yediyurappa", "Siddaramaiah", "H. D. Kumaraswamy", "Basavaraj Bommai"],
            correctAnswer: 1
        },
        {
            question: "Who is the Chief Minister of Rajasthan?",
            options: ["Vasundhara Raje", "Ashok Gehlot", "Sachin Pilot", "Bhajanlal Sharma"],
            correctAnswer: 3
        },
        {
            question: "Who is the Chief Minister of Bihar?",
            options: ["Lalu Prasad Yadav", "Nitish Kumar", "Rabri Devi", "Tejashwi Yadav"],
            correctAnswer: 1
        }
    ];

    // Start the quiz
    startButton.addEventListener('click', function() {
        if (!usernameInput.value.trim()) {
            alert('Please enter your name to start the quiz');
            return;
        }
        
        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        loadQuestion();
        startTimer();
    });

    // Handle option selection
    optionsElement.addEventListener('click', function(e) {
        if (quizEnded) return;
        
        if (e.target.classList.contains('option')) {
            // Remove selected class from all options
            document.querySelectorAll('.option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            e.target.classList.add('selected');
            selectedOption = parseInt(e.target.dataset.index);
            nextButton.disabled = false;
        }
    });

    // Handle next button click
    nextButton.addEventListener('click', function() {
        if (quizEnded) return;
        
        // Check answer
        const correctIndex = questions[currentQuestion].correctAnswer;
        const options = document.querySelectorAll('.option');
        
        options[correctIndex].classList.add('correct');
        
        if (selectedOption === correctIndex) {
            score++;
        } else if (selectedOption !== null) {
            options[selectedOption].classList.add('incorrect');
        }
        
        // Disable options
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        // Update button text for last question
        if (currentQuestion === questions.length - 1) {
            nextButton.textContent = 'Finish Quiz';
        }
        
        // Delay before moving to next question
        setTimeout(() => {
            currentQuestion++;
            
            if (currentQuestion < questions.length) {
                loadQuestion();
            } else {
                endQuiz();
            }
        }, 1500);
        
        nextButton.disabled = true;
    });

    // Restart quiz
    restartButton.addEventListener('click', function() {
        resetQuiz();
        resultScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
    });

    // Load question
    function loadQuestion() {
        selectedOption = null;
        nextButton.disabled = true;
        
        const question = questions[currentQuestion];
        questionElement.textContent = `${currentQuestion + 1}. ${question.question}`;
        
        optionsElement.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionsElement.appendChild(optionElement);
        });
    }

    // Start timer
    function startTimer() {
        timer = setInterval(() => {
            timeRemaining--;
            timeElement.textContent = timeRemaining;
            
            if (timeRemaining <= 0) {
                clearInterval(timer);
                endQuiz();
            }
        }, 1000);
    }

    // End quiz
    function endQuiz() {
        quizEnded = true;
        clearInterval(timer);
        
        // Save score to database
        const username = usernameInput.value.trim();
        saveScore(username, score, timeRemaining);
        
        // Show result screen
        quizScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        
        // Display result
        resultElement.textContent = `${username}, your score: ${score} out of ${questions.length}`;
        
        // Load leaderboard
        loadLeaderboard();
    }

    // Reset quiz
    function resetQuiz() {
        currentQuestion = 0;
        score = 0;
        timeRemaining = 120;
        quizEnded = false;
        usernameInput.value = '';
    }

    // Save score to database
    async function saveScore(username, score, timeRemaining) {
        try {
            const response = await fetch('/api/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, score, timeRemaining })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save score');
            }
            
            const result = await response.json();
            console.log('Score saved successfully:', result);
        } catch (error) {
            console.error('Error saving score:', error);
            // Display error to user
            alert('Failed to save your score. Please try again.');
        }
    }

    // Load leaderboard
    async function loadLeaderboard() {
        try {
            const response = await fetch('/api/scores');
            
            if (!response.ok) {
                throw new Error('Failed to load scores');
            }
            
            const scores = await response.json();
            
            // Clear existing scores
            scoresBody.innerHTML = '';
            
            // Add scores to table
            scores.slice(0, 10).forEach((score, index) => {
                const row = document.createElement('tr');
                
                const rankCell = document.createElement('td');
                rankCell.textContent = index + 1;
                
                const nameCell = document.createElement('td');
                nameCell.textContent = score.username;
                
                const scoreCell = document.createElement('td');
                scoreCell.textContent = `${score.score}/${questions.length}`;
                
                const timeCell = document.createElement('td');
                timeCell.textContent = `${score.timeRemaining}s`;
                
                const dateCell = document.createElement('td');
                dateCell.textContent = new Date(score.date).toLocaleDateString();
                
                row.appendChild(rankCell);
                row.appendChild(nameCell);
                row.appendChild(scoreCell);
                row.appendChild(timeCell);
                row.appendChild(dateCell);
                
                scoresBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading scores:', error);
            // Display error to user
            scoresBody.innerHTML = '<tr><td colspan="5">Failed to load leaderboard. Please refresh the page.</td></tr>';
        }
    }
});