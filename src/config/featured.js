// Curated projects for the explorer. `repo` is the lowercase GitHub repo name
// when it lives under somarjez (used to pull live stars); null for projects that
// live elsewhere. `image` is served from public/project-images/.
export const featured = [
  {
    repo: 'osca-agesense',
    slug: 'osca-agesense',
    title: 'OSCA-AgeSense',
    category: 'AI / ML',
    icon: 'fa-heart-pulse',
    image: '/project-images/osca-agesense.png',
    thesis: true,
    description:
      'A thesis platform for the Office of Senior Citizens Affairs in Pagsanjan, Laguna that uses machine learning to assess senior-citizen health risk, organize assessment results, and support recommendations aligned with the WHO Healthy Ageing framework.',
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
    image: '/project-images/findify-mobile.png',
    description:
      'A cross-platform Flutter marketplace experience for browsing products, reviewing item details, managing a cart, and working with Firebase-backed authentication and application data.',
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
    image: '/project-images/findify-web.png',
    description:
      'The Flask web edition of Findify, combining storefront product discovery and ordering with product management, vendor dashboards, and order-tracking workflows.',
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
    image: '/project-images/educational-rms.png',
    description:
      'A Django and React resource-management system for academic facilities, bringing together room scheduling, equipment records, capacity planning, and simulation-based analysis.',
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
      'A Flask and Firebase e-learning platform where Computer Science students move through lessons, practice activities, quizzes, and examinations, with completion certificates built into the learning flow.',
    tech: ['Flask', 'Python', 'Firebase'],
    source: 'https://github.com/somarjez/quizera-app',
    demo: 'https://quizera-app.onrender.com',
  },
  {
    repo: '404-dreamteamfinal-project-ml-krr-1ay2526',
    slug: '404-dreamteam',
    title: 'PropertyAI — 404 DreamTeam',
    category: 'AI / ML',
    icon: 'fa-house-circle-check',
    image: '/project-images/property-ai.png',
    description:
      'An intelligent property recommendation system for affordable and sustainable housing choices, with natural-language search, criteria filters, future-price prediction, and ranked listing matches.',
    tech: ['Python', 'Jupyter', 'Machine Learning', 'KRR'],
    source: 'https://github.com/somarjez/404-DreamTeamFinal-Project-ML-KRR-1AY2526',
    demo: null,
  },
  {
    repo: null,
    slug: 'sbcc-system',
    title: 'SBCC Management System',
    category: 'Web',
    icon: 'fa-church',
    image: '/project-images/sbcc-management-system.png',
    description:
      'A Django REST Framework and React management platform for Santa Cruz Bible Christian Church, supporting public information alongside membership, event, attendance, and volunteer workflows.',
    tech: ['Django REST', 'React', 'PostgreSQL'],
    source: 'https://github.com/santacruz-bible-christian-church/sbcc-management-system',
    demo: 'https://pbcm-sbcc.online',
  },
]

export const categoryStyle = {
  'AI / ML': { dot: 'bg-accent', text: 'text-accent', ring: 'border-accent/40 bg-accent/10' },
  Web: { dot: 'bg-primary', text: 'text-primary', ring: 'border-primary/40 bg-primary/10' },
  Mobile: { dot: 'bg-green', text: 'text-green', ring: 'border-green/40 bg-green/10' },
}
