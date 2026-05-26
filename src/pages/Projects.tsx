import { useState, useMemo } from "react";
import { Search, ExternalLink, Play, Globe, CheckCircle2, ChevronRight, X, ArrowUpRight } from "lucide-react";
import { ProjectPost, Category } from "../types";

interface ProjectsProps {
  posts: ProjectPost[];
  categories: Category[];
}

export default function Projects({ posts, categories }: ProjectsProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPost, setSelectedPost] = useState<ProjectPost | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Filter posts to show only 'publish' (Published posts automatically appear)
  const publishedPosts = useMemo(() => {
    return posts.filter((post) => post.status === "publish");
  }, [posts]);

  // Compute filtered posts list based on current active tab and search query
  const filteredPosts = useMemo(() => {
    return publishedPosts.filter((post) => {
      const matchCategory = selectedCategoryId === "all" || post.categoryId === selectedCategoryId;
      const matchSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [publishedPosts, selectedCategoryId, searchQuery]);

  // Helper to obtain Category Name for layout
  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : "Creative Design";
  };

  // Extract a clean direct text summary from general rich HTML code
  const getCleanTextSnippet = (htmlContent: string) => {
    // Strip HTML tags roughly for cards
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    return plainText.length > 140 ? plainText.substring(0, 140) + "..." : plainText;
  };

  // Parse custom youtube urls for responsive modal iFrame embeds
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return "";
    try {
      // Handle standard watch?v= format
      if (url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        return `https://www.youtube.com/embed/${urlParams.get("v")}`;
      }
      // Handle shared url details be/ format
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      // Handle direct embed URL or normal Vimeo embeds
      if (url.includes("player.vimeo.com")) {
        return url;
      }
      if (url.includes("vimeo.com/")) {
        const vimeoId = url.split("vimeo.com/")[1]?.split("?")[0];
        return `https://player.vimeo.com/video/${vimeoId}`;
      }
    } catch (e) {
      console.warn("Error parsing video url, using direct", url);
    }
    return url;
  };

  return (
    <div id="projects-page-root" className="space-y-12 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. HEADER HERO BANNER */}
      <section className="text-center space-y-4 pt-4">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-orange-500 bg-brand-orange-500/10 px-3 py-1 rounded-full border border-brand-orange-500/20">
          Case Studies Portfolio
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-slate-800 tracking-tight leading-none">
          Our Dynamic Projects
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Explore full active projects, tech specs, and video workflow walkovers built for our enterprise client list.
        </p>
      </section>

      {/* 2. SEARCH AND FILTER PILL RACK */}
      <section className="flex flex-col md:flex-row items-center gap-4 justify-between bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
        {/* Category Pill Buttons */}
        <div id="category-filter-pillbox" className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryId("all")}
            className={`px-5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryId === "all" 
                ? "bg-brand-orange-500 text-white shadow-md shadow-brand-orange-500/20" 
                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100"
            }`}
          >
            All Case Studies ({publishedPosts.length})
          </button>
          {categories.map((cat) => {
            const count = publishedPosts.filter((p) => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategoryId === cat.id 
                    ? "bg-brand-orange-500 text-white shadow-md shadow-brand-orange-500/20" 
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Dynamic Live Search Input */}
        <div className="relative w-full md:w-80 flex-shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-brand-orange-300 placeholder-slate-400 transition-colors"
          />
        </div>
      </section>

      {/* 3. DYNAMIC CASE CARDS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              id={`project-card-${post.id}`}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-350 group flex flex-col justify-between overflow-hidden relative"
            >
              <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
                <img
                  src={post.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Sky Blue Floating Tag Category */}
                <span className="absolute top-4 left-4 inline-block px-3 py-1 bg-brand-sky-500/90 backdrop-blur-md text-white text-[10px] font-mono uppercase font-bold tracking-widest rounded-full shadow-md z-17">
                  {getCategoryName(post.categoryId)}
                </span>

                {/* Optional Play indicator overlay */}
                {post.videoUrl && (
                  <button
                    onClick={() => setActiveVideoUrl(post.videoUrl || "")}
                    className="absolute inset-0 flex items-center justify-center bg-slate-900/30 group-hover:bg-slate-900/40 transition-colors cursor-pointer"
                    title="Play project showcase video walkover"
                  >
                    <div className="w-14 h-14 rounded-full bg-brand-orange-500 text-white flex items-center justify-center shadow-lg shadow-brand-orange-500/30 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </button>
                )}
              </div>

              {/* Card Meta Content Info */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-lg text-slate-800 line-clamp-2 leading-tight group-hover:text-brand-orange-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 font-light leading-relaxed">
                    {getCleanTextSnippet(post.description)}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4 mt-auto border-t border-slate-50">
                  <button
                    onClick={() => setSelectedPost(post)}
                    id={`btn-read-${post.id}`}
                    className="flex-1 py-2 rounded-xl text-center border border-slate-100 hover:border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <span>Read Specs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {post.websiteUrl && (
                    <a
                      href={post.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`btn-visit-${post.id}`}
                      className="flex-1 py-1 px-3 rounded-xl bg-gradient-to-tr from-brand-orange-500 to-brand-orange-600 text-white text-xs font-bold transition-all hover:shadow-md hover:shadow-brand-orange-500/10 flex items-center justify-center space-x-1.5"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Site</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center space-y-3">
            <div className="text-3xl">📭</div>
            <h4 className="font-display font-bold text-slate-600">No project case studies match your query</h4>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">Try toggling to a different visual filter or refine the search input details above.</p>
          </div>
        )}
      </section>

      {/* 4. DETAILS RICH MODAL SHEET */}
      {selectedPost && (
        <div id="project-detail-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in-quick">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 animate-slide-up-quick">
            {/* Modal Cover Image */}
            <div className="relative aspect-[16/9] bg-slate-100">
              <img
                src={selectedPost.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2 bg-slate-950/70 hover:bg-slate-950/90 text-white rounded-full sm:p-2.5 transition-colors cursor-pointer"
                title="Close overlay card details"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="absolute bottom-4 left-4 bg-brand-sky-500 text-white text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                {getCategoryName(selectedPost.categoryId)}
              </span>
            </div>

            {/* Modal Body with Rich text rendering layout */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-2">
                <h2 className="font-display font-black text-2xl text-slate-800 tracking-tight leading-tight">
                  {selectedPost.title}
                </h2>
                <div className="text-[10px] font-mono text-slate-400">
                  PUBLISHED &middot; {new Date(selectedPost.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Renders the Rich Text description properly with custom prose-like styles */}
              <div 
                className="prose prose-slate prose-sm text-slate-600 max-w-none space-y-4 font-light leading-relaxed border-t border-slate-100 pt-4"
                dangerouslySetInnerHTML={{ __html: selectedPost.description }}
              />

              {/* Bottom footer links inside details sheet */}
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                {selectedPost.websiteUrl && (
                  <a
                    href={selectedPost.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-brand-orange-500 hover:bg-brand-orange-600 text-center text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all hover:shadow-lg shadow-brand-orange-500/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Launch Project Link</span>
                  </a>
                )}
                {selectedPost.videoUrl && (
                  <button
                    onClick={() => {
                      setActiveVideoUrl(selectedPost.videoUrl || "");
                    }}
                    className="flex-1 py-3 bg-slate-900 hover:bg-black text-center text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch walkover video</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. FLOATING IFRAME VIDEO PLAYER SCREEN */}
      {activeVideoUrl && (
        <div id="video-iframe-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4" onClick={() => setActiveVideoUrl(null)}>
          <div className="relative w-full max-w-3xl aspect-[16/9] bg-black rounded-3xl overflow-hidden border border-slate-800" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-slate-950/80 hover:bg-slate-950 text-white rounded-full transition-colors cursor-pointer"
              title="Close system media player"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={getYoutubeEmbedUrl(activeVideoUrl)}
              className="w-full h-full border-none"
              title="Project Visual Walkover Showcase"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
