import type { College } from "@/types";

export const mockCollegeData: College = {
  info: {
    name: "Tribhuvan University Institute of Engineering, Thapathali Campus",
    established: "1965",
    affiliation: "Tribhuvan University",
    location: "Kathmandu, Nepal",
  },
  departments: [
    {
      name: "Applied Science",
      description:
        "Provides foundational science courses essential for engineering disciplines.",
      icon: "Atom",
      href: "/departments/applied-science",
      head: {
        name: "Dr. Baldev Das",
        image: "/data/baldev_das.webp",
        message:
          "The Department of Applied Science is dedicated to fostering scientific inquiry and knowledge.",
      },
      programs: [],
      faculty: [],
      facilities: [],
      research: [],
    },
    {
      name: "Civil Engineering",
      description:
        "Focuses on the design, construction, and maintenance of the physical and naturally built environment.",
      icon: "Construction",
      href: "/departments/civil",
      head: {
        name: "Dr. Indra Narayan Yadav",
        image: "/data/indra_doce.webp",
        message:
          "Welcome to the Department of Civil Engineering. We are committed to excellence in education and research.",
      },
      programs: [
        {
          level: "Undergraduate",
          name: "BE Civil Engineering",
          duration: "4 Years",
          description:
            "Comprehensive program covering structural, transportation, environmental, and water resources engineering.",
        },
        {
          level: "Graduate",
          name: "ME Structural Engineering",
          duration: "2 Years",
          description: "Advanced studies in structural analysis and design.",
        },
      ],
      faculty: [
        {
          name: "Dr. Anjali Sharma",
          position: "Professor",
          image: "/placeholder-user.jpg",
          specialization: "Structural Engineering",
        },
        {
          name: "Er. Binod Karki",
          position: "Associate Professor",
          image: "/placeholder-user.jpg",
          specialization: "Transportation Engineering",
        },
      ],
      facilities: ["Hydraulics Lab", "Geotechnical Lab", "Structural Lab"],
      research: [
        {
          title: "Seismic Performance of RC Structures",
          description:
            "Research on improving earthquake resistance of reinforced concrete buildings.",
        },
        {
          title: "Sustainable Urban Drainage Systems",
          description:
            "Study on eco-friendly drainage solutions for urban areas.",
        },
      ],
    },
    {
      name: "Architecture",
      description:
        "Integrates art, science, and technology to design buildings and physical structures.",
      icon: "Building",
      href: "/departments/architecture",
      head: {
        name: "Ar. Shova Thapa",
        image: "/data/shova_doarch.webp",
        message:
          "We foster creativity and technical expertise in architectural design.",
      },
      programs: [
        {
          level: "Undergraduate",
          name: "B. Arch",
          duration: "5 Years",
          description:
            "Comprehensive program covering architectural design, history, theory, and construction.",
        },
      ],
      faculty: [
        {
          name: "Ar. Smriti Poudel",
          position: "Associate Professor",
          image: "/placeholder.svg?height=50&width=50",
          specialization: "Urban Design",
        },
        {
          name: "Ar. Nabin Tamang",
          position: "Lecturer",
          image: "/placeholder.svg?height=50&width=50",
          specialization: "Sustainable Architecture",
        },
      ],
      facilities: ["Design Studio", "Model Making Workshop", "CAD Lab"],
      research: [
        {
          title: "Traditional Nepali Architecture Preservation",
          description:
            "Study and documentation of indigenous architectural styles.",
        },
        {
          title: "Green Building Technologies",
          description:
            "Research on energy-efficient and environmentally friendly building practices.",
        },
      ],
    },
    {
      name: "Electronics and Computer Engineering",
      description:
        "Combines principles of electronics, computer science, and information technology.",
      icon: "Laptop",
      href: "/departments/electronics-computer",
      head: {
        name: "Er. Umesh Kanta Ghimire",
        image: "/data/ukg_doece.webp",
        message:
          "Our department is at the forefront of innovation in electronics and computing.",
      },
      programs: [
        {
          level: "Undergraduate",
          name: "BE Electronics, Communication & Information Engineering",
          duration: "4 Years",
          description:
            "Covers electronics, communication systems, and information technology.",
        },
        {
          level: "Undergraduate",
          name: "BE Computer Engineering",
          duration: "4 Years",
          description:
            "Focuses on computer hardware, software, and networking.",
        },
      ],
      faculty: [
        {
          name: "Dr. Suresh Bhattarai",
          position: "Professor",
          image: "/placeholder.svg?height=50&width=50",
          specialization: "Artificial Intelligence",
        },
        {
          name: "Er. Puja Gurung",
          position: "Lecturer",
          image: "/placeholder.svg?height=50&width=50",
          specialization: "Embedded Systems",
        },
      ],
      facilities: ["Microprocessor Lab", "Networking Lab", "Robotics Lab"],
      research: [
        {
          title: "IoT for Smart Cities",
          description:
            "Developing IoT solutions for urban management and services.",
        },
        {
          title: "Machine Learning in Healthcare",
          description:
            "Applying ML algorithms for disease diagnosis and prediction.",
        },
      ],
    },
    {
      name: "Automobile and Mechanical Engineering",
      description:
        "Focuses on the design, manufacturing, and operation of machinery and systems.",
      icon: "Car",
      href: "/departments/automobile-mechanical",
      head: {
        name: "Er. Debendra Bahadur Raut",
        image: "/data/debendra_doame.webp",
        message: "Driving innovation in mechanical and automotive fields.",
      },
      programs: [],
      faculty: [],
      facilities: [],
      research: [],
    },
    {
      name: "Industrial Engineering",
      description: "Optimizing complex processes, systems, or organizations.",
      icon: "Factory",
      href: "/departments/industrial",
      head: {
        name: "Er. Kamal Pokharel",
        image: "/data/kamal_doie.webp",
        message:
          "Enhancing efficiency and productivity through industrial engineering principles.",
      },
      programs: [],
      faculty: [],
      facilities: [],
      research: [],
    },
  ],
  programs: [], // Will be populated from departments for simplicity
  faculty: [], // Will be populated from departments for simplicity
  students: {
    totalStudents: 2500,
    graduates: 500,
    undergraduates: 2000,
    internationalStudents: 50,
  },
  news: [
    {
      id: "1",
      title: "Annual Tech Fest 'Innovate Nepal' Concludes Successfully",
      excerpt:
        "The annual technology festival, Innovate Nepal, organized by the students of Thapathali Campus, concluded with great success...",
      date: "2024-07-15",
      category: "Campus Life",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      title: "New Research Grant Awarded to Civil Engineering Department",
      excerpt:
        "The Department of Civil Engineering has secured a significant research grant for its project on sustainable infrastructure...",
      date: "2024-07-10",
      category: "Research",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "3",
      title: "Admissions Open for Graduate Programs 2025",
      excerpt:
        "Applications are now open for various graduate programs for the academic year 2025. Prospective students are encouraged to apply early...",
      date: "2024-07-01",
      category: "Admissions",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "4",
      title: "Workshop on AI and Machine Learning for Engineering Students",
      excerpt:
        "A two-day workshop on Artificial Intelligence and Machine Learning was successfully conducted by the Electronics and Computer Engineering Department...",
      date: "2024-06-28",
      category: "Academics",
      image: "/placeholder.svg?height=200&width=300",
    },
  ],
  events: [
    {
      id: "e1",
      title: "Orientation Program for New Students",
      date: "2025-08-01",
      location: "Auditorium, Thapathali Campus",
      description:
        "An orientation program for newly admitted undergraduate students.",
    },
    {
      id: "e2",
      title: "Inter-College Robotics Competition",
      date: "2025-08-15",
      location: "Engineering Lab, Thapathali Campus",
      description:
        "Annual robotics competition inviting teams from various engineering colleges.",
    },
  ],
  notices: [
    {
      id: "n1",
      title: "Exam Schedule for Odd Semester 2024",
      date: "2024-07-20",
      category: "Exams",
      fileUrl: "#",
    },
    {
      id: "n2",
      title: "Scholarship Application Deadline Extended",
      date: "2024-07-18",
      category: "Scholarships",
      fileUrl: "#",
    },
  ],
  announcements: [
    "4th Graduation Conference",
    "60th Convocation Day",
    "Annual Reports",
    "New research opportunities available for graduate students. Contact your department head.",
  ],
  gallery: [
    {
      id: "g1",
      src: "/placeholder.svg?height=400&width=600",
      alt: "Campus Building",
      caption: "Main Campus Building",
    },
    {
      id: "g2",
      src: "/placeholder.svg?height=400&width=600",
      alt: "Students in Lab",
      caption: "Students working in the lab",
    },
    {
      id: "g3",
      src: "/placeholder.svg?height=400&width=600",
      alt: "Library Interior",
      caption: "Modern Library Interior",
    },
    {
      id: "g4",
      src: "/placeholder.svg?height=400&width=600",
      alt: "Sports Ground",
      caption: "Campus Sports Ground",
    },
    {
      id: "g5",
      src: "/placeholder.svg?height=400&width=600",
      alt: "Graduation Ceremony",
      caption: "Annual Graduation Ceremony",
    },
    {
      id: "g6",
      src: "/placeholder.svg?height=400&width=600",
      alt: "Lecture Hall",
      caption: "Spacious Lecture Hall",
    },
  ],
};

// Campus Chief data - separate from department heads
export const campusChiefData = {
  name: "Dr. Khem Gyawali ",
  title: "Campus Chief",
  image: "/data/campuscheif.jpeg",
  message:
    "It is with immense pleasure that I welcome you to Tribhuvan University Institute of Engineering, Thapathali Campus. Our institution has a rich history of nurturing brilliant minds and contributing significantly to the nation's development through quality engineering and architectural education.",
  fullMessage:
    "We are committed to providing a dynamic learning environment that fosters innovation, critical thinking, and ethical leadership. Our dedicated faculty, state-of-the-art facilities, and comprehensive curriculum ensure that our students are well-equipped to face global challenges and make a positive impact on society. We encourage you to explore our diverse programs, engage with our vibrant campus community, and embark on a transformative educational journey with us.",
};

// Populate programs and faculty from departments for convenience
mockCollegeData.departments.forEach((dept) => {
  mockCollegeData.programs.push(
    ...dept.programs.map((p) => ({
      ...p,
      level: p.level.toLowerCase() as "undergraduate" | "graduate",
      department: dept.name,
      curriculum: [],
      admissionRequirements: [],
    }))
  );
  mockCollegeData.faculty.push(
    ...dept.faculty.map((f) => ({ ...f, department: dept.name }))
  );
});
