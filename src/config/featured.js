// Curated projects for the explorer. `repo` is the lowercase GitHub repo name
// when it lives under somarjez (used to pull live stars); null for projects that
// live elsewhere (org repos, video-only demos). `slug` is the file-tree label.
export const featured = [
  {
    repo: 'osca-agesense',
    slug: 'osca-agesense',
    title: 'OSCA-AgeSense',
    category: 'AI / ML',
    icon: 'fa-heart-pulse',
    thesis: true,
    description:
      'Our thesis. A machine-learning system that assesses senior-citizen health risk and returns recommendations for the Office of Senior Citizens Affairs (OSCA) in Pagsanjan, Laguna, aligned with the WHO Healthy Ageing framework.',
    tech: ['Machine Learning', 'Python', 'Laravel', 'MySQL'],
    source: 'https://github.com/somarjez/osca-agesense',
    demo: null,
  },
  {
    repo: null,
    slug: 'findify-mobile',
    title: 'Findify Mobile',
    category: 'Mobile',
    icon: 'fa-mobile-screen',
    description:
      'A cross-platform Flutter e-commerce app with product discovery, cart, and Firebase-backed auth and data.',
    tech: ['Flutter', 'Dart', 'Firebase'],
    source: null,
    demo: 'https://youtu.be/BgZDwtQfKKk',
  },
  {
    repo: 'flask-ecommerce',
    slug: 'findify-web',
    title: 'Findify Web (Flask)',
    category: 'Web',
    icon: 'fa-cart-shopping',
    description:
      'The web build of Findify: a full-featured Flask e-commerce platform with product management, vendor dashboards, and order tracking.',
    tech: ['Flask', 'Python', 'HTML'],
    source: 'https://github.com/somarjez/Flask-Ecommerce',
    demo: null,
  },
  {
    repo: 'educational-rms',
    slug: 'educational-rms',
    title: 'Educational RMS',
    category: 'Web',
    icon: 'fa-school',
    description:
      'A Django and React system for room scheduling, equipment management, and capacity and simulation analysis in academic settings.',
    tech: ['Django', 'React', 'JavaScript'],
    source: 'https://github.com/somarjez/educational-rms',
    demo: 'https://educational-rms.vercel.app',
  },
  {
    repo: 'quizera-app',
    slug: 'quizera',
    title: 'Quizera',
    category: 'Web',
    icon: 'fa-graduation-cap',
    description:
      'An e-learning platform where Computer Science students learn, practice, and earn certificates through lessons, quizzes, and exams. Built with Flask and Firebase.',
    tech: ['Flask', 'Python', 'Firebase'],
    source: 'https://github.com/somarjez/quizera-app',
    demo: null,
  },
  {
    repo: '404-dreamteamfinal-project-ml-krr-1ay2526',
    slug: '404-dreamteam',
    title: '404 DreamTeam (ML + KRR)',
    category: 'AI / ML',
    icon: 'fa-house-circle-check',
    description:
      'A hybrid AI platform combining Machine Learning and Knowledge Representation and Reasoning to guide affordable, sustainable housing choices in the Philippines.',
    tech: ['Python', 'Jupyter', 'Machine Learning'],
    source: 'https://github.com/somarjez/404-DreamTeamFinal-Project-ML-KRR-1AY2526',
    demo: null,
  },
  {
    repo: null,
    slug: 'sbcc-system',
    title: 'SBCC Management System',
    category: 'Web',
    icon: 'fa-church',
    description:
      'A full-stack church management app built with Django REST Framework and React: memberships, events, attendance, and volunteers for Santa Cruz Bible Christian Church.',
    tech: ['Django REST', 'React', 'PostgreSQL'],
    source: 'https://github.com/santacruz-bible-christian-church/sbcc-management-system',
    demo: 'https://pbcm-sbcc.online',
  },
]

// Category accent mapping (Tokyo Night tokens).
export const categoryStyle = {
  'AI / ML': { dot: 'bg-accent', text: 'text-accent', ring: 'border-accent/40 bg-accent/10' },
  Web: { dot: 'bg-primary', text: 'text-primary', ring: 'border-primary/40 bg-primary/10' },
  Mobile: { dot: 'bg-green', text: 'text-green', ring: 'border-green/40 bg-green/10' },
}
