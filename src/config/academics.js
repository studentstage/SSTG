export const faculties = [
  {
    id: "faat",
    name: "Faculty of Agriculture & Agricultural Technology",
    shortName: "FAAT",
    departments: [
      "Agricultural Economics & Extension",
      "Animal Science",
      "Crop Science",
      "Fisheries & Aquaculture",
      "Forestry & Wildlife Management",
      "Soil Science",
      "Food Science & Technology",
    ],
  },
  {
    id: "facms",
    name: "Faculty of Computing & Mathematical Sciences",
    shortName: "FACMS",
    departments: ["Computer Science", "Mathematics", "Statistics"],
  },
  {
    id: "faees",
    name: "Faculty of Earth & Environmental Science",
    shortName: "FAEES",
    departments: [
      "Architecture",
      "Geography",
      "Geology",
      "Building Technology",
      "Estate Management",
      "Meteorology",
      "Quantity Surveying",
      "Urban & Regional Planning",
    ],
  },
  {
    id: "faeng",
    name: "Faculty of Engineering",
    shortName: "FAENG",
    departments: [
      "Agricultural Engineering",
      "Automotive Engineering",
      "Civil Engineering",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Mechatronics Engineering",
      "Water Resources & Environmental Engineering",
    ],
  },
  {
    id: "fasci",
    name: "Faculty of Science",
    shortName: "FASCI",
    departments: [
      "Biochemistry",
      "Biology",
      "Chemistry",
      "Microbiology",
      "Physics",
      "Science Laboratory Technology",
    ],
  },
  {
    id: "faste",
    name: "Faculty of Science & Technical Education",
    shortName: "FASTE",
    departments: [
      "Technology & Vocational Education",
      "Science Education",
      "Computing & Mathematics Education",
      "Human Kinetics & Health Education",
      "Library & Information Science",
      "Educational Foundations",
      "Natural Science Education",
      "Environmental Science Education",
      "Physical Science Education",
    ],
  },
];

export const facultyById = Object.fromEntries(
  faculties.map((faculty) => [faculty.id, faculty]),
);
