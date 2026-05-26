import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Lock } from "lucide-react";
import OnboardingSlider from "./components/OnboardingSlider";
import Navbar from "./components/Navbar";
import BottomNavBar from "./components/BottomNavBar";
import Home from "./pages/Home";
import About from "./pages/About";
import Service from "./pages/Service";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

export default function App() {
  // Global datastore loaded asynchronously from `/api/db`
  const [db, setDb] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Layout navigation states
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Fetch full state coordinates from Express backend
  const fetchStateData = useCallback(async () => {
    try {
      const response = await fetch("/api/db");
      if (!response.ok) {
        throw new Error("HTTP connection error while loading Webro settings");
      }
      const data = await response.json();
      setDb(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed loading system resources");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize and check user onboarding status
  useEffect(() => {
    fetchStateData();
    const completed = localStorage.getItem("webro_completed_onboarding");
    if (!completed) {
      setShowOnboarding(true);
    }
  }, [fetchStateData]);

  // Callback to signal final onboarding slide completion
  const handleOnboardingComplete = () => {
    localStorage.setItem("webro_completed_onboarding", "true");
    setShowOnboarding(false);
  };

  // Replay onboarding introduction slideshow
  const handleResetOnboarding = () => {
    setShowOnboarding(true);
    setIsAdmin(false);
    setActiveTab("home");
  };

  const handleOpenAdminConsole = () => {
    setIsAdmin(true);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setActiveTab("home");
  };

  // Render correct catalog views
  const renderActivePage = () => {
    if (isAdmin) {
      return (
        <Admin 
          db={db} 
          onRefreshDb={fetchStateData} 
          onLogout={handleAdminLogout} 
        />
      );
    }

    switch (activeTab) {
      case "home":
        return (
          <Home
            hero={db.hero}
            services={db.services}
            testimonials={db.testimonials}
            setActiveTab={setActiveTab}
          />
        );
      case "about":
        return (
          <About
            about={db.about}
            workflow={db.workflow}
            skills={db.skills}
          />
        );
      case "service":
        return (
          <Service
            services={db.services}
            setActiveTab={setActiveTab}
          />
        );
      case "projects":
        return (
          <Projects
            posts={db.posts}
            categories={db.categories}
          />
        );
      case "contact":
        return (
          <Contact />
        );
      default:
        return (
          <Home
            hero={db.hero}
            services={db.services}
            testimonials={db.testimonials}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  // Loader screen before database sync succeeds
  if (isLoading) {
    return (
      <div id="loader-screen-root" className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 text-white z-55">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-sky-500/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-orange-500/10 blur-[100px] animate-pulse-slow" />
        
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-orange-500 to-brand-sky-500 flex items-center justify-center shadow-2xl shadow-brand-orange-500/30 animate-spin-slow">
            <span className="font-display font-black text-2xl text-white">W</span>
          </div>
          <div className="text-center space-y-1">
            <h1 className="font-display font-black text-xl tracking-wide">Webro Digital Platform</h1>
            <p className="text-slate-400 text-xs font-mono tracking-widest uppercase flex items-center justify-center space-x-1">
              <Sparkles className="w-3 h-3 text-brand-orange-500 animate-pulse" />
              <span>Aligning System Assets...</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error screen in case of persistent loading issues code
  if (error) {
    return (
      <div id="error-screen-root" className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-200 z-55 p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md text-center space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto text-xl">⚠️</div>
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg text-white">Resource System Connection Interrupted</h2>
            <p className="text-slate-400 text-xs font-light leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => {
              setIsLoading(true);
              fetchStateData();
            }}
            className="w-full py-3 bg-brand-orange-500 hover:bg-brand-orange-600 text-white text-xs font-bold rounded-2xl cursor-pointer"
          >
            Retry Sync Parameters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-brand-orange-100 flex flex-col relative">
      
      {/* 1. APP ONBOARDING SLIDER INTRO (Triggered dynamically) */}
      {showOnboarding && db?.slides && (
        <OnboardingSlider 
          slides={db.slides} 
          onComplete={handleOnboardingComplete} 
        />
      )}

      {/* 2. TOP REGISTERED HEADER DESKTOP NAVBAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsAdmin(false);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        onResetOnboarding={handleResetOnboarding}
        onExploreAdmin={handleOpenAdminConsole}
        isAdmin={isAdmin}
      />

      {/* 3. DYNAMIC CONTENT CONTAINER ROUTER WITH ROUTE ENTRANCIES */}
      <main className="flex-1 py-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={isAdmin ? "admin" : activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. GLOBAL LAYOUT FOOTER WITH LOCK ICON FOR ADMIN GATEWAY */}
      {!isAdmin && (
        <footer className="pt-8 pb-32 border-t border-slate-200 text-center max-w-xl mx-auto space-y-3 px-6 z-10">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 flex-wrap">
            <span>&copy; 2026 Webro Digital Agency. Designed as a high-performance modern applet.</span>
            <button
              onClick={() => setIsAdmin(true)}
              id="admin-footer-lock-link"
              className="inline-flex items-center justify-center text-slate-400 hover:text-orange-500 hover:bg-slate-100 transition-all p-1 rounded-md cursor-pointer"
              title="Aesthetic Admin Control panel"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </p>
          <button
            onClick={() => {
              const details = document.getElementById("mobile-bottom-tabs");
              if (details) {
                details.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-[10px] font-mono text-orange-500 hover:underline cursor-pointer tracking-wider block mx-auto uppercase"
          >
            SCROLL TO BOTTOM NAVIGATION &middot; WEB SYSTEM ACTIVE
          </button>
        </footer>
      )}

      {/* 5. MOBILE / TABLET DOCKED BOTTOM NAVIGATION TABBAR */}
      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsAdmin(false);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        onExploreAdmin={handleOpenAdminConsole}
        isAdmin={isAdmin}
      />
    </div>
  );
}
