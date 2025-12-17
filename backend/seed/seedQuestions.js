require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

const sampleQuestions = [
  // Physics
  {
    question: "What is Newton's First Law of Motion?",
    options: [
      "Force equals mass times acceleration",
      "An object at rest stays at rest unless acted upon by a force",
      "For every action there is an equal and opposite reaction",
      "Energy cannot be created or destroyed"
    ],
    correctAnswer: "An object at rest stays at rest unless acted upon by a force",
    subject: "Physics",
    difficulty: "easy"
  },
  {
    question: "What is the SI unit of electric current?",
    options: ["Volt", "Watt", "Ampere", "Ohm"],
    correctAnswer: "Ampere",
    subject: "Physics",
    difficulty: "easy"
  },
  {
    question: "What is the speed of light in vacuum (approximately)?",
    options: ["3 × 10⁶ m/s", "3 × 10⁸ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"],
    correctAnswer: "3 × 10⁸ m/s",
    subject: "Physics",
    difficulty: "medium"
  },
  {
    question: "Which particle has a negative charge?",
    options: ["Proton", "Neutron", "Electron", "Positron"],
    correctAnswer: "Electron",
    subject: "Physics",
    difficulty: "easy"
  },
  {
    question: "What is the formula for kinetic energy?",
    options: ["KE = mv", "KE = ½mv²", "KE = mgh", "KE = mv²"],
    correctAnswer: "KE = ½mv²",
    subject: "Physics",
    difficulty: "medium"
  },

  // Computer Science
  {
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Program Utility",
      "Computer Processing Unit"
    ],
    correctAnswer: "Central Processing Unit",
    subject: "Computer Science",
    difficulty: "easy"
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    correctAnswer: "O(log n)",
    subject: "Computer Science",
    difficulty: "medium"
  },
  {
    question: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: "Stack",
    subject: "Computer Science",
    difficulty: "easy"
  },
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language"
    ],
    correctAnswer: "Hyper Text Markup Language",
    subject: "Computer Science",
    difficulty: "easy"
  },
  {
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort"],
    correctAnswer: "Quick Sort",
    subject: "Computer Science",
    difficulty: "medium"
  },

  // Mathematics
  {
    question: "What is the value of π (pi) to two decimal places?",
    options: ["3.12", "3.14", "3.16", "3.18"],
    correctAnswer: "3.14",
    subject: "Mathematics",
    difficulty: "easy"
  },
  {
    question: "What is the derivative of x²?",
    options: ["x", "2x", "x²", "2x²"],
    correctAnswer: "2x",
    subject: "Mathematics",
    difficulty: "medium"
  },
  {
    question: "What is the sum of angles in a triangle?",
    options: ["90°", "180°", "270°", "360°"],
    correctAnswer: "180°",
    subject: "Mathematics",
    difficulty: "easy"
  },
  {
    question: "What is the integral of 2x?",
    options: ["x", "x²", "2x²", "x² + C"],
    correctAnswer: "x² + C",
    subject: "Mathematics",
    difficulty: "medium"
  },
  {
    question: "What is log₁₀(1000)?",
    options: ["2", "3", "4", "10"],
    correctAnswer: "3",
    subject: "Mathematics",
    difficulty: "medium"
  },

  // Chemistry
  {
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: "Au",
    subject: "Chemistry",
    difficulty: "easy"
  },
  {
    question: "What is the pH of pure water?",
    options: ["0", "7", "14", "1"],
    correctAnswer: "7",
    subject: "Chemistry",
    difficulty: "easy"
  },
  {
    question: "How many electrons are in a neutral Hydrogen atom?",
    options: ["0", "1", "2", "3"],
    correctAnswer: "1",
    subject: "Chemistry",
    difficulty: "easy"
  },
  {
    question: "What is the most abundant gas in Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: "Nitrogen",
    subject: "Chemistry",
    difficulty: "medium"
  },
  {
    question: "What type of bond is formed when electrons are shared?",
    options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
    correctAnswer: "Covalent bond",
    subject: "Chemistry",
    difficulty: "medium"
  },

  // General Knowledge
  {
    question: "What is the capital of Japan?",
    options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
    correctAnswer: "Tokyo",
    subject: "General",
    difficulty: "easy"
  },
  {
    question: "In what year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: "1945",
    subject: "General",
    difficulty: "easy"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"],
    correctAnswer: "Leonardo da Vinci",
    subject: "General",
    difficulty: "easy"
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Saturn", "Neptune", "Jupiter", "Uranus"],
    correctAnswer: "Jupiter",
    subject: "General",
    difficulty: "easy"
  },
  {
    question: "What is the largest organ in the human body?",
    options: ["Heart", "Liver", "Brain", "Skin"],
    correctAnswer: "Skin",
    subject: "General",
    difficulty: "medium"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz1v1');
    console.log('Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert new questions
    await Question.insertMany(sampleQuestions);
    console.log(`Inserted ${sampleQuestions.length} questions`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
