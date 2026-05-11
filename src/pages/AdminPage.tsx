import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fallbackPortfolioData } from "../lib/fallback-portfolio";
import { fetchPortfolioData } from "../lib/portfolio-data";
import type {
  Experience,
  HeroRole,
  PortfolioData,
  Project,
  Skill,
  SocialLink,
  Stat,
} from "../lib/portfolio-types";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type Tab = "profile" | "projects" | "experience" | "skills" | "stats" | "social";

const tabs: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile/Hero" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "stats", label: "Stats" },
  { id: "social", label: "Social/Footer" },
];

const newId = (prefix: string) =>
  `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;

const uploadAsset = async (file: File, folder: string) => {
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

  const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  const path = `${folder}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage
    .from("portfolio-assets")
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
  return data.publicUrl;
};

const AdminPage = () => {
  const [sessionReady, setSessionReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [data, setData] = useState<PortfolioData>(fallbackPortfolioData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setSessionReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data: sessionData }) => {
      setIsLoggedIn(Boolean(sessionData.session));
      setSessionReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(Boolean(session));
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchPortfolioData(true).then(setData);
  }, [isLoggedIn]);

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setAuthError("Supabase belum dikonfigurasi.");
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: authForm.email.trim(),
        password: authForm.password,
      });

      if (error) {
        const message = getAuthErrorMessage(error.message);
        setAuthError(message);
        toast.error(message);
        return;
      }

      setIsLoggedIn(Boolean(authData.session));
      toast.success("Login berhasil.");
    } catch (error) {
      const message =
        error instanceof Error
          ? getAuthErrorMessage(error.message)
          : "Login gagal. Cek koneksi dan konfigurasi Supabase.";
      setAuthError(message);
      toast.error(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
    toast.success("Logout berhasil.");
  };

  const refreshData = async () => {
    setData(await fetchPortfolioData(true));
  };

  const runSave = async (action: () => Promise<void>) => {
    setSaving(true);
    try {
      await action();
      await refreshData();
      toast.success("Perubahan tersimpan.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = () =>
    runSave(async () => {
      if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

      const { error } = await supabase.from("profile_content").upsert({
        id: data.profile.id,
        hero_name: data.profile.heroName,
        hero_prefix: data.profile.heroPrefix,
        hero_subtitle: data.profile.heroSubtitle,
        profile_image: data.profile.profileImage,
        location: data.profile.location,
        email: data.profile.email,
        website: data.profile.website,
        footer_name: data.profile.footerName,
        brand_name: data.profile.brandName,
        contact_cta: data.profile.contactCta,
      });

      if (error) throw error;
    });

  const saveRole = (role: HeroRole) =>
    runSave(async () => {
      if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

      const { error } = await supabase.from("hero_roles").upsert({
        id: role.id,
        text: role.text,
        img_path: role.imgPath,
        sort_order: role.sortOrder,
        is_active: role.isActive,
      });

      if (error) throw error;
    });

  const saveProject = (project: Project) =>
    runSave(async () => {
      if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

      const { error } = await supabase.from("projects").upsert({
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.image,
        link: project.link,
        background_color: project.backgroundColor,
        featured: project.featured,
        sort_order: project.sortOrder,
        is_active: project.isActive,
      });

      if (error) throw error;
    });

  const saveExperience = (experience: Experience) =>
    runSave(async () => {
      if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

      const { error } = await supabase.from("experiences").upsert({
        id: experience.id,
        title: experience.title,
        date: experience.date,
        review: experience.review,
        img_path: experience.imgPath,
        logo_path: experience.logoPath,
        responsibilities: experience.responsibilities,
        sort_order: experience.sortOrder,
        is_active: experience.isActive,
      });

      if (error) throw error;
    });

  const saveSkill = (skill: Skill) =>
    runSave(async () => {
      if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

      const { error } = await supabase.from("skills").upsert({
        id: skill.id,
        name: skill.name,
        img_path: skill.imgPath,
        sort_order: skill.sortOrder,
        is_active: skill.isActive,
      });

      if (error) throw error;
    });

  const saveStat = (stat: Stat) =>
    runSave(async () => {
      if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

      const { error } = await supabase.from("stats").upsert({
        id: stat.id,
        label: stat.label,
        value: stat.value,
        suffix: stat.suffix,
        sort_order: stat.sortOrder,
        is_active: stat.isActive,
      });

      if (error) throw error;
    });

  const saveSocial = (social: SocialLink) =>
    runSave(async () => {
      if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

      const { error } = await supabase.from("social_links").upsert({
        id: social.id,
        name: social.name,
        img_path: social.imgPath,
        link: social.link,
        sort_order: social.sortOrder,
        is_active: social.isActive,
      });

      if (error) throw error;
    });

  const deleteItem = (table: string, id: string) =>
    runSave(async () => {
      if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    });

  const handleUpload = async (
    file: File | null,
    folder: string,
    onUploaded: (url: string) => void
  ) => {
    if (!file) return;

    setSaving(true);
    try {
      const url = await uploadAsset(file, folder);
      onUploaded(url);
      toast.success("Upload berhasil. Klik Save untuk menyimpan URL.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload gagal.");
    } finally {
      setSaving(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <main className="admin-shell">
        <section className="admin-card">
          <h1>Supabase belum dikonfigurasi</h1>
          <p>
            Tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di file
            `.env.local`, lalu jalankan ulang dev server.
          </p>
        </section>
      </main>
    );
  }

  if (!sessionReady) {
    return (
      <main className="admin-shell">
        <section className="admin-card">
          <p>Loading admin...</p>
        </section>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="admin-shell">
        <form className="admin-card admin-login" onSubmit={signIn}>
          <p className="admin-eyebrow">Portfolio CMS</p>
          <h1>Login Admin</h1>
          {authError && <div className="admin-alert">{authError}</div>}
          <label>
            Email
            <input
              type="email"
              value={authForm.email}
              autoComplete="email"
              onChange={(event) =>
                setAuthForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={authForm.password}
              autoComplete="current-password"
              onChange={(event) =>
                setAuthForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              required
            />
          </label>
          <button type="submit" disabled={authLoading}>
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Portfolio CMS</p>
          <h1>Update Konten Portfolio</h1>
        </div>
        <button type="button" onClick={signOut}>
          Logout
        </button>
      </header>

      <nav className="admin-tabs" aria-label="Admin sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "profile" && (
        <section className="admin-grid">
          <article className="admin-card">
            <h2>Profile & Hero</h2>
            <TextInput
              label="Brand Name"
              value={data.profile.brandName}
              onChange={(value) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, brandName: value },
                }))
              }
            />
            <TextInput
              label="Hero Name"
              value={data.profile.heroName}
              onChange={(value) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, heroName: value },
                }))
              }
            />
            <TextInput
              label="Hero Prefix"
              value={data.profile.heroPrefix}
              onChange={(value) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, heroPrefix: value },
                }))
              }
            />
            <TextareaInput
              label="Hero Subtitle"
              value={data.profile.heroSubtitle}
              onChange={(value) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, heroSubtitle: value },
                }))
              }
            />
            <ImageInput
              label="Profile Image"
              value={data.profile.profileImage}
              folder="profile"
              onUpload={handleUpload}
              onChange={(value) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, profileImage: value },
                }))
              }
            />
            <TextInput
              label="Location"
              value={data.profile.location}
              onChange={(value) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, location: value },
                }))
              }
            />
            <TextInput
              label="Email"
              value={data.profile.email}
              onChange={(value) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, email: value },
                }))
              }
            />
            <TextInput
              label="Website"
              value={data.profile.website}
              onChange={(value) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, website: value },
                }))
              }
            />
            <TextInput
              label="Footer Name"
              value={data.profile.footerName}
              onChange={(value) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, footerName: value },
                }))
              }
            />
            <TextInput
              label="Contact CTA"
              value={data.profile.contactCta}
              onChange={(value) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, contactCta: value },
                }))
              }
            />
            <button type="button" disabled={saving} onClick={saveProfile}>
              Save Profile
            </button>
          </article>

          <article className="admin-card">
            <AdminListHeader
              title="Hero Roles"
              onAdd={() =>
                setData((current) => ({
                  ...current,
                  heroRoles: [
                    ...current.heroRoles,
                    {
                      id: newId("role"),
                      text: "New Role",
                      imgPath: "/images/code.svg",
                      sortOrder: current.heroRoles.length + 1,
                      isActive: true,
                    },
                  ],
                }))
              }
            />
            {data.heroRoles.map((role, index) => (
              <div className="admin-item" key={role.id}>
                <TextInput
                  label="Role"
                  value={role.text}
                  onChange={(value) =>
                    setData((current) => updateRole(current, index, { text: value }))
                  }
                />
                <ImageInput
                  label="Icon"
                  value={role.imgPath}
                  folder="roles"
                  onUpload={handleUpload}
                  onChange={(value) =>
                    setData((current) =>
                      updateRole(current, index, { imgPath: value })
                    )
                  }
                />
                <MetaControls
                  sortOrder={role.sortOrder}
                  isActive={role.isActive}
                  onSortChange={(value) =>
                    setData((current) =>
                      updateRole(current, index, { sortOrder: value })
                    )
                  }
                  onActiveChange={(value) =>
                    setData((current) =>
                      updateRole(current, index, { isActive: value })
                    )
                  }
                />
                <div className="admin-actions">
                  <button type="button" disabled={saving} onClick={() => saveRole(role)}>
                    Save
                  </button>
                  <button
                    type="button"
                    className="danger"
                    disabled={saving}
                    onClick={() => deleteItem("hero_roles", role.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </article>
        </section>
      )}

      {activeTab === "projects" && (
        <section className="admin-grid">
          <article className="admin-card admin-span">
            <AdminListHeader
              title="Projects"
              onAdd={() =>
                setData((current) => ({
                  ...current,
                  projects: [
                    ...current.projects,
                    {
                      id: newId("project"),
                      title: "New Project",
                      description: "",
                      image: "/images/project1.png",
                      link: "#",
                      backgroundColor: "#e8f4f6",
                      featured: false,
                      sortOrder: current.projects.length + 1,
                      isActive: true,
                    },
                  ],
                }))
              }
            />
            {data.projects.map((project, index) => (
              <div className="admin-item" key={project.id}>
                <TextInput
                  label="Title"
                  value={project.title}
                  onChange={(value) =>
                    setData((current) =>
                      updateProject(current, index, { title: value })
                    )
                  }
                />
                <TextareaInput
                  label="Description"
                  value={project.description}
                  onChange={(value) =>
                    setData((current) =>
                      updateProject(current, index, { description: value })
                    )
                  }
                />
                <TextInput
                  label="Link"
                  value={project.link}
                  onChange={(value) =>
                    setData((current) =>
                      updateProject(current, index, { link: value })
                    )
                  }
                />
                <ImageInput
                  label="Image"
                  value={project.image}
                  folder="projects"
                  onUpload={handleUpload}
                  onChange={(value) =>
                    setData((current) =>
                      updateProject(current, index, { image: value })
                    )
                  }
                />
                <TextInput
                  label="Background Color"
                  value={project.backgroundColor}
                  onChange={(value) =>
                    setData((current) =>
                      updateProject(current, index, { backgroundColor: value })
                    )
                  }
                />
                <MetaControls
                  sortOrder={project.sortOrder}
                  isActive={project.isActive}
                  featured={project.featured}
                  onSortChange={(value) =>
                    setData((current) =>
                      updateProject(current, index, { sortOrder: value })
                    )
                  }
                  onActiveChange={(value) =>
                    setData((current) =>
                      updateProject(current, index, { isActive: value })
                    )
                  }
                  onFeaturedChange={(value) =>
                    setData((current) =>
                      updateProject(current, index, { featured: value })
                    )
                  }
                />
                <div className="admin-actions">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveProject(project)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="danger"
                    disabled={saving}
                    onClick={() => deleteItem("projects", project.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </article>
        </section>
      )}

      {activeTab === "experience" && (
        <section className="admin-grid">
          <article className="admin-card admin-span">
            <AdminListHeader
              title="Experience"
              onAdd={() =>
                setData((current) => ({
                  ...current,
                  experiences: [
                    ...current.experiences,
                    {
                      id: newId("experience"),
                      title: "New Experience",
                      date: "",
                      review: "",
                      imgPath: "",
                      logoPath: "",
                      responsibilities: [],
                      sortOrder: current.experiences.length + 1,
                      isActive: true,
                    },
                  ],
                }))
              }
            />
            {data.experiences.map((experience, index) => (
              <div className="admin-item" key={experience.id}>
                <TextInput
                  label="Title"
                  value={experience.title}
                  onChange={(value) =>
                    setData((current) =>
                      updateExperience(current, index, { title: value })
                    )
                  }
                />
                <TextInput
                  label="Date"
                  value={experience.date}
                  onChange={(value) =>
                    setData((current) =>
                      updateExperience(current, index, { date: value })
                    )
                  }
                />
                <TextareaInput
                  label="Review"
                  value={experience.review}
                  onChange={(value) =>
                    setData((current) =>
                      updateExperience(current, index, { review: value })
                    )
                  }
                />
                <TextareaInput
                  label="Responsibilities (one per line)"
                  value={experience.responsibilities.join("\n")}
                  onChange={(value) =>
                    setData((current) =>
                      updateExperience(current, index, {
                        responsibilities: value
                          .split("\n")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      })
                    )
                  }
                />
                <ImageInput
                  label="Card Image"
                  value={experience.imgPath}
                  folder="experience"
                  onUpload={handleUpload}
                  onChange={(value) =>
                    setData((current) =>
                      updateExperience(current, index, { imgPath: value })
                    )
                  }
                />
                <ImageInput
                  label="Logo"
                  value={experience.logoPath}
                  folder="experience"
                  onUpload={handleUpload}
                  onChange={(value) =>
                    setData((current) =>
                      updateExperience(current, index, { logoPath: value })
                    )
                  }
                />
                <MetaControls
                  sortOrder={experience.sortOrder}
                  isActive={experience.isActive}
                  onSortChange={(value) =>
                    setData((current) =>
                      updateExperience(current, index, { sortOrder: value })
                    )
                  }
                  onActiveChange={(value) =>
                    setData((current) =>
                      updateExperience(current, index, { isActive: value })
                    )
                  }
                />
                <div className="admin-actions">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveExperience(experience)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="danger"
                    disabled={saving}
                    onClick={() => deleteItem("experiences", experience.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </article>
        </section>
      )}

      {activeTab === "skills" && (
        <section className="admin-grid">
          <article className="admin-card admin-span">
            <AdminListHeader
              title="Skills"
              onAdd={() =>
                setData((current) => ({
                  ...current,
                  skills: [
                    ...current.skills,
                    {
                      id: newId("skill"),
                      name: "New Skill",
                      imgPath: "/images/logos/react.png",
                      sortOrder: current.skills.length + 1,
                      isActive: true,
                    },
                  ],
                }))
              }
            />
            {data.skills.map((skill, index) => (
              <div className="admin-item" key={skill.id}>
                <TextInput
                  label="Name"
                  value={skill.name}
                  onChange={(value) =>
                    setData((current) => updateSkill(current, index, { name: value }))
                  }
                />
                <ImageInput
                  label="Icon"
                  value={skill.imgPath}
                  folder="skills"
                  onUpload={handleUpload}
                  onChange={(value) =>
                    setData((current) =>
                      updateSkill(current, index, { imgPath: value })
                    )
                  }
                />
                <MetaControls
                  sortOrder={skill.sortOrder}
                  isActive={skill.isActive}
                  onSortChange={(value) =>
                    setData((current) =>
                      updateSkill(current, index, { sortOrder: value })
                    )
                  }
                  onActiveChange={(value) =>
                    setData((current) =>
                      updateSkill(current, index, { isActive: value })
                    )
                  }
                />
                <div className="admin-actions">
                  <button type="button" disabled={saving} onClick={() => saveSkill(skill)}>
                    Save
                  </button>
                  <button
                    type="button"
                    className="danger"
                    disabled={saving}
                    onClick={() => deleteItem("skills", skill.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </article>
        </section>
      )}

      {activeTab === "stats" && (
        <section className="admin-grid">
          <article className="admin-card admin-span">
            <AdminListHeader
              title="Stats"
              onAdd={() =>
                setData((current) => ({
                  ...current,
                  stats: [
                    ...current.stats,
                    {
                      id: newId("stat"),
                      label: "New Stat",
                      value: 0,
                      suffix: "+",
                      sortOrder: current.stats.length + 1,
                      isActive: true,
                    },
                  ],
                }))
              }
            />
            {data.stats.map((stat, index) => (
              <div className="admin-item" key={stat.id}>
                <TextInput
                  label="Label"
                  value={stat.label}
                  onChange={(value) =>
                    setData((current) => updateStat(current, index, { label: value }))
                  }
                />
                <NumberInput
                  label="Value"
                  value={stat.value}
                  onChange={(value) =>
                    setData((current) => updateStat(current, index, { value }))
                  }
                />
                <TextInput
                  label="Suffix"
                  value={stat.suffix}
                  onChange={(value) =>
                    setData((current) => updateStat(current, index, { suffix: value }))
                  }
                />
                <MetaControls
                  sortOrder={stat.sortOrder}
                  isActive={stat.isActive}
                  onSortChange={(value) =>
                    setData((current) =>
                      updateStat(current, index, { sortOrder: value })
                    )
                  }
                  onActiveChange={(value) =>
                    setData((current) =>
                      updateStat(current, index, { isActive: value })
                    )
                  }
                />
                <div className="admin-actions">
                  <button type="button" disabled={saving} onClick={() => saveStat(stat)}>
                    Save
                  </button>
                  <button
                    type="button"
                    className="danger"
                    disabled={saving}
                    onClick={() => deleteItem("stats", stat.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </article>
        </section>
      )}

      {activeTab === "social" && (
        <section className="admin-grid">
          <article className="admin-card admin-span">
            <AdminListHeader
              title="Social Links"
              onAdd={() =>
                setData((current) => ({
                  ...current,
                  socialLinks: [
                    ...current.socialLinks,
                    {
                      id: newId("social"),
                      name: "new",
                      imgPath: "/images/github.png",
                      link: "#",
                      sortOrder: current.socialLinks.length + 1,
                      isActive: true,
                    },
                  ],
                }))
              }
            />
            {data.socialLinks.map((social, index) => (
              <div className="admin-item" key={social.id}>
                <TextInput
                  label="Name"
                  value={social.name}
                  onChange={(value) =>
                    setData((current) =>
                      updateSocial(current, index, { name: value })
                    )
                  }
                />
                <TextInput
                  label="Link"
                  value={social.link}
                  onChange={(value) =>
                    setData((current) =>
                      updateSocial(current, index, { link: value })
                    )
                  }
                />
                <ImageInput
                  label="Icon"
                  value={social.imgPath}
                  folder="social"
                  onUpload={handleUpload}
                  onChange={(value) =>
                    setData((current) =>
                      updateSocial(current, index, { imgPath: value })
                    )
                  }
                />
                <MetaControls
                  sortOrder={social.sortOrder}
                  isActive={social.isActive}
                  onSortChange={(value) =>
                    setData((current) =>
                      updateSocial(current, index, { sortOrder: value })
                    )
                  }
                  onActiveChange={(value) =>
                    setData((current) =>
                      updateSocial(current, index, { isActive: value })
                    )
                  }
                />
                <div className="admin-actions">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveSocial(social)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="danger"
                    disabled={saving}
                    onClick={() => deleteItem("social_links", social.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </article>
        </section>
      )}
    </main>
  );
};

const getAuthErrorMessage = (message: string) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("email not confirmed")) {
    return "Email user belum dikonfirmasi. Di Supabase Auth, buka user tersebut lalu set Email Confirmed / Confirm user.";
  }

  if (
    lowerMessage.includes("invalid login credentials") ||
    lowerMessage.includes("invalid credentials")
  ) {
    return "Email atau password salah. Pastikan user dibuat di Supabase Auth dan password-nya benar.";
  }

  if (lowerMessage.includes("fetch") || lowerMessage.includes("network")) {
    return "Tidak bisa menghubungi Supabase. Cek URL, anon/publishable key, dan koneksi internet.";
  }

  return message || "Login gagal. Cek konfigurasi Supabase.";
};

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const TextInput = ({ label, value, onChange }: TextInputProps) => (
  <label>
    {label}
    <input value={value} onChange={(event) => onChange(event.target.value)} />
  </label>
);

const NumberInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => (
  <label>
    {label}
    <input
      type="number"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </label>
);

const TextareaInput = ({ label, value, onChange }: TextInputProps) => (
  <label>
    {label}
    <textarea
      value={value}
      rows={4}
      onChange={(event) => onChange(event.target.value)}
    />
  </label>
);

const ImageInput = ({
  label,
  value,
  folder,
  onChange,
  onUpload,
}: TextInputProps & {
  folder: string;
  onUpload: (
    file: File | null,
    folder: string,
    onUploaded: (url: string) => void
  ) => void;
}) => (
  <div className="admin-image-input">
    <TextInput label={label} value={value} onChange={onChange} />
    <input
      type="file"
      accept="image/*"
      onChange={(event) =>
        onUpload(event.target.files?.[0] ?? null, folder, onChange)
      }
    />
  </div>
);

const MetaControls = ({
  sortOrder,
  isActive,
  featured,
  onSortChange,
  onActiveChange,
  onFeaturedChange,
}: {
  sortOrder: number;
  isActive: boolean;
  featured?: boolean;
  onSortChange: (value: number) => void;
  onActiveChange: (value: boolean) => void;
  onFeaturedChange?: (value: boolean) => void;
}) => (
  <div className="admin-meta">
    <NumberInput label="Sort" value={sortOrder} onChange={onSortChange} />
    <label className="admin-check">
      <input
        type="checkbox"
        checked={isActive}
        onChange={(event) => onActiveChange(event.target.checked)}
      />
      Active
    </label>
    {onFeaturedChange && (
      <label className="admin-check">
        <input
          type="checkbox"
          checked={Boolean(featured)}
          onChange={(event) => onFeaturedChange(event.target.checked)}
        />
        Featured
      </label>
    )}
  </div>
);

const AdminListHeader = ({
  title,
  onAdd,
}: {
  title: string;
  onAdd: () => void;
}) => (
  <div className="admin-list-header">
    <h2>{title}</h2>
    <button type="button" onClick={onAdd}>
      Add
    </button>
  </div>
);

const updateRole = (
  data: PortfolioData,
  index: number,
  patch: Partial<HeroRole>
): PortfolioData => ({
  ...data,
  heroRoles: data.heroRoles.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item
  ),
});

const updateProject = (
  data: PortfolioData,
  index: number,
  patch: Partial<Project>
): PortfolioData => ({
  ...data,
  projects: data.projects.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item
  ),
});

const updateExperience = (
  data: PortfolioData,
  index: number,
  patch: Partial<Experience>
): PortfolioData => ({
  ...data,
  experiences: data.experiences.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item
  ),
});

const updateSkill = (
  data: PortfolioData,
  index: number,
  patch: Partial<Skill>
): PortfolioData => ({
  ...data,
  skills: data.skills.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item
  ),
});

const updateStat = (
  data: PortfolioData,
  index: number,
  patch: Partial<Stat>
): PortfolioData => ({
  ...data,
  stats: data.stats.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item
  ),
});

const updateSocial = (
  data: PortfolioData,
  index: number,
  patch: Partial<SocialLink>
): PortfolioData => ({
  ...data,
  socialLinks: data.socialLinks.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item
  ),
});

export default AdminPage;
