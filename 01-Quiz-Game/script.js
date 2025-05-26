//* =====================
//* QUIZ GAME
//* =====================

// DOM ELEMENTS REFERENCE
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

/*
  QUIZ QUESTIONS DATA
  Each question is an object with:
  - question: string (the question text)
  - answers: array of answer objects with:
    - text: string (the answer text)
    - correct: boolean (whether it's the correct answer)
*/
const quizQuestions = [
	{
		question: "What is the capital of France?",
		answers: [
			{ text: "London", correct: false },
			{ text: "Berlin", correct: false },
			{ text: "Paris", correct: true },
			{ text: "Madrid", correct: false },
		],
	},
	{
		question: "Which planet is known as the Red Planet?",
		answers: [
			{ text: "Venus", correct: false },
			{ text: "Mars", correct: true },
			{ text: "Jupiter", correct: false },
			{ text: "Saturn", correct: false },
		],
	},
	{
		question: "What is the largest ocean on Earth?",
		answers: [
			{ text: "Atlantic Ocean", correct: false },
			{ text: "Indian Ocean", correct: false },
			{ text: "Arctic Ocean", correct: false },
			{ text: "Pacific Ocean", correct: true },
		],
	},
	{
		question: "Which of these is NOT a programming language?",
		answers: [
			{ text: "Java", correct: false },
			{ text: "Python", correct: false },
			{ text: "Banana", correct: true },
			{ text: "JavaScript", correct: false },
		],
	},
	{
		question: "What is the chemical symbol for gold?",
		answers: [
			{ text: "Go", correct: false },
			{ text: "Gd", correct: false },
			{ text: "Au", correct: true },
			{ text: "Ag", correct: false },
		],
	},
];

//* =====================
//* QUIZ STATE VARIABLES
//* =====================

// Tracks which question we're on
let currentQuestionIndex = 0;

// Tracks correct answers
let score = 0;

// Prevents answering while showing feedback
let answersDisabled = false;

// Initialize total questions and max score display
totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

//* =====================
//* EVENT LISTENERS
//* =====================

startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

//* =====================
//* CORE FUNCTIONS
//* =====================

// Starts the quiz by resetting variables and showing first question
function startQuiz() {
	// Reset quiz state
	currentQuestionIndex = 0;
	score = 0;
	scoreSpan.textContent = score;

	// Switch screens
	startScreen.classList.remove("active");
	quizScreen.classList.add("active");

	// Show first question
	showQuestion();
}

// Displays the current question and its answer choices
function showQuestion() {
	// Reset answer state
	answersDisabled = false;

	// Get current question data
	const currentQuestion = quizQuestions[currentQuestionIndex];

	// Update question counter
	currentQuestionSpan.textContent = currentQuestionIndex + 1;

	// Update progress bar
	const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
	progressBar.style.width = `${progressPercent}%`;

	// Set question text
	questionText.textContent = currentQuestion.question;

	// Clear previous answers
	answersContainer.innerHTML = "";

	// Create answer buttons
	currentQuestion.answers.forEach((answer) => {
		const button = document.createElement("button");
		button.textContent = answer.text;
		button.classList.add("answer-btn");

		// Store whether this is the correct answer as a data attribute
		button.dataset.correct = answer.correct;

		// Add click event
		button.addEventListener("click", selectAnswer);

		// Add to container
		answersContainer.appendChild(button);
	});
}

// Handles when a user selects an answer
function selectAnswer(event) {
	// Prevent multiple answers while showing feedback
	if (answersDisabled) return;
	answersDisabled = true;

	const selectedButton = event.target;
	const isCorrect = selectedButton.dataset.correct === "true";

	// Highlight correct/incorrect answers
	Array.from(answersContainer.children).forEach((button) => {
		if (button.dataset.correct === "true") {
			button.classList.add("correct");
		} else if (button === selectedButton) {
			button.classList.add("incorrect");
		}
	});

	// Update score if correct
	if (isCorrect) {
		score++;
		scoreSpan.textContent = score;
	}

	// Move to next question or show results after 1 second delay
	setTimeout(() => {
		currentQuestionIndex++;

		if (currentQuestionIndex < quizQuestions.length) {
			showQuestion();
		} else {
			showResults();
		}
	}, 1000);
}

// Shows the final results screen
function showResults() {
	// Switch to results screen
	quizScreen.classList.remove("active");
	resultScreen.classList.add("active");

	// Set final score
	finalScoreSpan.textContent = score;

	// Calculate percentage and show appropriate message
	const percentage = (score / quizQuestions.length) * 100;

	if (percentage === 100) {
		resultMessage.textContent = "Perfect! You're a genius!";
	} else if (percentage >= 80) {
		resultMessage.textContent = "Great job! You know your stuff!";
	} else if (percentage >= 60) {
		resultMessage.textContent = "Good effort! Keep learning!";
	} else if (percentage >= 40) {
		resultMessage.textContent = "Not bad! Try again to improve!";
	} else {
		resultMessage.textContent = "Keep studying! You'll get better!";
	}
}

// Restarts the quiz from the beginning
function restartQuiz() {
	// Simply go back to start screen which will reset everything
	resultScreen.classList.remove("active");
	startQuiz();
}
