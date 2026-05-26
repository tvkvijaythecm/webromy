import React, { useState, useEffect } from "react";
import { 
  Lock, LayoutDashboard, Sliders, Home as HomeIcon, FileText, 
  Layers, Tags, Briefcase, Trash2, Edit3, Plus, Save, Undo, Eye, 
  Check, X, RefreshCw, Smartphone, LogOut, MessageSquare, ListCollapse,
  Type, Bold, Italic, Underline, Palette as PaletteIcon
} from "lucide-react";
import { 
  Slide, HeroSection, Testimonial, ServiceDetail, AboutSection, 
  WorkflowStep, SkillItem, Category, ProjectPost, ContactSubmission, SystemStats 
} from "../types";

interface AdminProps {
  db: {
    slides: Slide[];
    hero: HeroSection;
    testimonials: Testimonial[];
    services: ServiceDetail[];
    about: AboutSection;
    workflow: WorkflowStep[];
    skills: SkillItem[];
    categories: Category[];
    posts: ProjectPost[];
    contacts: ContactSubmission[];
  };
  onRefreshDb: () => void;
  onLogout: () => void;
}

export default function Admin({ db, onRefreshDb, onLogout }: AdminProps) {
  // Token authentication gating locally
  const [token, setToken] = useState<string | null>(localStorage.getItem("webro_admin_auth_token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active sub-section tab inside the Admin board
  const [activeAdminTab, setActiveAdminTab] = useState<"dashboard" | "slides" | "hero" | "about" | "services" | "categories" | "posts" | "contacts">("dashboard");
  
  // Dashboard overall telemetrics
  const [stats, setStats] = useState<SystemStats & { activePostsCount: number; draftPostsCount: number; contactsCount: number } | null>(null);
  const [isStatsRefreshing, setIsStatsRefreshing] = useState(false);

  // Toast notifications indicators
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // DELETION CONFIRMATION DIALOG MODEL
  const [deleteTarget, setDeleteTarget] = useState<{ type: "post" | "category" | "testimonial"; id: string; name: string } | null>(null);

  // RICH TEXT EDITOR IN-FORM STATE
  const [richTextSize, setRichTextSize] = useState<string>("16px");
  const [richTextColor, setRichTextColor] = useState<string>("#334155");

  // FORM EDITING STATES
  // 1. Hero Settings Form
  const [heroForm, setHeroForm] = useState<HeroSection>({ ...db.hero });
  // 2. Slide list settings
  const [slidesForm, setSlidesForm] = useState<Slide[]>([ ...db.slides ]);
  // 3. Testimonials configuration state
  const [testimonialsForm, setTestimonialsForm] = useState<Testimonial[]>([ ...db.testimonials ]);
  // 4. About wiki forms
  const [aboutForm, setAboutForm] = useState<AboutSection>({ ...db.about });
  const [workflowForm, setWorkflowForm] = useState<WorkflowStep[]>([ ...db.workflow ]);
  const [skillsForm, setSkillsForm] = useState<SkillItem[]>([ ...db.skills ]);
  // 5. Service elements specification
  const [servicesForm, setServicesForm] = useState<ServiceDetail[]>([ ...db.services ]);
  // 6. Category taxonomy controls
  const [categoryInputName, setCategoryInputName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  // 7. Comprehensive Post CRUD models state
  const [isPostEditing, setIsPostEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<ProjectPost>>({});

  // Trigger brief alert notifications
  const triggerToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage(text);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Fetch telemetry coordinates
  const fetchTelemetry = async () => {
    setIsStatsRefreshing(true);
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.warn("Telemetry stats failure", e);
    } finally {
      setIsStatsRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTelemetry();
    }
  }, [token, db]);

  // Sync forms whenever parent db structure reloads
  useEffect(() => {
    setHeroForm({ ...db.hero });
    setSlidesForm([ ...db.slides ]);
    setTestimonialsForm([ ...db.testimonials ]);
    setAboutForm({ ...db.about });
    setWorkflowForm([ ...db.workflow ]);
    setSkillsForm([ ...db.skills ]);
    setServicesForm([ ...db.services ]);
  }, [db]);

  // Log in procedures
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      return setAuthError("Email username and password represent mandatory inputs.");
    }
    setAuthError("");
    setIsLoggingIn(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem("webro_admin_auth_token", data.token);
        setToken(data.token);
        triggerToast("Authentication check passed successfully!");
        onRefreshDb();
      } else {
        setAuthError(data.message || "Invalid Admin username/password.");
      }
    } catch (err) {
      setAuthError("Failed connection relay to credentials portal.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Log out operations
  const handleLogoutAction = () => {
    localStorage.removeItem("webro_admin_auth_token");
    setToken(null);
    onLogout();
  };

  // Save Hero Config changes
  const saveHeroSettings = async () => {
    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroForm)
      });
      if (res.ok) {
        triggerToast("Updated Hero Banner section settings!");
        onRefreshDb();
      } else {
        triggerToast("Failed validating parameters.", "error");
      }
    } catch (e) {
      triggerToast("Network link failed.", "error");
    }
  };

  // Update Onboarding Slides
  const saveSlidesSettings = async () => {
    try {
      const res = await fetch("/api/slides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slidesForm)
      });
      if (res.ok) {
        triggerToast("Saved Onboarding Intro Slider layout!");
        onRefreshDb();
      }
    } catch (e) {
      triggerToast("Update Slider failure.", "error");
    }
  };

  // Save Testimonials
  const saveTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonialsForm)
      });
      if (res.ok) {
        triggerToast("Customer reviews synced successfully.");
        onRefreshDb();
      }
    } catch (e) {
      triggerToast("Failed synchronizing reviews.", "error");
    }
  };

  // Save About page wiki
  const saveAboutSettings = async () => {
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          about: aboutForm,
          workflow: workflowForm,
          skills: skillsForm
        })
      });
      if (res.ok) {
        triggerToast("Company profile wiki pages and skills saved.");
        onRefreshDb();
      }
    } catch (e) {
      triggerToast("Network update failed.", "error");
    }
  };

  // Save Specific Service feature
  const saveServicesSettings = async () => {
    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(servicesForm)
      });
      if (res.ok) {
        triggerToast("Service features list updated successfully.");
        onRefreshDb();
      }
    } catch (e) {
      triggerToast("Database failure.", "error");
    }
  };

  // Create Category taxonomy
  const addCategoryTaxonomy = async () => {
    if (!categoryInputName.trim()) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryInputName })
      });
      if (res.ok) {
        setCategoryInputName("");
        triggerToast("New project category created!");
        onRefreshDb();
      }
    } catch (e) {
      triggerToast("Network creation failure.", "error");
    }
  };

  // Edit Category Taxonomy
  const updateCategoryTaxonomy = async (catId: string) => {
    if (!editingCategoryName.trim()) return;
    try {
      const res = await fetch(`/api/categories/${catId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingCategoryName })
      });
      if (res.ok) {
        setEditingCategoryId(null);
        triggerToast("Category title modified!");
        onRefreshDb();
      }
    } catch (e) {
      triggerToast("Failed renaming category.", "error");
    }
  };

  // Confirm delete triggers for safety
  const executeConfirmedDeletion = async () => {
    if (!deleteTarget) return;
    try {
      let path = "";
      if (deleteTarget.type === "post") {
        path = `/api/posts/${deleteTarget.id}`;
      } else if (deleteTarget.type === "category") {
        path = `/api/categories/${deleteTarget.id}`;
      }

      const res = await fetch(path, { method: "DELETE" });
      if (res.ok) {
        triggerToast(`Successfully deleted ${deleteTarget.type} item!`);
        setDeleteTarget(null);
        onRefreshDb();
      } else {
        triggerToast("Failed execution.", "error");
      }
    } catch (e) {
      triggerToast("Failure during deletion.", "error");
    }
  };

  // Post forms handlers
  const handleAddNewPostTrigger = () => {
    // Scaffold empty form for new post
    setEditingPost({
      title: "",
      categoryId: db.categories[0]?.id || "",
      videoUrl: "",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      thumbnailUrl: "",
      websiteUrl: "",
      description: "<h2>Project Case Overview</h2><p>Describe specs here...</p>",
      status: "publish"
    });
    setIsPostEditing(true);
  };

  const handleEditPostTrigger = (post: ProjectPost) => {
    setEditingPost({ ...post });
    setIsPostEditing(true);
  };

  // Save Project Post (Add / Edit merger)
  const savePostForm = async () => {
    if (!editingPost.title?.trim()) {
      return triggerToast("Project title represents a mandatory field", "error");
    }
    const isNew = !editingPost.id;
    try {
      const url = isNew ? "/api/posts" : `/api/posts/${editingPost.id}`;
      const method = isNew ? "POST" : "PUT";

      // fallback thumbnails if empty
      const payload = {
        ...editingPost,
        thumbnailUrl: editingPost.thumbnailUrl || editingPost.imageUrl
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        triggerToast(`Project Case ${isNew ? "Created" : "Updated"} successfully!`);
        setIsPostEditing(false);
        setEditingPost({});
        onRefreshDb();
      } else {
        triggerToast("Could not register post.", "error");
      }
    } catch (e) {
      triggerToast("Database transmission error.", "error");
    }
  };

  // RICH TEXT QUICK TOOLBAR SHORTCUT ENGINES
  const applyRichFormat = (command: string, value: string = "") => {
    const textEditor = document.getElementById("post-rich-editor") as HTMLTextAreaElement;
    if (!textEditor) return;

    const start = textEditor.selectionStart;
    const end = textEditor.selectionEnd;
    const originalText = textEditor.value;
    const selectedText = originalText.substring(start, end);

    if (!selectedText) {
      triggerToast("Please first highlight / select text inside the brief box to apply format.", "error");
      return;
    }

    let modifiedText = "";
    if (command === "bold") {
      modifiedText = `<strong>${selectedText}</strong>`;
    } else if (command === "italic") {
      modifiedText = `<em>${selectedText}</em>`;
    } else if (command === "underline") {
      modifiedText = `<u>${selectedText}</u>`;
    } else if (command === "fontSize") {
      modifiedText = `<span style="font-size: ${value}">${selectedText}</span>`;
    } else if (command === "color") {
      modifiedText = `<span style="color: ${value}">${selectedText}</span>`;
    }

    const nextContent = originalText.substring(0, start) + modifiedText + originalText.substring(end);
    setEditingPost(prev => ({ ...prev, description: nextContent }));
    
    // Reset focus
    setTimeout(() => {
      textEditor.focus();
      textEditor.setSelectionRange(start, start + modifiedText.length);
    }, 100);
  };

  // --- RENDER 1: LOGIN GATE ---
  if (!token) {
    return (
      <div id="admin-login-wrapper" className="min-h-[750px] flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
          {/* Subtle Orange glowing background */}
          <div className="absolute top-[-40%] left-[-20%] w-64 h-64 bg-brand-orange-500/5 rounded-full blur-3xl" />
          
          <div className="text-center space-y-2 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-orange-500 to-brand-sky-500 flex items-center justify-center shadow-lg shadow-brand-orange-500/20 mx-auto transform rotate-3">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-display font-black text-2xl text-slate-800">Admin Console Gateway</h1>
            <p className="text-xs text-slate-500">Provide credentials to modify Webro dynamic catalogs.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs text-center font-medium">
                {authError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-slate-400">Username Code</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 outline-none rounded-2xl text-xs sm:text-sm text-slate-800 focus:border-brand-orange-500 placeholder-slate-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-slate-400">Security Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Provide password"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 outline-none rounded-2xl text-xs sm:text-sm text-slate-800 focus:border-brand-orange-500 placeholder-slate-400"
              />
              <div className="text-[9px] font-mono text-slate-400 text-right pt-0.5">Password hint: sureshwebro</div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-gradient-to-r from-brand-orange-500 to-amber-500 hover:from-brand-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold rounded-2xl text-xs shadow-lg shadow-brand-orange-500/20 active:scale-95 transition-all cursor-pointer flex justify-center items-center"
            >
              {isLoggingIn ? "Authing Gateway Coordinates..." : "Unlock Console Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER 2: CORE DASHBOARD PANEL ---
  return (
    <div id="admin-dashboard-container" className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto items-start pt-4">
      
      {/* Dynamic Toast Notifications */}
      {toastMessage && (
        <div className={`fixed top-8 right-8 z-55 px-5 py-3.5 rounded-2xl text-xs font-semibold text-white shadow-2xl flex items-center space-x-2 animate-bounce ${
          toastType === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          <Check className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2A. LEFT SIDEBAR MENU PANEL */}
      <aside className="col-span-1 md:col-span-3 bg-white border border-slate-100 p-4 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center space-x-2 px-2 border-b border-slate-50 pb-4">
          <div className="w-8 h-8 rounded-lg bg-brand-sky-500 text-white flex items-center justify-center font-display font-black">W</div>
          <div className="flex flex-col">
            <span className="text-xs font-mono tracking-widest uppercase font-black text-slate-800">Admin Control</span>
            <span className="text-[9px] font-semibold text-emerald-600">Secure Live Context</span>
          </div>
        </div>

        <nav className="space-y-1.5" id="admin-sidebar-navigation">
          {[
            { id: "dashboard", label: "Overview Status", icon: LayoutDashboard },
            { id: "slides", label: "Intro Slides", icon: Sliders },
            { id: "hero", label: "Hero & Reviews", icon: HomeIcon },
            { id: "about", label: "Company Profile", icon: FileText },
            { id: "services", label: "Service Settings", icon: Layers },
            { id: "categories", label: "Taxonomy Tags", icon: Tags },
            { id: "posts", label: "Portfolio Items", icon: Briefcase },
            { id: "contacts", label: "Inbound briefs", icon: MessageSquare }
          ].map((itm) => {
            const Icon = itm.icon;
            const isMenuSel = activeAdminTab === itm.id;
            return (
              <button
                key={itm.id}
                id={`admin-nav-${itm.id}`}
                onClick={() => {
                  setActiveAdminTab(itm.id as any);
                  setIsPostEditing(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isMenuSel 
                    ? "bg-brand-orange-500 text-white shadow-md shadow-brand-orange-500/15" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{itm.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-50 px-2 flex justify-between items-center">
          <button
            onClick={() => {
              const details = document.getElementById("projects-page-root") ?? document.getElementById("home-page-root");
              details?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer flex items-center space-x-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Site</span>
          </button>
          
          <button
            onClick={handleLogoutAction}
            className="text-[10px] font-mono font-bold text-red-500 hover:text-red-700 cursor-pointer flex items-center space-x-1 border border-red-100 hover:border-red-400 px-2 py-1 rounded-xl bg-red-50/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2B. RIGHT DETAILED VIEWPORT */}
      <main className="col-span-1 md:col-span-9 bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm min-h-[550px]">
        {/* OVERWRITE / MERGER WITH POST CRUD WRITING BLOCK */}
        {activeAdminTab === "posts" && isPostEditing ? (
          <div className="space-y-6" id="post-crud-form-chassis">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display font-medium text-xl text-slate-800">
                  {editingPost.id ? "Edit Portfolio Case Brief" : "Create Modern Project Entry"}
                </h2>
                <p className="text-slate-400 text-xs">Maintain your responsive database. Fill in parameters below.</p>
              </div>
              <button
                onClick={() => setIsPostEditing(false)}
                className="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-xs text-slate-600 cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Post Title */}
              <div className="space-y-1.5 col-span-1 sm:col-span-2">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500">Case Study Title *</label>
                <input
                  type="text"
                  value={editingPost.title || ""}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. AI Optimization Drive for CloudNova Solutions"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-sm text-slate-800 outline-none focus:border-brand-orange-500"
                />
              </div>

              {/* Category dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500">Category Taxonomy Selection *</label>
                <select
                  value={editingPost.categoryId || ""}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-sm text-slate-800 outline-none focus:border-brand-orange-500"
                >
                  {db.categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Status toggle */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500">Publication Status *</label>
                <select
                  value={editingPost.status || "publish"}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-sm text-slate-800 outline-none focus:border-brand-orange-500"
                >
                  <option value="publish">Publish (Visible live immediately)</option>
                  <option value="draft">Draft (Private to Admin dashboard)</option>
                </select>
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500">Image Cover URL</label>
                <input
                  type="text"
                  value={editingPost.imageUrl || ""}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="e.g. https://images.unsplash.com/..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-sm text-slate-800 outline-none focus:border-brand-orange-500"
                />
              </div>

              {/* Video URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500">Optional Video Walkover URL</label>
                <input
                  type="text"
                  value={editingPost.videoUrl || ""}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="YouTube, Vimeo, or MP4 URL link"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-sm text-slate-800 outline-none focus:border-brand-orange-500"
                />
              </div>

              {/* Website Visit URL */}
              <div className="space-y-1.5 col-span-1 sm:col-span-2">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500">Live Website / Demo Visit URL</label>
                <input
                  type="text"
                  value={editingPost.websiteUrl || ""}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, websiteUrl: e.target.value }))}
                  placeholder="e.g. https://demo.cloudenova.my"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-sm text-slate-800 outline-none focus:border-brand-orange-500"
                />
              </div>

              {/* CUSTOM RICH TEXT DESCRIPTION EDITOR */}
              <div className="space-y-1.5 col-span-1 sm:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500">Rich Description Content brief *</label>
                  <span className="text-[9px] font-sans text-slate-400 font-semibold">Highlight text to apply styles</span>
                </div>
                
                {/* TOOLBAR HEADERS */}
                <div className="bg-slate-50 border border-b-0 border-slate-100 rounded-t-2xl p-2 flex items-center gap-1 flex-wrap">
                  {/* Bold trigger */}
                  <button
                    type="button"
                    onClick={() => applyRichFormat("bold")}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                    title="Bold Toggle selection"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>

                  {/* Italic */}
                  <button
                    type="button"
                    onClick={() => applyRichFormat("italic")}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                    title="Italic Toggle selection"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>

                  {/* Underline */}
                  <button
                    type="button"
                    onClick={() => applyRichFormat("underline")}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                    title="Underline selection"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-[1px] h-4 bg-slate-200 mx-1" />

                  {/* Font Size select shortcut */}
                  <div className="flex items-center space-x-1">
                    <Type className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={richTextSize}
                      onChange={(e) => {
                        setRichTextSize(e.target.value);
                        applyRichFormat("fontSize", e.target.value);
                      }}
                      className="text-[10px] bg-white border border-slate-200 rounded p-0.5 w-18 text-slate-700"
                    >
                      <option value="12px">XS (12px)</option>
                      <option value="14px">Small (14px)</option>
                      <option value="16px">Normal (16px)</option>
                      <option value="20px">Medium (20px)</option>
                      <option value="24px">Big Title (24px)</option>
                    </select>
                  </div>

                  {/* Font Color pick selector */}
                  <div className="flex items-center space-x-1 ml-1">
                    <PaletteIcon className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={richTextColor}
                      onChange={(e) => {
                        setRichTextColor(e.target.value);
                        applyRichFormat("color", e.target.value);
                      }}
                      className="text-[10px] bg-white border border-slate-200 rounded p-0.5 w-20 text-slate-700"
                    >
                      <option value="#334155">Dark grey</option>
                      <option value="#f97316">Orange</option>
                      <option value="#0ea5e9">Sky Blue</option>
                      <option value="#10b981">Green Success</option>
                      <option value="#ef4444">Alert Red</option>
                    </select>
                  </div>
                </div>

                {/* Text Area */}
                <textarea
                  id="post-rich-editor"
                  value={editingPost.description || ""}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, description: e.target.value }))}
                  rows={8}
                  placeholder="Write client brief deliverables in standard HTML or copy/paste rich snippets..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-b-2xl font-mono text-[11px] text-slate-800 outline-none focus:border-brand-orange-500 resize-none leading-relaxed"
                />
              </div>

              {/* Real-time HTML visual view container pane */}
              <div className="col-span-1 sm:col-span-2 space-y-2">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-400">Live Visual Content output markup preview</label>
                <div 
                  className="p-5 border border-slate-100 rounded-2xl bg-white max-h-52 overflow-y-auto prose prose-slate prose-xs"
                  dangerouslySetInnerHTML={{ __html: editingPost.description || "<p className='text-slate-400 italic text-xs'>Write some text layout to see output render</p>" }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsPostEditing(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Back To List
              </button>
              <button
                type="button"
                onClick={savePostForm}
                className="px-6 py-2 bg-gradient-to-tr from-brand-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold hover:from-brand-orange-600 cursor-pointer"
              >
                Save Project Post
              </button>
            </div>
          </div>
        ) : (
          /* OTHERWISE RENDER THE ACTIVE SUB-TABS VIEWS */
          <div>
            {/* TABS VIEW 1: GENERAL STATS DASHBOARD */}
            {activeAdminTab === "dashboard" && (
              <div className="space-y-8" id="admin-subtab-dashboard">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div>
                    <h2 className="font-display font-medium text-xl text-slate-800">Dynamic Performance Telemetry</h2>
                    <p className="text-slate-400 text-xs">Overview analytical statistics representing database files index.</p>
                  </div>
                  <button
                    onClick={fetchTelemetry}
                    disabled={isStatsRefreshing}
                    className="p-2 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
                    title="Refresh Stats"
                  >
                    <RefreshCw className={`w-4 h-4 text-slate-500 ${isStatsRefreshing ? "animate-spin" : ""}`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
                    <div className="text-[10px] font-mono text-brand-orange-700 uppercase font-bold">Total Showcase posts</div>
                    <div className="text-3xl font-black font-display text-brand-orange-500 mt-2">{stats?.totalPosts ?? db.posts.length}</div>
                    <div className="text-[9px] text-slate-400 mt-1">
                      {stats?.activePostsCount ?? db.posts.filter(p=>p.status==='publish').length} Live | {stats?.draftPostsCount ?? db.posts.filter(p=>p.status==='draft').length} Drafts
                    </div>
                  </div>

                  <div className="p-5 bg-sky-50/50 rounded-2xl border border-sky-100">
                    <div className="text-[10px] font-mono text-brand-sky-700 uppercase font-bold">Taxonomy Tags</div>
                    <div className="text-3xl font-black font-display text-brand-sky-500 mt-2">{stats?.categoriesCount ?? db.categories.length}</div>
                    <div className="text-[9px] text-slate-400 mt-1">Unique taxonomy sorting lists</div>
                  </div>

                  <div className="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-100">
                    <div className="text-[10px] font-mono text-emerald-800 uppercase font-bold">Incoming client messages</div>
                    <div className="text-3xl font-black font-display text-emerald-600 mt-2">{stats?.contactsCount ?? db.contacts.length}</div>
                    <div className="text-[9px] text-slate-400 mt-1">Dispatched to info@webro.my</div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 col-span-1">
                    <div className="text-[10px] font-mono text-slate-600 uppercase font-bold">Platform State</div>
                    <div className="text-xs font-bold text-emerald-600 mt-4 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      <span>Online Relay</span>
                    </div>
                    <div className="text-[9px] text-slate-450 mt-1">Node Express Full-stack context</div>
                  </div>
                </div>

                {/* System activities rows */}
                <div className="space-y-3">
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Recent Activities Log</div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 max-h-56 overflow-y-auto space-y-2 font-mono text-[10px] sm:text-xs">
                    {(stats?.recentActivities ?? (db as any)?.activities ?? []).map((act, index) => (
                      <div key={index} className="text-slate-600 flex items-start space-x-1.5 py-1 border-b border-white">
                        <span className="text-brand-orange-500">&gt;</span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TABS VIEW 2: INTRO ONBOARDING SLIDES EDIT */}
            {activeAdminTab === "slides" && (
              <div className="space-y-6" id="admin-subtab-slides">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div>
                    <h2 className="font-display font-medium text-xl text-slate-800">Onboarding Introduction Slides</h2>
                    <p className="text-slate-400 text-xs text-xs">Configure headers, texts, and sequential order for step sliders.</p>
                  </div>
                  <button
                    onClick={saveSlidesSettings}
                    className="px-4 py-2 bg-brand-orange-500 hover:bg-brand-orange-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Layout changes</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {slidesForm.map((sld, idx) => (
                    <div key={sld.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50 space-y-4">
                      <div className="flex justify-between text-xs font-mono font-bold text-slate-700">
                        <span>Slide 0{idx + 1} System Index ({sld.id})</span>
                        <span className="text-brand-orange-500">Order placement: {sld.order}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-5 space-y-1">
                          <label className="text-[10px] text-slate-440 uppercase font-bold">Slide Headline</label>
                          <input
                            type="text"
                            value={sld.title}
                            onChange={(e) => {
                              const updated = [...slidesForm];
                              updated[idx].title = e.target.value;
                              setSlidesForm(updated);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-7 space-y-1">
                          <label className="text-[10px] text-slate-440 uppercase font-bold">Slide content summary</label>
                          <input
                            type="text"
                            value={sld.description}
                            onChange={(e) => {
                              const updated = [...slidesForm];
                              updated[idx].description = e.target.value;
                              setSlidesForm(updated);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TABS VIEW 3: HOME HERO AND TESTIMONIAL CAROUSEL MANAGEMENT */}
            {activeAdminTab === "hero" && (
              <div className="space-y-8" id="admin-subtab-hero">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div>
                    <h2 className="font-display font-medium text-xl text-slate-800">Hero Section Content</h2>
                    <p className="text-slate-400 text-xs">Configure the homepage landing billboard parameters.</p>
                  </div>
                  <button
                    onClick={saveHeroSettings}
                    className="px-4 py-2 bg-brand-orange-500 hover:bg-brand-orange-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Apply Hero settings</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-1 sm:col-span-2">
                    <label className="text-[10px] uppercase font-mono font-bold text-slate-500">Main Headline</label>
                    <input
                      type="text"
                      value={heroForm.title || ""}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1 sm:col-span-2">
                    <label className="text-[10px] uppercase font-mono font-bold text-slate-500">Body Subtitle</label>
                    <textarea
                      value={heroForm.subtitle || ""}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs sm:text-sm resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold text-slate-500">CTA Button Text</label>
                    <input
                      type="text"
                      value={heroForm.ctaText || ""}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, ctaText: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold text-slate-500">Cover BG Backdrop image URL</label>
                    <input
                      type="text"
                      value={heroForm.imageUrl || ""}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-display font-medium text-lg text-slate-800">Edit Customer Feedback review carousel</h3>
                      <p className="text-slate-400 text-xs">Manage ratings and quotes shown dynamically.</p>
                    </div>
                    <button
                      onClick={saveTestimonials}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Sync Testimony updates</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {testimonialsForm.map((test, idx) => (
                      <div key={test.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-500">Customer Name</label>
                            <input
                              type="text"
                              value={test.name}
                              onChange={(e) => {
                                const copy = [...testimonialsForm];
                                copy[idx].name = e.target.value;
                                setTestimonialsForm(copy);
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-500">Role / Designation</label>
                            <input
                              type="text"
                              value={test.role}
                              onChange={(e) => {
                                const copy = [...testimonialsForm];
                                copy[idx].role = e.target.value;
                                setTestimonialsForm(copy);
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-500">Rating Stars (1 - 5)</label>
                            <input
                              type="number"
                              min={1}
                              max={5}
                              value={test.rating}
                              onChange={(e) => {
                                const copy = [...testimonialsForm];
                                copy[idx].rating = parseInt(e.target.value) || 5;
                                setTestimonialsForm(copy);
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-slate-500">Client Message summary</label>
                          <input
                            type="text"
                            value={test.message}
                            onChange={(e) => {
                              const copy = [...testimonialsForm];
                              copy[idx].message = e.target.value;
                              setTestimonialsForm(copy);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TABS VIEW 4: ABOUT PAGE COMPREHENSIVE MANAGER */}
            {activeAdminTab === "about" && (
              <div className="space-y-6" id="admin-subtab-about">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div>
                    <h2 className="font-display font-medium text-xl text-slate-800">Company History & Values</h2>
                    <p className="text-slate-400 text-xs">Configure company descriptions, procedure workflows, and skill scales.</p>
                  </div>
                  <button
                    onClick={saveAboutSettings}
                    className="px-4 py-2 bg-brand-orange-500 hover:bg-brand-orange-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Corporate profile</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-slate-500">History Headline Title</label>
                      <input
                        type="text"
                        value={aboutForm.historyTitle || ""}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, historyTitle: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs sm:text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-slate-500">History Text brief paragraph</label>
                      <textarea
                        value={aboutForm.companyHistory || ""}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, companyHistory: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs sm:text-sm resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase font-bold text-slate-500">Our Vision statement</label>
                        <textarea
                          value={aboutForm.vision || ""}
                          onChange={(e) => setAboutForm(prev => ({ ...prev, vision: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase font-bold text-slate-500">Our Mission statement</label>
                        <textarea
                          value={aboutForm.mission || ""}
                          onChange={(e) => setAboutForm(prev => ({ ...prev, mission: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Procedure working timeline items */}
                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    <h3 className="font-display font-medium text-base text-slate-800">Edit Project Procedural workflow Steps</h3>
                    <div className="space-y-3">
                      {workflowForm.map((work, idx) => (
                        <div key={work.id} className="p-4 border border-slate-100 bg-slate-50 rounded-2xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <span className="col-span-1 text-slate-400 font-bold font-mono">0{work.stepNumber}</span>
                          <div className="col-span-4 space-y-1">
                            <label className="text-[8px] uppercase font-bold text-slate-500">Step Name</label>
                            <input
                              type="text"
                              value={work.title}
                              onChange={(e) => {
                                const c = [...workflowForm];
                                c[idx].title = e.target.value;
                                setWorkflowForm(c);
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-120 rounded-lg text-xs"
                            />
                          </div>
                          <div className="col-span-7 space-y-1">
                            <label className="text-[8px] uppercase font-bold text-slate-500">Detailed Action Descriptions</label>
                            <input
                              type="text"
                              value={work.description}
                              onChange={(e) => {
                                const c = [...workflowForm];
                                c[idx].description = e.target.value;
                                setWorkflowForm(c);
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-120 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills indicators configuration */}
                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    <h3 className="font-display font-medium text-base text-slate-800">Skills percentage configurations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {skillsForm.map((sk, idx) => (
                        <div key={sk.id} className="p-3 border border-slate-100 rounded-2xl bg-slate-50 flex items-center justify-between space-x-3 text-xs">
                          <span className="font-bold text-slate-700 w-1/2">{sk.name}</span>
                          <div className="w-1/2 flex items-center space-x-2">
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={sk.percentage}
                              onChange={(e) => {
                                const c = [...skillsForm];
                                c[idx].percentage = parseInt(e.target.value) || 0;
                                setSkillsForm(c);
                              }}
                              className="w-3/4 bg-brand-orange-500 rounded"
                            />
                            <span className="font-mono font-bold text-brand-orange-500">{sk.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TABS VIEW 5: SERVICE PAGE DETAILED FEATURES EDIT */}
            {activeAdminTab === "services" && (
              <div className="space-y-6" id="admin-subtab-services">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div>
                    <h2 className="font-display font-medium text-xl text-slate-800">Custom Services Features Settings</h2>
                    <p className="text-slate-400 text-xs">Modify summaries, checklists and key deliverables.</p>
                  </div>
                  <button
                    onClick={saveServicesSettings}
                    className="px-4 py-2 bg-brand-orange-500 hover:bg-brand-orange-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save all Services</span>
                  </button>
                </div>

                <div className="space-y-8">
                  {servicesForm.map((svc, idx) => (
                    <div key={svc.id} className="p-5 border border-slate-100 rounded-2.5xl bg-slate-50 space-y-4">
                      <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-brand-orange-600">
                        <span>Capabilities: {svc.title}</span>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500">Service Core Overview descriptions</label>
                        <textarea
                          value={svc.description}
                          onChange={(e) => {
                            const copy = [...servicesForm];
                            copy[idx].description = e.target.value;
                            setServicesForm(copy);
                          }}
                          rows={2}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500">Key Features Checklist highlights (4 items)</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {svc.features.map((feat, fIdx) => (
                            <input
                              key={fIdx}
                              type="text"
                              value={feat}
                              onChange={(e) => {
                                const copy = [...servicesForm];
                                copy[idx].features[fIdx] = e.target.value;
                                setServicesForm(copy);
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TABS VIEW 6: CATEGORY TAXONOMY CRUD */}
            {activeAdminTab === "categories" && (
              <div className="space-y-6" id="admin-subtab-categories">
                <div className="border-b border-slate-50 pb-4">
                  <h2 className="font-display font-medium text-xl text-slate-800">Dynamic Taxonomy Tags (Categories)</h2>
                  <p className="text-slate-400 text-xs">Categories are dynamically loaded inside project selector fields.</p>
                </div>

                {/* Add new category form bar */}
                <div className="p-4 border border-slate-50 rounded-2xl bg-slate-50 flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={categoryInputName}
                    onChange={(e) => setCategoryInputName(e.target.value)}
                    placeholder="Enter category name... e.g. iOS Development"
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    onClick={addCategoryTaxonomy}
                    className="w-full sm:w-auto px-5 py-2.5 bg-brand-orange-500 text-white rounded-xl text-xs font-bold hover:bg-brand-orange-600 cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Category</span>
                  </button>
                </div>

                {/* Category listed tags review */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                        <th className="p-4 font-semibold">Tag Name</th>
                        <th className="p-4 font-semibold">Slug Identifier</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {db.categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-bold text-slate-800">
                            {editingCategoryId === cat.id ? (
                              <input
                                type="text"
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                className="px-2 py-1 border border-slate-300 rounded focus:border-brand-orange-500 focus:outline-none"
                              />
                            ) : (
                              <span>{cat.name}</span>
                            )}
                          </td>
                          <td className="p-4 font-mono text-slate-500 font-medium">/{cat.slug}</td>
                          <td className="p-4 text-right flex items-center justify-end space-x-2">
                            {editingCategoryId === cat.id ? (
                              <>
                                <button
                                  onClick={() => updateCategoryTaxonomy(cat.id)}
                                  className="p-1 px-2.5 bg-emerald-500 text-white rounded font-bold text-[10px] hover:bg-emerald-600 transition-colors cursor-pointer"
                                  title="Submit title update"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingCategoryId(null)}
                                  className="p-1 px-2 border border-slate-300 rounded text-slate-500 text-[10px] hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingCategoryId(cat.id);
                                    setEditingCategoryName(cat.name);
                                  }}
                                  className="p-1.5 border border-slate-200 hover:border-brand-sky-300 rounded text-slate-600 hover:text-brand-sky-600 cursor-pointer"
                                  title="Rename Category"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget({ type: "category", id: cat.id, name: cat.name })}
                                  className="p-1.5 border border-slate-200 hover:border-red-300 rounded text-slate-600 hover:text-red-500 cursor-pointer"
                                  title="Trash Category"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABS VIEW 7: PROJECTS PORTFOLIO CRUD MANAGER */}
            {activeAdminTab === "posts" && (
              <div className="space-y-6" id="admin-subtab-posts">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div>
                    <h2 className="font-display font-medium text-xl text-slate-800">Dynamic Case Stories Database</h2>
                    <p className="text-slate-400 text-xs">Create, edit and manage specific portfolio briefs rendering live.</p>
                  </div>
                  <button
                    onClick={handleAddNewPostTrigger}
                    id="btn-admin-add-post"
                    className="px-5 py-2.5 bg-brand-orange-500 hover:bg-brand-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-orange-500/25 flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Post Case</span>
                  </button>
                </div>

                {/* Grid layout cards representing projects for editing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {db.posts.map((post) => (
                    <div key={post.id} className="p-4 border border-slate-100 rounded-3xl bg-slate-50 hover:bg-white flex gap-4 hover:shadow-md transition-all relative group">
                      <img
                        src={post.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=120&q=80"}
                        alt={post.title}
                        className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 space-y-2 flex flex-col justify-between">
                        <div className="space-y-0.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-mono font-bold tracking-widest text-brand-sky-600 uppercase">
                              {db.categories.find(c => c.id === post.categoryId)?.name || "Interactive Branding"}
                            </span>
                            <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                              post.status === 'publish' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-200 text-slate-500'
                            }`}>
                              {post.status}
                            </span>
                          </div>
                          <h4 className="font-display font-bold text-slate-800 text-xs sm:text-sm leading-tight line-clamp-1">{post.title}</h4>
                          <span className="text-[9px] font-mono text-slate-400 font-medium">Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 justify-end">
                          <button
                            onClick={() => handleEditPostTrigger(post)}
                            className="p-1 px-2 border border-slate-250 hover:bg-slate-200 rounded text-slate-700 text-[10px] font-semibold cursor-pointer"
                            title="Edit Parameters"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: "post", id: post.id, name: post.title })}
                            className="p-1.5 border border-red-100 hover:border-red-300 rounded text-red-500 cursor-pointer"
                            title="Delete case Study"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TABS VIEW 8: CONTACT SUBMISSIONS LIST VIEW */}
            {activeAdminTab === "contacts" && (
              <div className="space-y-6" id="admin-subtab-contacts">
                <div className="border-b border-slate-50 pb-4">
                  <h2 className="font-display font-medium text-xl text-slate-800">Incoming Client Inquiry logs</h2>
                  <p className="text-slate-400 text-xs">These briefs represent live items. Each was copied and triggered a simulated SMTP email to info@webro.my.</p>
                </div>

                <div className="space-y-4">
                  {db.contacts.length > 0 ? (
                    db.contacts.map((msg) => (
                      <div key={msg.id} className="p-5 border border-slate-100 bg-slate-50 rounded-2.5xl space-y-3 relative group">
                        <div className="absolute top-4 right-4 text-[9px] font-mono text-slate-400 font-bold">
                          {new Date(msg.createdAt).toLocaleString()}
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-display font-bold text-slate-800 text-sm">
                            {msg.name} &middot; <span className="text-brand-orange-500 font-normal">{msg.email}</span>
                          </h4>
                          <p className="text-[10px] font-mono font-semibold text-slate-500">
                            WhatsApp Phone: <span className="text-slate-400">{msg.whatsapp}</span>
                          </p>
                        </div>

                        <p className="text-slate-600 text-xs sm:text-sm font-light bg-white border border-white p-3.5 rounded-xl leading-relaxed italic">
                          &ldquo;{msg.message}&rdquo;
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-16 text-center text-slate-400 text-xs font-light">
                      📭 No dynamic customer submissions recorded yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* CONFIRM DELETION MODAL DRAWER OVERLAY */}
      {deleteTarget && (
        <div id="delete-confirmation-modal" className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in-quick">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-6 shadow-2xl border border-slate-100 transform scale-98">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-md">
              <Trash2 className="w-6 h-6 text-red-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-slate-800">Confirm Deletion</h3>
              <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                Are you absolutely sure you want to permanently delete the {deleteTarget.type}: <strong className="text-slate-800">"{deleteTarget.name}"</strong>? This operation cannot be reversed inside the datastore.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedDeletion}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-lg shadow-red-500/10"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
