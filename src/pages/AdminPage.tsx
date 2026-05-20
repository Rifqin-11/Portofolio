import { useEffect, useMemo, useRef, useState } from "react";
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

type Tab =
  | "profile"
  | "projects"
  | "experience"
  | "skills"
  | "stats"
  | "social";

type TableKey =
  | "hero_roles"
  | "projects"
  | "experiences"
  | "skills"
  | "stats"
  | "social_links";

type TrackerMap = Record<TableKey, Set<string>>;

type Sortable = { id: string; sortOrder: number };

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

const emptyTrackers = (): TrackerMap => ({
  hero_roles: new Set<string>(),
  projects: new Set<string>(),
  experiences: new Set<string>(),
  skills: new Set<string>(),
  stats: new Set<string>(),
  social_links: new Set<string>(),
});

const renumberSort = <T extends Sortable>(items: T[]): T[] =>
  items.map((item, index) => ({ ...item, sortOrder: index + 1 }));

type RefreshTarget = "all" | "profile" | TableKey;

const moveItem = <T extends Sortable>(
  items: T[],
  from: number,
  dir: -1 | 1,
): T[] => {
  const to = from + dir;
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [picked] = next.splice(from, 1);
  next.splice(to, 0, picked);
  return renumberSort(next);
};

const ensureFeaturedProject = (projects: Project[]): Project[] => {
  if (projects.length === 0 || projects.some((project) => project.featured)) {
    return projects;
  }

  const featuredIndex = projects.reduce((bestIndex, project, index) => {
    const bestProject = projects[bestIndex];
    return project.sortOrder < bestProject.sortOrder ? index : bestIndex;
  }, 0);

  return projects.map((project, index) => ({
    ...project,
    featured: index === featuredIndex,
  }));
};

const normalizeAdminData = (incoming: PortfolioData): PortfolioData => ({
  ...incoming,
  projects: ensureFeaturedProject(incoming.projects),
});

const addToSet = (map: TrackerMap, table: TableKey, id: string): TrackerMap => {
  const set = new Set(map[table]);
  set.add(id);
  return { ...map, [table]: set };
};

const removeFromSet = (
  map: TrackerMap,
  table: TableKey,
  id: string,
): TrackerMap => {
  if (!map[table].has(id)) return map;
  const set = new Set(map[table]);
  set.delete(id);
  return { ...map, [table]: set };
};

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
  const [pendingDeletes, setPendingDeletes] =
    useState<TrackerMap>(emptyTrackers);
  const [pendingNew, setPendingNew] = useState<TrackerMap>(emptyTrackers);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const originalRef = useRef<PortfolioData>(fallbackPortfolioData);

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
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchPortfolioData(true).then((fresh) => {
      const normalized = normalizeAdminData(fresh);
      setData(normalized);
      originalRef.current = normalized;
      setPendingDeletes(emptyTrackers());
      setPendingNew(emptyTrackers());
      setExpanded({});
    });
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

  const mergeFreshData = (
    current: PortfolioData,
    fresh: PortfolioData,
    target: RefreshTarget,
  ): PortfolioData => {
    switch (target) {
      case "all":
        return fresh;
      case "profile":
        return { ...current, profile: fresh.profile };
      case "hero_roles":
        return { ...current, heroRoles: fresh.heroRoles };
      case "projects":
        return { ...current, projects: fresh.projects };
      case "experiences":
        return { ...current, experiences: fresh.experiences };
      case "skills":
        return { ...current, skills: fresh.skills };
      case "stats":
        return { ...current, stats: fresh.stats };
      case "social_links":
        return { ...current, socialLinks: fresh.socialLinks };
    }
  };

  const clearTrackers = (target: RefreshTarget) => {
    if (target === "all") {
      setPendingDeletes(emptyTrackers());
      setPendingNew(emptyTrackers());
      return;
    }

    if (target === "profile") return;

    setPendingDeletes((current) => ({
      ...current,
      [target]: new Set<string>(),
    }));
    setPendingNew((current) => ({
      ...current,
      [target]: new Set<string>(),
    }));
  };

  const refreshData = async (target: RefreshTarget = "all") => {
    const fresh = normalizeAdminData(await fetchPortfolioData(true));
    setData((current) => mergeFreshData(current, fresh, target));
    originalRef.current = mergeFreshData(originalRef.current, fresh, target);
    clearTrackers(target);
  };

  const discardSection = (table: TableKey) => {
    const orig = originalRef.current;
    setData((current) => {
      switch (table) {
        case "hero_roles":
          return { ...current, heroRoles: orig.heroRoles };
        case "projects":
          return { ...current, projects: orig.projects };
        case "experiences":
          return { ...current, experiences: orig.experiences };
        case "skills":
          return { ...current, skills: orig.skills };
        case "stats":
          return { ...current, stats: orig.stats };
        case "social_links":
          return { ...current, socialLinks: orig.socialLinks };
      }
    });
    setPendingDeletes((curr) => ({ ...curr, [table]: new Set<string>() }));
    setPendingNew((curr) => ({ ...curr, [table]: new Set<string>() }));
    toast.success("Perubahan dibatalkan.");
  };

  const discardProfile = () => {
    setData((current) => ({
      ...current,
      profile: originalRef.current.profile,
    }));
    toast.success("Perubahan profil dibatalkan.");
  };

  const runSave = async (
    action: () => Promise<void>,
    refreshTarget: RefreshTarget,
  ) => {
    setSaving(true);
    try {
      await action();
      await refreshData(refreshTarget);
      toast.success("Perubahan tersimpan.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = () =>
    runSave(
      async () => {
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
      },
      "profile",
    );

  const saveSection = <T extends { id: string }>(
    table: TableKey,
    items: T[],
    mapper: (item: T) => Record<string, unknown>,
    preValidate?: () => string | null,
  ) =>
    runSave(
      async () => {
        if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

        const validationError = preValidate?.();
        if (validationError) throw new Error(validationError);

        if (items.length > 0) {
          const { error } = await supabase.from(table).upsert(items.map(mapper));
          if (error) throw error;
        }

        const toDelete = [...pendingDeletes[table]];
        if (toDelete.length > 0) {
          const { error } = await supabase
            .from(table)
            .delete()
            .in("id", toDelete);
          if (error) throw error;
        }
      },
      table,
    );

  const saveRoles = () =>
    saveSection("hero_roles", data.heroRoles, (role) => ({
      id: role.id,
      text: role.text,
      img_path: role.imgPath,
      sort_order: role.sortOrder,
      is_active: role.isActive,
    }));

  const saveProjects = () =>
    saveSection(
      "projects",
      data.projects,
      (project) => ({
        id: project.id,
        title: project.title,
        description: project.featured ? project.description : "",
        image: project.image,
        link: project.link,
        background_color: project.backgroundColor,
        image_layout: project.imageLayout,
        featured: project.featured,
        sort_order: project.sortOrder,
        is_active: project.isActive,
      }),
      () => {
        if (data.projects.length === 0) return null;
        const featuredCount = data.projects.filter((p) => p.featured).length;
        if (featuredCount === 0)
          return "Pilih satu project sebagai Featured sebelum menyimpan.";
        if (featuredCount > 1)
          return "Hanya satu project yang boleh di-Featured.";
        return null;
      },
    );

  const saveExperiences = () =>
    saveSection("experiences", data.experiences, (experience) => ({
      id: experience.id,
      title: experience.title,
      date: experience.date,
      review: experience.review,
      img_path: experience.imgPath,
      logo_path: experience.logoPath,
      responsibilities: experience.responsibilities,
      sort_order: experience.sortOrder,
      is_active: experience.isActive,
    }));

  const saveSkills = () =>
    saveSection("skills", data.skills, (skill) => ({
      id: skill.id,
      name: skill.name,
      img_path: skill.imgPath,
      sort_order: skill.sortOrder,
      is_active: skill.isActive,
    }));

  const saveStats = () =>
    saveSection("stats", data.stats, (stat) => ({
      id: stat.id,
      label: stat.label,
      value: stat.value,
      suffix: stat.suffix,
      sort_order: stat.sortOrder,
      is_active: stat.isActive,
    }));

  const saveSocialLinks = () =>
    saveSection("social_links", data.socialLinks, (social) => ({
      id: social.id,
      name: social.name,
      img_path: social.imgPath,
      link: social.link,
      sort_order: social.sortOrder,
      is_active: social.isActive,
    }));

  const isPersistedItem = (table: TableKey, id: string): boolean => {
    const orig = originalRef.current;
    switch (table) {
      case "hero_roles":
        return orig.heroRoles.some((item) => item.id === id);
      case "projects":
        return orig.projects.some((item) => item.id === id);
      case "experiences":
        return orig.experiences.some((item) => item.id === id);
      case "skills":
        return orig.skills.some((item) => item.id === id);
      case "stats":
        return orig.stats.some((item) => item.id === id);
      case "social_links":
        return orig.socialLinks.some((item) => item.id === id);
    }
  };

  const queueDelete = (
    table: TableKey,
    id: string,
    removeFromState: () => void,
  ) => {
    if (
      !window.confirm(
        "Hapus item ini? Perubahan baru berlaku setelah Save Section.",
      )
    ) {
      return;
    }

    removeFromState();
    setExpanded((curr) => {
      if (!(id in curr)) return curr;
      const next = { ...curr };
      delete next[id];
      return next;
    });

    if (isPersistedItem(table, id)) {
      setPendingDeletes((curr) => addToSet(curr, table, id));
    }
    setPendingNew((curr) => removeFromSet(curr, table, id));
  };

  const markNew = (table: TableKey, id: string) => {
    setPendingNew((curr) => addToSet(curr, table, id));
    setExpanded((curr) => ({ ...curr, [id]: true }));
  };

  const toggleExpanded = (id: string) =>
    setExpanded((curr) => ({ ...curr, [id]: !curr[id] }));

  const setFeaturedProject = (projectId: string) => {
    setData((current) => ({
      ...current,
      projects: current.projects.map((project) => ({
        ...project,
        featured: project.id === projectId,
      })),
    }));
  };

  const sectionDirty = (table: TableKey): boolean => {
    if (pendingDeletes[table].size > 0) return true;
    if (pendingNew[table].size > 0) return true;
    const orig = originalRef.current;
    const pick = (d: PortfolioData) => {
      switch (table) {
        case "hero_roles":
          return d.heroRoles;
        case "projects":
          return d.projects;
        case "experiences":
          return d.experiences;
        case "skills":
          return d.skills;
        case "stats":
          return d.stats;
        case "social_links":
          return d.socialLinks;
      }
    };
    return JSON.stringify(pick(data)) !== JSON.stringify(pick(orig));
  };

  const profileDirty = useMemo(
    () =>
      JSON.stringify(data.profile) !==
      JSON.stringify(originalRef.current.profile),
    [data.profile],
  );

  const handleUpload = async (
    file: File | null,
    folder: string,
    onUploaded: (url: string) => void,
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
          <article className="admin-card admin-span">
            <SectionActionBar
              title="Profile & Hero"
              dirty={profileDirty}
              saving={saving}
              onSave={saveProfile}
              onDiscard={discardProfile}
              saveLabel="Save Profile"
            />
            <div className="admin-form-grid">
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
            </div>
          </article>

          <article className="admin-card admin-span">
            <SectionActionBar
              title="Hero Roles"
              dirty={sectionDirty("hero_roles")}
              saving={saving}
              onSave={saveRoles}
              onDiscard={() => discardSection("hero_roles")}
              onAdd={() => {
                const id = newId("role");
                setData((current) => ({
                  ...current,
                  heroRoles: [
                    ...current.heroRoles,
                    {
                      id,
                      text: "New Role",
                      imgPath: "/images/code.svg",
                      sortOrder: current.heroRoles.length + 1,
                      isActive: true,
                    },
                  ],
                }));
                markNew("hero_roles", id);
              }}
              pendingDeletes={pendingDeletes.hero_roles.size}
              pendingNew={pendingNew.hero_roles.size}
            />
            {data.heroRoles.length === 0 && (
              <p className="admin-empty">
                Belum ada role. Tambah lewat tombol Add.
              </p>
            )}
            {data.heroRoles.map((role, index) => {
              const badges: { tone: Tone; label: string }[] = [];
              if (pendingNew.hero_roles.has(role.id))
                badges.push({ tone: "draft", label: "Draft" });
              return (
                <ItemCard
                  key={role.id}
                  title={role.text || "Role baru"}
                  expanded={expanded[role.id] ?? false}
                  onToggle={() => toggleExpanded(role.id)}
                  badges={badges}
                  isActive={role.isActive}
                  onActiveChange={(value) =>
                    setData((current) =>
                      updateRole(current, index, { isActive: value }),
                    )
                  }
                  onMoveUp={
                    index > 0
                      ? () =>
                          setData((current) => ({
                            ...current,
                            heroRoles: renumberSort(
                              moveItem(current.heroRoles, index, -1),
                            ),
                          }))
                      : undefined
                  }
                  onMoveDown={
                    index < data.heroRoles.length - 1
                      ? () =>
                          setData((current) => ({
                            ...current,
                            heroRoles: renumberSort(
                              moveItem(current.heroRoles, index, 1),
                            ),
                          }))
                      : undefined
                  }
                  onDelete={() =>
                    queueDelete("hero_roles", role.id, () =>
                      setData((current) => ({
                        ...current,
                        heroRoles: renumberSort(
                          current.heroRoles.filter(
                            (item) => item.id !== role.id,
                          ),
                        ),
                      })),
                    )
                  }
                  saving={saving}
                >
                  <TextInput
                    label="Role"
                    value={role.text}
                    onChange={(value) =>
                      setData((current) =>
                        updateRole(current, index, { text: value }),
                      )
                    }
                  />
                  <ImageInput
                    label="Icon"
                    value={role.imgPath}
                    folder="roles"
                    onUpload={handleUpload}
                    onChange={(value) =>
                      setData((current) =>
                        updateRole(current, index, { imgPath: value }),
                      )
                    }
                  />
                </ItemCard>
              );
            })}
          </article>
        </section>
      )}

      {activeTab === "projects" && (
        <section className="admin-grid">
          <article className="admin-card admin-span">
            <SectionActionBar
              title="Projects"
              dirty={sectionDirty("projects")}
              saving={saving}
              onSave={saveProjects}
              onDiscard={() => discardSection("projects")}
              onAdd={() => {
                const id = newId("project");
                setData((current) => {
                  const shouldFeature =
                    current.projects.length === 0 ||
                    !current.projects.some((project) => project.featured);
                  return {
                    ...current,
                    projects: [
                      ...current.projects,
                      {
                        id,
                        title: "New Project",
                        description: "",
                        image: "/images/project1.png",
                        link: "#",
                        backgroundColor: "#e8f4f6",
                        imageLayout: "full",
                        featured: shouldFeature,
                        sortOrder: current.projects.length + 1,
                        isActive: true,
                      },
                    ],
                  };
                });
                markNew("projects", id);
              }}
              pendingDeletes={pendingDeletes.projects.size}
              pendingNew={pendingNew.projects.size}
            />
            {data.projects.length === 0 && (
              <p className="admin-empty">
                Belum ada project. Tambah lewat tombol Add — project pertama
                otomatis di-Featured.
              </p>
            )}
            {data.projects.map((project, index) => {
              const badges: { tone: Tone; label: string }[] = [];
              if (project.featured)
                badges.push({ tone: "featured", label: "Featured" });
              if (project.imageLayout === "full")
                badges.push({ tone: "active", label: "Full image" });
              if (pendingNew.projects.has(project.id))
                badges.push({ tone: "draft", label: "Draft" });
              return (
                <ItemCard
                  key={project.id}
                  title={project.title || "Project baru"}
                  expanded={expanded[project.id] ?? false}
                  onToggle={() => toggleExpanded(project.id)}
                  badges={badges}
                  isActive={project.isActive}
                  onActiveChange={(value) =>
                    setData((current) =>
                      updateProject(current, index, { isActive: value }),
                    )
                  }
                  onMoveUp={
                    index > 0
                      ? () =>
                          setData((current) => ({
                            ...current,
                            projects: renumberSort(
                              moveItem(current.projects, index, -1),
                            ),
                          }))
                      : undefined
                  }
                  onMoveDown={
                    index < data.projects.length - 1
                      ? () =>
                          setData((current) => ({
                            ...current,
                            projects: renumberSort(
                              moveItem(current.projects, index, 1),
                            ),
                          }))
                      : undefined
                  }
                  onDelete={() =>
                    queueDelete("projects", project.id, () =>
                      setData((current) => {
                        const remaining = current.projects.filter(
                          (item) => item.id !== project.id,
                        );
                        const stillFeatured = remaining.some((p) => p.featured);
                        const next = renumberSort(remaining);
                        if (!stillFeatured && next.length > 0) {
                          next[0] = { ...next[0], featured: true };
                        }
                        return { ...current, projects: next };
                      }),
                    )
                  }
                  saving={saving}
                >
                  <TextInput
                    label="Title"
                    value={project.title}
                    onChange={(value) =>
                      setData((current) =>
                        updateProject(current, index, { title: value }),
                      )
                    }
                  />
                  <TextInput
                    label="Link"
                    value={project.link}
                    onChange={(value) =>
                      setData((current) =>
                        updateProject(current, index, { link: value }),
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
                        updateProject(current, index, { image: value }),
                      )
                    }
                  />
                  <ProjectImageLayoutPicker
                    projectId={project.id}
                    value={project.imageLayout}
                    onChange={(value) =>
                      setData((current) =>
                        updateProject(current, index, {
                          imageLayout: value,
                        }),
                      )
                    }
                  />
                  {project.imageLayout === "contained" && (
                    <ColorInput
                      label="Background Color"
                      value={project.backgroundColor}
                      onChange={(value) =>
                        setData((current) =>
                          updateProject(current, index, {
                            backgroundColor: value,
                          }),
                        )
                      }
                    />
                  )}
                  <label className="admin-check admin-featured-radio">
                    <input
                      type="radio"
                      name="featured-project"
                      checked={project.featured}
                      onChange={() => setFeaturedProject(project.id)}
                    />
                    Featured (tampil di hero showcase)
                  </label>
                  {project.featured && (
                    <TextareaInput
                      label="Description (hanya untuk featured)"
                      value={project.description}
                      onChange={(value) =>
                        setData((current) =>
                          updateProject(current, index, { description: value }),
                        )
                      }
                    />
                  )}
                </ItemCard>
              );
            })}
          </article>
        </section>
      )}

      {activeTab === "experience" && (
        <section className="admin-grid">
          <article className="admin-card admin-span">
            <SectionActionBar
              title="Experience"
              dirty={sectionDirty("experiences")}
              saving={saving}
              onSave={saveExperiences}
              onDiscard={() => discardSection("experiences")}
              onAdd={() => {
                const id = newId("experience");
                setData((current) => ({
                  ...current,
                  experiences: [
                    ...current.experiences,
                    {
                      id,
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
                }));
                markNew("experiences", id);
              }}
              pendingDeletes={pendingDeletes.experiences.size}
              pendingNew={pendingNew.experiences.size}
            />
            {data.experiences.length === 0 && (
              <p className="admin-empty">Belum ada experience.</p>
            )}
            {data.experiences.map((experience, index) => {
              const badges: { tone: Tone; label: string }[] = [];
              if (pendingNew.experiences.has(experience.id))
                badges.push({ tone: "draft", label: "Draft" });
              return (
                <ItemCard
                  key={experience.id}
                  title={experience.title || "Experience baru"}
                  expanded={expanded[experience.id] ?? false}
                  onToggle={() => toggleExpanded(experience.id)}
                  badges={badges}
                  isActive={experience.isActive}
                  onActiveChange={(value) =>
                    setData((current) =>
                      updateExperience(current, index, { isActive: value }),
                    )
                  }
                  onMoveUp={
                    index > 0
                      ? () =>
                          setData((current) => ({
                            ...current,
                            experiences: renumberSort(
                              moveItem(current.experiences, index, -1),
                            ),
                          }))
                      : undefined
                  }
                  onMoveDown={
                    index < data.experiences.length - 1
                      ? () =>
                          setData((current) => ({
                            ...current,
                            experiences: renumberSort(
                              moveItem(current.experiences, index, 1),
                            ),
                          }))
                      : undefined
                  }
                  onDelete={() =>
                    queueDelete("experiences", experience.id, () =>
                      setData((current) => ({
                        ...current,
                        experiences: renumberSort(
                          current.experiences.filter(
                            (item) => item.id !== experience.id,
                          ),
                        ),
                      })),
                    )
                  }
                  saving={saving}
                >
                  <TextInput
                    label="Title"
                    value={experience.title}
                    onChange={(value) =>
                      setData((current) =>
                        updateExperience(current, index, { title: value }),
                      )
                    }
                  />
                  <TextInput
                    label="Date"
                    value={experience.date}
                    onChange={(value) =>
                      setData((current) =>
                        updateExperience(current, index, { date: value }),
                      )
                    }
                  />
                  <TextareaInput
                    label="Review"
                    value={experience.review}
                    onChange={(value) =>
                      setData((current) =>
                        updateExperience(current, index, { review: value }),
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
                        }),
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
                        updateExperience(current, index, { imgPath: value }),
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
                        updateExperience(current, index, { logoPath: value }),
                      )
                    }
                  />
                </ItemCard>
              );
            })}
          </article>
        </section>
      )}

      {activeTab === "skills" && (
        <section className="admin-grid">
          <article className="admin-card admin-span">
            <SectionActionBar
              title="Skills"
              dirty={sectionDirty("skills")}
              saving={saving}
              onSave={saveSkills}
              onDiscard={() => discardSection("skills")}
              onAdd={() => {
                const id = newId("skill");
                setData((current) => ({
                  ...current,
                  skills: [
                    ...current.skills,
                    {
                      id,
                      name: "New Skill",
                      imgPath: "/images/logos/react.png",
                      sortOrder: current.skills.length + 1,
                      isActive: true,
                    },
                  ],
                }));
                markNew("skills", id);
              }}
              pendingDeletes={pendingDeletes.skills.size}
              pendingNew={pendingNew.skills.size}
            />
            {data.skills.length === 0 && (
              <p className="admin-empty">Belum ada skill.</p>
            )}
            {data.skills.map((skill, index) => {
              const badges: { tone: Tone; label: string }[] = [];
              if (pendingNew.skills.has(skill.id))
                badges.push({ tone: "draft", label: "Draft" });
              return (
                <ItemCard
                  key={skill.id}
                  title={skill.name || "Skill baru"}
                  expanded={expanded[skill.id] ?? false}
                  onToggle={() => toggleExpanded(skill.id)}
                  badges={badges}
                  isActive={skill.isActive}
                  onActiveChange={(value) =>
                    setData((current) =>
                      updateSkill(current, index, { isActive: value }),
                    )
                  }
                  onMoveUp={
                    index > 0
                      ? () =>
                          setData((current) => ({
                            ...current,
                            skills: renumberSort(
                              moveItem(current.skills, index, -1),
                            ),
                          }))
                      : undefined
                  }
                  onMoveDown={
                    index < data.skills.length - 1
                      ? () =>
                          setData((current) => ({
                            ...current,
                            skills: renumberSort(
                              moveItem(current.skills, index, 1),
                            ),
                          }))
                      : undefined
                  }
                  onDelete={() =>
                    queueDelete("skills", skill.id, () =>
                      setData((current) => ({
                        ...current,
                        skills: renumberSort(
                          current.skills.filter((item) => item.id !== skill.id),
                        ),
                      })),
                    )
                  }
                  saving={saving}
                >
                  <TextInput
                    label="Name"
                    value={skill.name}
                    onChange={(value) =>
                      setData((current) =>
                        updateSkill(current, index, { name: value }),
                      )
                    }
                  />
                  <ImageInput
                    label="Icon"
                    value={skill.imgPath}
                    folder="skills"
                    onUpload={handleUpload}
                    onChange={(value) =>
                      setData((current) =>
                        updateSkill(current, index, { imgPath: value }),
                      )
                    }
                  />
                </ItemCard>
              );
            })}
          </article>
        </section>
      )}

      {activeTab === "stats" && (
        <section className="admin-grid">
          <article className="admin-card admin-span">
            <SectionActionBar
              title="Stats"
              dirty={sectionDirty("stats")}
              saving={saving}
              onSave={saveStats}
              onDiscard={() => discardSection("stats")}
              onAdd={() => {
                const id = newId("stat");
                setData((current) => ({
                  ...current,
                  stats: [
                    ...current.stats,
                    {
                      id,
                      label: "New Stat",
                      value: 0,
                      suffix: "+",
                      sortOrder: current.stats.length + 1,
                      isActive: true,
                    },
                  ],
                }));
                markNew("stats", id);
              }}
              pendingDeletes={pendingDeletes.stats.size}
              pendingNew={pendingNew.stats.size}
            />
            {data.stats.length === 0 && (
              <p className="admin-empty">Belum ada stat.</p>
            )}
            {data.stats.map((stat, index) => {
              const badges: { tone: Tone; label: string }[] = [];
              if (pendingNew.stats.has(stat.id))
                badges.push({ tone: "draft", label: "Draft" });
              return (
                <ItemCard
                  key={stat.id}
                  title={stat.label || "Stat baru"}
                  expanded={expanded[stat.id] ?? false}
                  onToggle={() => toggleExpanded(stat.id)}
                  badges={badges}
                  isActive={stat.isActive}
                  onActiveChange={(value) =>
                    setData((current) =>
                      updateStat(current, index, { isActive: value }),
                    )
                  }
                  onMoveUp={
                    index > 0
                      ? () =>
                          setData((current) => ({
                            ...current,
                            stats: renumberSort(
                              moveItem(current.stats, index, -1),
                            ),
                          }))
                      : undefined
                  }
                  onMoveDown={
                    index < data.stats.length - 1
                      ? () =>
                          setData((current) => ({
                            ...current,
                            stats: renumberSort(
                              moveItem(current.stats, index, 1),
                            ),
                          }))
                      : undefined
                  }
                  onDelete={() =>
                    queueDelete("stats", stat.id, () =>
                      setData((current) => ({
                        ...current,
                        stats: renumberSort(
                          current.stats.filter((item) => item.id !== stat.id),
                        ),
                      })),
                    )
                  }
                  saving={saving}
                >
                  <TextInput
                    label="Label"
                    value={stat.label}
                    onChange={(value) =>
                      setData((current) =>
                        updateStat(current, index, { label: value }),
                      )
                    }
                  />
                  <NumberInput
                    label="Value"
                    value={stat.value}
                    onChange={(value) =>
                      setData((current) =>
                        updateStat(current, index, { value }),
                      )
                    }
                  />
                  <TextInput
                    label="Suffix"
                    value={stat.suffix}
                    onChange={(value) =>
                      setData((current) =>
                        updateStat(current, index, { suffix: value }),
                      )
                    }
                  />
                </ItemCard>
              );
            })}
          </article>
        </section>
      )}

      {activeTab === "social" && (
        <section className="admin-grid">
          <article className="admin-card admin-span">
            <SectionActionBar
              title="Social Links"
              dirty={sectionDirty("social_links")}
              saving={saving}
              onSave={saveSocialLinks}
              onDiscard={() => discardSection("social_links")}
              onAdd={() => {
                const id = newId("social");
                setData((current) => ({
                  ...current,
                  socialLinks: [
                    ...current.socialLinks,
                    {
                      id,
                      name: "new",
                      imgPath: "/images/github.png",
                      link: "#",
                      sortOrder: current.socialLinks.length + 1,
                      isActive: true,
                    },
                  ],
                }));
                markNew("social_links", id);
              }}
              pendingDeletes={pendingDeletes.social_links.size}
              pendingNew={pendingNew.social_links.size}
            />
            {data.socialLinks.length === 0 && (
              <p className="admin-empty">Belum ada social link.</p>
            )}
            {data.socialLinks.map((social, index) => {
              const badges: { tone: Tone; label: string }[] = [];
              if (pendingNew.social_links.has(social.id))
                badges.push({ tone: "draft", label: "Draft" });
              return (
                <ItemCard
                  key={social.id}
                  title={social.name || "Social baru"}
                  expanded={expanded[social.id] ?? false}
                  onToggle={() => toggleExpanded(social.id)}
                  badges={badges}
                  isActive={social.isActive}
                  onActiveChange={(value) =>
                    setData((current) =>
                      updateSocial(current, index, { isActive: value }),
                    )
                  }
                  onMoveUp={
                    index > 0
                      ? () =>
                          setData((current) => ({
                            ...current,
                            socialLinks: renumberSort(
                              moveItem(current.socialLinks, index, -1),
                            ),
                          }))
                      : undefined
                  }
                  onMoveDown={
                    index < data.socialLinks.length - 1
                      ? () =>
                          setData((current) => ({
                            ...current,
                            socialLinks: renumberSort(
                              moveItem(current.socialLinks, index, 1),
                            ),
                          }))
                      : undefined
                  }
                  onDelete={() =>
                    queueDelete("social_links", social.id, () =>
                      setData((current) => ({
                        ...current,
                        socialLinks: renumberSort(
                          current.socialLinks.filter(
                            (item) => item.id !== social.id,
                          ),
                        ),
                      })),
                    )
                  }
                  saving={saving}
                >
                  <TextInput
                    label="Name"
                    value={social.name}
                    onChange={(value) =>
                      setData((current) =>
                        updateSocial(current, index, { name: value }),
                      )
                    }
                  />
                  <TextInput
                    label="Link"
                    value={social.link}
                    onChange={(value) =>
                      setData((current) =>
                        updateSocial(current, index, { link: value }),
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
                        updateSocial(current, index, { imgPath: value }),
                      )
                    }
                  />
                </ItemCard>
              );
            })}
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

const toColorInputValue = (value: string) => {
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#e8f4f6";
};

const ColorInput = ({ label, value, onChange }: TextInputProps) => (
  <label className="admin-color-input">
    {label}
    <span>
      <input
        type="color"
        value={toColorInputValue(value)}
        onChange={(event) => onChange(event.target.value)}
        aria-label={`${label} picker`}
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={`${label} hex value`}
      />
    </span>
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
    onUploaded: (url: string) => void,
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

const ProjectImageLayoutPicker = ({
  projectId,
  value,
  onChange,
}: {
  projectId: string;
  value: Project["imageLayout"];
  onChange: (value: Project["imageLayout"]) => void;
}) => (
  <div className="admin-field-group">
    <span>Image Display</span>
    <div className="admin-layout-options" role="radiogroup">
      <label className={value === "full" ? "active" : ""}>
        <input
          type="radio"
          name={`project-image-layout-${projectId}`}
          checked={value === "full"}
          onChange={() => onChange("full")}
        />
        <span>
          <strong>Full image</strong>
          <small>Foto memenuhi card tanpa background warna.</small>
        </span>
      </label>
      <label className={value === "contained" ? "active" : ""}>
        <input
          type="radio"
          name={`project-image-layout-${projectId}`}
          checked={value === "contained"}
          onChange={() => onChange("contained")}
        />
        <span>
          <strong>With background</strong>
          <small>Mode lama, foto contain dengan pilihan warna.</small>
        </span>
      </label>
    </div>
  </div>
);

type Tone = "active" | "inactive" | "featured" | "draft" | "danger";

const Badge = ({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) => <span className={`admin-badge admin-badge-${tone}`}>{children}</span>;

type SectionActionBarProps = {
  title: string;
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onAdd?: () => void;
  pendingDeletes?: number;
  pendingNew?: number;
  saveLabel?: string;
};

const SectionActionBar = ({
  title,
  dirty,
  saving,
  onSave,
  onDiscard,
  onAdd,
  pendingDeletes = 0,
  pendingNew = 0,
  saveLabel = "Save Section",
}: SectionActionBarProps) => (
  <div className="admin-section-bar">
    <div className="admin-section-bar-info">
      <h2>{title}</h2>
      <div className="admin-section-bar-meta">
        {dirty ? (
          <span className="admin-pill admin-pill-dirty">Unsaved changes</span>
        ) : (
          <span className="admin-pill admin-pill-clean">All saved</span>
        )}
        {pendingNew > 0 && (
          <span className="admin-pill admin-pill-draft">
            {pendingNew} draft{pendingNew > 1 ? "s" : ""}
          </span>
        )}
        {pendingDeletes > 0 && (
          <span className="admin-pill admin-pill-delete">
            Pending delete: {pendingDeletes}
          </span>
        )}
      </div>
    </div>
    <div className="admin-section-bar-actions">
      {onAdd && (
        <button
          type="button"
          className="ghost"
          onClick={onAdd}
          disabled={saving}
        >
          + Add
        </button>
      )}
      <button
        type="button"
        className="ghost"
        onClick={onDiscard}
        disabled={saving || !dirty}
      >
        Discard
      </button>
      <button type="button" onClick={onSave} disabled={saving || !dirty}>
        {saving ? "Saving..." : saveLabel}
      </button>
    </div>
  </div>
);

type ItemCardProps = {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  badges?: { tone: Tone; label: string }[];
  isActive: boolean;
  onActiveChange: (value: boolean) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete: () => void;
  saving: boolean;
  children: React.ReactNode;
};

const ItemCard = ({
  title,
  expanded,
  onToggle,
  badges = [],
  isActive,
  onActiveChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  saving,
  children,
}: ItemCardProps) => (
  <div
    className={`admin-item ${expanded ? "is-open" : "is-closed"} ${
      isActive ? "is-active" : "is-inactive"
    }`}
  >
    <header className="admin-item-header">
      <button
        type="button"
        className="admin-item-toggle"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <span className="admin-chevron" aria-hidden>
          {expanded ? "▾" : "▸"}
        </span>
        <span className="admin-item-title">{title || "(untitled)"}</span>
        {badges.length > 0 && (
          <span className="admin-item-badges">
            {badges.map((badge) => (
              <Badge key={`${badge.tone}-${badge.label}`} tone={badge.tone}>
                {badge.label}
              </Badge>
            ))}
          </span>
        )}
      </button>
      <div className="admin-item-controls">
        <button
          type="button"
          className={`admin-status-toggle ${
            isActive ? "is-active" : "is-inactive"
          }`}
          onClick={() => onActiveChange(!isActive)}
          disabled={saving}
          aria-pressed={isActive}
          title={isActive ? "Set inactive" : "Set active"}
        >
          {isActive ? "Active" : "Inactive"}
        </button>
        <button
          type="button"
          className="ghost icon"
          onClick={onMoveUp}
          disabled={!onMoveUp || saving}
          aria-label="Move up"
          title="Move up"
        >
          ↑
        </button>
        <button
          type="button"
          className="ghost icon"
          onClick={onMoveDown}
          disabled={!onMoveDown || saving}
          aria-label="Move down"
          title="Move down"
        >
          ↓
        </button>
        <button
          type="button"
          className="danger icon"
          onClick={onDelete}
          disabled={saving}
          aria-label="Delete"
          title="Delete"
        >
          ×
        </button>
      </div>
    </header>
    {expanded && <div className="admin-item-body">{children}</div>}
  </div>
);

const updateRole = (
  data: PortfolioData,
  index: number,
  patch: Partial<HeroRole>,
): PortfolioData => ({
  ...data,
  heroRoles: data.heroRoles.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item,
  ),
});

const updateProject = (
  data: PortfolioData,
  index: number,
  patch: Partial<Project>,
): PortfolioData => ({
  ...data,
  projects: data.projects.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item,
  ),
});

const updateExperience = (
  data: PortfolioData,
  index: number,
  patch: Partial<Experience>,
): PortfolioData => ({
  ...data,
  experiences: data.experiences.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item,
  ),
});

const updateSkill = (
  data: PortfolioData,
  index: number,
  patch: Partial<Skill>,
): PortfolioData => ({
  ...data,
  skills: data.skills.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item,
  ),
});

const updateStat = (
  data: PortfolioData,
  index: number,
  patch: Partial<Stat>,
): PortfolioData => ({
  ...data,
  stats: data.stats.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item,
  ),
});

const updateSocial = (
  data: PortfolioData,
  index: number,
  patch: Partial<SocialLink>,
): PortfolioData => ({
  ...data,
  socialLinks: data.socialLinks.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item,
  ),
});

export default AdminPage;
