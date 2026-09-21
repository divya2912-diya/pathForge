import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://jnywotypxhmpryinbvuv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpueXdvdHlweGhtcHJ5aW5idnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTU4MzUsImV4cCI6MjEwNTU3MTgzNX0.qCd1lzGHtfcRS6_FhQdtdPwX9ubFMDJPsYB3Rt5JO1Y";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const certs = [
  {
    name: "TensorFlow Developer Certificate",
    provider: "DeepLearning.AI",
    description: "Foundational certificate for developers to build basic machine learning and deep learning models with TensorFlow.",
    official_url: "https://www.tensorflow.org/certificate",
    learning_url: "https://www.coursera.org/professional-certificates/tensorflow-in-practice",
    duration: "6-8 weeks",
    difficulty: "Intermediate",
    skills: ["Deep Learning", "TensorFlow", "Python", "Machine Learning"],
    career_tags: ["AI/ML Engineer", "Data Scientist"]
  },
  {
    name: "Docker & Kubernetes Essentials",
    provider: "Cloud Native Foundation",
    description: "Learn containerization and orchestration fundamentals.",
    official_url: "https://www.cncf.io/certification/kcna/",
    learning_url: "https://training.linuxfoundation.org/",
    duration: "3 weeks",
    difficulty: "Beginner",
    skills: ["Docker", "Kubernetes", "Containerization", "CI/CD"],
    career_tags: ["Cloud Engineer", "Software Engineer", "Full Stack Developer"]
  },
  {
    name: "AWS Certified Machine Learning – Specialty",
    provider: "Amazon Web Services",
    description: "Validates expertise in building, training, tuning, and deploying machine learning models on AWS.",
    official_url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/",
    learning_url: "https://aws.amazon.com/training/learning-paths/machine-learning/",
    exam_url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/",
    duration: "10 weeks",
    difficulty: "Advanced",
    skills: ["Machine Learning", "Cloud", "MLOps", "AWS"],
    career_tags: ["AI/ML Engineer", "Data Scientist"]
  },
  {
    name: "Meta Front-End Developer Professional Certificate",
    provider: "Meta",
    description: "Launch your career as a front-end developer. Build job-ready skills for an in-demand career and earn a credential from Meta.",
    official_url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    learning_url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    duration: "7 months",
    difficulty: "Beginner",
    skills: ["JavaScript", "React", "HTML", "CSS", "Git"],
    career_tags: ["Full Stack Developer", "Software Engineer"]
  },
  {
    name: "Google Data Analytics Professional Certificate",
    provider: "Google",
    description: "Get professional training designed by Google and have the opportunity to connect with top employers.",
    official_url: "https://grow.google/certificates/data-analytics/",
    learning_url: "https://www.coursera.org/professional-certificates/google-data-analytics",
    duration: "6 months",
    difficulty: "Beginner",
    skills: ["Data Analysis", "SQL", "Tableau", "R"],
    career_tags: ["Data Scientist"]
  },
  {
    name: "Certified Information Systems Security Professional (CISSP)",
    provider: "ISC2",
    description: "The world's premier cybersecurity certification. Validate your deep technical and managerial competence.",
    official_url: "https://www.isc2.org/Certifications/CISSP",
    exam_url: "https://www.isc2.org/Certifications/CISSP",
    duration: "6 months",
    difficulty: "Advanced",
    skills: ["Cybersecurity", "Risk Assessment", "Network Security", "Cryptography"],
    career_tags: ["Cybersecurity Analyst"]
  },
  {
    name: "AWS Certified Solutions Architect – Associate",
    provider: "Amazon Web Services",
    description: "Showcase knowledge and skills in AWS technology, across a wide range of AWS services.",
    official_url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    learning_url: "https://aws.amazon.com/training/learning-paths/architect/",
    duration: "4 months",
    difficulty: "Intermediate",
    skills: ["AWS", "System Design", "Cloud Architecture"],
    career_tags: ["Cloud Engineer", "Software Engineer"]
  }
];

async function seed() {
  console.log("Seeding certifications...");
  
  // Clear existing
  const { error: delError } = await supabase.from('certifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  const { data, error } = await supabase.from('certifications').insert(certs).select();
  
  if (error) {
    console.error("Error seeding data:", error);
  } else {
    console.log(`Successfully seeded ${data.length} certifications!`);
  }
}

seed();
