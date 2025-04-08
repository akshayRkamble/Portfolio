import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactMessageSchema,
  insertProjectSchema,
  insertExperienceSchema,
  insertSkillSchema,
  insertCertificationSchema,
  insertAchievementSchema,
  insertHobbySchema,
  insertAboutInfoSchema,
  insertSocialLinkSchema,
  insertBlogPostSchema
} from "@shared/schema";
import { setupAuth } from "./auth";
import { upload, saveUploadToDatabase, deleteUploadFile } from "./upload";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication and get middleware
  const { isAuthenticated, isAdmin } = await setupAuth(app);

  // Public API routes
  
  // Contact Form Submission
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const contactMessage = await storage.createContactMessage(validatedData);

      res.status(201).json({ 
        success: true, 
        message: "Contact message received successfully",
        data: contactMessage
      });
    } catch (error) {
      let errorMessage = "Failed to process your message";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ 
        success: false, 
        message: errorMessage 
      });
    }
  });

  // Content API routes
  
  // Projects
  app.get("/api/projects", async (_req: Request, res: Response) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching projects" });
    }
  });

  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const project = await storage.getProject(Number(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Error fetching project" });
    }
  });

  // Experiences
  app.get("/api/experiences", async (_req: Request, res: Response) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ message: "Error fetching experiences" });
    }
  });

  // Skills
  app.get("/api/skills", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const skills = category 
        ? await storage.getSkillsByCategory(category)
        : await storage.getSkills();
      
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Error fetching skills" });
    }
  });

  // Certifications
  app.get("/api/certifications", async (_req: Request, res: Response) => {
    try {
      const certifications = await storage.getCertifications();
      res.json(certifications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching certifications" });
    }
  });
  
  // Achievements
  app.get("/api/achievements", async (_req: Request, res: Response) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Error fetching achievements" });
    }
  });
  
  // Hobbies
  app.get("/api/hobbies", async (_req: Request, res: Response) => {
    try {
      const hobbies = await storage.getHobbies();
      res.json(hobbies);
    } catch (error) {
      res.status(500).json({ message: "Error fetching hobbies" });
    }
  });
  
  // About Info
  app.get("/api/about", async (_req: Request, res: Response) => {
    try {
      const aboutInfo = await storage.getAboutInfo();
      if (!aboutInfo) {
        return res.status(404).json({ message: "About info not found" });
      }
      res.json(aboutInfo);
    } catch (error) {
      res.status(500).json({ message: "Error fetching about info" });
    }
  });
  
  // Social Links
  app.get("/api/social-links", async (_req: Request, res: Response) => {
    try {
      const socialLinks = await storage.getSocialLinks();
      res.json(socialLinks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching social links" });
    }
  });
  
  // Blog posts
  app.get("/api/blog", async (req: Request, res: Response) => {
    try {
      const publishedOnly = req.query.published === "true";
      const posts = publishedOnly 
        ? await storage.getPublishedBlogPosts()
        : await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });
  
  app.get("/api/blog/:slug", async (req: Request, res: Response) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });
  
  // Serve the PDF resume file
  app.get("/Akshay Kamble Resume.pdf", (_req, res) => {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Akshay_Kamble_Resume.pdf");
    res.sendFile("attached_assets/Akshay Kamble Resume.pdf", { root: "." });
  });

  
  // ===== ADMIN ROUTES =====
  
  // File Upload
  app.post("/api/admin/upload", isAuthenticated, upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const userId = req.user?.id;
      const uploadRecord = await saveUploadToDatabase(req.file, userId);
      
      res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        data: uploadRecord
      });
    } catch (error) {
      let errorMessage = "Failed to upload file";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  });
  
  app.get("/api/admin/uploads", isAdmin, async (_req: Request, res: Response) => {
    try {
      const uploads = await storage.getUploads();
      res.json(uploads);
    } catch (error) {
      res.status(500).json({ message: "Error fetching uploads" });
    }
  });
  
  app.delete("/api/admin/uploads/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await deleteUploadFile(Number(req.params.id));
      res.json({ message: "Upload deleted successfully" });
    } catch (error) {
      let errorMessage = "Failed to delete upload";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(500).json({ message: errorMessage });
    }
  });
  
  // Contact Messages Management
  app.get("/api/admin/messages", isAdmin, async (_req: Request, res: Response) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  });
  
  app.put("/api/admin/messages/:id/read", isAdmin, async (req: Request, res: Response) => {
    try {
      const message = await storage.markContactMessageAsRead(Number(req.params.id));
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Error updating message" });
    }
  });
  
  app.put("/api/admin/messages/:id/archive", isAdmin, async (req: Request, res: Response) => {
    try {
      const message = await storage.archiveContactMessage(Number(req.params.id));
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Error archiving message" });
    }
  });
  
  app.delete("/api/admin/messages/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteContactMessage(Number(req.params.id));
      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting message" });
    }
  });
  
  // Projects Management
  app.post("/api/admin/projects", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      let errorMessage = "Failed to create project";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.put("/api/admin/projects/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const project = await storage.updateProject(Number(req.params.id), req.body);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      let errorMessage = "Failed to update project";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.delete("/api/admin/projects/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteProject(Number(req.params.id));
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting project" });
    }
  });
  
  // Experiences Management
  app.post("/api/admin/experiences", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertExperienceSchema.parse(req.body);
      const experience = await storage.createExperience(validatedData);
      res.status(201).json(experience);
    } catch (error) {
      let errorMessage = "Failed to create experience";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.put("/api/admin/experiences/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const experience = await storage.updateExperience(Number(req.params.id), req.body);
      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }
      res.json(experience);
    } catch (error) {
      let errorMessage = "Failed to update experience";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.delete("/api/admin/experiences/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteExperience(Number(req.params.id));
      res.json({ message: "Experience deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting experience" });
    }
  });
  
  // Skills Management
  app.post("/api/admin/skills", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      res.status(201).json(skill);
    } catch (error) {
      let errorMessage = "Failed to create skill";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.put("/api/admin/skills/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const skill = await storage.updateSkill(Number(req.params.id), req.body);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      res.json(skill);
    } catch (error) {
      let errorMessage = "Failed to update skill";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.delete("/api/admin/skills/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteSkill(Number(req.params.id));
      res.json({ message: "Skill deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting skill" });
    }
  });
  
  // Certifications Management
  app.post("/api/admin/certifications", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertCertificationSchema.parse(req.body);
      const certification = await storage.createCertification(validatedData);
      res.status(201).json(certification);
    } catch (error) {
      let errorMessage = "Failed to create certification";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.put("/api/admin/certifications/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const certification = await storage.updateCertification(Number(req.params.id), req.body);
      if (!certification) {
        return res.status(404).json({ message: "Certification not found" });
      }
      res.json(certification);
    } catch (error) {
      let errorMessage = "Failed to update certification";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.delete("/api/admin/certifications/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteCertification(Number(req.params.id));
      res.json({ message: "Certification deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting certification" });
    }
  });
  
  // Achievements Management
  app.post("/api/admin/achievements", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(validatedData);
      res.status(201).json(achievement);
    } catch (error) {
      let errorMessage = "Failed to create achievement";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.put("/api/admin/achievements/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const achievement = await storage.updateAchievement(Number(req.params.id), req.body);
      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }
      res.json(achievement);
    } catch (error) {
      let errorMessage = "Failed to update achievement";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.delete("/api/admin/achievements/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteAchievement(Number(req.params.id));
      res.json({ message: "Achievement deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting achievement" });
    }
  });
  
  // Hobbies Management
  app.post("/api/admin/hobbies", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertHobbySchema.parse(req.body);
      const hobby = await storage.createHobby(validatedData);
      res.status(201).json(hobby);
    } catch (error) {
      let errorMessage = "Failed to create hobby";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.put("/api/admin/hobbies/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const hobby = await storage.updateHobby(Number(req.params.id), req.body);
      if (!hobby) {
        return res.status(404).json({ message: "Hobby not found" });
      }
      res.json(hobby);
    } catch (error) {
      let errorMessage = "Failed to update hobby";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.delete("/api/admin/hobbies/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteHobby(Number(req.params.id));
      res.json({ message: "Hobby deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting hobby" });
    }
  });
  
  // About Info Management
  app.post("/api/admin/about", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertAboutInfoSchema.parse(req.body);
      const aboutInfo = await storage.createOrUpdateAboutInfo(validatedData);
      res.status(201).json(aboutInfo);
    } catch (error) {
      let errorMessage = "Failed to update about info";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  // Social Links Management
  app.post("/api/admin/social-links", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertSocialLinkSchema.parse(req.body);
      const socialLink = await storage.createSocialLink(validatedData);
      res.status(201).json(socialLink);
    } catch (error) {
      let errorMessage = "Failed to create social link";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.put("/api/admin/social-links/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const socialLink = await storage.updateSocialLink(Number(req.params.id), req.body);
      if (!socialLink) {
        return res.status(404).json({ message: "Social link not found" });
      }
      res.json(socialLink);
    } catch (error) {
      let errorMessage = "Failed to update social link";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.delete("/api/admin/social-links/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteSocialLink(Number(req.params.id));
      res.json({ message: "Social link deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting social link" });
    }
  });
  
  // Blog Posts Management
  app.post("/api/admin/blog", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const blogPost = await storage.createBlogPost(validatedData);
      res.status(201).json(blogPost);
    } catch (error) {
      let errorMessage = "Failed to create blog post";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.put("/api/admin/blog/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const blogPost = await storage.updateBlogPost(Number(req.params.id), req.body);
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(blogPost);
    } catch (error) {
      let errorMessage = "Failed to update blog post";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(400).json({ message: errorMessage });
    }
  });
  
  app.delete("/api/admin/blog/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteBlogPost(Number(req.params.id));
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting blog post" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
