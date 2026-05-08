export const COURSES = {
    "C#": {
        "Absolute Beginner": [
            {
                id: "csharp-abs-unit-1",
                title: "Unit 1: The Basics of C#",
                description: "Your first steps into the world of C# programming.",
                lessons: [
                    { id: "csharp-abs-1-1", title: "Setting Up Your Environment", description: "Installing VS Code and .NET SDK." },
                    { id: "csharp-abs-1-2", title: "Hello World", description: "Writing and running your first C# program." },
                    { id: "csharp-abs-1-3", title: "Variables & Data Types", description: "int, string, bool, and double." },
                    { id: "csharp-abs-1-4", title: "Basic Input & Output", description: "Console.WriteLine and Console.ReadLine." },
                    { id: "csharp-abs-1-5", title: "String Basics", description: "Concatenation and interpolation." },
                    { id: "csharp-abs-1-6", title: "Math Operations", description: "Addition, subtraction, multiplication, division." },
                    { id: "csharp-abs-1-7", title: "Comments & Code Style", description: "Writing readable code." },
                    { id: "csharp-abs-1-8", title: "Project: Number Guessing Game", description: "Put it all together." }
                ]
            }
        ],
        "Beginner": [
            {
                id: "csharp-beg-unit-1",
                title: "Unit 1: Control Flow",
                description: "Making decisions and repeating actions.",
                lessons: [
                    { id: "csharp-beg-1-1", title: "If/Else Statements", description: "Conditional logic." },
                    { id: "csharp-beg-1-2", title: "Switch Expressions", description: "Handling multiple conditions cleanly." },
                    { id: "csharp-beg-1-3", title: "While & Do-While Loops", description: "Repeating code while a condition is true." },
                    { id: "csharp-beg-1-4", title: "For Loops", description: "Iterating a specific number of times." },
                    { id: "csharp-beg-1-5", title: "Logical Operators", description: "AND, OR, and NOT." }
                ]
            },
            {
                id: "csharp-beg-unit-2",
                title: "Unit 2: Methods & Arrays",
                description: "Structuring code and storing data.",
                lessons: [
                    { id: "csharp-beg-2-1", title: "Defining Methods", description: "Creating reusable code blocks." },
                    { id: "csharp-beg-2-2", title: "Parameters & Return Values", description: "Passing data in and out." },
                    { id: "csharp-beg-2-3", title: "Method Scope", description: "Variable visibility." },
                    { id: "csharp-beg-2-4", title: "Introduction to Arrays", description: "Storing multiple values." },
                    { id: "csharp-beg-2-5", title: "Looping Through Arrays", description: "Processing lists of data." },
                    { id: "csharp-beg-2-6", title: "Project: Simple Calculator", description: "Building a functional tool." }
                ]
            }
        ],
        "Intermediate": [
            {
                id: "csharp-int-unit-1",
                title: "Unit 1: Object-Oriented Basics",
                description: "Introduction to classes and objects.",
                lessons: [
                    { id: "csharp-int-1-1", title: "Classes vs Objects", description: "The blueprint and the house." },
                    { id: "csharp-int-1-2", title: "Fields & Properties", description: "Storing state safely." },
                    { id: "csharp-int-1-3", title: "Methods in Classes", description: "Adding behavior to objects." },
                    { id: "csharp-int-1-4", title: "Constructors", description: "Initializing objects." },
                    { id: "csharp-int-1-5", title: "Namespace & Using", description: "Organizing your code." }
                ]
            },
            {
                id: "csharp-int-unit-2",
                title: "Unit 2: Collections & Lists",
                description: "Beyond simple arrays.",
                lessons: [
                    { id: "csharp-int-2-1", title: "List<T>", description: "Dynamic arrays." },
                    { id: "csharp-int-2-2", title: "Dictionary<TKey, TValue>", description: "Key-value pairs." },
                    { id: "csharp-int-2-3", title: "Foreach Loop", description: "Iterating collections elegantly." },
                    { id: "csharp-int-2-4", title: "LINQ Basics", description: "Querying data specifically." },
                    { id: "csharp-int-2-5", title: "Project: Todo List Console App", description: "Managing tasks." }
                ]
            }
        ],
        "Advanced": [
            {
                id: "csharp-adv-unit-1",
                title: "Unit 1: Advanced OOP - Classes & Objects",
                description: "Master the building blocks of C# Object-Oriented Programming.",
                lessons: [
                    { id: "csharp-adv-1-1", title: "Anatomy of a Class", description: "Fields, Methods, and Access Modifiers." },
                    { id: "csharp-adv-1-2", title: "Constructors & Object Initialization", description: "Control how objects are created." },
                    { id: "csharp-adv-1-3", title: "Properties vs Fields", description: "Encapsulation best practices." },
                    { id: "csharp-adv-1-4", title: "Static Members & Static Classes", description: "Shared data and utility classes." },
                    { id: "csharp-adv-1-5", title: "Method Overloading", description: "Multiple methods with the same name." },
                    { id: "csharp-adv-1-6", title: "Object Composition", description: "Building complex objects from parts." },
                    { id: "csharp-adv-1-7", title: "Partial Classes", description: "Splitting code across files." },
                    { id: "csharp-adv-1-8", title: "Extension Methods", description: "Adding methods to existing types." },
                    { id: "csharp-adv-1-9", title: "Destructors & Finalizers", description: "Cleanup and memory management." },
                    { id: "csharp-adv-1-10", title: "Project: Build a Bank Account System", description: "Apply all OOP concepts." }
                ]
            },
            {
                id: "csharp-adv-unit-2",
                title: "Unit 2: Inheritance & Polymorphism",
                description: "Create flexible and reusable code hierarchies.",
                lessons: [
                    { id: "csharp-adv-2-1", title: "Inheritance Basics", description: "Base classes and Derived classes." },
                    { id: "csharp-adv-2-2", title: "The 'base' and 'this' Keywords", description: "Referencing parent and current instances." },
                    { id: "csharp-adv-2-3", title: "Method Overriding (virtual/override)", description: "Changing behavior in subclasses." },
                    { id: "csharp-adv-2-4", title: "Abstract Classes", description: "Partial blueprints." },
                    { id: "csharp-adv-2-5", title: "Sealed Classes & Methods", description: "Preventing inheritance." },
                    { id: "csharp-adv-2-6", title: "Polymorphism Explained", description: "Start treating objects as their base type." },
                    { id: "csharp-adv-2-7", title: "Interfaces Introduction", description: "Defining contracts." },
                    { id: "csharp-adv-2-8", title: "Interfaces vs Abstract Classes", description: "When to use which?" },
                    { id: "csharp-adv-2-9", title: "Explicit Interface Implementation", description: "Handling naming conflicts." },
                    { id: "csharp-adv-2-10", title: "Project: RPG Character System", description: "Warrior, Mage, Archer class hierarchy." }
                ]
            },
            {
                id: "csharp-adv-unit-3",
                title: "Unit 3: File I/O & Serialization",
                description: "Reading, writing, and saving data.",
                lessons: [
                    { id: "csharp-adv-3-1", title: "System.IO Basics", description: "Files, Directories, and Paths." },
                    { id: "csharp-adv-3-2", title: "Reading Text Files", description: "StreamReader and File.ReadAllText." },
                    { id: "csharp-adv-3-3", title: "Writing Text Files", description: "StreamWriter and File.WriteAllText." },
                    { id: "csharp-adv-3-4", title: "File Streams & Buffers", description: "Efficient large file handling." },
                    { id: "csharp-adv-3-5", title: "JSON Serialization (System.Text.Json)", description: "Saving objects to JSON." },
                    { id: "csharp-adv-3-6", title: "XML Serialization", description: "Working with XML data." },
                    { id: "csharp-adv-3-7", title: "Binary Serialization", description: "Understanding the risks and legacy." },
                    { id: "csharp-adv-3-8", title: "Async File I/O", description: "Non-blocking file operations." },
                    { id: "csharp-adv-3-9", title: "Working with CSVs", description: "Parsing tabular data." },
                    { id: "csharp-adv-3-10", title: "Project: Save/Load Game State", description: "Persisting player progress." }
                ]
            }
        ],
        "Expert": [
            {
                id: "csharp-exp-unit-1",
                title: "Unit 1: Advanced C# Features",
                description: "Deep dive into language internals.",
                lessons: [
                    { id: "csharp-exp-1-1", title: "Delegates & Events", description: "Event-driven programming." },
                    { id: "csharp-exp-1-2", title: "Lambda Expressions", description: "Inline functions and closures." },
                    { id: "csharp-exp-1-3", title: "Reflection", description: "Inspecting metadata at runtime." },
                    { id: "csharp-exp-1-4", title: "Attributes", description: "Declarative programming." },
                    { id: "csharp-exp-1-5", title: "Unsafe Code & Pointers", description: "Direct memory management." }
                ]
            },
            {
                id: "csharp-exp-unit-2",
                title: "Unit 2: Asynchronous Programming Patterns",
                description: "Mastering concurrency.",
                lessons: [
                    { id: "csharp-exp-2-1", title: "Task Parallel Library (TPL)", description: "Working with Tasks." },
                    { id: "csharp-exp-2-2", title: "Async Streams (IAsyncEnumerable)", description: "Streaming data asynchronously." },
                    { id: "csharp-exp-2-3", title: "ThreadPool Handling", description: "Managing thread execution." },
                    { id: "csharp-exp-2-4", title: "Synchronization Contexts", description: "UI vs Background threads." },
                    { id: "csharp-exp-2-5", title: "Locks & Monitors", description: "Thread safety." }
                ]
            }
        ]
    },
    "Python": {
        "Absolute Beginner": [
            {
                id: "py-abs-unit-1",
                title: "Unit 1: Welcome to Python",
                description: "Getting started with the easiest language.",
                lessons: [
                    { id: "py-abs-1-1", title: "Installing Python", description: "Setup on Windows/Mac/Linux." },
                    { id: "py-abs-1-2", title: "Your First Script", description: "Print command basics." },
                    { id: "py-abs-1-3", title: "Variables", description: "Storing data in boxes." },
                    { id: "py-abs-1-4", title: "Data Types", description: "Strings, Integers, Floats." },
                    { id: "py-abs-1-5", title: "Basic Math", description: "Calculate with Python." }
                ]
            }
        ],
        "Beginner": [
            {
                id: "py-beg-unit-1",
                title: "Unit 1: Logic & Flow",
                description: "Making your program think.",
                lessons: [
                    { id: "py-beg-1-1", title: "Booleans", description: "True or False?" },
                    { id: "py-beg-1-2", title: "If/Elif/Else", description: "Conditional branching." },
                    { id: "py-beg-1-3", title: "User Input", description: "Interacting with the keyboard." },
                    { id: "py-beg-1-4", title: "String Manipulation", description: "Slicing and dicing text." }
                ]
            },
            {
                id: "py-beg-unit-2",
                title: "Unit 2: Loops & Lists",
                description: "Handling repeated tasks.",
                lessons: [
                    { id: "py-beg-2-1", title: "While Loops", description: "Looping based on conditions." },
                    { id: "py-beg-2-2", title: "Lists", description: "Ordered collections." },
                    { id: "py-beg-2-3", title: "For Loops", description: "Iterating through lists." },
                    { id: "py-beg-2-4", title: "Range() Function", description: "Generating number sequences." },
                    { id: "py-beg-2-5", title: "Project: Shopping List App", description: "Manage a list of items." }
                ]
            }
        ],
        "Intermediate": [
            {
                id: "py-int-unit-1",
                title: "Unit 1: Functions & Modules",
                description: "Organizing your code.",
                lessons: [
                    { id: "py-int-1-1", title: "Writing Functions", description: "def keyword and scope." },
                    { id: "py-int-1-2", title: "Arguments & Returns", description: "Passing data around." },
                    { id: "py-int-1-3", title: "Dictionaries", description: "Key-value data storage." },
                    { id: "py-int-1-4", title: "Tuples & Sets", description: "Immutable and unique collections." },
                    { id: "py-int-1-5", title: "Modules & Imports", description: "Using Python's standard library." }
                ]
            },
            {
                id: "py-int-unit-2",
                title: "Unit 2: Basic OOP",
                description: "Classes in Python.",
                lessons: [
                    { id: "py-int-2-1", title: "Classes & Instances", description: "Creating custom types." },
                    { id: "py-int-2-2", title: "The __init__ Method", description: "Constructors in Python." },
                    { id: "py-int-2-3", title: "Instance Methods", description: "Behaviors of objects." },
                    { id: "py-int-2-4", title: "Inheritance", description: "Parent and Child classes." },
                    { id: "py-int-2-5", title: "Project: Library Management", description: "Books and Patrons." }
                ]
            }
        ],
        "Advanced": [
            {
                id: "py-adv-unit-1",
                title: "Unit 1: Advanced OOP & Features",
                description: "Professional Python patterns.",
                lessons: [
                    { id: "py-adv-1-1", title: "Class Methods vs Static Methods", description: "Decorators." },
                    { id: "py-adv-1-2", title: "Properties", description: "Getters and Setters pythonic way." },
                    { id: "py-adv-1-3", title: "Magic Methods (Dunder Methods)", description: "__str__, __repr__, __len__." },
                    { id: "py-adv-1-4", title: "Inheritance & Super()", description: "Deep dive." },
                    { id: "py-adv-1-5", title: "Abstract Base Classes", description: "Enforcing interfaces." }
                ]
            },
            {
                id: "py-adv-unit-2",
                title: "Unit 2: File I/O & Error Handling",
                description: "Robust applications.",
                lessons: [
                    { id: "py-adv-2-1", title: "Reading/Writing Files", description: "The 'with' statement." },
                    { id: "py-adv-2-2", title: "CSV & JSON Handling", description: "Data interchange." },
                    { id: "py-adv-2-3", title: "Try/Except/Finally", description: "Catching errors gracefully." },
                    { id: "py-adv-2-4", title: "Custom Exceptions", description: "Raising your own errors." },
                    { id: "py-adv-2-5", title: "Logging", description: "Tracking app execution." }
                ]
            }
        ],
        "Expert": [
            {
                id: "py-exp-unit-1",
                title: "Unit 1: Metaprogramming & Internals",
                description: "Hacking the language.",
                lessons: [
                    { id: "py-exp-1-1", title: "Decorators Deep Dive", description: "Writing custom decorators." },
                    { id: "py-exp-1-2", title: "Generators & Iterators", description: "Yield keyword." },
                    { id: "py-exp-1-3", title: "Context Managers", description: "__enter__ and __exit__." },
                    { id: "py-exp-1-4", title: "Metaclasses", description: "Classes that create classes." },
                    { id: "py-exp-1-5", title: "Concurrency: Threading vs Multiprocessing", description: "Parallel execution." }
                ]
            }
        ]
    },
    "Java": {
        "Absolute Beginner": [
            {
                id: "java-abs-unit-1",
                title: "Unit 1: Java Fundamentals",
                description: "Entering the Java ecosystem.",
                lessons: [
                    { id: "java-abs-1-1", title: "Java Setup & JDK", description: "Understanding the JVM." },
                    { id: "java-abs-1-2", title: "Main Method", description: "public static void main." },
                    { id: "java-abs-1-3", title: "Variables & Primatives", description: "int, double, char, boolean." },
                    { id: "java-abs-1-4", title: "Operators", description: "Arithmetic and Assignment." },
                    { id: "java-abs-1-5", title: "Type Casting", description: "Implicit vs Explicit." }
                ]
            }
        ],
        "Beginner": [
            {
                id: "java-beg-unit-1",
                title: "Unit 1: Control Structures",
                description: "Logic flow in Java.",
                lessons: [
                    { id: "java-beg-1-1", title: "If-Else & Switch", description: "Branching code." },
                    { id: "java-beg-1-2", title: "While Loops", description: "Repeating code." },
                    { id: "java-beg-1-3", title: "For Loops", description: "Standard and Enhanced for-loop." },
                    { id: "java-beg-1-4", title: "Break & Continue", description: "Loop control." }
                ]
            },
            {
                id: "java-beg-unit-2",
                title: "Unit 2: Arrays & Methods",
                description: "Modular programming.",
                lessons: [
                    { id: "java-beg-2-1", title: "Defining Methods", description: "Parameters and Scope." },
                    { id: "java-beg-2-2", title: "Method Overloading", description: "Same name, different params." },
                    { id: "java-beg-2-3", title: "Single Dimensional Arrays", description: "Fixed size lists." },
                    { id: "java-beg-2-4", title: "Multi-Dimensional Arrays", description: "Matrices and Grids." },
                    { id: "java-beg-2-5", title: "String Manipulation", description: "String class methods." }
                ]
            }
        ],
        "Intermediate": [
            {
                id: "java-int-unit-1",
                title: "Unit 1: Object-Oriented Programming",
                description: "The core of Java.",
                lessons: [
                    { id: "java-int-1-1", title: "Classes & Objects", description: "Instantiation." },
                    { id: "java-int-1-2", title: "Constructors", description: "this keyword." },
                    { id: "java-int-1-3", title: "Encapsulation", description: "Getters, Setters, Access Modifiers." },
                    { id: "java-int-1-4", title: "Inheritance", description: "extends keyword." },
                    { id: "java-int-1-5", title: "Polymorphism", description: "Overriding vs Overloading." }
                ]
            },
            {
                id: "java-int-unit-2",
                title: "Unit 2: Abstraction & Interfaces",
                description: "Designing architecture.",
                lessons: [
                    { id: "java-int-2-1", title: "Abstract Classes", description: "Partial implementation." },
                    { id: "java-int-2-2", title: "Interfaces", description: "implements keyword." },
                    { id: "java-int-2-3", title: "Packages", description: "Organizing classes." },
                    { id: "java-int-2-4", title: "Exception Handling", description: "try-catch-finally." }
                ]
            }
        ],
        "Advanced": [
            {
                id: "java-adv-unit-1",
                title: "Unit 1: Collections Framework",
                description: "Managing groups of objects.",
                lessons: [
                    { id: "java-adv-1-1", title: "ArrayList & LinkedList", description: "List interface." },
                    { id: "java-adv-1-2", title: "HashSet & TreeSet", description: "Set interface." },
                    { id: "java-adv-1-3", title: "HashMap & TreeMap", description: "Map interface." },
                    { id: "java-adv-1-4", title: "Iterators", description: "Traversing collections." },
                    { id: "java-adv-1-5", title: "Generics", description: "Type safety." }
                ]
            },
            {
                id: "java-adv-unit-2",
                title: "Unit 2: File I/O & Streams",
                description: "Data persistence.",
                lessons: [
                    { id: "java-adv-2-1", title: "File Class", description: "Managing files." },
                    { id: "java-adv-2-2", title: "Reading/Writing Files", description: "FileReader/FileWriter." },
                    { id: "java-adv-2-3", title: "Serialization", description: "Saving objects to bytes." },
                    { id: "java-adv-2-4", title: "Java 8 Streams API", description: "Functional processing." },
                    { id: "java-adv-2-5", title: "Lambdas", description: "Anonymous functions." }
                ]
            }
        ],
        "Expert": [
            {
                id: "java-exp-unit-1",
                title: "Unit 1: Multithreading & Concurrency",
                description: "Parallel processing.",
                lessons: [
                    { id: "java-exp-1-1", title: "Thread Class vs Runnable", description: "Creating threads." },
                    { id: "java-exp-1-2", title: "Thread Lifecycle", description: "States of a thread." },
                    { id: "java-exp-1-3", title: "Synchronization", description: "Preventing race conditions." },
                    { id: "java-exp-1-4", title: "Executors Framework", description: "Thread pools." },
                    { id: "java-exp-1-5", title: "Concurrent Collections", description: "Thread-safe maps/lists." }
                ]
            }
        ]
    },
    // NEW COURSES
    "Programming Fundamentals (C++)": {
        "Beginner": [
            {
                id: "cpp-fund-unit-1",
                title: "Unit 1: Introduction to C++",
                description: "Setting up and writing your first code.",
                lessons: [
                    { id: "cpp-fund-1-1", title: "Setup & Hello World", description: "Compilers, IDEs, and main()." },
                    { id: "cpp-fund-1-2", title: "Variables & Constants", description: "int, float, char, bool, const." },
                    { id: "cpp-fund-1-3", title: "Input/Output (cin/cout)", description: "Interacting with the user." },
                    { id: "cpp-fund-1-4", title: "Operators", description: "Arithmetic, Relational, Logical." }
                ]
            },
            {
                id: "cpp-fund-unit-2",
                title: "Unit 2: Control Flow",
                description: "Making decisions and loops.",
                lessons: [
                    { id: "cpp-fund-2-1", title: "If-Else Statements", description: "Conditional logic." },
                    { id: "cpp-fund-2-2", title: "Switch Case", description: "Multiple choice handling." },
                    { id: "cpp-fund-2-3", title: "Loops (For, While, Do-While)", description: "Repetition structures." },
                    { id: "cpp-fund-2-4", title: "Break & Continue", description: "Controlling loop execution." }
                ]
            },
            {
                id: "cpp-fund-unit-3",
                title: "Unit 3: Functions",
                description: "Modular programming.",
                lessons: [
                    { id: "cpp-fund-3-1", title: "Defining Functions", description: "Return types and parameters." },
                    { id: "cpp-fund-3-2", title: "Function Overloading", description: "Same name, different params." },
                    { id: "cpp-fund-3-3", title: "Recursion", description: "Functions calling themselves." },
                    { id: "cpp-fund-3-4", title: "Pass by Value vs Reference", description: "Understanding memory flow." }
                ]
            },
            {
                id: "cpp-fund-unit-4",
                title: "Unit 4: Arrays & Strings",
                description: "Storing data collections.",
                lessons: [
                    { id: "cpp-fund-4-1", title: "1D Arrays", description: "Lists of items." },
                    { id: "cpp-fund-4-2", title: "Multidimensional Arrays", description: "Matrices and grids." },
                    { id: "cpp-fund-4-3", title: "C-Style Strings", description: "Char arrays." },
                    { id: "cpp-fund-4-4", title: "std::string Class", description: "Modern string handling." }
                ]
            },
            {
                id: "cpp-fund-unit-5",
                title: "Unit 5: Pointers & References",
                description: "Direct memory access.",
                lessons: [
                    { id: "cpp-fund-5-1", title: "Pointer Basics", description: "Addresses and dereferencing." },
                    { id: "cpp-fund-5-2", title: "Pointers and Arrays", description: "Array-pointer relationship." },
                    { id: "cpp-fund-5-3", title: "Dynamic Memory Allocation", description: "new and delete keywords." }
                ]
            }
        ]
    },
    "Data Structures & Algorithms (C++)": {
        "Intermediate": [
            {
                id: "cpp-dsa-unit-1",
                title: "Unit 1: Complexity Analysis",
                description: "Measuring efficiency.",
                lessons: [
                    { id: "cpp-dsa-1-1", title: "Big O Notation", description: "Time and Space complexity." },
                    { id: "cpp-dsa-1-2", title: "Best, Average, Worst Case", description: "Analyzing scenarios." },
                    { id: "cpp-dsa-1-3", title: "Space Complexity", description: "Memory usage analysis." }
                ]
            },
            {
                id: "cpp-dsa-unit-2",
                title: "Unit 2: Linear Data Structures",
                description: "Organizing data sequentially.",
                lessons: [
                    { id: "cpp-dsa-2-1", title: "Linked Lists (Singly/Doubly)", description: "Dynamic nodes." },
                    { id: "cpp-dsa-2-2", title: "Stacks", description: "LIFO principle." },
                    { id: "cpp-dsa-2-3", title: "Queues", description: "FIFO principle." },
                    { id: "cpp-dsa-2-4", title: "Vectors (Dynamic Arrays)", description: "std::vector deep dive." }
                ]
            },
            {
                id: "cpp-dsa-unit-3",
                title: "Unit 3: Sorting & Searching",
                description: "Finding and ordering data.",
                lessons: [
                    { id: "cpp-dsa-3-1", title: "Binary Search", description: "O(log n) searching." },
                    { id: "cpp-dsa-3-2", title: "Bubble, Selection, Insertion Sort", description: "Basic sorting." },
                    { id: "cpp-dsa-3-3", title: "Merge Sort", description: "Divide and conquer." },
                    { id: "cpp-dsa-3-4", title: "Quick Sort", description: "Pivot-based partitioning." }
                ]
            },
            {
                id: "cpp-dsa-unit-4",
                title: "Unit 4: Trees & Graphs",
                description: "Hierarchical data.",
                lessons: [
                    { id: "cpp-dsa-4-1", title: "Binary Trees", description: "Traversals (In/Pre/Post-order)." },
                    { id: "cpp-dsa-4-2", title: "Binary Search Trees (BST)", description: "Efficient lookup." },
                    { id: "cpp-dsa-4-3", title: "Graphs Basics", description: "Adjacency Matrix vs List." },
                    { id: "cpp-dsa-4-4", title: "BFS & DFS", description: "Graph traversal algorithms." }
                ]
            },
            {
                id: "cpp-dsa-unit-5",
                title: "Unit 5: Advanced Algorithms",
                description: "Solving complex problems.",
                lessons: [
                    { id: "cpp-dsa-5-1", title: "Greedy Algorithms", description: "Local optimum choices." },
                    { id: "cpp-dsa-5-2", title: "Dynamic Programming Basics", description: "Memoization and Tabulation." },
                    { id: "cpp-dsa-5-3", title: "Hashing", description: "Hash Maps and collisions." }
                ]
            }
        ]
    },
    "Machine Learning (Python) 🤖": {
        "Advanced": [
            {
                id: "ml-unit-1",
                phase: "Phase 1: Foundations & The Spark",
                title: "Unit 1: The AI Revolution 🚀",
                description: "From magic to math. Understanding the AI landscape.",
                lessons: [
                    { id: "ml-1-1", title: "Magic or Math? The Truth About AI 🎩", description: "Intro to AI concepts." },
                    { id: "ml-1-2", title: "The History of Intelligence: From Golems to GPT 📜", description: "Origins of AI." },
                    { id: "ml-1-3", title: "The Turing Test: Imitation Game 🎭", description: "Can machines think?" }
                ]
            },
            {
                id: "ml-unit-2",
                phase: "Phase 1: Foundations & The Spark",
                title: "Unit 2: Computer Vision Intuition 👁️",
                description: "How machines perceive pixels and patterns.",
                lessons: [
                    { id: "ml-2-1", title: "How Machines 'See' the World: Pixels to Patterns 👁️", description: "Visual Data." },
                    { id: "ml-2-2", title: "Computer Vision: FaceID & Self-Driving Cars 🚗", description: "Real world applications." }
                ]
            },
            {
                id: "ml-unit-3",
                phase: "Phase 1: Foundations & The Spark",
                title: "Unit 3: Supervised Learning Foundations 📏",
                description: "The core engine of predictive models.",
                lessons: [
                    { id: "ml-3-1", title: "Linear Regression: The 'Line of Best Fit' 📏", description: "Simple Regression." },
                    { id: "ml-3-2", title: "Prediction vs Guessing: The Science of ML 📊", description: "Data Patterns." }
                ]
            },
            {
                id: "ml-unit-4",
                phase: "Phase 1: Foundations & The Spark",
                title: "Unit 4: Training the Engine 📉",
                description: "Learning from mistakes with Gradient Descent.",
                lessons: [
                    { id: "ml-4-1", title: "The Cost Function: Measuring Our Mistakes ❌", description: "Loss minimization." },
                    { id: "ml-4-2", title: "Gradient Descent: Walking Down the Mountain 📉", description: "Optimization Algorithm." },
                    { id: "ml-4-3", title: "Learning Rate: Baby Steps vs Giant Leaps 👣", description: "Hyperparameters." }
                ]
            },
            {
                id: "ml-unit-5",
                phase: "Phase 2: Logic & Neural Nets",
                title: "Unit 5: Classification (Logistic Regression) 🚫",
                description: "Drawing lines between cats and dogs.",
                lessons: [
                    { id: "ml-5-1", title: "Logistic Regression: It's Not About Regression! 🚫", description: "Binary Classification logic." },
                    { id: "ml-5-2", title: "Classification: Binary vs Multiclass 🐱🐶", description: "Cat vs Dog." },
                    { id: "ml-5-3", title: "Decision Boundaries: Drawing the Line ✏️", description: "Linear separation." }
                ]
            },
            {
                id: "ml-unit-6",
                phase: "Phase 2: Logic & Neural Nets",
                title: "Unit 6: The Tuning Bench 🛠️",
                description: "Handling bias, variance, and overfitting.",
                lessons: [
                    { id: "ml-6-1", title: "Overfitting: Memorizing vs Learning 🎓", description: "Generalization." },
                    { id: "ml-6-2", title: "Regularization: Keeping Models Simple ⚖️", description: "Complexity control." }
                ]
            },
            {
                id: "ml-unit-7",
                phase: "Phase 2: Logic & Neural Nets",
                title: "Unit 7: The Digital Brain (Neural Networks) 🧠",
                description: "Inspiration from biology to build silicon minds.",
                lessons: [
                    { id: "ml-7-1", title: "Biological Inspiration: How Brains Work 🧠", description: "Synapses & Neurons." },
                    { id: "ml-7-2", title: "The Perceptron: A Digital Neuron ⚡", description: "Basic building unit." },
                    { id: "ml-7-3", title: "Activation Functions: The Spark (ReLU/Sigmoid) 💡", description: "Non-linearity." }
                ]
            },
            {
                id: "ml-unit-8",
                phase: "Phase 3: Advanced Models & Production",
                title: "Unit 8: Specialized Brains (Deep Learning) 🍰",
                description: "Layering complexity for superhuman performance.",
                lessons: [
                    { id: "ml-8-1", title: "Hidden Layers & The Black Box 🧩", description: "Inside the layers." },
                    { id: "ml-8-2", title: "Backpropagation: The Magic of Learning 🪄", description: "Weight updates." }
                ]
            },
            {
                id: "ml-unit-9",
                phase: "Phase 3: Advanced Models & Production",
                title: "Unit 9: Decision Trees & Forest Models 🌲",
                description: "Logic-based learning and ensembles.",
                lessons: [
                    { id: "ml-9-1", title: "Decision Tree Model: The Logic Branch 🌲", description: "Binary decisions." },
                    { id: "ml-9-2", title: "Random Forests & XGBoost: Power in Numbers 🌲🌲", description: "Ensemble methods." }
                ]
            },
            {
                id: "ml-unit-10",
                phase: "Phase 3: Advanced Models & Production",
                title: "Unit 10: Machine Learning in Production 🚀",
                description: "From notebook to the real world.",
                lessons: [
                    { id: "ml-10-1", title: "Hyperparameter Tuning: Dialing in Success ⚙️", description: "Optimization." },
                    { id: "ml-10-2", title: "Error Analysis: Diagnosing Failures 🩺", description: "Debugging models." }
                ]
            },
            {
                id: "ml-unit-11",
                phase: "Phase 4: Patterns & The Future",
                title: "Unit 11: Unsupervised Learning 🔍",
                description: "Finding patterns without labels.",
                lessons: [
                    { id: "ml-11-1", title: "K-Means Clustering: Finding Groups 🔍", description: "Grouping similar data." },
                    { id: "ml-11-2", title: "Anomaly Detection: Spotting the Outlier ⚠️", description: "Fraud detection logic." }
                ]
            },
            {
                id: "ml-unit-12",
                phase: "Phase 4: Patterns & The Future",
                title: "Unit 12: Recommender Systems 🎥",
                description: "How Netflix and Spotify know you.",
                lessons: [
                    { id: "ml-12-1", title: "Content-filtering: Matching the Profile 🎥", description: "Profile matching." },
                    { id: "ml-12-2", title: "Collaborative Filtering: The Network Effect 🎥", description: "Peer-based recs." }
                ]
            },
            {
                id: "ml-unit-13",
                phase: "Phase 4: Patterns & The Future",
                title: "Unit 13: The Future: RL & Agents 🤖",
                description: "The path to AGI and beyond.",
                lessons: [
                    { id: "ml-13-1", title: "Intro to Reinforcement Learning: Rewards & Penalties 🎮", description: "Learning by reward." },
                    { id: "ml-13-2", title: "AI Agents: The Path to AGI? 🚀", description: "Autonomous systems." }
                ]
            }
        ]
    }
};
