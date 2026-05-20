import { fallbackPortfolioData } from "./fallback-portfolio";
import { isSupabaseConfigured, supabase } from "./supabase";
import type {
  Experience,
  HeroRole,
  PortfolioData,
  ProfileContent,
  Project,
  Skill,
  SocialLink,
  Stat,
} from "./portfolio-types";

type ProfileRow = {
  id: string;
  hero_name: string;
  hero_prefix: string;
  hero_subtitle: string;
  profile_image: string;
  location: string;
  email: string;
  website: string;
  footer_name: string;
  brand_name: string;
  contact_cta: string;
};

type CommonRow = {
  id: string;
  sort_order: number | null;
  is_active: boolean | null;
};

type HeroRoleRow = CommonRow & {
  text: string;
  img_path: string;
};

type ProjectRow = CommonRow & {
  title: string;
  description: string | null;
  image: string;
  link: string;
  background_color: string | null;
  image_layout: Project["imageLayout"] | null;
  featured: boolean | null;
};

type ExperienceRow = CommonRow & {
  title: string;
  date: string;
  review: string;
  img_path: string | null;
  logo_path: string | null;
  responsibilities: string[] | null;
};

type SkillRow = CommonRow & {
  name: string;
  img_path: string;
};

type StatRow = CommonRow & {
  label: string;
  value: number;
  suffix: string | null;
};

type SocialRow = CommonRow & {
  name: string;
  img_path: string;
  link: string;
};

const bySortOrder = { ascending: true, nullsFirst: false };

const mapProfile = (row: ProfileRow): ProfileContent => ({
  id: row.id,
  heroName: row.hero_name,
  heroPrefix: row.hero_prefix,
  heroSubtitle: row.hero_subtitle,
  profileImage: row.profile_image,
  location: row.location,
  email: row.email,
  website: row.website,
  footerName: row.footer_name,
  brandName: row.brand_name,
  contactCta: row.contact_cta,
});

const mapRole = (row: HeroRoleRow): HeroRole => ({
  id: row.id,
  text: row.text,
  imgPath: row.img_path,
  sortOrder: row.sort_order ?? 0,
  isActive: row.is_active ?? true,
});

const mapProject = (row: ProjectRow): Project => ({
  id: row.id,
  title: row.title,
  description: row.description ?? "",
  image: row.image,
  link: row.link,
  backgroundColor: row.background_color ?? "#e8f4f6",
  imageLayout: row.image_layout === "full" ? "full" : "contained",
  featured: row.featured ?? false,
  sortOrder: row.sort_order ?? 0,
  isActive: row.is_active ?? true,
});

const mapExperience = (row: ExperienceRow): Experience => ({
  id: row.id,
  title: row.title,
  date: row.date,
  review: row.review,
  imgPath: row.img_path ?? "",
  logoPath: row.logo_path ?? "",
  responsibilities: row.responsibilities ?? [],
  sortOrder: row.sort_order ?? 0,
  isActive: row.is_active ?? true,
});

const mapSkill = (row: SkillRow): Skill => ({
  id: row.id,
  name: row.name,
  imgPath: row.img_path,
  sortOrder: row.sort_order ?? 0,
  isActive: row.is_active ?? true,
});

const mapStat = (row: StatRow): Stat => ({
  id: row.id,
  label: row.label,
  value: row.value,
  suffix: row.suffix ?? "",
  sortOrder: row.sort_order ?? 0,
  isActive: row.is_active ?? true,
});

const mapSocial = (row: SocialRow): SocialLink => ({
  id: row.id,
  name: row.name,
  imgPath: row.img_path,
  link: row.link,
  sortOrder: row.sort_order ?? 0,
  isActive: row.is_active ?? true,
});

const activeRows = <T extends CommonRow>(rows: T[] | null): T[] =>
  (rows ?? []).filter((row) => row.is_active !== false);

const visibleRows = <T extends CommonRow>(
  rows: T[] | null,
  includeInactive: boolean
): T[] => (includeInactive ? rows ?? [] : activeRows(rows));

export const fetchPortfolioData = async (
  includeInactive = false
): Promise<PortfolioData> => {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackPortfolioData;
  }

  try {
    const [
      profileResult,
      rolesResult,
      projectsResult,
      experiencesResult,
      skillsResult,
      statsResult,
      socialsResult,
    ] = await Promise.all([
      supabase.from("profile_content").select("*").eq("id", "main").maybeSingle(),
      supabase.from("hero_roles").select("*").order("sort_order", bySortOrder),
      supabase.from("projects").select("*").order("sort_order", bySortOrder),
      supabase.from("experiences").select("*").order("sort_order", bySortOrder),
      supabase.from("skills").select("*").order("sort_order", bySortOrder),
      supabase.from("stats").select("*").order("sort_order", bySortOrder),
      supabase.from("social_links").select("*").order("sort_order", bySortOrder),
    ]);

    if (
      profileResult.error ||
      rolesResult.error ||
      projectsResult.error ||
      experiencesResult.error ||
      skillsResult.error ||
      statsResult.error ||
      socialsResult.error
    ) {
      return fallbackPortfolioData;
    }

    const roleRows = visibleRows(rolesResult.data as HeroRoleRow[], includeInactive);
    const projectRows = visibleRows(
      projectsResult.data as ProjectRow[],
      includeInactive
    );
    const experienceRows = visibleRows(
      experiencesResult.data as ExperienceRow[],
      includeInactive
    );
    const skillRows = visibleRows(skillsResult.data as SkillRow[], includeInactive);
    const statRows = visibleRows(statsResult.data as StatRow[], includeInactive);
    const socialRows = visibleRows(
      socialsResult.data as SocialRow[],
      includeInactive
    );

    return {
      profile: profileResult.data
        ? mapProfile(profileResult.data as ProfileRow)
        : fallbackPortfolioData.profile,
      heroRoles:
        roleRows.map(mapRole).length > 0
          ? roleRows.map(mapRole)
          : fallbackPortfolioData.heroRoles,
      projects:
        projectRows.map(mapProject).length > 0
          ? projectRows.map(mapProject)
          : fallbackPortfolioData.projects,
      experiences:
        experienceRows.map(mapExperience).length > 0
          ? experienceRows.map(mapExperience)
          : fallbackPortfolioData.experiences,
      skills:
        skillRows.map(mapSkill).length > 0
          ? skillRows.map(mapSkill)
          : fallbackPortfolioData.skills,
      stats:
        statRows.map(mapStat).length > 0
          ? statRows.map(mapStat)
          : fallbackPortfolioData.stats,
      socialLinks:
        socialRows.map(mapSocial).length > 0
          ? socialRows.map(mapSocial)
          : fallbackPortfolioData.socialLinks,
    };
  } catch {
    return fallbackPortfolioData;
  }
};
