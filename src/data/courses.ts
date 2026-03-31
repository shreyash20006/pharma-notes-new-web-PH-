// Course Structure for NotesDrive Platform
export const courses = {
  btech: {
    common_first_year: {
      sem1: [
        "Engineering Mathematics 1",
        "Engineering Physics",
        "Basic Electrical Engineering",
        "Engineering Mechanics",
        "Programming in C",
        "Workshop Practice"
      ],
      sem2: [
        "Engineering Mathematics 2",
        "Engineering Chemistry",
        "Basic Electronics",
        "Engineering Graphics",
        "Data Structures",
        "Environmental Studies"
      ]
    },
    cse: {
      sem3: [
        "Discrete Mathematics",
        "Data Structures",
        "Digital Logic",
        "Computer Organization",
        "OOPs (Java/C++)"
      ],
      sem4: [
        "Operating System",
        "DBMS",
        "Theory of Computation",
        "Software Engineering",
        "Computer Networks"
      ],
      sem5: [
        "Artificial Intelligence",
        "Machine Learning",
        "Compiler Design",
        "Web Development",
        "Cloud Computing"
      ],
      sem6: [
        "Big Data Analytics",
        "Cyber Security",
        "Data Science",
        "Mobile Computing"
      ],
      sem7: [
        "Deep Learning",
        "Blockchain",
        "Project Work 1"
      ],
      sem8: [
        "Project Work 2",
        "Internship"
      ]
    },
    it: {
      sem3: ["Data Structures", "Digital Logic", "Computer Organization"],
      sem4: ["OS", "DBMS", "Computer Networks"],
      sem5: ["Web Development", "AI", "Cloud Computing"],
      sem6: ["Cyber Security", "Data Analytics"],
      sem7: ["Project"],
      sem8: ["Internship"]
    },
    mechanical: {
      sem3: ["Thermodynamics", "Material Science", "Fluid Mechanics"],
      sem4: ["Manufacturing Process", "Kinematics of Machines"],
      sem5: ["Heat Transfer", "Machine Design"],
      sem6: ["CAD/CAM", "Industrial Engineering"],
      sem7: ["Project"],
      sem8: ["Internship"]
    },
    civil: {
      sem3: ["Strength of Materials", "Surveying", "Fluid Mechanics"],
      sem4: ["Structural Analysis", "Geotechnical Engineering"],
      sem5: ["Transportation Engineering", "Environmental Engineering"],
      sem6: ["Concrete Technology"],
      sem7: ["Project"],
      sem8: ["Internship"]
    },
    ece: {
      sem3: ["Signals & Systems", "Analog Electronics", "Digital Electronics"],
      sem4: ["Communication Systems", "Microprocessors"],
      sem5: ["VLSI Design", "Embedded Systems"],
      sem6: ["Wireless Communication"],
      sem7: ["Project"],
      sem8: ["Internship"]
    },
    electrical: {
      sem3: ["Circuit Theory", "Electrical Machines 1"],
      sem4: ["Power Systems", "Control Systems"],
      sem5: ["Electrical Machines 2"],
      sem6: ["Power Electronics"],
      sem7: ["Project"],
      sem8: ["Internship"]
    },
    data_science: {
      sem3: ["Statistics", "Python Programming", "Data Structures"],
      sem4: ["Machine Learning", "Data Mining"],
      sem5: ["Deep Learning", "Big Data"],
      sem6: ["AI", "Cloud"],
      sem7: ["Project"],
      sem8: ["Internship"]
    }
  },
  bpharma: {
    sem1: ["Pharmaceutics 1", "Pharmaceutical Chemistry 1", "Biology"],
    sem2: ["Pharmaceutics 2", "Chemistry 2", "Human Anatomy"],
    sem3: ["Pharmacology 1", "Pharmaceutical Analysis"],
    sem4: ["Pharmacology 2", "Medicinal Chemistry"],
    sem5: ["Industrial Pharmacy", "Pharmacognosy"],
    sem6: ["Biopharmaceutics", "Clinical Pharmacy"],
    sem7: ["Project"],
    sem8: ["Internship"]
  },
  dpharma: {
    year1: [
      "Pharmaceutics",
      "Pharmaceutical Chemistry",
      "Pharmacognosy",
      "Human Anatomy"
    ],
    year2: [
      "Pharmacology",
      "Hospital Pharmacy",
      "Clinical Pharmacy"
    ]
  }
};

export const branchNames = {
  cse: "Computer Science & Engineering",
  it: "Information Technology",
  mechanical: "Mechanical Engineering",
  civil: "Civil Engineering",
  ece: "Electronics & Communication",
  electrical: "Electrical Engineering",
  data_science: "Data Science",
  common_first_year: "Common First Year"
};
