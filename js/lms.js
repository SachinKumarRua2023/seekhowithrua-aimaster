// ══════════════════════════════════════════════════════════════════
//  SeekhoWithRua LMS — lms.js
//  Auth model: cosmos-auth.js handles token storage.
//  Index page: OPEN (no lock). Shows user name + progress if logged in.
//  Course player: LOCKED (requires login).
// ══════════════════════════════════════════════════════════════════

// ─── AUTH UI (Header) ────────────────────────────────────────────
/**
 * Renders the top-right user section.
 * On index/open pages: show login link OR user greeting + logout.
 * Called after DOMContentLoaded so the element exists.
 */
function updateAuthUI() {
  const userSection = document.querySelector('.user-section');
  if (!userSection) return;

  const user  = COSMOS_AUTH.getUser();
  const token = COSMOS_AUTH.getToken();

  if (token && user) {
    const displayName = user.first_name || user.username || user.email?.split('@')[0] || 'Student';
    userSection.innerHTML = `
      <div class="user-info" style="display:flex;align-items:center;gap:10px;">
        <div class="progress-summary" id="progressSummary" style="display:flex;align-items:center;gap:6px;cursor:default;">
          <span class="progress-icon">📚</span>
          <span id="overallProgress" style="font-size:13px;color:rgba(255,255,255,0.8);">0% Complete</span>
        </div>
        <span style="color:#00d4ff;font-size:14px;font-weight:600;">👋 ${displayName}</span>
        <button onclick="COSMOS_AUTH.logout()"
          style="background:#ff4757;color:#fff;border:none;padding:5px 14px;border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;">
          Logout
        </button>
      </div>
    `;
  } else {
    // Not logged in — show login button (no lock on index)
    const currentUrl = encodeURIComponent(window.location.href);
    userSection.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <div class="progress-summary" style="display:flex;align-items:center;gap:6px;">
          <span class="progress-icon">📚</span>
          <span style="font-size:13px;color:rgba(255,255,255,0.5);">Not logged in</span>
        </div>
        <a href="https://app.seekhowithrua.com/login?redirect=${currentUrl}"
           style="background:linear-gradient(135deg,#7c3aed,#00d4ff);color:#fff;padding:8px 20px;border-radius:20px;text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap;">
          🔐 Login
        </a>
      </div>
    `;
  }
}

// ─── BATCH CATEGORIES ─────────────────────────────────────────────
const batchCategories = [
  { id: 'it-professionals', name: 'IT Professionals', icon: '💼', color: '#7c3aed' },
  { id: 'non-it-professionals', name: 'Non-IT Professionals', icon: '🎯', color: '#00d4ff' },
  { id: 'it-students', name: 'IT Students', icon: '🎓', color: '#ff6b6b' },
  { id: 'non-it-students', name: 'Non-IT Students', icon: '📚', color: '#4ecdc4' }
];

// ─── COURSE DATA WITH BATCHES ──────────────────────────────────────
const defaultCourses = [
  // ═════════════════════════════════════════════════════════════════
  //  PYTHON BASICS - Foundation for All
  // ═════════════════════════════════════════════════════════════════
  {
    id: 'python-basics-it-pro',
    title: 'Python Basics for IT Professionals',
    category: 'python',
    batchType: 'it-professionals',
    level: 'beginner',
    description: 'Master Python programming tailored for IT professionals. Learn automation, scripting, and foundation for AI/ML transition.',
    icon: '🐍',
    gradient: 'linear-gradient(135deg, #3776ab, #ffd43b)',
    price: 999,
    duration: '4 Weeks',
    videos: [
      { title: 'Python for IT Professionals',          duration: '12:00', youtubeUrl: 'https://www.youtube.com/watch?v=8DvywoWv6fI', module: 'Module 1: Getting Started',    description: 'Why Python matters for IT careers' },
      { title: 'Environment Setup & IDE',              duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=YYXdXT2l-Gg', module: 'Module 1: Getting Started',    description: 'Professional setup for developers' },
      { title: 'Variables, Data Types & Structures',   duration: '20:00', youtubeUrl: 'https://www.youtube.com/watch?v=khIv5p1JIAA', module: 'Module 2: Core Python',        description: 'Foundation programming concepts' },
      { title: 'Control Flow & Logic',                 duration: '18:00', youtubeUrl: 'https://www.youtube.com/watch?v=PqFKFXyNbXk', module: 'Module 2: Core Python',        description: 'If-else, loops, and iterations' },
      { title: 'Functions & Modular Programming',      duration: '25:00', youtubeUrl: 'https://www.youtube.com/watch?v=u-OmVr_fT4s', module: 'Module 3: Advanced Basics',    description: 'Reusable code and modules' },
      { title: 'File Handling & Automation',           duration: '22:00', youtubeUrl: 'https://www.youtube.com/watch?v=Uh2ebnS0VIY', module: 'Module 3: Advanced Basics',    description: 'Automate repetitive IT tasks' },
      { title: 'API Integration Basics',               duration: '28:00', youtubeUrl: 'https://www.youtube.com/watch?v=2mB5_a6IQ3s', module: 'Module 4: Real Applications',  description: 'Working with REST APIs' },
      { title: 'Database Connectivity with Python',    duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=M-4EpN-9Qx8', module: 'Module 4: Real Applications',  description: 'Connect to MySQL/PostgreSQL' }
    ]
  },
  {
    id: 'python-basics-non-it-pro',
    title: 'Python Basics for Non-IT Professionals',
    category: 'python',
    batchType: 'non-it-professionals',
    level: 'beginner',
    description: 'Learn Python for data analysis, reporting, and automation. No prior coding experience required. Perfect for managers, analysts, and entrepreneurs.',
    icon: '🐍',
    gradient: 'linear-gradient(135deg, #3776ab, #4ecdc4)',
    price: 999,
    duration: '4 Weeks',
    videos: [
      { title: 'Python for Non-IT Professionals',      duration: '12:00', youtubeUrl: 'https://www.youtube.com/watch?v=8DvywoWv6fI', module: 'Module 1: Getting Started',    description: 'Why non-IT professionals need Python' },
      { title: 'Easy Setup & First Program',            duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=YYXdXT2l-Gg', module: 'Module 1: Getting Started',    description: 'Gentle introduction to coding' },
      { title: 'Data Types & Excel Integration',        duration: '20:00', youtubeUrl: 'https://www.youtube.com/watch?v=khIv5p1JIAA', module: 'Module 2: Data Handling',      description: 'Work with data like Excel' },
      { title: 'Automating Reports',                    duration: '18:00', youtubeUrl: 'https://www.youtube.com/watch?v=94UHCEMAXmU', module: 'Module 2: Data Handling',      description: 'Generate reports automatically' },
      { title: 'Working with CSV & Excel Files',        duration: '25:00', youtubeUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg', module: 'Module 3: Business Tasks',   description: 'Process business data files' },
      { title: 'Data Visualization for Business',       duration: '22:00', youtubeUrl: 'https://www.youtube.com/watch?v=3Xc3CA655Y4', module: 'Module 3: Business Tasks',   description: 'Create charts and dashboards' },
      { title: 'Web Scraping for Research',             duration: '28:00', youtubeUrl: 'https://www.youtube.com/watch?v=XVv6mJpFuy0', module: 'Module 4: Practical Skills', description: 'Gather data from websites' },
      { title: 'Email Automation',                    duration: '20:00', youtubeUrl: 'https://www.youtube.com/watch?v=g_j6ILT-X5k', module: 'Module 4: Practical Skills', description: 'Automate email communications' }
    ]
  },
  {
    id: 'python-basics-it-student',
    title: 'Python Basics for IT Students',
    category: 'python',
    batchType: 'it-students',
    level: 'beginner',
    description: 'Foundation Python course for B.Tech, BCA, MCA students. Prepare for placements and advanced programming.',
    icon: '🐍',
    gradient: 'linear-gradient(135deg, #3776ab, #ff6b6b)',
    price: 799,
    duration: '4 Weeks',
    videos: [
      { title: 'Python for Engineering Students',     duration: '12:00', youtubeUrl: 'https://www.youtube.com/watch?v=8DvywoWv6fI', module: 'Module 1: Foundation',         description: 'Python in academic curriculum' },
      { title: 'Setup for Student Projects',           duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=YYXdXT2l-Gg', module: 'Module 1: Foundation',         description: 'IDE setup for assignments' },
      { title: 'Core Programming Concepts',            duration: '20:00', youtubeUrl: 'https://www.youtube.com/watch?v=khIv5p1JIAA', module: 'Module 2: Programming',        description: 'Variables, loops, functions' },
      { title: 'Data Structures Basics',               duration: '25:00', youtubeUrl: 'https://www.youtube.com/watch?v=W8KRzm-HUcc', module: 'Module 2: Programming',        description: 'Lists, dictionaries, tuples' },
      { title: 'OOP Concepts',                         duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=qiSCMNBIP2g', module: 'Module 3: Advanced',           description: 'Classes, objects, inheritance' },
      { title: 'File Handling & Exception',            duration: '22:00', youtubeUrl: 'https://www.youtube.com/watch?v=Uh2ebnS0VIY', module: 'Module 3: Advanced',           description: 'Robust file operations' },
      { title: 'Mini Project - Student Management',    duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=71W9qh--kTw', module: 'Module 4: Projects',           description: 'Build your first project' },
      { title: 'Placement Preparation',                duration: '28:00', youtubeUrl: 'https://www.youtube.com/watch?v=8pNJP5xWNqQ', module: 'Module 4: Projects',           description: 'Interview questions & tips' }
    ]
  },
  {
    id: 'python-basics-non-it-student',
    title: 'Python Basics for Non-IT Students',
    category: 'python',
    batchType: 'non-it-students',
    level: 'beginner',
    description: 'Python for B.Com, BBA, BA, Science students. Learn data analysis and automation for research and projects.',
    icon: '🐍',
    gradient: 'linear-gradient(135deg, #3776ab, #9b59b6)',
    price: 799,
    duration: '4 Weeks',
    videos: [
      { title: 'Python for Non-Tech Students',        duration: '12:00', youtubeUrl: 'https://www.youtube.com/watch?v=8DvywoWv6fI', module: 'Module 1: Introduction',       description: 'Why Python matters for your field' },
      { title: 'Simple Setup & Basics',               duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=YYXdXT2l-Gg', module: 'Module 1: Introduction',       description: 'No technical background needed' },
      { title: 'Working with Data',                   duration: '20:00', youtubeUrl: 'https://www.youtube.com/watch?v=khIv5p1JIAA', module: 'Module 2: Data Skills',        description: 'Process research data' },
      { title: 'Excel & Data Analysis',               duration: '25:00', youtubeUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg', module: 'Module 2: Data Skills',        description: 'Analyze data like a pro' },
      { title: 'Charts & Graphs',                     duration: '22:00', youtubeUrl: 'https://www.youtube.com/watch?v=3Xc3CA655Y4', module: 'Module 3: Visualization',      description: 'Visualize research findings' },
      { title: 'Research Data Processing',              duration: '28:00', youtubeUrl: 'https://www.youtube.com/watch?v=2mB5_a6IQ3s', module: 'Module 3: Visualization',      description: 'Process survey data' },
      { title: 'Automating repetitive tasks',         duration: '20:00', youtubeUrl: 'https://www.youtube.com/watch?v=94UHCEMAXmU', module: 'Module 4: Automation',         description: 'Save time on manual work' },
      { title: 'Final Project - Data Analysis',       duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=71W9qh--kTw', module: 'Module 4: Automation',         description: 'Complete analysis project' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════
  //  FULL STACK AI/ML - Advanced Course
  // ═════════════════════════════════════════════════════════════════
  {
    id: 'fullstack-ai-ml-it-pro',
    title: 'Full Stack AI/ML for IT Professionals',
    category: 'ai-ml',
    batchType: 'it-professionals',
    level: 'advanced',
    description: 'Complete AI/ML mastery for IT pros. Learn ML algorithms, Deep Learning, NLP, Computer Vision, MLOps, and deployment. Career transition to AI Engineer.',
    icon: '🤖',
    gradient: 'linear-gradient(135deg, #ff6b6b, #7c3aed)',
    price: 15999,
    duration: '24 Weeks',
    videos: [
      { title: 'AI/ML Roadmap for IT Professionals',  duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=J6_1M3hYnQI', module: 'Module 1: AI Foundation',      description: 'Career transition strategy' },
      { title: 'Python Advanced & Libraries',         duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=QUT1VHiLmmI', module: 'Module 1: AI Foundation',      description: 'NumPy, Pandas, Matplotlib' },
      { title: 'Machine Learning Fundamentals',       duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfM', module: 'Module 2: Core ML',            description: 'Supervised & unsupervised ML' },
      { title: 'Regression & Classification',       duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=nk2CQITm_eo', module: 'Module 2: Core ML',            description: 'Linear, logistic, SVM, trees' },
      { title: 'Deep Learning with TensorFlow',       duration: '50:00', youtubeUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', module: 'Module 3: Deep Learning',      description: 'Neural networks fundamentals' },
      { title: 'CNNs for Computer Vision',           duration: '55:00', youtubeUrl: 'https://www.youtube.com/watch?v=YRhxdVk_sIs', module: 'Module 3: Deep Learning',      description: 'Image recognition & processing' },
      { title: 'NLP & Transformers',                  duration: '60:00', youtubeUrl: 'https://www.youtube.com/watch?v=qjRza5UB8Qo', module: 'Module 4: Advanced AI',        description: 'BERT, GPT, language models' },
      { title: 'MLOps & Model Deployment',            duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=9VlK7m2m16A', module: 'Module 4: Advanced AI',        description: 'Deploy ML models to production' }
    ]
  },
  {
    id: 'fullstack-ai-ml-non-it-pro',
    title: 'Full Stack AI/ML for Non-IT Professionals',
    category: 'ai-ml',
    batchType: 'non-it-professionals',
    level: 'intermediate',
    description: 'Learn AI/ML without coding background. Focus on business applications, AI strategy, no-code ML tools, and data-driven decision making.',
    icon: '🤖',
    gradient: 'linear-gradient(135deg, #ff6b6b, #00d4ff)',
    price: 15999,
    duration: '20 Weeks',
    videos: [
      { title: 'AI for Business Professionals',       duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=J6_1M3hYnQI', module: 'Module 1: AI Strategy',        description: 'AI in business context' },
      { title: 'Python for Business Users',          duration: '25:00', youtubeUrl: 'https://www.youtube.com/watch?v=khIv5p1JIAA', module: 'Module 1: AI Strategy',        description: 'Gentle coding introduction' },
      { title: 'Data Analysis with AI Tools',       duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg', module: 'Module 2: Data & AI',          description: 'AI-powered data analysis' },
      { title: 'No-Code Machine Learning',           duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfM', module: 'Module 2: Data & AI',          description: 'Build ML models without coding' },
      { title: 'AI for Marketing & Sales',          duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=2mB5_a6IQ3s', module: 'Module 3: AI Applications',    description: 'Customer segmentation, prediction' },
      { title: 'AI for Finance & Operations',       duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=3Xc3CA655Y4', module: 'Module 3: AI Applications',    description: 'Forecasting & optimization' },
      { title: 'ChatGPT & Generative AI',            duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=qjRza5UB8Qo', module: 'Module 4: Modern AI',        description: 'Leverage AI tools effectively' },
      { title: 'AI Strategy Implementation',          duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=9VlK7m2m16A', module: 'Module 4: Modern AI',        description: 'Deploy AI in your organization' }
    ]
  },
  {
    id: 'fullstack-ai-ml-it-student',
    title: 'Full Stack AI/ML for IT Students',
    category: 'ai-ml',
    batchType: 'it-students',
    level: 'advanced',
    description: 'Complete AI/ML curriculum for B.Tech/MCA students. Covers ML, DL, NLP, Computer Vision with projects. Placement-ready skills.',
    icon: '🤖',
    gradient: 'linear-gradient(135deg, #ff6b6b, #e74c3c)',
    price: 12999,
    duration: '20 Weeks',
    videos: [
      { title: 'AI/ML Career for Students',          duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=J6_1M3hYnQI', module: 'Module 1: Foundation',       description: 'Industry expectations & roadmap' },
      { title: 'Python for AI/ML',                    duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=QUT1VHiLmmI', module: 'Module 1: Foundation',       description: 'Essential libraries & tools' },
      { title: 'Machine Learning Algorithms',        duration: '50:00', youtubeUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfM', module: 'Module 2: Core ML',            description: 'Theory + hands-on implementation' },
      { title: 'Deep Learning & Neural Networks',    duration: '55:00', youtubeUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', module: 'Module 2: Core ML',            description: 'Build neural networks from scratch' },
      { title: 'Computer Vision Projects',           duration: '60:00', youtubeUrl: 'https://www.youtube.com/watch?v=YRhxdVk_sIs', module: 'Module 3: Specialization',   description: 'OpenCV, CNNs, image processing' },
      { title: 'NLP & Text Analytics',               duration: '55:00', youtubeUrl: 'https://www.youtube.com/watch?v=qjRza5UB8Qo', module: 'Module 3: Specialization',   description: 'Text processing, sentiment analysis' },
      { title: 'Capstone Project',                   duration: '90:00', youtubeUrl: 'https://www.youtube.com/watch?v=71W9qh--kTw', module: 'Module 4: Projects',         description: 'End-to-end AI project' },
      { title: 'Interview Preparation & Placement',  duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=B8QpD-I8E3c', module: 'Module 4: Projects',         description: 'Crack AI/ML interviews' }
    ]
  },
  {
    id: 'fullstack-ai-ml-non-it-student',
    title: 'AI/ML Applications for Non-IT Students',
    category: 'ai-ml',
    batchType: 'non-it-students',
    level: 'intermediate',
    description: 'Learn AI/ML applications for research, analysis, and career growth. Focus on practical tools, data science, and AI-powered research methods.',
    icon: '🤖',
    gradient: 'linear-gradient(135deg, #ff6b6b, #9b59b6)',
    price: 9999,
    duration: '16 Weeks',
    videos: [
      { title: 'AI in Research & Academics',         duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=J6_1M3hYnQI', module: 'Module 1: Introduction',       description: 'AI tools for researchers' },
      { title: 'Python for Data Analysis',           duration: '25:00', youtubeUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg', module: 'Module 1: Introduction',       description: 'Process research data' },
      { title: 'Machine Learning Basics',            duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfM', module: 'Module 2: ML Fundamentals',    description: 'Understand ML concepts' },
      { title: 'Data Visualization & Insights',      duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=3Xc3CA655Y4', module: 'Module 2: ML Fundamentals',    description: 'Present data findings' },
      { title: 'AI for Thesis & Research',           duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=qjRza5UB8Qo', module: 'Module 3: Research AI',      description: 'AI-assisted research methods' },
      { title: 'Predictive Analytics',               duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=2mB5_a6IQ3s', module: 'Module 3: Research AI',      description: 'Forecast trends & outcomes' },
      { title: 'Generative AI for Content',          duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=9VlK7m2m16A', module: 'Module 4: Modern Tools',     description: 'AI writing, analysis tools' },
      { title: 'Final Research Project',             duration: '60:00', youtubeUrl: 'https://www.youtube.com/watch?v=71W9qh--kTw', module: 'Module 4: Modern Tools',     description: 'Apply AI to your field' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════
  //  DATA SCIENCE - Complete Course
  // ═════════════════════════════════════════════════════════════════
  {
    id: 'data-science-it-pro',
    title: 'Data Science for IT Professionals',
    category: 'data-science',
    batchType: 'it-professionals',
    level: 'intermediate',
    description: 'Complete Data Science training for IT pros. Learn Python, SQL, Statistics, Machine Learning, and Big Data. Transition to Data Scientist role.',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #7c3aed, #00d4ff)',
    price: 12999,
    duration: '20 Weeks',
    videos: [
      { title: 'Data Science Career Path',            duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=ua-CiDNNj30', module: 'Module 1: Introduction',       description: 'From developer to data scientist' },
      { title: 'Python for Data Science',            duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=QUT1VHiLmmI', module: 'Module 1: Introduction',       description: 'NumPy, Pandas, Matplotlib' },
      { title: 'SQL for Data Science',               duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=9Pzj7AjZG7U', module: 'Module 2: Data Engineering', description: 'Advanced SQL queries' },
      { title: 'Statistics & Probability',           duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=xxpc-HPKN28', module: 'Module 2: Data Engineering', description: 'Statistical foundations' },
      { title: 'Machine Learning for DS',            duration: '50:00', youtubeUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfM', module: 'Module 3: ML & Modeling',      description: 'Predictive modeling' },
      { title: 'Deep Learning Basics',               duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', module: 'Module 3: ML & Modeling',      description: 'Neural networks intro' },
      { title: 'Big Data & Spark',                   duration: '55:00', youtubeUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4', module: 'Module 4: Big Data',           description: 'Process large datasets' },
      { title: 'DS Project & Deployment',            duration: '60:00', youtubeUrl: 'https://www.youtube.com/watch?v=9VlK7m2m16A', module: 'Module 4: Big Data',           description: 'End-to-end DS pipeline' }
    ]
  },
  {
    id: 'data-science-non-it-pro',
    title: 'Data Science for Non-IT Professionals',
    category: 'data-science',
    batchType: 'non-it-professionals',
    level: 'beginner',
    description: 'Learn Data Science for business decision-making. No coding background required. Excel, Tableau, Python basics, and business analytics.',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #7c3aed, #4ecdc4)',
    price: 12999,
    duration: '16 Weeks',
    videos: [
      { title: 'Data Science in Business',          duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=ua-CiDNNj30', module: 'Module 1: Business Analytics',   description: 'DS for decision makers' },
      { title: 'Excel to Python Transition',       duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg', module: 'Module 1: Business Analytics',   description: 'Beyond spreadsheets' },
      { title: 'Data Analysis & Visualization',     duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=3Xc3CA655Y4', module: 'Module 2: Analysis Skills',    description: 'Tableau, PowerBI, Python viz' },
      { title: 'Business Statistics',                duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=xxpc-HPKN28', module: 'Module 2: Analysis Skills',    description: 'Stats for business insights' },
      { title: 'Predictive Business Analytics',     duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfM', module: 'Module 3: Predictive Modeling',description: 'Forecast sales, trends' },
      { title: 'Customer Analytics',                 duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=2mB5_a6IQ3s', module: 'Module 3: Predictive Modeling',description: 'Segmentation & behavior' },
      { title: 'Marketing Analytics',                duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=6GUZXDef2U4', module: 'Module 4: Specialization',   description: 'Campaign optimization' },
      { title: 'Business Intelligence Project',    duration: '50:00', youtubeUrl: 'https://www.youtube.com/watch?v=71W9qh--kTw', module: 'Module 4: Specialization',   description: 'Capstone business project' }
    ]
  },
  {
    id: 'data-science-it-student',
    title: 'Data Science for IT Students',
    category: 'data-science',
    batchType: 'it-students',
    level: 'intermediate',
    description: 'Complete Data Science course for B.Tech/MCA students. Covers Python, ML, Statistics, SQL. Projects for placements.',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #7c3aed, #ff6b6b)',
    price: 9999,
    duration: '16 Weeks',
    videos: [
      { title: 'DS Career for Engineering Students',duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=ua-CiDNNj30', module: 'Module 1: Foundation',       description: 'Industry & opportunities' },
      { title: 'Python Data Science Stack',          duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=QUT1VHiLmmI', module: 'Module 1: Foundation',       description: 'NumPy, Pandas, Sklearn' },
      { title: 'Statistics for Data Science',        duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=xxpc-HPKN28', module: 'Module 2: Core Skills',      description: 'Hypothesis testing, distributions' },
      { title: 'Machine Learning Algorithms',      duration: '50:00', youtubeUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfM', module: 'Module 2: Core Skills',      description: 'Classification & regression' },
      { title: 'SQL & Database Management',          duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=9Pzj7AjZG7U', module: 'Module 3: Data Engineering', description: 'Query & manage databases' },
      { title: 'Data Visualization & EDA',           duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=3Xc3CA655Y4', module: 'Module 3: Data Engineering', description: 'Explore & visualize data' },
      { title: 'End-to-End DS Project',              duration: '70:00', youtubeUrl: 'https://www.youtube.com/watch?v=71W9qh--kTw', module: 'Module 4: Projects',         description: 'Complete DS lifecycle' },
      { title: 'Placement & Interview Prep',         duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=B8QpD-I8E3c', module: 'Module 4: Projects',         description: 'Crack DS interviews' }
    ]
  },
  {
    id: 'data-science-non-it-student',
    title: 'Data Science for Non-IT Students',
    category: 'data-science',
    batchType: 'non-it-students',
    level: 'beginner',
    description: 'Data Science for B.Com, BBA, BA, Science students. Learn research data analysis, survey analysis, and visualization for academic projects.',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #7c3aed, #9b59b6)',
    price: 7999,
    duration: '12 Weeks',
    videos: [
      { title: 'Data Science in Your Field',        duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=ua-CiDNNj30', module: 'Module 1: Introduction',       description: 'Applications in your domain' },
      { title: 'Python for Research Data',          duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg', module: 'Module 1: Introduction',       description: 'Process academic data' },
      { title: 'Survey Data Analysis',              duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=xxpc-HPKN28', module: 'Module 2: Research Methods',   description: 'Analyze questionnaires' },
      { title: 'Statistical Analysis',              duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=3Xc3CA655Y4', module: 'Module 2: Research Methods',   description: 'Tests, correlations, insights' },
      { title: 'Data Visualization',                duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=6GUZXDef2U4', module: 'Module 3: Presentation',     description: 'Charts, dashboards, reports' },
      { title: 'Research Paper Analytics',          duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=qjRza5UB8Qo', module: 'Module 3: Presentation',     description: 'Data for publications' },
      { title: 'Thesis Data Project',               duration: '50:00', youtubeUrl: 'https://www.youtube.com/watch?v=71W9qh--kTw', module: 'Module 4: Capstone',         description: 'Complete thesis analysis' },
      { title: 'Career with Data Skills',           duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=U8mQG6A7E5E', module: 'Module 4: Capstone',         description: 'Jobs requiring data skills' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════
  //  WEB DEVELOPMENT - Frontend & Backend
  // ═════════════════════════════════════════════════════════════════
  {
    id: 'web-dev-it-pro',
    title: 'Full Stack Web Development for IT Professionals',
    category: 'web-dev',
    batchType: 'it-professionals',
    level: 'intermediate',
    description: 'Complete web development training. Learn HTML, CSS, JavaScript, React, Node.js, Django, databases, and deployment. Build production-ready applications.',
    icon: '💻',
    gradient: 'linear-gradient(135deg, #e74c3c, #f39c12)',
    price: 11999,
    duration: '20 Weeks',
    videos: [
      { title: 'Web Dev Roadmap for IT Pros',         duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=GW2ZrjtzAo4', module: 'Module 1: Foundation',       description: 'Career transition to web dev' },
      { title: 'HTML5 & CSS3 Mastery',               duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=G3e-cpL7ofc', module: 'Module 1: Foundation',       description: 'Modern responsive design' },
      { title: 'JavaScript ES6+ Deep Dive',          duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', module: 'Module 2: JavaScript',       description: 'Advanced JS concepts' },
      { title: 'React.js Complete Guide',            duration: '55:00', youtubeUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', module: 'Module 2: JavaScript',       description: 'Component-based UI development' },
      { title: 'Node.js & Express Backend',         duration: '50:00', youtubeUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE', module: 'Module 3: Backend',          description: 'Server-side JavaScript' },
      { title: 'Django Backend Development',        duration: '60:00', youtubeUrl: 'https://www.youtube.com/watch?v=TW7PYS6xTpA', module: 'Module 3: Backend',          description: 'Python web framework mastery' },
      { title: 'Database Design & SQL',              duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', module: 'Module 4: Database',         description: 'PostgreSQL, MySQL, NoSQL' },
      { title: 'Deployment & DevOps',                duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=07U3j9w3J6U', module: 'Module 4: Database',         description: 'Deploy Django apps to production' }
    ]
  },
  {
    id: 'web-dev-non-it-pro',
    title: 'Web Development for Non-IT Professionals',
    category: 'web-dev',
    batchType: 'non-it-professionals',
    level: 'beginner',
    description: 'Learn to build websites and web applications. Perfect for entrepreneurs, marketers, and business owners who want to create digital products.',
    icon: '💻',
    gradient: 'linear-gradient(135deg, #e74c3c, #4ecdc4)',
    price: 9999,
    duration: '16 Weeks',
    videos: [
      { title: 'Web Dev for Business Professionals',duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=GW2ZrjtzAo4', module: 'Module 1: Getting Started',  description: 'Why learn web development' },
      { title: 'HTML & CSS Fundamentals',            duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=G3e-cpL7ofc', module: 'Module 1: Getting Started',  description: 'Build your first webpage' },
      { title: 'JavaScript for Beginners',          duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', module: 'Module 2: Interactivity',    description: 'Add dynamic behavior' },
      { title: 'Responsive Design Principles',       duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=ZYV6dYtz4Nc', module: 'Module 2: Interactivity',    description: 'Mobile-friendly websites' },
      { title: 'WordPress & CMS Basics',            duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=JZudmxJq3yA', module: 'Module 3: CMS & Tools',      description: 'Build without coding' },
      { title: 'No-Code Website Builders',          duration: '25:00', youtubeUrl: 'https://www.youtube.com/watch?v=9Qtv8PjmY0w', module: 'Module 3: CMS & Tools',      description: 'Webflow, Wix, Shopify' },
      { title: 'E-commerce Website Setup',          duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=5zkej8h1Uog', module: 'Module 4: Business Sites', description: 'Online stores & payments' },
      { title: 'Website Maintenance Basics',         duration: '25:00', youtubeUrl: 'https://www.youtube.com/watch?v=7kVeCqQCxnk', module: 'Module 4: Business Sites', description: 'Hosting, domains, updates' }
    ]
  },
  {
    id: 'web-dev-it-student',
    title: 'Full Stack Web Development for IT Students',
    category: 'web-dev',
    batchType: 'it-students',
    level: 'intermediate',
    description: 'Complete web development course for B.Tech/BCA/MCA students. Covers MERN stack, Django, databases, and deployment. Placement-focused projects.',
    icon: '💻',
    gradient: 'linear-gradient(135deg, #e74c3c, #ff6b6b)',
    price: 8999,
    duration: '16 Weeks',
    videos: [
      { title: 'Web Dev Career for Students',       duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=GW2ZrjtzAo4', module: 'Module 1: Foundation',       description: 'Industry expectations' },
      { title: 'Frontend: HTML, CSS, JS',          duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=G3e-cpL7ofc', module: 'Module 1: Foundation',       description: 'Core web technologies' },
      { title: 'React.js with Projects',          duration: '50:00', youtubeUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', module: 'Module 2: Frontend',         description: 'Build dynamic UIs' },
      { title: 'Node.js & Express API',            duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE', module: 'Module 2: Frontend',         description: 'Backend with JavaScript' },
      { title: 'Django for Beginners',             duration: '55:00', youtubeUrl: 'https://www.youtube.com/watch?v=TW7PYS6xTpA', module: 'Module 3: Backend',          description: 'Python web framework' },
      { title: 'Database: SQL & NoSQL',            duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', module: 'Module 3: Backend',          description: 'PostgreSQL & MongoDB' },
      { title: 'Full Stack Project',               duration: '70:00', youtubeUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M', module: 'Module 4: Projects',         description: 'End-to-end application' },
      { title: 'Deployment & Interview Prep',      duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=07U3j9w3J6U', module: 'Module 4: Projects',         description: 'Deploy and get hired' }
    ]
  },
  {
    id: 'web-dev-non-it-student',
    title: 'Web Development for Non-IT Students',
    category: 'web-dev',
    batchType: 'non-it-students',
    level: 'beginner',
    description: 'Learn web development for portfolios, blogs, and research websites. Perfect for students who want to showcase their work online.',
    icon: '💻',
    gradient: 'linear-gradient(135deg, #e74c3c, #9b59b6)',
    price: 6999,
    duration: '12 Weeks',
    videos: [
      { title: 'Web Dev for Academic Use',          duration: '12:00', youtubeUrl: 'https://www.youtube.com/watch?v=GW2ZrjtzAo4', module: 'Module 1: Basics',           description: 'Why students need web skills' },
      { title: 'Building Your Portfolio Site',     duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=G3e-cpL7ofc', module: 'Module 1: Basics',           description: 'Showcase your achievements' },
      { title: 'HTML/CSS for Content Sites',       duration: '28:00', youtubeUrl: 'https://www.youtube.com/watch?v=ZYV6dYtz4Nc', module: 'Module 2: Design',           description: 'Create content-rich pages' },
      { title: 'JavaScript for Interactivity',     duration: '25:00', youtubeUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', module: 'Module 2: Design',           description: 'Add dynamic elements' },
      { title: 'Research Website Creation',        duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=JZudmxJq3yA', module: 'Module 3: Projects',       description: 'Build academic project sites' },
      { title: 'Blog & Content Management',        duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=9Qtv8PjmY0w', module: 'Module 3: Projects',       description: 'WordPress & blogging' },
      { title: 'Website Hosting Guide',            duration: '25:00', youtubeUrl: 'https://www.youtube.com/watch?v=7kVeCqQCxnk', module: 'Module 4: Publishing',     description: 'Free hosting options' },
      { title: 'Final Website Project',            duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=5zkej8h1Uog', module: 'Module 4: Publishing',     description: 'Your complete website' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════
  //  CLOUD COMPUTING - AWS, Azure, GCP
  // ═════════════════════════════════════════════════════════════════
  {
    id: 'cloud-computing-it-pro',
    title: 'Cloud Computing for IT Professionals',
    category: 'cloud',
    batchType: 'it-professionals',
    level: 'intermediate',
    description: 'Master AWS, Azure, and cloud architecture. Learn cloud migration, serverless computing, and infrastructure as code. Career upgrade to Cloud Engineer.',
    icon: '☁️',
    gradient: 'linear-gradient(135deg, #3498db, #2980b9)',
    price: 13999,
    duration: '16 Weeks',
    videos: [
      { title: 'Cloud Computing Fundamentals',       duration: '20:00', youtubeUrl: 'https://www.youtube.com/watch?v=MXd3bvdfd38', module: 'Module 1: Cloud Basics',     description: 'AWS, Azure, GCP overview' },
      { title: 'AWS Core Services Deep Dive',      duration: '50:00', youtubeUrl: 'https://www.youtube.com/watch?v=Ia-UEYYGCGU', module: 'Module 1: Cloud Basics',     description: 'EC2, S3, RDS, Lambda' },
      { title: 'Azure for Enterprise',             duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=NKEFWyqJ5XA', module: 'Module 2: Multi-Cloud',      description: 'Microsoft cloud platform' },
      { title: 'GCP & Kubernetes',                 duration: '55:00', youtubeUrl: 'https://www.youtube.com/watch?v=4ZXvEJL8bDU', module: 'Module 2: Multi-Cloud',      description: 'Google Cloud & containers' },
      { title: 'Infrastructure as Code',           duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=I8TZwmZFLjI', module: 'Module 3: DevOps',           description: 'Terraform & CloudFormation' },
      { title: 'Serverless Architecture',          duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=9oKNGVj2qKs', module: 'Module 3: DevOps',           description: 'Lambda, Functions, Apps' },
      { title: 'Cloud Security Best Practices',    duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=7mgQeqTV7z4', module: 'Module 4: Advanced',       description: 'Secure cloud deployments' },
      { title: 'Cloud Migration Project',          duration: '60:00', youtubeUrl: 'https://www.youtube.com/watch?v=pqEJzYYyEP4', module: 'Module 4: Advanced',       description: 'Real-world migration' }
    ]
  },
  {
    id: 'cloud-computing-it-student',
    title: 'Cloud Computing for IT Students',
    category: 'cloud',
    batchType: 'it-students',
    level: 'intermediate',
    description: 'Learn AWS, cloud fundamentals, and DevOps basics. Perfect for campus placements and internships in cloud roles.',
    icon: '☁️',
    gradient: 'linear-gradient(135deg, #3498db, #ff6b6b)',
    price: 7999,
    duration: '12 Weeks',
    videos: [
      { title: 'Cloud for Beginners',             duration: '18:00', youtubeUrl: 'https://www.youtube.com/watch?v=MXd3bvdfd38', module: 'Module 1: Introduction',     description: 'Why cloud matters' },
      { title: 'AWS Free Tier Setup',             duration: '25:00', youtubeUrl: 'https://www.youtube.com/watch?v=Ia-UEYYGCGU', module: 'Module 1: Introduction',     description: 'Get started with AWS' },
      { title: 'EC2 & Virtual Servers',           duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=I8TZwmZFLjI', module: 'Module 2: Core Services',    description: 'Launch cloud servers' },
      { title: 'S3 Storage & Databases',          duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=4ZXvEJL8bDU', module: 'Module 2: Core Services',    description: 'Cloud storage solutions' },
      { title: 'Serverless Functions',            duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=9oKNGVj2qKs', module: 'Module 3: Modern Cloud',     description: 'AWS Lambda basics' },
      { title: 'Docker on Cloud',                 duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=pqEJzYYyEP4', module: 'Module 3: Modern Cloud',     description: 'Container basics' },
      { title: 'CI/CD Pipelines',                 duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=7mgQeqTV7z4', module: 'Module 4: DevOps',           description: 'Automated deployments' },
      { title: 'Cloud Project & Certification',   duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=NKEFWyqJ5XA', module: 'Module 4: DevOps',           description: 'AWS certification prep' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════
  //  MOBILE APP DEVELOPMENT
  // ═════════════════════════════════════════════════════════════════
  {
    id: 'mobile-dev-it-pro',
    title: 'Mobile App Development for IT Professionals',
    category: 'mobile',
    batchType: 'it-professionals',
    level: 'intermediate',
    description: 'Build iOS and Android apps with React Native and Flutter. Learn mobile architecture, APIs, and app store deployment.',
    icon: '📱',
    gradient: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
    price: 11999,
    duration: '16 Weeks',
    videos: [
      { title: 'Mobile Dev for IT Pros',            duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=0-S5a0e-Qoc', module: 'Module 1: Mobile Basics',    description: 'iOS vs Android vs Cross-platform' },
      { title: 'React Native Fundamentals',        duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=0-S5a0e-Qoc', module: 'Module 1: Mobile Basics',    description: 'Cross-platform development' },
      { title: 'Flutter & Dart',                   duration: '50:00', youtubeUrl: 'https://www.youtube.com/watch?v=VPvVD8t02U8', module: 'Module 2: Frameworks',       description: 'Google UI toolkit' },
      { title: 'Mobile UI/UX Design',              duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=BjMSXl7A-3Q', module: 'Module 2: Frameworks',       description: 'Design mobile interfaces' },
      { title: 'APIs & Backend Integration',       duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=9Qtv8PjmY0w', module: 'Module 3: Backend',          description: 'Connect to services' },
      { title: 'Local Storage & Offline',          duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=a9m1zC0fs6c', module: 'Module 3: Backend',          description: 'SQLite, SharedPrefs' },
      { title: 'App Store Deployment',            duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=GTeoQn8Jl6U', module: 'Module 4: Publishing',     description: 'Play Store & App Store' },
      { title: 'Complete Mobile Project',           duration: '60:00', youtubeUrl: 'https://www.youtube.com/watch?v=71W9qh--kTw', module: 'Module 4: Publishing',     description: 'Build & deploy an app' }
    ]
  },
  {
    id: 'mobile-dev-it-student',
    title: 'Mobile App Development for IT Students',
    category: 'mobile',
    batchType: 'it-students',
    level: 'intermediate',
    description: 'Learn to build mobile apps with React Native. Create projects for your portfolio and ace mobile dev interviews.',
    icon: '📱',
    gradient: 'linear-gradient(135deg, #00d4ff, #ff6b6b)',
    price: 6999,
    duration: '12 Weeks',
    videos: [
      { title: 'Mobile Dev Introduction',         duration: '15:00', youtubeUrl: 'https://www.youtube.com/watch?v=0-S5a0e-Qoc', module: 'Module 1: Getting Started',  description: 'Mobile career paths' },
      { title: 'React Native Setup',              duration: '25:00', youtubeUrl: 'https://www.youtube.com/watch?v=0-S5a0e-Qoc', module: 'Module 1: Getting Started',  description: 'Environment setup' },
      { title: 'Building UI Components',          duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=VPvVD8t02U8', module: 'Module 2: UI Development',   description: 'Screens & navigation' },
      { title: 'State Management',                duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=BjMSXl7A-3Q', module: 'Module 2: UI Development',   description: 'Hooks & context' },
      { title: 'API Integration',                 duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=9Qtv8PjmY0w', module: 'Module 3: Functionality',    description: 'Fetch & display data' },
      { title: 'Authentication in Apps',        duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=a9m1zC0fs6c', module: 'Module 3: Functionality',    description: 'Login & security' },
      { title: 'Testing & Debugging',             duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=GTeoQn8Jl6U', module: 'Module 4: Final',            description: 'Quality assurance' },
      { title: 'Portfolio App Project',           duration: '50:00', youtubeUrl: 'https://www.youtube.com/watch?v=71W9qh--kTw', module: 'Module 4: Final',            description: 'Showcase project' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════
  //  DEVOPS & AUTOMATION
  // ═════════════════════════════════════════════════════════════════
  {
    id: 'devops-it-pro',
    title: 'DevOps Engineering for IT Professionals',
    category: 'devops',
    batchType: 'it-professionals',
    level: 'advanced',
    description: 'Master DevOps practices including CI/CD, Docker, Kubernetes, Jenkins, and monitoring. Transform into a DevOps Engineer.',
    icon: '⚙️',
    gradient: 'linear-gradient(135deg, #e67e22, #d35400)',
    price: 14999,
    duration: '20 Weeks',
    videos: [
      { title: 'DevOps Roadmap & Culture',         duration: '20:00', youtubeUrl: 'https://www.youtube.com/watch?v=5RQqht3iFyI', module: 'Module 1: DevOps Basics',    description: 'DevOps principles & practices' },
      { title: 'Linux for DevOps',                 duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=WMy3OzvBWc0', module: 'Module 1: DevOps Basics',    description: 'Essential Linux commands' },
      { title: 'Git & Version Control',            duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=apGV9Kg7ics', module: 'Module 2: Source Control',   description: 'Git workflows & branching' },
      { title: 'Docker Containers',                duration: '50:00', youtubeUrl: 'https://www.youtube.com/watch?v=17Bl31rlnRM', module: 'Module 2: Source Control',   description: 'Containerization mastery' },
      { title: 'Kubernetes Orchestration',         duration: '60:00', youtubeUrl: 'https://www.youtube.com/watch?v=X48VuDVv0do', module: 'Module 3: Orchestration',    description: 'K8s clusters & pods' },
      { title: 'Jenkins CI/CD Pipelines',          duration: '55:00', youtubeUrl: 'https://www.youtube.com/watch?v=7KZhU_DmGpQ', module: 'Module 3: Orchestration',    description: 'Automated build & deploy' },
      { title: 'Infrastructure Monitoring',        duration: '45:00', youtubeUrl: 'https://www.youtube.com/watch?v=Q5SXZMY0Xzs', module: 'Module 4: Monitoring',       description: 'Prometheus, Grafana' },
      { title: 'DevOps Project & Best Practices',  duration: '70:00', youtubeUrl: 'https://www.youtube.com/watch?v=pqEJzYYyEP4', module: 'Module 4: Monitoring',       description: 'End-to-end DevOps pipeline' }
    ]
  },
  {
    id: 'devops-it-student',
    title: 'DevOps Fundamentals for IT Students',
    category: 'devops',
    batchType: 'it-students',
    level: 'intermediate',
    description: 'Learn DevOps basics including Git, Docker, and CI/CD. Essential skills for modern software development roles.',
    icon: '⚙️',
    gradient: 'linear-gradient(135deg, #e67e22, #ff6b6b)',
    price: 6999,
    duration: '12 Weeks',
    videos: [
      { title: 'DevOps for Beginners',            duration: '18:00', youtubeUrl: 'https://www.youtube.com/watch?v=5RQqht3iFyI', module: 'Module 1: Basics',           description: 'Introduction to DevOps' },
      { title: 'Linux Command Line',              duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=WMy3OzvBWc0', module: 'Module 1: Basics',           description: 'Terminal fundamentals' },
      { title: 'Git & GitHub',                    duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=apGV9Kg7ics', module: 'Module 2: Version Control',  description: 'Collaborate with Git' },
      { title: 'Docker Basics',                   duration: '40:00', youtubeUrl: 'https://www.youtube.com/watch?v=17Bl31rlnRM', module: 'Module 2: Version Control',  description: 'Container introduction' },
      { title: 'CI/CD Concepts',                  duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=7KZhU_DmGpQ', module: 'Module 3: Automation',       description: 'Continuous integration' },
      { title: 'GitHub Actions',                  duration: '35:00', youtubeUrl: 'https://www.youtube.com/watch?v=R8_veQiYBjI', module: 'Module 3: Automation',       description: 'Free CI/CD with GitHub' },
      { title: 'Cloud Deployment Basics',         duration: '30:00', youtubeUrl: 'https://www.youtube.com/watch?v=pqEJzYYyEP4', module: 'Module 4: Deployment',     description: 'Deploy to cloud' },
      { title: 'DevOps Project',                  duration: '50:00', youtubeUrl: 'https://www.youtube.com/watch?v=Q5SXZMY0Xzs', module: 'Module 4: Deployment',     description: 'Complete pipeline project' }
    ]
  }
];

// ─── STORAGE HELPERS ──────────────────────────────────────────────

function getCourses() {
  const stored = localStorage.getItem('lms_courses');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('lms_courses', JSON.stringify(defaultCourses));
  return defaultCourses;
}

function saveCourse(course) {
  const courses = getCourses();
  const idx = courses.findIndex(c => c.id === course.id);
  if (idx >= 0) courses[idx] = course; else courses.push(course);
  localStorage.setItem('lms_courses', JSON.stringify(courses));
}

function updateCourse(course) { saveCourse(course); }

function getCourseProgress(courseId) {
  const stored = localStorage.getItem(`lms_progress_${courseId}`);
  return stored ? JSON.parse(stored) : { completedVideos: [], lastWatched: null };
}

function saveCourseProgress(courseId, progress) {
  localStorage.setItem(`lms_progress_${courseId}`, JSON.stringify(progress));
}

function getEnrolledCourses() {
  const stored = localStorage.getItem('lms_enrolled');
  if (stored) return JSON.parse(stored);
  const allIds = defaultCourses.map(c => c.id);
  localStorage.setItem('lms_enrolled', JSON.stringify(allIds));
  return allIds;
}

function enrollInCourse(courseId) {
  const enrolled = getEnrolledCourses();
  if (!enrolled.includes(courseId)) {
    enrolled.push(courseId);
    localStorage.setItem('lms_enrolled', JSON.stringify(enrolled));
  }
}

// ─── PROGRESS ─────────────────────────────────────────────────────

function calculateOverallProgress() {
  const courses  = getCourses();
  const enrolled = getEnrolledCourses();
  if (!enrolled.length) return 0;

  let total = 0;
  enrolled.forEach(id => {
    const course = courses.find(c => c.id === id);
    if (course) {
      const prog = getCourseProgress(id);
      total += (prog.completedVideos.length / course.videos.length) * 100;
    }
  });
  return Math.round(total / enrolled.length);
}

function updateOverallProgress() {
  const el = document.getElementById('overallProgress');
  if (el) el.textContent = `${calculateOverallProgress()}% Complete`;
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────

function showNotification(message, type = 'success') {
  const old = document.querySelector('.notification');
  if (old) old.remove();
  const n = document.createElement('div');
  n.className = 'notification';
  n.innerHTML = message;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3000);
}

// ─── PARTICLES ────────────────────────────────────────────────────

function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 20 + 's';
    p.style.animationDuration = (15 + Math.random() * 10) + 's';
    container.appendChild(p);
  }
}

// ─── COURSE CARDS ─────────────────────────────────────────────────

function renderCourseCard(course) {
  const progress   = getCourseProgress(course.id);
  const percentage = Math.round((progress.completedVideos.length / course.videos.length) * 100);
  const isCompleted = percentage === 100;

  return `
    <div class="course-card" onclick="window.location.href='course.html?course=${course.id}'">
      <div class="course-image" style="background:${course.gradient};">
        <span>${course.icon}</span>
        <span class="course-badge">${course.level}</span>
      </div>
      <div class="course-content">
        <div class="course-category">${course.category.replace('-', ' ')}</div>
        <h3 class="course-title">${course.title}</h3>
        <p class="course-description">${course.description}</p>
        <div class="course-meta">
          <span>${course.videos.length} videos</span>
          <div class="course-progress">
            ${isCompleted
              ? '<span style="color:var(--success);">✓ Completed</span>'
              : `<div class="progress-circle" style="--progress:${percentage}">${percentage}%</div>`
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

function filterCourses(courses, filter, searchTerm) {
  return courses.filter(course => {
    const matchFilter = filter === 'all' || course.category === filter;
    const matchSearch = !searchTerm ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });
}

function renderCourseGrid() {
  const grid = document.getElementById('courseGrid');
  if (!grid) return;

  const courses    = getCourses();
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  const searchTerm   = document.getElementById('searchInput')?.value || '';
  const filtered     = filterCourses(courses, activeFilter, searchTerm);

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">🔍</div>
        <p>No courses found matching your search.</p>
      </div>`;
    return;
  }
  grid.innerHTML = filtered.map(renderCourseCard).join('');
}

// ─── MOBILE MENU ──────────────────────────────────────────────────

function toggleMobileMenu() {
  const nav    = document.getElementById('mainNav');
  const toggle = document.getElementById('mobileMenuToggle');
  if (nav && toggle) {
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
  }
}

document.addEventListener('click', (e) => {
  const nav    = document.getElementById('mainNav');
  const toggle = document.getElementById('mobileMenuToggle');
  if (nav && toggle && !nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove('active');
    toggle.classList.remove('active');
  }
});

// ─── INDEX PAGE INIT ──────────────────────────────────────────────
/**
 * Index is OPEN — no auth required to browse courses.
 * Auth UI shows login button when logged out, name + progress when logged in.
 */
function initIndexPage() {
  createParticles();

  // Auth is handled by cosmos-auth.js init (checkUrlForToken called there)
  // Just update the UI
  updateAuthUI();
  updateOverallProgress();
  renderCourseGrid();

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach((btn, _i, all) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      all.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCourseGrid();
    });
  });

  // Search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('input', renderCourseGrid);

  // Stats
  const courses = getCourses();
  const totalVideos = courses.reduce((s, c) => s + c.videos.length, 0);
  const totalCoursesEl = document.getElementById('totalCourses');
  const totalVideosEl  = document.getElementById('totalVideos');
  if (totalCoursesEl) totalCoursesEl.textContent = courses.length;
  if (totalVideosEl)  totalVideosEl.textContent  = totalVideos + '+';

  // Re-render UI when auth state changes (e.g. after redirect brings token)
  COSMOS_AUTH.onAuthChange(() => {
    updateAuthUI();
    updateOverallProgress();
  });
}

// ─── BOOT ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Index page
  if (document.getElementById('courseGrid')) {
    initIndexPage();
  }
  // Course player page (course.html) handles its own auth lock separately
});