
// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
    });

// Create Quiz Result Schema
const resultSchema = new mongoose.Schema({
    studentName: {
        type: String,
        default: "Student"
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Create Model
const QuizResult = mongoose.model("QuizResult", resultSchema);

// Home Route
app.get("/", (req, res) => {
    res.send("Online Quiz Application Backend is Running!");
});

// Save Quiz Result
app.post("/api/results", async (req, res) => {
    try {
        const { studentName, score, totalQuestions } = req.body;

        if (
            !Number.isInteger(score) ||
            !Number.isInteger(totalQuestions) ||
            totalQuestions <= 0 ||
            score < 0 ||
            score > totalQuestions
        ) {
            return res.status(400).json({
                message: "Invalid quiz result"
            });
        }

        const percentage = (score / totalQuestions) * 100;

        const newResult = new QuizResult({
            studentName,
            score,
            totalQuestions,
            percentage
        });

        await newResult.save();

        res.status(201).json({
            message: "Quiz result saved successfully!",
            result: newResult
        });

    } catch (error) {
        res.status(500).json({
            message: "Error saving quiz result",
            error: error.message
        });
    }
});

// noGet All Quiz Results
app.get("/api/results", async (req, res) => {
    try {
        const results = await QuizResult.find().sort({ date: -1 });

        res.status(200).json(results);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching quiz results",
            error: error.message
        });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
