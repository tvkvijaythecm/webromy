import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "data", "db.json");

app.use(express.json());

// Helper function to read the database file
function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Re-create parent directory if it got deleted
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify({ slides: [], hero: {}, testimonials: [], services: [], about: {}, workflow: [], skills: [], categories: [], posts: [], contacts: [], activities: [] }, null, 2));
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database files, using memory backup:", err);
    return null;
  }
}

// Helper function to write to our database file
function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing to database:", err);
    return false;
  }
}

// Logger for admin and system activities
function logActivity(text: string) {
  const db = readDb();
  if (db) {
    if (!db.activities) db.activities = [];
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    db.activities.unshift(`[${timestamp}] ${text}`);
    if (db.activities.length > 50) {
      db.activities = db.activities.slice(0, 50); // cap at 50 activities
    }
    writeDb(db);
  }
}

// API: Auth endpoint
app.post("/api/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "sureshwebro") {
    logActivity("Admin successfully authenticated");
    res.json({ success: true, token: "session-token-webro-sureshwebro" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials. Password is 'sureshwebro'." });
  }
});

// API: Get entire Database configuration for public or admin load
app.get("/api/db", (req: Request, res: Response) => {
  const db = readDb();
  if (db) {
    res.json(db);
  } else {
    res.status(500).json({ error: "Failed to load database details" });
  }
});

// API: Get admin board dynamic statistics
app.get("/api/stats", (req: Request, res: Response) => {
  const db = readDb();
  if (!db) return res.status(500).json({ error: "No database" });

  const activePostsCount = db.posts ? db.posts.filter((p: any) => p.status === 'publish').length : 0;
  const draftPostsCount = db.posts ? db.posts.filter((p: any) => p.status === 'draft').length : 0;

  res.json({
    totalPosts: db.posts ? db.posts.length : 0,
    activePostsCount,
    draftPostsCount,
    categoriesCount: db.categories ? db.categories.length : 0,
    contactsCount: db.contacts ? db.contacts.length : 0,
    recentActivities: db.activities ? db.activities.slice(0, 10) : []
  });
});

// API: Save Hero Settings
app.put("/api/hero", (req: Request, res: Response) => {
  const db = readDb();
  if (db) {
    db.hero = req.body;
    writeDb(db);
    logActivity("Updated Hero Banner section elements");
    res.json({ success: true, hero: db.hero });
  } else {
    res.status(500).json({ success: false });
  }
});

// API: Save Onboarding Slider Content
app.put("/api/slides", (req: Request, res: Response) => {
  const db = readDb();
  if (db) {
    db.slides = req.body;
    writeDb(db);
    logActivity("Reordered/Edited onboarding introduction slides");
    res.json({ success: true, slides: db.slides });
  } else {
    res.status(500).json({ success: false });
  }
});

// API: Edit Home Testimonial list
app.put("/api/testimonials", (req: Request, res: Response) => {
  const db = readDb();
  if (db) {
    db.testimonials = req.body;
    writeDb(db);
    logActivity("Updated custom active customer review carousel cards");
    res.json({ success: true, testimonials: db.testimonials });
  } else {
    res.status(500).json({ success: false });
  }
});

// API: Save Corporate Profile & History Section
app.put("/api/about", (req: Request, res: Response) => {
  const db = readDb();
  if (db) {
    db.about = req.body.about;
    if (req.body.workflow) db.workflow = req.body.workflow;
    if (req.body.skills) db.skills = req.body.skills;
    writeDb(db);
    logActivity("Modified 'About' corporate profile history and procedural systems");
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

// API: Save Service Details
app.put("/api/services", (req: Request, res: Response) => {
  const db = readDb();
  if (db) {
    db.services = req.body;
    writeDb(db);
    logActivity("Edited Webro service summaries & key checklists");
    res.json({ success: true, services: db.services });
  } else {
    res.status(500).json({ success: false });
  }
});

// --- CATEGORY CRUD ---
app.post("/api/categories", (req: Request, res: Response) => {
  const db = readDb();
  if (db) {
    const newCategory = {
      id: "cat-" + Date.now(),
      name: req.body.name,
      slug: req.body.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
    };
    db.categories.push(newCategory);
    writeDb(db);
    logActivity(`Created project catalog category: "${newCategory.name}"`);
    res.status(201).json(newCategory);
  } else {
    res.status(500).json({ error: "Failed to create" });
  }
});

app.put("/api/categories/:id", (req: Request, res: Response) => {
  const db = readDb();
  if (db) {
    const index = db.categories.findIndex((c: any) => c.id === req.params.id);
    if (index !== -1) {
      db.categories[index].name = req.body.name;
      db.categories[index].slug = req.body.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      writeDb(db);
      logActivity(`Updated project category name to "${req.body.name}"`);
      res.json(db.categories[index]);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } else {
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/categories/:id", (req: Request, res: Response) => {
  const db = readDb();
  if (db) {
    const category = db.categories.find((c: any) => c.id === req.params.id);
    db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
    // Also change posts with this category to a blank or default if needed
    // db.posts.forEach((p: any) => { if (p.categoryId === req.params.id) p.categoryId = ''; });
    writeDb(db);
    if (category) {
      logActivity(`Deleted portfolio category: "${category.name}"`);
    }
    res.json({ success: true });
  } else {
    res.status(500).json({ error: "Database error" });
  }
});

// --- PROJECT POST CRUD ---
app.post("/api/posts", (req: Request, res: Response) => {
  const db = readDb();
  if (db) {
    const { title, categoryId, videoUrl, imageUrl, thumbnailUrl, websiteUrl, description, status } = req.body;
    const newPost = {
      id: "post-" + Date.now(),
      title: title || "Untitled Project",
      categoryId: categoryId || "",
      videoUrl: videoUrl || "",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      thumbnailUrl: thumbnailUrl || imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      websiteUrl: websiteUrl || "",
      description: description || "<p>Detailed description of our beautiful agency outcome.</p>",
      status: status || "publish",
      createdAt: new Date().toISOString()
    };
    db.posts.unshift(newPost);
    writeDb(db);
    logActivity(`Added new portfolio project post: "${newPost.title}" [status: ${newPost.status}]`);
    res.status(201).json(newPost);
  } else {
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/api/posts/:id", (req: Request, res: Response) => {
  const db = readDb();
  if (db) {
    const index = db.posts.findIndex((p: any) => p.id === req.params.id);
    if (index !== -1) {
      const { title, categoryId, videoUrl, imageUrl, thumbnailUrl, websiteUrl, description, status } = req.body;
      db.posts[index] = {
        ...db.posts[index],
        title: title !== undefined ? title : db.posts[index].title,
        categoryId: categoryId !== undefined ? categoryId : db.posts[index].categoryId,
        videoUrl: videoUrl !== undefined ? videoUrl : db.posts[index].videoUrl,
        imageUrl: imageUrl !== undefined ? imageUrl : db.posts[index].imageUrl,
        thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : db.posts[index].thumbnailUrl,
        websiteUrl: websiteUrl !== undefined ? websiteUrl : db.posts[index].websiteUrl,
        description: description !== undefined ? description : db.posts[index].description,
        status: status !== undefined ? status : db.posts[index].status
      };
      writeDb(db);
      logActivity(`Edited portfolio project specifications for: "${db.posts[index].title}"`);
      res.json(db.posts[index]);
    } else {
      res.status(404).json({ error: "Post item not found" });
    }
  } else {
    res.status(500).json({ error: "Database write failure" });
  }
});

app.delete("/api/posts/:id", (req: Request, res: Response) => {
  const db = readDb();
  if (db) {
    const post = db.posts.find((p: any) => p.id === req.params.id);
    db.posts = db.posts.filter((p: any) => p.id !== req.params.id);
    writeDb(db);
    if (post) {
      logActivity(`Removed dynamic portfolio project card: "${post.title}"`);
    }
    res.json({ success: true });
  } else {
    res.status(500).json({ error: "Database deletion failure" });
  }
});

// --- CONTACT SUBMISSIONS AND EMAIL SEND SIMULATION ---
app.post("/api/contacts", (req: Request, res: Response) => {
  const { name, email, whatsapp, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Incomplete validation query. Name, Email and Message are mandatory parameters." });
  }

  const db = readDb();
  if (db) {
    const newSubmission = {
      id: "msg-" + Date.now(),
      name,
      email,
      whatsapp: whatsapp || "N/A",
      message,
      createdAt: new Date().toISOString()
    };
    db.contacts.unshift(newSubmission);
    writeDb(db);

    // Dynamic Simulation output representing the actual SMTP Mail relay to info@webro.my
    console.log(`
      ===============================================
      📧 OUTBOUND EMAIL TRANSMISSION SIMULATION
      ===============================================
      To: info@webro.my
      Cc: sureshksmy@gmail.com
      Subject: [Webro Agency Contact Form] Submission from ${name}
      -----------------------------------------------
      Brand Source : Webro Digital (webro.my)
      Client Name  : ${name}
      Client Email : ${email}
      WhatsApp No  : ${whatsapp || 'Not provided'}
      Timestamp    : ${newSubmission.createdAt}
      
      Message Details:
      "${message}"
      
      -----------------------------------------------
      SMTP Relay Status: 250 OK Message accepted for delivery.
      ===============================================
    `);

    logActivity(`Submitted inbound client inquiry from: "${name}" (${email})`);
    res.json({ success: true, message: "Your message has been received successfully! Simulated SMTP notification dispatched upstream." });
  } else {
    res.status(500).json({ error: "Contacts registration error" });
  }
});

// Vite Developer / Production integration layers
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development server proxy for Vite
    console.log("Configuring development environment proxy with Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Host production compiled static builds
    console.log("Configuring production environment asset routes...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Webro Digital Full-Stack platform active on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Critical crash in Webro system bootstrap:", err);
});
