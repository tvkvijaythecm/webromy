import { Home, Info, Sparkles, FolderKanban, MessageSquare, ShieldCheck, RefreshCw } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onResetOnboarding: () => void;
  onExploreAdmin: () => void;
  isAdmin: boolean;
}

export default function Navbar({ activeTab, setActiveTab, onResetOnboarding, onExploreAdmin, isAdmin }: NavbarProps) {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About Us", icon: Info },
    { id: "service", label: "Services", icon: Sparkles },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "contact", label: "Get In Touch", icon: MessageSquare }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 h-16 px-6 flex items-center transition-all duration-300">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo Brand Brand */}
        <button
          onClick={() => { setActiveTab("home"); }}
          className="flex items-center space-x-2.5 bg-transparent text-left cursor-pointer group"
          id="desktop-logo-button"
        >
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl leading-none">W</span>
          </div>
          <span className="text-2xl font-bold tracking-tighter text-slate-900 font-display">
            WEBRO<span className="text-sky-500">.</span>
          </span>
        </button>

        {/* Center Desktop Menu Items */}
        <nav className="hidden md:flex items-center space-x-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id && !isAdmin;
            return (
              <button
                key={item.id}
                id={`desktop-menu-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop Controls (Admin Switcher and Slider Resetter) */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-100 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-orange-500' : 'bg-sky-500'} animate-pulse`}></div>
            <span className="text-[10px] font-bold text-sky-700 uppercase tracking-widest leading-none">
              {isAdmin ? "Admin Console" : "Agent Online"}
            </span>
          </div>

          <button
            onClick={onResetOnboarding}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer transition-all"
            title="Replay intro interactive slideshow"
            id="btn-replay-intro"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">Show Intro</span>
          </button>
        </div>
      </div>
    </header>
  );
}
