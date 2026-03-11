// Freelancing Specialties Constants (Alphabetically Ordered)
export const FREELANCING_SPECIALTIES = [
  { value: '', label: 'Select your specialty...', category: '' },
  { value: '3d-modeling', label: '3D Modeling (Blender/Maya)', category: 'Design' },
  { value: 'ai-ml-development', label: 'AI/ML Development', category: 'Development' },
  { value: 'animation', label: 'Animation', category: 'Media' },
  { value: 'audio-editing', label: 'Audio Editing', category: 'Media' },
  { value: 'backend-development', label: 'Backend Development', category: 'Development' },
  { value: 'blockchain-development', label: 'Blockchain Development', category: 'Development' },
  { value: 'blog-writing', label: 'Blog Writing', category: 'Writing' },
  { value: 'business-consulting', label: 'Business Consulting', category: 'Business' },
  { value: 'content-marketing', label: 'Content Marketing', category: 'Marketing' },
  { value: 'content-writing', label: 'Content Writing', category: 'Writing' },
  { value: 'copywriting', label: 'Copywriting', category: 'Writing' },
  { value: 'customer-support', label: 'Customer Support', category: 'Other' },
  { value: 'data-analysis', label: 'Data Analysis', category: 'Business' },
  { value: 'data-entry', label: 'Data Entry', category: 'Other' },
  { value: 'digital-marketing', label: 'Digital Marketing', category: 'Marketing' },
  { value: 'ecommerce-development', label: 'E-Commerce Development', category: 'Development' },
  { value: 'editing-proofreading', label: 'Editing & Proofreading', category: 'Writing' },
  { value: 'email-marketing', label: 'Email Marketing', category: 'Marketing' },
  { value: 'financial-consulting', label: 'Financial Consulting', category: 'Business' },
  { value: 'frontend-development', label: 'Frontend Development', category: 'Development' },
  { value: 'full-stack-development', label: 'Full-Stack Development', category: 'Development' },
  { value: 'game-development', label: 'Game Development', category: 'Development' },
  { value: 'ghostwriting', label: 'Ghostwriting', category: 'Writing' },
  { value: 'graphic-design', label: 'Graphic Design', category: 'Design' },
  { value: 'hr-recruiting', label: 'HR & Recruiting', category: 'Business' },
  { value: 'illustration', label: 'Illustration', category: 'Design' },
  { value: 'influencer-marketing', label: 'Influencer Marketing', category: 'Marketing' },
  { value: 'logo-design', label: 'Logo & Brand Identity Design', category: 'Design' },
  { value: 'mobile-app-development', label: 'Mobile App Development', category: 'Development' },
  { value: 'motion-graphics', label: 'Motion Graphics', category: 'Design' },
  { value: 'music-production', label: 'Music Production', category: 'Media' },
  { value: 'other', label: 'Other', category: 'Other' },
  { value: 'podcast-production', label: 'Podcast Production', category: 'Media' },
  { value: 'ppc-advertising', label: 'PPC Advertising', category: 'Marketing' },
  { value: 'product-design', label: 'Product Design', category: 'Design' },
  { value: 'project-management', label: 'Project Management', category: 'Business' },
  { value: 'qa-testing', label: 'QA Testing', category: 'Other' },
  { value: 'seo-specialist', label: 'SEO Specialist', category: 'Marketing' },
  { value: 'seo-writing', label: 'SEO Writing', category: 'Writing' },
  { value: 'social-media-marketing', label: 'Social Media Marketing', category: 'Marketing' },
  { value: 'technical-writing', label: 'Technical Writing', category: 'Writing' },
  { value: 'transcription', label: 'Transcription', category: 'Other' },
  { value: 'translation', label: 'Translation Services', category: 'Other' },
  { value: 'ui-ux-design', label: 'UI/UX Design', category: 'Design' },
  { value: 'video-editing', label: 'Video Editing', category: 'Media' },
  { value: 'video-production', label: 'Video Production', category: 'Media' },
  { value: 'virtual-assistant', label: 'Virtual Assistant', category: 'Business' },
  { value: 'voice-over', label: 'Voice Over Artist', category: 'Media' },
  { value: 'web-design', label: 'Web Design', category: 'Design' },
  { value: 'wordpress-development', label: 'WordPress Development', category: 'Development' },
];

// Helper function to get specialty label by value
export const getSpecialtyLabel = (value: string): string => {
  const specialty = FREELANCING_SPECIALTIES.find(s => s.value === value);
  return specialty ? specialty.label : value;
};

// Helper function to get specialties by category
export const getSpecialtiesByCategory = (category: string) => {
  return FREELANCING_SPECIALTIES.filter(s => s.category === category);
};

// Get all unique categories
export const SPECIALTY_CATEGORIES = [
  'Development',
  'Design',
  'Writing',
  'Marketing',
  'Media',
  'Business',
  'Other',
];
