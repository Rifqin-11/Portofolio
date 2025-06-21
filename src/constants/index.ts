

const navLinks = [
  {
    name: "Work",
    link: "#work",
  },
  {
    name: "Experience",
    link: "#experience",
  },
  {
    name: "Skills",
    link: "#skills",
  },
];

const words = [
  { text: "Software Developer", imgPath: "/images/code.svg" },
  { text: "UI/UX Designer", imgPath: "/images/designs.svg" },
  { text: "Graphic Designer", imgPath: "/images/ideas.svg" },
  { text: "Video Editor", imgPath: "/images/concepts.svg" },
  { text: "Software Developer", imgPath: "/images/code.svg" },
  { text: "UI/UX Designer", imgPath: "/images/designs.svg" },
  { text: "Graphic Designer", imgPath: "/images/ideas.svg" },
  { text: "Video Editor", imgPath: "/images/concepts.svg" },
];

const counterItems = [
  { value: 5, suffix: "+", label: "Years of Experience" },
  { value: 25, suffix: "+", label: "Projects Developed" },
  // { value: 1, suffix: "+", label: "Internship Experience" },
  { value: 8, suffix: "+", label: "Technologies Learned" },
];

const logoIconsList = [
  {
    imgPath: "/images/logos/company-logo-2.png",
  },
  {
    imgPath: "/images/logos/company-logo-4.png",
  },
  {
    imgPath: "/images/logos/company-logo-6.png",
  },
  {
    imgPath: "/images/logos/company-logo-9.png",
  },
];

const abilities = [
  {
    imgPath: "/images/seo.png",
    title: "Rapid Growth",
    desc: "Quickly mastering new skills and technologies to adapt to challenges and drive innovation.",
  },
  {
    imgPath: "/images/chat.png",
    title: "Focus on Quality",
    desc: "Dedicated to delivering high-standard, polished results with a meticulous eye for every detail.",
  },
  {
    imgPath: "/images/time.png",
    title: "Team Collaboration",
    desc: "Thriving in team environments by contributing ideas and supporting colleagues to achieve shared goals.",
  },
];

const techStackImgs = [
  {
    name: "React Developer",
    imgPath: "/images/logos/react.png",
  },
  {
    name: "Python Developer",
    imgPath: "/images/logos/python.svg",
  },
  {
    name: "Backend Developer",
    imgPath: "/images/logos/node.png",
  },
  {
    name: "Interactive Developer",
    imgPath: "/images/logos/three.png",
  },
  {
    name: "Project Manager",
    imgPath: "/images/logos/git.svg",
  },
];

const techStackIcons = [
  {
    name: "React Developer",
    modelPath: "/models/react_logo-transformed.glb",
    scale: 1,
    rotation: [0, 0, 0],
  },
  {
    name: "Python Developer",
    modelPath: "/models/python-transformed.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
  },
  {
    name: "Backend Developer",
    modelPath: "/models/node-transformed.glb",
    scale: 5,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    name: "Interactive Developer",
    modelPath: "/models/three.js-transformed.glb",
    scale: 0.05,
    rotation: [0, 0, 0],
  },
  {
    name: "Project Manager",
    modelPath: "/models/git-svg-transformed.glb",
    scale: 0.05,
    rotation: [0, -Math.PI / 4, 0],
  },
];

const expCards = [
  {
    review:
      "Siap Undip Schedule is an unofficial web app allowing students to view their course timetables. It provides a key solution for iPhone users, as the official 'Siap Undip' app is only on Android.",
    imgPath: "/images/exp1.png",
    logoPath: "/images/logo1.png",
    title: "Siap Undip Schedule",
    link: "https://github.com/Rifqin-11/SiapUndipSchedule",
    responsibilities: [
      "Designed, developed, and deployed the 'Siap Undip Schedule' web application from concept to launch.",
      "Created a responsive and intuitive UI/UX focused on simplicity for a seamless cross-device user experience.",
      "Solved a critical accessibility problem for iOS users by building a functional, web-based scheduling solution.",
    ],
  },
  {
    review:
      "PLN Calculator is a web application designed to help the public efficiently plan their electricity consumption and calculate lighting requirements based on Indonesian PLN standards.",
    imgPath: "/images/exp3.png",
    logoPath: "/images/logo3.png",
    title: "PLN Calculator",
    link: "https://github.com/Rifqin-11/PLNCalculator",
    responsibilities: [
      "Developed a fully responsive web application, ensuring optimal functionality and user experience on both desktop and mobile devices.",
      "Engineered the core calculation algorithms for the three main features: electricity cost estimation, lamp quantity requirements, and lighting level (lux) standards.",
      "Implemented front-end optimization techniques to improve application performance, resulting in faster load times and more efficient calculations.",
    ],
  },
  {
    review:
      "The 'Sitita Teknik Elektro' redesign transformed the department's legacy academic portal into a modern, user-friendly, and responsive platform. The updated technology stack resulted in significantly better performance, scalability, and efficiency in handling user requests.",
    imgPath: "/images/exp3.png",
    title: "Sitita Teknik Elektro",
    link: "https://github.com/Rifqin-11/Sitita",
    responsibilities: [
      "Redesigned the complete User Interface (UI) and User Experience (UX) from the ground up, applying modern, user-centered design principles.",
      "Rebuilt the entire front-end application using a modern tech stack React.js to improve performance, interactivity, and maintainability.",
      "Significantly improved application performance by optimizing data fetching processes and reducing page load times.",
    ],
  },
  {
    review:
      "This Netflix Clone is a personal portfolio project developed to showcase advanced skills in modern front-end development and API integration.",
    imgPath: "/images/exp3.png",
    title: "Netflix Clone",
    link: "https://github.com/Rifqin-11/NetflixClone",
    responsibilities: [
      "Developed a pixel-perfect User Interface (UI) replicating the Netflix design aesthetic",
      "Integrated The Movie Database (TMDb) API to dynamically fetch and display real-time movie and TV show data across the application.",
      "Implemented a feature to display detailed movie information and stream trailers upon user interaction",
    ],
  },
  {
    review:
      "EmployeeWeb is a web-based administration system that allows employees to manage visitor records efficiently.",
    imgPath: "/images/exp2.png",
    logoPath: "/images/logo2.png",
    title: "EmployeeWeb - Visitor Management System",
    link: "https://github.com/Rifqin-11/EmployeeWeb",
    responsibilities: [
      "Led the end-to-end development lifecycle of the EmployeeWeb system",
      "Designed the complete user interface (UI) and user experience (UX), focusing on creating a clean, intuitive, and efficient workflow for all employees.",
      "Contributed to back-end logic and database structure, including the implementation of the real-time analytics dashboard.",
    ],
  },
];

const expLogos = [
  {
    name: "logo1",
    imgPath: "/images/logo1.png",
  },
  {
    name: "logo2",
    imgPath: "/images/logo2.png",
  },
  {
    name: "logo3",
    imgPath: "/images/logo3.png",
  },
];

const testimonials = [
  {
    name: "Esther Howard",
    mentions: "@estherhoward",
    review:
      "I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.",
    imgPath: "/images/client1.png",
  },
  {
    name: "Wade Warren",
    mentions: "@wadewarren",
    review:
      "Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.",
    imgPath: "/images/client3.png",
  },
  {
    name: "Guy Hawkins",
    mentions: "@guyhawkins",
    review:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    imgPath: "/images/client2.png",
  },
  {
    name: "Marvin McKinney",
    mentions: "@marvinmckinney",
    review:
      "Adrian was a pleasure to work with. He turned our outdated website into a fresh, intuitive platform that’s both modern and easy to navigate. Fantastic work overall.",
    imgPath: "/images/client5.png",
  },
  {
    name: "Floyd Miles",
    mentions: "@floydmiles",
    review:
      "Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional!",
    imgPath: "/images/client4.png",
  },
  {
    name: "Albert Flores",
    mentions: "@albertflores",
    review:
      "Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend and backend dev are top-notch.",
    imgPath: "/images/client6.png",
  },
];

const socialImgs = [
  {
    name: "insta",
    imgPath: "/images/insta.png",
  },
  {
    name: "fb",
    imgPath: "/images/fb.png",
  },
  {
    name: "x",
    imgPath: "/images/x.png",
  },
  {
    name: "linkedin",
    imgPath: "/images/linkedin.png",
  },
];

export {
  words,
  abilities,
  logoIconsList,
  counterItems,
  expCards,
  expLogos,
  testimonials,
  socialImgs,
  techStackIcons,
  techStackImgs,
  navLinks,
};
