import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Bot, Code2, Palette, Star, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { HeroSection, ServiceDetail, Testimonial } from "../types";

interface HomeProps {
  hero: HeroSection;
  services: ServiceDetail[];
  testimonials: Testimonial[];
  setActiveTab: (tab: string) => void;
}

export default function Home({ hero, services, testimonials, setActiveTab }: HomeProps) {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Auto-slide Testimonials effect (cycles every 5 seconds)
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => 
      (prev + 1) % testimonials.length
    );
  };

  // Get matching Lucide icon helper
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Bot":
        return Bot;
      case "Code2":
        return Code2;
      case "Palette":
        return Palette;
      default:
        return Code2;
    }
  };

  return (
    <div id="home-page-root" className="space-y-16 pb-28">
      {/* 1. HERO SECTION WITH DECORATIVE OVERLAYS */}
      <section className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 bg-slate-950 text-white min-h-[500px] flex items-center shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: `url(${hero?.imageUrl || "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=1200&q=80"})` }}
        />
        {/* Sky-Blue and Orange background gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-sky-500/15 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange-500/15 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center md:text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-6">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-orange-500/10 text-brand-orange-500 border border-brand-orange-500/20 uppercase tracking-widest">
              ⚡ Webro Digital Agency
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {hero?.title || "Next-Gen Digital Solutions for Exponential Growth"}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-light">
              {hero?.subtitle || "Webro combines modern AI advertisement, bespoke application engineering, and immaculate visual art to scale your digital presence."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={() => setActiveTab(hero?.ctaLink || "projects")}
                id="hero-cta-button"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-brand-orange-500 to-amber-500 hover:from-brand-orange-600 hover:to-amber-600 font-display shadow-lg shadow-brand-orange-500/35 transition-all text-white flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                <span>{hero?.ctaText || "Explore Project Portfolio"}</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
              
              <button
                onClick={() => setActiveTab("contact")}
                id="hero-secondary-button"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 transition-all text-white cursor-pointer active:scale-95"
              >
                Schedule Consultation
              </button>
            </div>
          </div>
          <div className="hidden md:col-span-4 md:flex items-center justify-center">
            {/* Visual aesthetic wireframe cube representation */}
            <div className="relative w-64 h-64 border border-brand-orange-500/25 rounded-3xl p-6 bg-white/5 backdrop-blur-md flex flex-col justify-between shadow-[0_0_50px_rgba(249,115,22,0.1)]">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-orange-500 to-brand-orange-600 flex items-center justify-center shadow-lg shadow-brand-orange-500/20">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-display text-brand-sky-400">99.8%</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Uptime Rate</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300">Modern Digital Architecture</div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-orange-500 rounded-full w-[94%]" />
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>EST: 2018</span>
                <span>KUALA LUMPUR, MY</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES OVERVIEW GRID SECTION */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-orange-500 bg-brand-orange-500/10 px-3 py-1 rounded-full border border-brand-orange-500/20">
            Our Specialties
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-800 tracking-tight">
            How We Transform Your Business
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            Webro delivers unified design and core software services to accelerate acquisition and operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((svc) => {
            const Icon = getIcon(svc.icon);
            const isSky = svc.color === "sky";
            const cardBgColor = isSky 
              ? "hover:border-brand-sky-300 hover:shadow-brand-sky-500/10" 
              : svc.id === "ai-ads" 
                ? "hover:border-brand-sky-300 hover:shadow-brand-sky-500/10"
                : svc.color === "orange" 
                  ? "hover:border-brand-orange-300 hover:shadow-brand-orange-500/10" 
                  : "hover:border-slate-300 hover:shadow-slate-500/10";

            return (
              <div
                key={svc.id}
                id={`card-service-overview-${svc.id}`}
                className={`bg-white rounded-3xl p-8 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between relative overflow-hidden ${cardBgColor}`}
              >
                {/* Visual Accent gradient bar on hover */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                  svc.id === "ai-ads" ? "bg-brand-sky-500" : svc.color === "orange" ? "bg-brand-orange-500" : "bg-slate-400"
                }`} />

                <div className="space-y-6">
                  {/* Service Icon inside a beautiful colored ring */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md ${
                    svc.id === "ai-ads" 
                      ? "bg-brand-sky-50 text-brand-sky-500" 
                      : svc.color === "orange"
                        ? "bg-brand-orange-50 text-brand-orange-500"
                        : "bg-slate-100 text-slate-600"
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-xl text-slate-800">
                      {svc.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {svc.description}
                    </p>
                  </div>

                  {/* Checklist highlights */}
                  <ul className="space-y-2.5 pt-2">
                    {svc.features.slice(0, 3).map((feat, index) => (
                      <li key={index} className="flex items-center space-x-2 text-xs text-slate-600">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                          svc.id === "ai-ads" ? "text-brand-sky-500" : "text-brand-orange-500"
                        }`} />
                        <span className="font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab("service")}
                    className="text-xs font-semibold hover:underline flex items-center space-x-1 cursor-pointer transition-colors text-slate-700"
                  >
                    <span>Learn Capabilities</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CUSTOMER REVIEWS AUTO-SLIDING CAROUSEL */}
      <section className="bg-slate-50 border-y border-slate-200/50 py-16">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-sky-600 dark:text-brand-sky-500 bg-brand-sky-50 py-1 px-3 rounded-full border border-brand-sky-100">
              Trusted Worldwide
            </span>
            <h2 className="font-display font-black text-3xl text-slate-800 tracking-tight">
              What Our Clients Say
            </h2>
          </div>

          <div className="relative" id="testimonial-carousel-container">
            <AnimatePresence mode="wait">
              {testimonials.length > 0 && (
                <motion.div
                  key={currentTestimonialIndex}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
                >
                  {/* Decorative glowing backdrops */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange-500/5 rounded-full blur-2xl" />
                  
                  {/* Avatar Column */}
                  <div className="flex-shrink-0 text-center relative z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange-500 to-brand-sky-500 rounded-full blur-md opacity-20 transform scale-110" />
                      <img
                        src={testimonials[currentTestimonialIndex].avatar}
                        alt={testimonials[currentTestimonialIndex].name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white relative z-10 mx-auto"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Feedback Details Column */}
                  <div className="space-y-4 flex-1 text-center md:text-left relative z-10">
                    {/* Stars bar */}
                    <div className="flex justify-center md:justify-start items-center space-x-1">
                      {Array.from({ length: testimonials[currentTestimonialIndex].rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-slate-600 text-base sm:text-lg italic leading-relaxed font-light">
                      &ldquo;{testimonials[currentTestimonialIndex].message}&rdquo;
                    </p>

                    <div>
                      <h4 className="font-display font-bold text-slate-800 text-base">
                        {testimonials[currentTestimonialIndex].name}
                      </h4>
                      <p className="text-brand-sky-600 text-xs font-semibold tracking-wide">
                        {testimonials[currentTestimonialIndex].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Testimonial Nav Arrows */}
            <div className="flex justify-center items-center space-x-3 mt-6">
              <button
                id="btn-testimonial-prev"
                onClick={prevTestimonial}
                className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 active:scale-95 transition-all shadow-sm cursor-pointer"
                title="Previous feedback"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex space-x-1.5">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonialIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentTestimonialIndex ? "w-6 bg-brand-orange-500" : "w-2 bg-slate-300"
                    }`}
                    title={`Go to feedback ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                id="btn-testimonial-next"
                onClick={nextTestimonial}
                className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 active:scale-95 transition-all shadow-sm cursor-pointer"
                title="Next feedback"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
