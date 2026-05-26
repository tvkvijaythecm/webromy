import React, { useState } from "react";
import { Mail, Phone, Clock, MapPin, Send, MessageSquareMore, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form field validations
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please input a valid email address.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message text is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Please describe details using at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();
      if (response.ok) {
        setSuccessMessage(resData.message || "Your request was submitted successfully! Simulated email triggered.");
        setFormData({ name: "", email: "", whatsapp: "", message: "" });
      } else {
        setErrors({ general: resData.error || "Failed to submit request information." });
      }
    } catch (err) {
      setErrors({ general: "A network error occurred. Please verify your connection status and retry." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-page-root" className="space-y-16 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <section className="text-center space-y-4 pt-4">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-orange-500 bg-brand-orange-500/10 px-3 py-1 rounded-full border border-brand-orange-500/20">
          Global Gateway
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-slate-800 tracking-tight leading-none">
          Contact Webro Team
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Scale your enterprise brand today. Inbound submissions automatically dispatch notifications to info@webro.my.
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CONTACT INFO CARD */}
        <div className="lg:col-span-4 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-8">
          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl">Agency Coordinates</h2>
            <p className="text-slate-400 text-xs">Reach out directly via secure communication channels.</p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-sky-400 flex-shrink-0">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Primary Email</div>
                <a href="mailto:info@webro.my" className="text-sm font-semibold hover:text-brand-orange-500 transition-colors">
                  info@webro.my
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-orange-500 flex-shrink-0">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">WhatsApp Inquiry</div>
                <a href="tel:+60123456789" className="text-sm font-semibold hover:text-brand-orange-500 transition-colors">
                  +601 2345 6789
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Office Location</div>
                <div className="text-sm text-slate-300 font-light">
                  Webro Level 22, Boutique Suite Building, Kuala Lumpur, Malaysia
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Operating Hours</div>
                <div className="text-sm text-slate-300 font-light">
                  Mon - Fri: 9:00 AM - 6:00 PM (GMT+8)
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-300">Social Networks</div>
            <div className="flex items-center space-x-3">
              {["Twitter", "LinkedIn", "GitHub", "Instagram"].map((network) => (
                <span
                  key={network}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 rounded-full text-[10px] font-mono font-bold cursor-pointer hover:text-brand-orange-500"
                >
                  {network}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FORMS BLOCK */}
        <div id="contact-form-block" className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1.5">
            <h2 className="font-display font-medium text-xl text-slate-800">Submit Project Brief</h2>
            <p className="text-slate-500 text-xs">Fill out parameters and our solution director will contact you within 24 hours.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {successMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-start space-x-3 text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <div>
                  <span className="font-bold">Message Forwarded!</span> {successMessage}
                </div>
              </div>
            )}

            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center space-x-2 text-xs">
                <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0 text-red-600" />
                <span>{errors.general}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Suresh Kumar"
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none placeholder-slate-400 transition-colors ${
                    errors.name ? "border-red-400 focus:border-red-500" : "border-slate-100 focus:border-brand-orange-500"
                  }`}
                />
                {errors.name && <div className="text-[10px] text-red-500 font-semibold">{errors.name}</div>}
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. contact@domain.my"
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none placeholder-slate-400 transition-colors ${
                    errors.email ? "border-red-400 focus:border-red-500" : "border-slate-100 focus:border-brand-orange-500"
                  }`}
                />
                {errors.email && <div className="text-[10px] text-red-500 font-semibold">{errors.email}</div>}
              </div>
            </div>

            {/* WhatsApp Number field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">WhatsApp Number (Optional)</label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                placeholder="e.g. +60 12 345 6789"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-orange-500 placeholder-slate-400 transition-colors"
              />
            </div>

            {/* Message field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Message & Brief *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                placeholder="Describe your goals, timeline parameters, or outline the dynamic app architecture..."
                className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none placeholder-slate-400 transition-colors resize-none ${
                  errors.message ? "border-red-400 focus:border-red-500" : "border-slate-100 focus:border-brand-orange-500"
                }`}
              />
              {errors.message && <div className="text-[10px] text-red-500 font-semibold">{errors.message}</div>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-brand-orange-500 to-amber-500 hover:from-brand-orange-600 hover:to-amber-600 disabled:opacity-50 hover:shadow-lg shadow-brand-orange-500/20 text-white rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer select-none transition-all active:scale-95"
            >
              {isSubmitting ? (
                <span>Submitting Brief...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Query</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* 4. GOOGLE MAPS SECTION PLACEHOLDER */}
      <section className="space-y-6">
        <div className="space-y-1.5">
          <h2 className="font-display font-medium text-lg text-slate-800">Visual Coordination Coordinates</h2>
          <p className="text-slate-500 text-xs">Aesthetic Google Map overlay coordinates mapping out Webro head office in Kuala Lumpur.</p>
        </div>

        <div className="relative w-full h-80 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-center items-center p-6 text-center shadow-lg">
          {/* Aesthetic grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#ffffff 1.5px, transparent 1.5px)", backgroundSize: "16px 16px" }} />
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/[0.04] pl-20 transform -translate-y-1/2 select-none pointer-events-none" />
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/[0.04] pt-20 transform -translate-x-1/2 select-none pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-sd">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-brand-orange-500 rounded-full blur-md opacity-40 transform scale-125 animate-ping" />
              <div className="w-14 h-14 rounded-2xl bg-brand-orange-500 text-white flex items-center justify-center shadow-xl shadow-brand-orange-500/30">
                <MapPin className="w-7 h-7" />
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-white font-display font-bold text-base">Webro Head Office Headquarters</h4>
              <p className="text-slate-400 text-xs font-light">3.1390&deg; N, 101.6869&deg; E &middot; Kuala Lumpur Core Center Hub</p>
            </div>
            
            <span className="inline-block px-3 py-1 bg-white/[0.07] border border-white/10 rounded-full text-[10px] font-mono text-brand-sky-300 uppercase tracking-widest">
              Google Maps Placement Frame Active
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
