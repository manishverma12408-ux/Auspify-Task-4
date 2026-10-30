
// Quiz Questions
const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Tool Multi Language",
            "Home Text Markup Language"
        ],
        answer: 0
    },
    {
        question: "Which language is used to style web pages?",
        options: [
            "HTML",
            "CSS",
            "Python",
            "C++"
        ],
        answer: 1
    },
    {
        question: "Which tag is used to create a hyperlink in HTML?",
        options: [
            "<link>",
            "<p>",
            "<a>",
            "<h1>"
        ],
        answer: 2
    },
    {
        question: "Which language makes a webpage interactive?",
        options: [
            "CSS",
            "HTML",
            "Java",
            "JavaScript"
        ],
        answer: 3
    },
    {
        question: "Which symbol is used for comments in JavaScript?",
        options: [
            "<!-- -->",
            "//",
            "**",
            "##"
        ],
        answer: 1
    }
];

// Get HTML Elements
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const questionNumberElement = document.getElementById("questionNumber");
const scoreElement = document.getElementById("score");
const progressBar = document.getElementById("progressBar");
const feedbackElement = document.getElementById("feedback");

const quizBox = document.getElementById("quizBox");
const resultBox = document.getElementById("resultBox");

const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const restartBtn = document.getElementById("restartBtn");

const finalScoreElement = document.getElementById("finalScore");
const resultMessageElement = document.getElementById("resultMessage");
const answerElement = document.getElementById("answer");

// Quiz Variables
let currentQuestion = 0;
let userAnswers = new Array(questions.length).fill(null);
let score = 0;

// Calculate Score
function calculateScore() {
    score = 0;

    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].answer) {
            score++;
        }
    });
}

// Display Question
function showQuestion() {
    const current = questions[currentQuestion];

    questionElement.textContent = current.question;

    questionNumberElement.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    calculateScore();
    scoreElement.textContent = `Score: ${score}`;

    progressBar.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    optionsElement.innerHTML = "";
    feedbackElement.textContent = "";

    current.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.textContent = option;
        button.classList.add("option");
        button.type = "button";

        if (userAnswers[currentQuestion] === index) {
            button.classList.add("selected");
        }

        button.addEventListener("click", () => {
            selectAnswer(index);
        });

        optionsElement.appendChild(button);
    });

    previousBtn.disabled = currentQuestion === 0;

    nextBtn.hidden = currentQuestion === questions.length - 1;
    submitBtn.hidden = currentQuestion !== questions.length - 1;
}

// Select Answer
function selectAnswer(selectedIndex) {
    userAnswers[currentQuestion] = selectedIndex;

    const correctAnswer = questions[currentQuestion].answer;
    const optionButtons = optionsElement.querySelectorAll(".option");

    optionButtons.forEach((button, index) => {
        button.classList.remove("selected", "correct", "incorrect");

        if (index === correctAnswer) {
            button.classList.add("correct");
        }

        if (index === selectedIndex && selectedIndex !== correctAnswer) {
            button.classList.add("incorrect");
        }

        button.disabled = true;
    });

    if (selectedIndex === correctAnswer) {
        feedbackElement.textContent = "Correct Answer!";
        feedbackElement.style.color = "green";
    } else {
        feedbackElement.textContent = "Wrong Answer! Correct answer: " +
            questions[currentQuestion].options[correctAnswer];

        feedbackElement.style.color = "red";
    }

    calculateScore();
    scoreElement.textContent = `Score: ${score}`;
}

// Next Question
nextBtn.addEventListener("click", () => {
    if (userAnswers[currentQuestion] === null) {
        feedbackElement.textContent = "Please select an answer first!";
        feedbackElement.style.color = "red";
        return;
    }

    currentQuestion++;
    showQuestion();
});

// Previous Question
previousBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
});

// Submit Quiz
submitBtn.addEventListener("click", () => {
    if (userAnswers.includes(null)) {
        feedbackElement.textContent = "Please answer all questions first!";
        feedbackElement.style.color = "red";
        return;
    }

    showResult();
});

// Show Final Result
function showResult() {
    calculateScore();

    quizBox.hidden = true;
    resultBox.hidden = false;

    const percentage = (score / questions.length) * 100;

    finalScoreElement.textContent =
        `Your Score: ${score}/${questions.length}`;

    if (percentage >= 80) {
        resultMessageElement.textContent = "Excellent! Great job!";
    } else if (percentage >= 50) {
        resultMessageElement.textContent = "Good work! Keep practising.";
    } else {
        resultMessageElement.textContent = "Keep learning and try again!";
    }

    answerElement.innerHTML = "<h3>Answer Summary</h3>";

    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.answer;

        const summary = document.createElement("div");
        summary.classList.add("summary-item");

        const questionText = document.createElement("strong");
        questionText.textContent =
            `${index + 1}. ${question.question}`;

        const yourAnswer = document.createElement("p");
        yourAnswer.textContent =
            `Your Answer: ${question.options[userAnswer]}`;
        yourAnswer.classList.add(
            isCorrect ? "correct-answer" : "wrong-answer"
        );

        const correctAnswer = document.createElement("p");
        correctAnswer.textContent =
            `Correct Answer: ${question.options[question.answer]}`;

        summary.appendChild(questionText);
        summary.appendChild(yourAnswer);
        summary.appendChild(correctAnswer);

        answerElement.appendChild(summary);
    });
}

// Restart Quiz
restartBtn.addEventListener("click", () => {
    currentQuestion = 0;
    userAnswers = new Array(questions.length).fill(null);
    score = 0;

    quizBox.hidden = false;
    resultBox.hidden = true;

    showQuestion();
});

// Start Quiz
showQuestion();
