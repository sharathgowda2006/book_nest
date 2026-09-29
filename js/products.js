/**
 * BookNest – Books & Stationery Store
 * Complete Product Catalog (12 Curated Products across Books & Stationery)
 */

const BOOKNEST_PRODUCTS = [
  // =========================
  // BOOKS (6 Products)
  // =========================
  {
    id: 1,
    name: "The Art of Programming",
    category: "Books",
    price: 649,
    rating: 4.9,
    reviewsCount: 184,
    featured: true,
    image: "images/art-of-programming.svg",
    shortDescription: "Master algorithmic thinking, clean software architecture, and problem-solving techniques with practical code examples.",
    detailedDescription: "The Art of Programming is a comprehensive hardcover reference crafted for computer science undergraduates and aspiring software engineers. Covering algorithmic design paradigms, recursion, dynamic programming, memory efficiency, and modular architecture, every chapter pairs rigorous intuition with annotated problems and step-by-step walkthroughs suitable for semester coursework and technical interviews.",
    specs: {
      authorOrBrand: "Dr. Arjun Mehta",
      format: "Hardcover · 540 Pages",
      languageOrMaterial: "English · Archival Matte Paper",
      isbnOrSku: "BN-BK-1001"
    }
  },
  {
    id: 2,
    name: "Python for Beginners",
    category: "Books",
    price: 499,
    rating: 4.8,
    reviewsCount: 246,
    featured: true,
    image: "images/python-beginners.svg",
    shortDescription: "A step-by-step hands-on introduction to Python 3, covering core syntax, automation scripts, and real-world student projects.",
    detailedDescription: "Designed specifically for first-year students and self-taught learners with zero prior coding experience, Python for Beginners walks you from variables, loops, and functions to object-oriented programming, file handling, and data visualization. Includes 45 graded lab exercises and 4 complete capstone mini-projects.",
    specs: {
      authorOrBrand: "Prof. Neha Sharma",
      format: "Paperback · 412 Pages",
      languageOrMaterial: "English · Code-Friendly Layout",
      isbnOrSku: "BN-BK-1002"
    }
  },
  {
    id: 3,
    name: "Data Structures Made Easy",
    category: "Books",
    price: 579,
    rating: 4.9,
    reviewsCount: 198,
    featured: true,
    image: "images/data-structures.svg",
    shortDescription: "Visual explanations of arrays, linked lists, trees, graphs, hashing, and Big-O complexity analysis for exams and placements.",
    detailedDescription: "Data Structures Made Easy transforms abstract data organization concepts into intuitive visual diagrams. Whether you are preparing for university semester examinations or campus placement coding rounds, this book demystifies pointers, balanced binary search trees, heaps, graph traversals (BFS/DFS), and asymptotic time-space complexity with crystal clarity.",
    specs: {
      authorOrBrand: "Rohan Kulkarni",
      format: "Paperback · 488 Pages",
      languageOrMaterial: "English · 200+ Visual Diagrams",
      isbnOrSku: "BN-BK-1003"
    }
  },
  {
    id: 4,
    name: "Web Development Basics",
    category: "Books",
    price: 529,
    rating: 4.7,
    reviewsCount: 152,
    featured: false,
    image: "images/web-development.svg",
    shortDescription: "Build responsive, accessible websites from scratch using modern HTML5, CSS3 Flexbox & Grid, and Vanilla JavaScript.",
    detailedDescription: "Web Development Basics is the definitive studio handbook for building standards-compliant, modern web interfaces without relying on heavy frameworks. Learn semantic HTML5 document structure, responsive CSS3 layouts with Flexbox and Grid, DOM manipulation, event handling, localStorage persistence, and form validation through real portfolio-ready projects.",
    specs: {
      authorOrBrand: "Ananya Verma",
      format: "Paperback · 436 Pages",
      languageOrMaterial: "English · Full-Color Illustrations",
      isbnOrSku: "BN-BK-1004"
    }
  },
  {
    id: 5,
    name: "Artificial Intelligence Essentials",
    category: "Books",
    price: 699,
    rating: 4.9,
    reviewsCount: 167,
    featured: false,
    image: "images/ai-essentials.svg",
    shortDescription: "Explore search algorithms, machine learning foundations, neural networks, and responsible AI systems with clear mathematics.",
    detailedDescription: "Artificial Intelligence Essentials bridges classical symbolic AI and modern statistical machine learning. Written in clear, accessible language for undergraduate engineering and science students, it covers heuristic search, probability, supervised and unsupervised learning, deep neural networks, and real-world case studies.",
    specs: {
      authorOrBrand: "Dr. Vikram Nair",
      format: "Hardcover · 516 Pages",
      languageOrMaterial: "English · Illustrated Edition",
      isbnOrSku: "BN-BK-1005"
    }
  },
  {
    id: 6,
    name: "The Student Success Guide",
    category: "Books",
    price: 399,
    rating: 4.8,
    reviewsCount: 310,
    featured: false,
    image: "images/student-success.svg",
    shortDescription: "Evidence-based study frameworks, active recall methods, time management, and exam preparation strategies for college life.",
    detailedDescription: "The Student Success Guide is an inspiring, practical companion for college students aiming to study smarter without burnout. Drawing on cognitive science research, it teaches spaced repetition, the Cornell note-taking method, deep-focus scheduling, research paper writing, and stress-free exam revision.",
    specs: {
      authorOrBrand: "Meera Krishnan",
      format: "Hardcover · 320 Pages",
      languageOrMaterial: "English · Cream Acid-Free Paper",
      isbnOrSku: "BN-BK-1006"
    }
  },

  // =========================
  // STATIONERY (6 Products)
  // =========================
  {
    id: 7,
    name: "Premium Spiral Notebook",
    category: "Stationery",
    price: 249,
    rating: 4.8,
    reviewsCount: 275,
    featured: true,
    image: "images/spiral-notebook.svg",
    shortDescription: "A4 twin-wire spiral notebook with 200 pages of 100 GSM fountain-pen friendly ivory paper and durable burgundy hard cover.",
    detailedDescription: "Crafted for daily lecture notes and problem sets, the BookNest Premium Spiral Notebook features snag-free brass-toned twin-wire binding that lays completely flat at 360 degrees. Its 100 GSM smooth ivory pages prevent ink feathering and bleed-through, accompanied by a built-in elastic closure band and micro-perforated sheets.",
    specs: {
      authorOrBrand: "BookNest Studio",
      format: "A4 Size · 200 Ruled Pages",
      languageOrMaterial: "100 GSM Ivory Paper · Twin-Wire",
      isbnOrSku: "BN-ST-2001"
    }
  },
  {
    id: 8,
    name: "Blue Gel Pen Set",
    category: "Stationery",
    price: 179,
    rating: 4.9,
    reviewsCount: 342,
    featured: true,
    image: "images/gel-pen-set.svg",
    shortDescription: "Pack of 5 precision 0.5mm fine-point sapphire blue gel pens with quick-dry smudge-free ink and ergonomic matte grip.",
    detailedDescription: "Engineered for effortless speed during long university examinations and note-taking sessions, the BookNest Blue Gel Pen Set delivers consistent, skip-free 0.5mm lines. The quick-drying archival pigment ink resists smudging for both right- and left-handed writers, housed in a balanced matte barrel with brass clip accents.",
    specs: {
      authorOrBrand: "BookNest Studio",
      format: "Pack of 5 Pens · 0.5mm Fine Tip",
      languageOrMaterial: "Quick-Dry Sapphire Gel Ink",
      isbnOrSku: "BN-ST-2002"
    }
  },
  {
    id: 9,
    name: "Highlighter Set",
    category: "Stationery",
    price: 219,
    rating: 4.7,
    reviewsCount: 190,
    featured: false,
    image: "images/highlighter-set.svg",
    shortDescription: "Set of 6 muted pastel dual-tip highlighters designed for textbook annotation without paper shadow or bleed-through.",
    detailedDescription: "Organize your textbook readings and color-code revision notes with our curated palette of 6 eye-friendly pastel highlighters (Warm Gold, Dusty Rose, Sage Mint, Sky Mist, Soft Apricot, and Lavender Mauve). Each marker features a broad chisel tip for highlighting and a fine bullet tip for underlining.",
    specs: {
      authorOrBrand: "BookNest Studio",
      format: "Set of 6 · Dual Chisel & Fine Tip",
      languageOrMaterial: "Water-Based No-Bleed Pastel Ink",
      isbnOrSku: "BN-ST-2003"
    }
  },
  {
    id: 10,
    name: "Sticky Notes Pack",
    category: "Stationery",
    price: 149,
    rating: 4.6,
    reviewsCount: 164,
    featured: false,
    image: "images/sticky-notes.svg",
    shortDescription: "400-sheet academic sticky note folio featuring ruled square pads, lecture takeaway cards, and color-coded page index flags.",
    detailedDescription: "Keep key formulas, bibliography markers, and chapter summaries right where you need them. The Sticky Notes Pack arrives in a protective desk folio containing 4 color-coded index tab dispensers, 2 square note pads, and a wide lined revision pad with repositionable adhesive that leaves zero residue on book pages.",
    specs: {
      authorOrBrand: "BookNest Studio",
      format: "7 Pads · 400 Total Sheets",
      languageOrMaterial: "80 GSM Smooth Repositionable Paper",
      isbnOrSku: "BN-ST-2004"
    }
  },
  {
    id: 11,
    name: "College Pencil Case",
    category: "Stationery",
    price: 349,
    rating: 4.8,
    reviewsCount: 128,
    featured: false,
    image: "images/pencil-case.svg",
    shortDescription: "Spacious burgundy water-resistant canvas pencil organizer with dual mesh pockets, pen loops, and smooth brass zipper.",
    detailedDescription: "Keep your pens, highlighters, scientific calculator, geometry tools, and USB drives neatly organized in the BookNest College Pencil Case. Tailored from heavy-duty 16oz water-resistant burgundy cotton canvas with a reinforced navy base and antique brass zipper hardware, it opens wide for instant desk access.",
    specs: {
      authorOrBrand: "BookNest Studio",
      format: "22 × 10 × 7 cm · High Capacity",
      languageOrMaterial: "16oz Waxed Canvas & Brass Zipper",
      isbnOrSku: "BN-ST-2005"
    }
  },
  {
    id: 12,
    name: "Study Planner",
    category: "Stationery",
    price: 299,
    rating: 4.9,
    reviewsCount: 215,
    featured: true,
    image: "images/study-planner.svg",
    shortDescription: "Undated hardcover academic semester planner with weekly study blocks, assignment tracker, exam countdowns, and habit logs.",
    detailedDescription: "Take command of your semester workload with the clothbound BookNest Study Planner. Thoughtfully structured by academic educators, it includes semester timetable spreads, monthly project roadmaps, weekly time-blocked study layouts, exam revision checklists, and grade trackers—complete with brass corner protectors and a burgundy satin ribbon marker.",
    specs: {
      authorOrBrand: "BookNest Press",
      format: "A5 Hardcover · 192 Pages",
      languageOrMaterial: "Linen Cloth Cover · 100 GSM Paper",
      isbnOrSku: "BN-ST-2006"
    }
  }
];

// Expose globally for Vanilla JS multi-page access
window.BOOKNEST_PRODUCTS = BOOKNEST_PRODUCTS;
