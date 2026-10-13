export const navigationItems = [
  { label: 'Home', href: '#/home' },
  { label: 'About', href: '#/about' },
  { label: 'Projects', href: '#/projects' },
  { label: 'Skills', href: '#/skills' },
  { label: 'Equipment', href: '#/equipment' },
  { label: 'Achievements', href: '#/achievements' },
  { label: 'Journey', href: '#/journey' },
  { label: 'Contact', href: '#/contact' },
]

export const skillGroups = [
  {
    label: 'Programming Languages',
    note: 'Languages used for programming and web development.',
    skills: [
      { name: 'Java', icon: '/IMAGES/java-logo.ico' },
      { name: 'JavaScript', icon: '/IMAGES/js-logo.ico' },
      { name: 'Python', icon: '/IMAGES/Python-Emblem.ico' },
      { name: 'PHP', icon: '/IMAGES/php-log.ico' },
    ],
  },
  {
    label: 'Frameworks & Build Tools',
    note: 'Tools used to build this portfolio website.',
    skills: [
      { name: 'React', icon: '/IMAGES/react-logo-1.ico' },
      { name: 'Vite', icon: '/IMAGES/vite-logo.ico' },
    ],
  },
  {
    label: 'Web Technologies',
    note: 'The core markup and styling used throughout the portfolio.',
    skills: [
      { name: 'HTML5', icon: '/IMAGES/html-logo.ico' },
      { name: 'CSS3', icon: '/IMAGES/css3-logo.ico' },
    ],
  },
  {
    label: 'Database',
    note: 'Portfolio content and authentication are powered by Supabase.',
    skills: [
      { name: 'Supabase', icon: '/IMAGES/supabase-logo.ico' },
      { name: 'PostgreSQL', icon: '/IMAGES/PostgreSQL-Logo.ico' },
    ],
  },
  {
    label: 'IDEs',
    note: 'Editors and environments used to write and manage code.',
    skills: [
      { name: 'Visual Studio Code', icon: '/IMAGES/visual-studio-code-logo-2.ico' },
      { name: 'Visual Studio', icon: 'https://cdn.simpleicons.org/visualstudio' },
      { name: 'Eclipse IDE', icon: '/IMAGES/eclipse-logo.ico' },
    ],
  },
  {
    label: 'Development Tools',
    note: 'Tools used for version control and deploying the portfolio.',
    skills: [
      { name: 'Git', icon: '/IMAGES/git.ico' },
      { name: 'GitHub', icon: '/IMAGES/github_logo.ico' },
      { name: 'Vercel', icon: '/IMAGES/logo-vercel.ico' },
    ],
  },
  {
    label: 'Design Tools',
    note: 'Tools for design, image editing, and video editing.',
    skills: [
      { name: 'Canva', icon: '/IMAGES/canva-logo.ico' },
      { name: 'Figma', icon: 'https://cdn.simpleicons.org/figma' },
      { name: 'Adobe Photoshop', icon: '/IMAGES/adobe-photoshop-logo.ico' },
      { name: 'CapCut', icon: '/IMAGES/capcut-logo.ico' },
    ],
  },
]

export const projects = [
  {
    title: 'Restaurant Website Project',
    category: 'Web development',
    status: 'Source available',
    description:
      'A learning project exploring a restaurant website flow with authentication, menu, category, featured-food, and account-related screens.',
    role: 'Individual learning project',
    technologies: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
    githubUrl: 'https://github.com/jedrick-relshey/Restaurant-website-project',
    liveUrl: null,
    image: '/IMAGES/restaurant%20website.jpg',
    imageAlt: 'Restaurant website project screenshot',
  },
  {
    title: 'BrewPoint Café POS',
    category: 'Academic team project',
    status: 'Source available',
    description:
      'A Windows desktop café point-of-sale application with Admin and Cashier sign-in plus local text-file data storage.',
    role: 'Team contributor',
    technologies: ['VB.NET', 'Windows Forms'],
    githubUrl: 'https://github.com/jedrick-relshey/point-of-sale-system',
    liveUrl: null,
    image: '/IMAGES/pos.jpg',
    imageAlt: 'BrewPoint cafe point-of-sale project screenshot',
  },
  {
    title: 'LRT1 MetroRailway System',
    category: 'Programming project',
    status: 'Source available',
    description:
      'A Python linked-list command-line program for listing, adding, and deleting stations and checking intervals between selected stops.',
    role: 'Individual developer',
    technologies: ['Python', 'Linked lists'],
    githubUrl: 'https://github.com/jedrick-relshey/METRO-RAILWAY-SYSTEM',
    liveUrl: null,
    image: '/IMAGES/ltr.jpg',
    imageAlt: 'LRT railway train screenshot for the MetroRailway project',
  },
  {
    title: 'Student Grading System',
    category: 'Academic team project',
    status: 'Source available',
    description:
      'A Windows Forms application for entering student grades, computing final results, validating inputs, and saving grade records.',
    role: 'Team developer',
    technologies: ['VB.NET', 'Windows Forms'],
    githubUrl: 'https://github.com/jedrick-relshey/Student-Grading-System',
    liveUrl: null,
    image: '/IMAGES/grading%20system.jpg',
    imageAlt: 'Student grading system project screenshot',
  },
  {
    title: 'Student Record Management System',
    category: 'Academic team project',
    status: 'Source available',
    description:
      'A Python command-line project for adding, viewing, searching, updating, deleting, and summarizing student records.',
    role: 'Team member',
    technologies: ['Python'],
    githubUrl: 'https://github.com/jedrick-relshey/Student-Management-System',
    liveUrl: null,
    image: '/IMAGES/student%20record%20system.png',
    imageAlt: 'Student record management project screenshot',
  },
  {
    title: 'Pickleball Website',
    category: 'Upcoming project',
    status: 'Planning / Coming soon',
    description:
      'An upcoming web project focused on creating a modern digital experience around pickleball. It is currently in the planning stage as part of my continued journey in web development.',
    role: 'Concept & development planning',
    technologies: ['To be confirmed'],
    githubUrl: null,
    liveUrl: null,
    image: '/IMAGES/pickleball.jpg',
    imageAlt: 'Pickleball website reference image',
  },
]

export const socialLinks = {
  email: {
    label: 'Email',
    value: 'miclatjedrick06@gmail.com',
    href: 'mailto:miclatjedrick06@gmail.com',
    icon: 'mail',
  },
  github: {
    label: 'GitHub',
    value: '@jedrick-relshey',
    href: 'https://github.com/jedrick-relshey',
    icon: 'github',
  },
  linkedin: {
    label: 'LinkedIn',
    value: 'Jedrick Miclat',
    href: 'https://www.linkedin.com/in/jedrick-miclat-b91baa361/',
    icon: 'linkedin',
    note: 'LinkedIn profile',
  },
  facebook: {
    label: 'Facebook',
    value: 'jmiclat.26',
    href: 'https://www.facebook.com/jmiclat.26',
    icon: 'facebook',
  },
  instagram: {
    label: 'Instagram',
    value: '@jedrickmiclat',
    href: 'https://www.instagram.com/jedrickmiclat/',
    icon: 'instagram',
  },
  tiktok: {
    label: 'TikTok',
    value: '@jdjdmclt',
    href: 'https://www.tiktok.com/@jdjdmclt',
    icon: 'tiktok',
  },
}

export const education = {
  school: 'Dominican College of Tarlac',
  course: 'Bachelor of Science in Information Technology',
  year: '2nd Year',
  graduation: 'Expected graduation · 2029',
}
