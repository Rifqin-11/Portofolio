export type ProfileContent = {
  id: string;
  heroName: string;
  heroPrefix: string;
  heroSubtitle: string;
  profileImage: string;
  location: string;
  email: string;
  website: string;
  footerName: string;
  brandName: string;
  contactCta: string;
};

export type HeroRole = {
  id: string;
  text: string;
  imgPath: string;
  sortOrder: number;
  isActive: boolean;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  backgroundColor: string;
  featured: boolean;
  sortOrder: number;
  isActive: boolean;
};

export type Experience = {
  id: string;
  title: string;
  date: string;
  review: string;
  imgPath: string;
  logoPath: string;
  responsibilities: string[];
  sortOrder: number;
  isActive: boolean;
};

export type Skill = {
  id: string;
  name: string;
  imgPath: string;
  sortOrder: number;
  isActive: boolean;
};

export type Stat = {
  id: string;
  label: string;
  value: number;
  suffix: string;
  sortOrder: number;
  isActive: boolean;
};

export type SocialLink = {
  id: string;
  name: string;
  imgPath: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
};

export type PortfolioData = {
  profile: ProfileContent;
  heroRoles: HeroRole[];
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  stats: Stat[];
  socialLinks: SocialLink[];
};
