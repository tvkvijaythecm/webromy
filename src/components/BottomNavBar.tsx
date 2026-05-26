import { motion } from "motion/react";
import { Home, Info, Sparkles, FolderKanban, MessageSquare, ShieldAlert } from "lucide-react";

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExploreAdmin: () => void;
  isAdmin?: boolean;
}

export default function BottomNavBar({ activeTab, setActiveTab, onExploreAdmin, isAdmin }: BottomNavBarProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: Info },
    { id: "service", label: "Service", icon: Sparkles },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "contact", label: "Contact", icon: MessageSquare }
  ];

  return (
    <nav 
      id="mobile-bottom-tabs" 
      className="fixed bottom-5 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 md:max-w-md w-[calc(100%-2rem)] md:w-[420px] bg-white border border-slate-200 shadow-lg rounded-xl p-1.5 z-40 transition-all duration-300 md:bottom-6"
    >
      <div className="flex items-center justify-between w-full px-1 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && !isAdmin;

          return (
            <button
              key={item.id}
              id={`tab-btn-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center py-2 px-2.5 flex-1 relative rounded-lg transition-all group cursor-pointer"
              title={`Navigate to ${item.label}`}
            >
              <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
                <Icon 
                  className={`w-4 h-4 transition-transform duration-300 group-hover:scale-105 ${
                    isActive 
                      ? "text-orange-500" 
                      : "text-slate-400 hover:text-slate-700"
                  }`} 
                />
                <span 
                  className={`text-[9px] font-bold uppercase tracking-wider transition-color duration-300 ${
                    isActive 
                      ? "text-orange-500" 
                      : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-orange-50 border-t-2 border-orange-500 rounded-lg"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          );
        })}

        {/* Dynamic Admin Dashboard Option indicator link */}
        <button
          onClick={onExploreAdmin}
          id="tab-btn-admin"
          className="flex flex-col items-center justify-center py-2 px-2.5 rounded-lg cursor-pointer group hover:bg-slate-50 transition-all border border-transparent"
          title="Open Admin Gateway Panel"
        >
          <ShieldAlert 
            className={`w-4 h-4 ${
              isAdmin 
                ? "text-sky-500 animate-pulse" 
                : "text-slate-300 group-hover:text-sky-500"
            }`} 
          />
          <span className={`text-[9px] font-bold uppercase tracking-wider ${isAdmin ? "text-sky-500" : "text-slate-350 group-hover:text-sky-500"}`}>
            Admin
          </span>
        </button>
      </div>
    </nav>
  );
}
