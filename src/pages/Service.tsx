import React from "react";
import { motion } from "motion/react";
import { Bot, Code2, Palette, CheckCircle2, TrendingUp, Sparkles, Smartphone, Shield, Monitor } from "lucide-react";
import { ServiceDetail } from "../types";

interface ServiceProps {
  services: ServiceDetail[];
  setActiveTab: (tab: string) => void;
}

export default function Service({ services, setActiveTab }: ServiceProps) {
  // Matching illustration generator based on service identifiers
  const renderIllustration = (serviceId: string) => {
    switch (serviceId) {
      case "ai-ads":
        return (
          <div className="relative w-full h-64 bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between overflow-hidden shadow-2xl group">
            <div className="absolute top-[-30%] right-[-20%] w-60 h-60 bg-brand-sky-500/10 rounded-full blur-[80px]" />
            <div className="flex items-center justify-between z-10">
              <div className="flex space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-[10px] font-mono text-brand-sky-400 bg-brand-sky-500/10 border border-brand-sky-500/20 py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider">
                Model Live
              </span>
            </div>

            {/* Simulated AI conversion chart lines */}
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-end h-24 px-4 space-x-2">
                <motion.div initial={{ height: 0 }} animate={{ height: "40%" }} transition={{ duration: 1 }} className="bg-slate-700 w-full rounded-t-md" />
                <motion.div initial={{ height: 0 }} animate={{ height: "65%" }} transition={{ duration: 1.2 }} className="bg-slate-700 w-full rounded-t-md" />
                <motion.div initial={{ height: 0 }} animate={{ height: "50%" }} transition={{ duration: 1.1 }} className="bg-slate-600 w-full rounded-t-md" />
                <motion.div initial={{ height: 0 }} animate={{ height: "92%" }} transition={{ duration: 1.5 }} className="bg-brand-sky-500 w-full rounded-t-md relative">
                  <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 p-1 rounded bg-brand-sky-500 text-[8px] font-mono font-bold text-white shadow-xl shadow-brand-sky-500/30">
                    +142%
                  </div>
                </motion.div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 font-mono px-2">
                <span>Phase 1</span>
                <span>Phase 2</span>
                <span>Optimized Boost</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-t border-slate-800 pt-3 z-10">
              <span className="flex items-center space-x-1 text-slate-300">
                <TrendingUp className="w-3.5 h-3.5 text-brand-sky-400" />
                <span>Micro Bidding Alg</span>
              </span>
              <span>v2.8</span>
            </div>
          </div>
        );

      case "web-mobile":
        return (
          <div className="relative w-full h-64 bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange-500/5 via-transparent to-transparent opacity-30" />
            
            {/* Visual Header bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded-full bg-orange-500" />
                <span className="text-[10px] font-mono text-slate-400">Package.json &middot; WebroEngine</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">TypeScript</span>
            </div>

            {/* Mock coding block */}
            <div className="flex-1 font-mono text-[10px] space-y-1 py-4 text-slate-400 select-none">
              <div><span className="text-pink-400">import</span> React, &#123; useState &#125; <span className="text-pink-400">from</span> <span className="text-emerald-400">"react"</span>;</div>
              <div className="text-slate-500">// Initialize Responsive Viewport Systems</div>
              <div><span className="text-blue-400">const</span> <span className="text-amber-400">optimizeLayout</span> = () =&gt; &#123;</div>
              <div className="pl-4 text-slate-300">const [speed, setSpeed] = useState(<span className="text-orange-400">100</span>);</div>
              <div className="pl-4">return <span className="text-amber-400">compileApplet</span>(&#123; mode: <span className="text-emerald-400">"production"</span> &#125;);</div>
              <div>&#125;;</div>
            </div>

            {/* Mock preview widget floating indicator */}
            <div className="absolute right-5 bottom-5 p-3 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl flex items-center space-x-2 z-20">
              <Smartphone className="w-4 h-4 text-brand-orange-500" />
              <span className="text-[9px] font-mono font-bold text-slate-200">Interactive SPA</span>
            </div>
          </div>
        );

      case "graphic-design":
        return (
          <div className="relative w-full h-64 bg-slate-900 rounded-3xl border border-slate-800 p-6 flex items-center justify-center overflow-hidden shadow-2xl group">
            {/* Decorative intersecting circles mapping complete graphics precision */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-sky-500/5 rounded-full blur-2xl" />

            {/* Glowing intersection discs representation */}
            <div className="relative flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center animate-spin-slow">
                <div className="w-24 h-24 rounded-full border border-slate-700 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-brand-orange-500/30 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-brand-orange-500" />
                  </div>
                </div>
              </div>

              {/* Vector guide coordinates boxes */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 p-1.5 bg-slate-800 rounded border border-slate-700 text-[8px] font-mono text-slate-300">
                P1: (X24, Y88)
              </div>
              <div className="absolute bottom-0 right-[-30px] p-1.5 bg-slate-800 rounded border border-slate-700 text-[8px] font-mono text-slate-300">
                O: 0.8
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getSectionTitleColor = (serviceId: string) => {
    switch (serviceId) {
      case "ai-ads":
        return "text-brand-sky-600 dark:text-brand-sky-500";
      case "web-mobile":
        return "text-brand-orange-500";
      case "graphic-design":
        return "text-indigo-600 dark:text-indigo-400";
      default:
        return "text-brand-orange-500";
    }
  };

  return (
    <div id="service-page-root" className="space-y-16 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <section className="text-center space-y-4 pt-4">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-orange-600 bg-brand-orange-50 px-3 py-1 rounded-full border border-brand-orange-100">
          Professional Capabilities
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-slate-800 tracking-tight leading-none">
          Our Advanced Services
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Delivering professional-tier engineering, AI optimization, and immaculate art design system suites for digital enterprise.
        </p>
      </section>

      {/* CORE ALIGNED DETAILED CHASSIS */}
      <section className="space-y-16">
        {services.map((svc, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={svc.id}
              id={`service-detail-section-${svc.id}`}
              className={`flex flex-col ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              } bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 items-center gap-10 hover:shadow-xl transition-shadow duration-300`}
            >
              {/* Illustration Column on modern card */}
              <div className="w-full md:w-1/2">
                {renderIllustration(svc.id)}
              </div>

              {/* Text Description Feature highlights Column */}
              <div className="w-full md:w-1/2 space-y-6">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-mono font-bold tracking-widest uppercase py-1 px-3 rounded-full ${
                    svc.id === "ai-ads" 
                      ? "bg-brand-sky-50 text-brand-sky-600" 
                      : svc.color === "orange"
                        ? "bg-brand-orange-50 text-brand-orange-500"
                        : "bg-indigo-50 text-indigo-600"
                  }`}>
                    Service 0{index + 1}
                  </span>
                </div>

                <h2 className={`font-display font-black text-2xl sm:text-3xl tracking-tight ${getSectionTitleColor(svc.id)}`}>
                  {svc.title}
                </h2>

                <p className="text-slate-600 text-base leading-relaxed font-light">
                  {svc.description}
                </p>

                {/* Grid features highlight list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
                  {svc.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start space-x-2.5">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        svc.id === "ai-ads" ? "text-brand-sky-500" : "text-brand-orange-500"
                      }`} />
                      <span className="text-sm font-medium text-slate-700">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setActiveTab("contact")}
                    className={`px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                      svc.id === "ai-ads"
                        ? "bg-brand-sky-500 text-white hover:bg-brand-sky-600"
                        : "bg-brand-orange-500 text-white hover:bg-brand-orange-600"
                    }`}
                  >
                    Discuss This Service
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* QUICK VALUE PROPOSITION SECTION */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-display font-medium text-xl text-slate-100">
            Need a fully bespoke integration framework?
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm font-light">
            We adapt directly to your stack, providing dedicated deployment parameters.
          </p>
        </div>
        <button
          onClick={() => setActiveTab("contact")}
          className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-transform hover:-translate-y-0.5 cursor-pointer flex-shrink-0"
        >
          Initiate Request Info
        </button>
      </section>
    </div>
  );
}
