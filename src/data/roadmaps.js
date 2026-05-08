import { ML_ROADMAP } from './roadmaps/ml-python';

export const ROADMAPS = [
    // NEW ROADMAPS (Requested)
    {
        id: "cpp-fundamentals",
        title: "Programming Fundamentals (C++)",
        description: "Start your coding journey with C++. Master the basics of logic, memory management, and efficient coding.",
        level: "Beginner",
        duration: "3 Months",
        icon: "💻",
        color: "from-blue-500 to-indigo-600",
        steps: [
            {
                title: "Phase 1: The Basics (Syntax & Logic)",
                description: "Writing your first programs.",
                items: [
                    { type: "course", id: "Unit 1: Introduction to C++", title: "Setup & Variables" },
                    { type: "course", id: "Unit 2: Control Flow", title: "Decisions & Loops" },
                    { type: "topic", title: "Input/Output Mastery" }
                ]
            },
            {
                title: "Phase 2: Modular Programming",
                description: "Organizing code with functions.",
                items: [
                    { type: "course", id: "Unit 3: Functions", title: "Functions & Recursion" },
                    { type: "topic", title: "Scope & Lifetime" },
                    { type: "project", title: "Project: Number Guessing Game" }
                ]
            },
            {
                title: "Phase 3: Memory Managment",
                description: "The power of C++.",
                items: [
                    { type: "course", id: "Unit 4: Arrays & Strings", title: "Data Collections" },
                    { type: "course", id: "Unit 5: Pointers & References", title: "Pointers Deep Dive" },
                    { type: "project", title: "Project: Student Management System" }
                ]
            }
        ]
    },
    {
        id: "cpp-dsa",
        title: "Data Structures & Algorithms (C++)",
        description: "Ace technical interviews and write high-performance code. The most critical skill for top-tier software engineering jobs.",
        level: "Intermediate",
        duration: "4 Months",
        icon: "⚙️",
        color: "from-purple-500 to-pink-600",
        steps: [
            {
                title: "Phase 1: Analysis & Linear Structures",
                description: "Foundation of efficiency.",
                items: [
                    { type: "course", id: "Unit 1: Complexity Analysis", title: "Big O Notation" },
                    { type: "course", id: "Unit 2: Linear Data Structures", title: "Lists, Stacks, Queues" },
                    { type: "topic", title: "Two Pointer Technique" }
                ]
            },
            {
                title: "Phase 2: Sorting & Trees",
                description: "Organizing data.",
                items: [
                    { type: "course", id: "Unit 3: Sorting & Searching", title: "Merge/Quick Sort" },
                    { type: "course", id: "Unit 4: Trees & Graphs", title: "BST, DFS, BFS" },
                    { type: "project", title: "Project: File System Simulation" }
                ]
            },
            {
                title: "Phase 3: Advanced Problem Solving",
                description: "Hard interview problems.",
                items: [
                    { type: "course", id: "Unit 5: Advanced Algorithms", title: "Dynamic Programming" },
                    { type: "topic", title: "Graph Algorithms (Dijkstra/Prim)" },
                    { type: "project", title: "Project: Pathfinding Visualizer" }
                ]
            }
        ]
    },
    ML_ROADMAP,

    // ORIGINAL ROADMAPS
    {
        id: "ai-engineer",
        title: "Generative AI Engineer",
        description: "Master the art of building Large Language Model (LLM) applications. Go from Python basics to fine-tuning models and building agents.",
        level: "Advanced",
        duration: "4 Months",
        icon: "🤖",
        color: "from-purple-500 to-indigo-600",
        steps: [
            {
                title: "Phase 1: The Foundation",
                description: "Core programming skills required for AI.",
                items: [
                    { type: "course", id: "Python", title: "Python Mastery" },
                    { type: "topic", title: "Data Structures & Algorithms" },
                    { type: "topic", title: "APIs & JSON Handling" }
                ]
            },
            {
                title: "Phase 2: AI Fundamentals",
                description: "Understanding how machines learn.",
                items: [
                    { type: "topic", title: "Mathematics for AI (Linear Algebra)" },
                    { type: "topic", title: "Neural Networks Explained" },
                    { type: "course", id: "Machine Learning Basics" }
                ]
            },
            {
                title: "Phase 3: Large Language Models",
                description: "Working with the latest tech.",
                items: [
                    { type: "topic", title: "Transformers Architecture" },
                    { type: "topic", title: "Prompt Engineering (Zero/Few Shot)" },
                    { type: "topic", title: "RAG (Retrieval Augmented Generation)" }
                ]
            },
            {
                title: "Phase 4: Building Agents",
                description: "Creating autonomous systems.",
                items: [
                    { type: "topic", title: "LangChain & LlamaIndex" },
                    { type: "topic", title: "Vector Databases" },
                    { type: "project", title: "Capstone: Build a PDF Chatbot" }
                ]
            }
        ]
    },
    {
        id: "data-scientist",
        title: "Data Scientist",
        description: "Learn to extract insights from chaotic data. Master statistics, visualization, and predictive modeling.",
        level: "Intermediate",
        duration: "6 Months",
        icon: "📊",
        color: "from-blue-500 to-cyan-500",
        steps: [
            {
                title: "Phase 1: Data Analysis Stack",
                description: "The tools of the trade.",
                items: [
                    { type: "course", id: "Python", title: "Python for Data Science" },
                    { type: "topic", title: "NumPy & Pandas Mastery" },
                    { type: "topic", title: "Data Visualization (Matplotlib/Seaborn)" }
                ]
            },
            {
                title: "Phase 2: Mathematics & Stats",
                description: "The theory behind the magic.",
                items: [
                    { type: "topic", title: "Probability Theory" },
                    { type: "topic", title: "Hypothesis Testing" },
                    { type: "topic", title: "Statistical Distributions" }
                ]
            },
            {
                title: "Phase 3: Machine Learning",
                description: "Predicting the future.",
                items: [
                    { type: "topic", title: "Supervised Learning (Regression/Classification)" },
                    { type: "topic", title: "Unsupervised Learning (Clustering)" },
                    { type: "topic", title: "Model Evaluation & Metrics" }
                ]
            }
        ]
    },
    {
        id: "data-engineer",
        title: "Data Engineer",
        description: "Build the pipelines that power the world's data. Focus on SQL, Big Data, and Cloud Infrastructure.",
        level: "Advanced",
        duration: "5 Months",
        icon: "🛠️",
        color: "from-orange-500 to-red-500",
        steps: [
            {
                title: "Phase 1: Database Mastery",
                description: "Where data lives.",
                items: [
                    { type: "topic", title: "Advanced SQL (Window Functions)" },
                    { type: "topic", title: "Database Design & Normalization" },
                    { type: "topic", title: "NoSQL Databases" }
                ]
            },
            {
                title: "Phase 2: Big Data Processing",
                description: "Handling massive scale.",
                items: [
                    { type: "topic", title: "Apache Spark Basics" },
                    { type: "topic", title: "ETL Pipelines" },
                    { type: "topic", title: "Data Warehousing Concepts" }
                ]
            },
            {
                title: "Phase 3: Cloud & Infrastructure",
                description: "Deploying scalable systems.",
                items: [
                    { type: "topic", title: "AWS/GCP for Data Engineering" },
                    { type: "topic", title: "Docker & Kubernetes Basics" },
                    { type: "topic", title: "CI/CD for Data Pipelines" }
                ]
            }
        ]
    }
];
