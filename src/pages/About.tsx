import React from "react";
import { motion } from "motion/react";
import { History, Target, Compass, Sparkles, CheckSquare, Zap } from "lucide-react";
import { AboutSection, WorkflowStep, SkillItem } from "../types";

interface AboutProps {
  about: AboutSection;
  workflow: WorkflowStep[];
  skills: SkillItem[];
}

export default function About({ about, workflow, skills }: AboutProps) {
  return (
    <div id="about-page-root" className="space-y-16 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* HEADER HERO */}
      <section className="text-center space-y-4 pt-4">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-sky-600 bg-brand-sky-50 px-3 py-1 rounded-full border border-brand-sky-100 dark:bg-slate-800 dark:border-slate-700">
          Who We Are
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-slate-800 tracking-tight leading-none">
          {about?.historyTitle || "Transforming Digital Interfaces since 2018"}
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
          Delivering premium design, application development, and micro-ROI marketing to ambitious client networks.
        </p>
      </section>

      {/* 1. CORPORATE PROFILE GRID */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-center space-y-6">
          <div className="flex items-center space-x-3 text-brand-orange-500">
            <div className="w-10 h-10 rounded-xl bg-brand-orange-50 flex items-center justify-center">
              <History className="w-5 h-5 text-brand-orange-500" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-800">Company Information</h2>
          </div>
          <p className="text-slate-600 font-light text-base leading-relaxed">
            {about?.companyHistory || "Webro is a boutique digital strategy agency focused on elevating modern business operations. We started as an expert UI studio in Kuala Lumpur and evolved into a boutique, global powerhouse delivering end-to-end full stack development, smart AI marketing funnels, and stellar brand strategies."}
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-3xl font-black font-display text-brand-orange-500">250+</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Projects Launched</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-3xl font-black font-display text-brand-sky-500">100%</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Client Satisfaction</div>
            </div>
          </div>
        </div>

        {/* 2. VISION & MISSION */}
        <div className="md:col-span-5 flex flex-col gap-6 justify-between">
          <div className="bg-gradient-to-tr from-brand-orange-500 to-amber-600 text-white rounded-3xl p-8 shadow-xl flex-1 flex flex-col justify-center space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <Target className="w-5 h-5 text-white animate-pulse" />
              </div>
              <h3 className="font-display font-bold text-xl">Our Vision</h3>
            </div>
            <p className="text-orange-50 text-sm font-light leading-relaxed">
              {about?.vision || "To establish the gold standard of responsive visual elegance and functional machine performance on the web, bridging human creativity and automated intelligence."}
            </p>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex-1 flex flex-col justify-center space-y-4 border border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                <Compass className="w-5 h-5 text-brand-sky-400" />
              </div>
              <h3 className="font-display font-bold text-xl">Our Mission</h3>
            </div>
            <p className="text-slate-300 text-sm font-light leading-relaxed">
              {about?.mission || "To arm ambitious brands with advanced, responsive interfaces, lightning-fast application engines, and hyper-targeted advertising algorithms that force rapid growth."}
            </p>
          </div>
        </div>
      </section>

      {/* 3. PROJECT WORKING PROCEDURE (TIMELINE UI) */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-orange-500 bg-brand-orange-500/10 px-3 py-1 rounded-full border border-brand-orange-500/20">
            Development Flow
          </span>
          <h2 className="font-display font-black text-3xl text-slate-800 tracking-tight">
            Our Project Working Procedure
          </h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            From deep parameters analysis to continuous release integration, we employ strict steps.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto pt-6">
          {/* Vertical Timeline center line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block" />

          <div className="space-y-10">
            {workflow.map((step, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div 
                  key={step.id} 
                  id={`workflow-step-${step.id}`}
                  className="relative flex flex-col md:flex-row items-stretch"
                >
                  {/* Step counter button */}
                  <div className="absolute left-0 md:left-8 top-1 md:-translate-x-1/2 w-16 h-16 rounded-2xl bg-white border-2 border-brand-orange-500 flex items-center justify-center shadow-lg z-10 text-brand-orange-500 font-display font-black text-xl">
                    0{step.stepNumber}
                  </div>

                  {/* Message body block */}
                  <div className="pl-20 md:pl-28 w-full">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      {/* Left border highlight */}
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-brand-orange-500" />
                      
                      <div className="space-y-2">
                        <h4 className="font-display font-bold text-xl text-slate-800 group-hover:text-brand-orange-500 transition-colors">
                          {step.title}
                        </h4>
                        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SKILLS SECTION */}
      <section className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 space-y-6">
          <div className="w-12 h-12 rounded-xl bg-brand-sky-50 text-brand-sky-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 animate-spin-slow" />
          </div>
          <h2 className="font-display font-black text-3xl text-slate-800 leading-tight">
            Our Elite Technical & Marketing Skills
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            We hold ourselves to mathematically pristine criteria. Every pixel rendered represent our commitment to responsive mastery.
          </p>
          <div className="flex items-center space-x-2 text-slate-700 text-xs font-semibold">
            <Zap className="w-4 h-4 text-brand-orange-500 animate-bounce" />
            <span>Continuous Training & Model Optimization Labs</span>
          </div>
        </div>

        {/* Custom animated progress indicators */}
        <div className="md:col-span-7 space-y-6">
          {skills.map((skill) => (
            <div key={skill.id} className="space-y-2" id={`skill-indicator-${skill.id}`}>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-700">{skill.name}</span>
                <span className="font-mono font-bold text-brand-orange-500">{skill.percentage}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-brand-orange-500 to-brand-sky-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
