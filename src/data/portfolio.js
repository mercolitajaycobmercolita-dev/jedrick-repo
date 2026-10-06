export const navigationItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
]

export const skillGroups = [
  {
    label: 'Frontend',
    note: 'Building interfaces that are clear, responsive, and useful.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
  {
    label: 'Programming',
    note: 'Practicing problem-solving through different programming tools.',
    skills: ['Python', 'VB.NET'],
  },
  {
    label: 'Development',
    note: 'Learning the habits behind thoughtful, collaborative delivery.',
    skills: ['Git', 'GitHub', 'Vercel'],
  },
  {
    label: 'Backend & Content',
    note: 'Exploring data, deployment, and practical content workflows.',
    skills: ['Supabase', 'WordPress'],
  },
]

export const projects = [
  {
    title: 'Meme Calculator',
    category: 'Web experiment',
    status: 'Live demo available',
    description:
      'A playful calculator-style web experiment where the calculate action leads to a full-screen video result.',
    role: 'Individual developer',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: 'https://github.com/jedrick-relshey/meme-calculator',
    liveUrl: 'https://meme-calculator-psi.vercel.app/',
    image: null,
    imageAlt: '',
  },
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
    image: null,
    imageAlt: '',
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
    image: null,
    imageAlt: '',
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
    image: null,
    imageAlt: '',
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
    image: null,
    imageAlt: '',
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
    image: null,
    imageAlt: '',
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
    image: null,
    imageAlt: '',
  },
]

export const socialLinks = {
  email: {
    label: 'Email',
    value: 'miclatjedrick8@gmail.com',
    href: 'mailto:miclatjedrick8@gmail.com',
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
    href: null,
    icon: 'linkedin',
    note: 'Profile link to be added',
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
