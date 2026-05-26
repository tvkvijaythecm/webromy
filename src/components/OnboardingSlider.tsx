import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, Globe, Heart, Shield } from "lucide-react";
import { Slide } from "../types";

interface OnboardingSliderProps {
  slides: Slide[];
  onComplete: () => void;
}

export default function OnboardingSlider({ slides, onComplete }: OnboardingSliderProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      onComplete();
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  const getSlideColor = (imageType: string) => {
    switch (imageType) {
      case "indigo":
        return "from-blue-600 to-indigo-800";
      case "sky":
        return "from-sky-400 to-blue-600";
      case "orange":
        return "from-orange-500 to-amber-600";
      default:
        return "from-slate-800 to-slate-900";
    }
  };

  return (
    <div id="onboarding-slider-root" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden selection:bg-orange-500/30 selection:text-orange-200">
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/10 blur-[130px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/10 blur-[130px] animate-pulse-slow" />

      {/* Top Header Row with Logo and Skip */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xl leading-none">W</span>
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white font-display">
            WEBRO<span className="text-sky-500">.</span>
          </span>
        </div>
        <button
          id="btn-skip-onboarding"
          onClick={skipOnboarding}
          className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 cursor-pointer"
        >
          Skip Intro
        </button>
      </header>

      {/* Content Container */}
      <div className="w-full max-w-5xl px-6 flex flex-col justify-center flex-1 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
          >
            {/* Visual Column / Showcase Display */}
            <div className="col-span-1 md:col-span-6 flex justify-center order-1 md:order-2">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] rounded-3xl p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/60 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                {/* Visual gradient backdrop blur circles */}
                <div className="absolute top-4 right-4 w-60 h-60 bg-sky-500/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-4 left-4 w-60 h-60 bg-orange-500/20 rounded-full blur-[80px]" />

                {/* Simulated interactive agency vector wireframe illustration based on current slide */}
                {currentSlideIndex === 0 && (
                  <div className="relative z-10 flex flex-col items-center justify-center space-y-5 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center transform hover:rotate-6 transition-transform">
                      <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-white/20 rounded-full mx-auto" />
                      <div className="h-3 w-48 bg-white/10 rounded-full mx-auto" />
                      <div className="h-3 w-32 bg-white/15 rounded-full mx-auto" />
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <span className="inline-block px-3 py-1 rounded-md text-[9px] uppercase tracking-widest font-mono bg-white/10 border border-white/10 text-orange-100">
                        Targeting
                      </span>
                      <span className="inline-block px-3 py-1 rounded-md text-[9px] uppercase tracking-widest font-mono bg-sky-500/20 border border-sky-500/20 text-sky-200">
                        Micro-ROI
                      </span>
                    </div>
                  </div>
                )}

                {currentSlideIndex === 1 && (
                  <div className="relative z-10 flex flex-col items-center justify-center space-y-5">
                    <div className="w-16 h-16 rounded-2xl bg-sky-500/25 border border-sky-400 flex items-center justify-center relative shadow-indigo-500/10 shadow-lg">
                      <Globe className="w-8 h-8 text-sky-400 animate-spin-slow" />
                    </div>
                    <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700/80 flex flex-col space-y-1.5 w-52 shadow-xl">
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      </div>
                      <div className="h-2 w-full bg-white/20 rounded-full mt-1" />
                      <div className="h-2 w-5/6 bg-white/15 rounded-full" />
                      <div className="h-2 w-3/4 bg-orange-500/30 rounded-full" />
                    </div>
                  </div>
                )}

                {currentSlideIndex === 2 && (
                  <div className="relative z-10 flex flex-col items-center justify-center space-y-5 text-center">
                    <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <Heart className="w-8 h-8 animate-bounce" />
                    </div>
                    <div className="text-xs font-bold tracking-widest uppercase text-orange-100 bg-orange-500/15 py-1 px-4 rounded-full border border-orange-500/20">
                      Webro Standards
                    </div>
                    <div className="flex space-x-1.5 items-center justify-center">
                      <Shield className="w-4 h-4 text-sky-450" />
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        ESTABLISHED 2018
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description Text Column */}
            <div className="col-span-1 md:col-span-6 text-left space-y-6 order-2 md:order-1 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                Onboarding / Slide 0{currentSlideIndex + 1}
              </span>

              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-[0.95] text-white uppercase">
                {slides[currentSlideIndex]?.title?.includes(" ") ? (
                  <>
                    {slides[currentSlideIndex].title.split(" ").slice(0, -1).join(" ")}{" "}
                    <br />
                    <span className="text-sky-400 underline decoration-orange-500 decoration-4 underline-offset-8">
                      {slides[currentSlideIndex].title.split(" ").slice(-1)[0]}
                    </span>
                  </>
                ) : (
                  slides[currentSlideIndex]?.title
                )}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-md font-light">
                {slides[currentSlideIndex]?.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-8 flex flex-col sm:flex-row items-center justify-between z-10 max-w-7xl mx-auto w-full border-t border-slate-900 bg-slate-950/90 backdrop-blur-md">
        {/* Pagination Dots */}
        <div className="flex items-center space-x-3 mb-6 sm:mb-0 order-2 sm:order-1" id="pagination-dots-container">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlideIndex 
                  ? "bg-orange-500 w-12" 
                  : "bg-white/20 w-4 hover:bg-white/40"
              }`}
              title={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Buttons Row */}
        <div className="flex items-center space-x-4 mb-4 sm:mb-0 order-1 sm:order-2 w-full sm:w-auto">
          {currentSlideIndex > 0 && (
            <button
              id="btn-back-onboarding"
              onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}
              className="w-1/2 sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all text-center cursor-pointer border border-transparent hover:border-white/5"
            >
              Back
            </button>
          )}

          <button
            id="btn-next-onboarding"
            onClick={nextSlide}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-brand-orange-500 to-amber-500 hover:from-brand-orange-600 hover:to-amber-600 shadow-xl shadow-brand-orange-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer text-white"
          >
            <span>
              {currentSlideIndex === slides.length - 1 ? "Get Started" : "Next Slide"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
