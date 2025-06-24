

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
    name: "Next JS Developer",
    imgPath: "/images/logos/Next.png",
  },
  {
    name: "Backend Developer",
    imgPath: "/images/logos/node.png",
  },
  {
    name: "PHP Developer",
    imgPath: "/images/logos/PHP.png",
  },
  {
    name: "Python Developer",
    imgPath: "/images/logos/python.svg",
  },
  {
    name: "UI/UX Designer",
    imgPath: "/images/logos/figma.svg",
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
      "Developed a secure Visitor Management System web app, replacing an inefficient Google Form to streamline data handling and enhance the professional user experience.",
    imgPath: "/images/exp2.png",
    logoPath: "/images/logo1.png",
    title: "Web Developer Intern | PT Des Teknologi Informasi",
    date: "Jan 2025 - Feb 2025",
    responsibilities: [
      "Led the end-to-end development lifecycle of the EmployeeWeb system",
      "Designed the complete user interface (UI) and user experience (UX), focusing on creating a clean, intuitive, and efficient workflow for all employees.",
      "Contributed to back-end logic and database structure, including the implementation of the real-time analytics dashboard.",
    ],
  },
  {
    review:
      "I directed the division responsible for all technical training and IT-focused coaching clinics. My role was to plan and deliver workshops that provided practical, in-demand technology skills to electrical engineering students, managing all aspects from concept to successful execution.",
    imgPath: "",
    logoPath: "/images/logo3.png",
    title: "Head of Training Division | BKTI, Diponegoro University",
    date: "Jun 2025 - Present",
    responsibilities: [
      "Directed the strategic planning and execution of all technical training programs for students in the IT concentration.",
      "Recruited and coordinated with industry professionals, senior students, and faculty to act as trainers and mentors.",
      "Managed all event logistics, including technical requirements, promotional campaigns, and participant registration.",
    ],
  },
  {
    review:
      "As a member of the Media and Information Division, I handled photo/video documentation for events, designed visuals to boost social media engagement, and produced a farewell video for a major ceremony.",
    imgPath: "",
    logoPath: "/images/logo2.png",
    title: "Documentation Staff | HME, Diponegoro University",
    date: "Apr 2024 - Apr 2025",
    responsibilities: [
      "Executed photo and video documentation for all organizational events.",
      "Created engaging graphic designs and visual content for social media platforms.",
      "Produced and edited a commemorative video presentation for the annual farewell ceremony.",
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
    link: "https://www.instagram.com/rifqin11_/",
  },
  {
    name: "x",
    imgPath: "/images/x.png",
    link: "https://x.com/rifqin11_",
  },
  {
    name: "linkedin",
    imgPath: "/images/linkedin.png",
    link: "https://www.linkedin.com/in/rifqin11/",
  },
  {
    name: "github",
    imgPath: "/images/github.png",
    link: "https://github.com/Rifqin-11",
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
