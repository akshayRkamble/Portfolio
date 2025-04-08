import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User and Auth tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email"),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // 'admin' or 'user'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImageUrl: text("featured_image_url"),
  published: boolean("published").default(false).notNull(),
  publishDate: timestamp("publish_date").defaultNow().notNull(),
  authorId: integer("author_id").references(() => users.id),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Core content tables
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  technologies: text("technologies").notNull(),
  imageUrl: text("image_url"),
  projectUrl: text("project_url"),
  githubUrl: text("github_url"),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  location: text("location"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  current: boolean("current").default(false).notNull(),
  description: text("description").notNull(),
  responsibilities: text("responsibilities").array(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g., 'frontend', 'backend', 'devops'
  proficiency: integer("proficiency").default(80).notNull(), // 0-100
  featured: boolean("featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  description: text("description"),
  credentialId: text("credential_id"),
  credentialUrl: text("credential_url"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hobbies = pgTable("hobbies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  archived: boolean("archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// About section info (singular record that can be updated)
export const aboutInfo = pgTable("about_info", {
  id: serial("id").primaryKey(),
  headline: text("headline").notNull(),
  bio: text("bio").notNull(),
  profileImageUrl: text("profile_image_url"),
  resumeUrl: text("resume_url"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Image uploads metadata
export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Social links
export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(), // e.g., 'linkedin', 'github', 'twitter'
  url: text("url").notNull(),
  displayName: text("display_name"),
  active: boolean("active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// Define insert schemas for use with forms
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  featuredImageUrl: true,
  published: true,
  publishDate: true,
  authorId: true,
  tags: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  technologies: true,
  imageUrl: true,
  projectUrl: true,
  githubUrl: true,
  featured: true,
  sortOrder: true,
});

export const insertExperienceSchema = createInsertSchema(experiences).pick({
  company: true,
  position: true,
  location: true,
  startDate: true,
  endDate: true,
  current: true,
  description: true,
  responsibilities: true,
  sortOrder: true,
});

export const insertSkillSchema = createInsertSchema(skills).pick({
  name: true,
  category: true,
  proficiency: true,
  featured: true,
  sortOrder: true,
});

export const insertCertificationSchema = createInsertSchema(certifications).pick({
  name: true,
  issuer: true,
  issueDate: true,
  expiryDate: true,
  description: true,
  credentialId: true,
  credentialUrl: true,
  imageUrl: true,
  sortOrder: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  title: true,
  description: true,
  date: true,
  imageUrl: true,
  sortOrder: true,
});

export const insertHobbySchema = createInsertSchema(hobbies).pick({
  name: true,
  description: true,
  imageUrl: true,
  sortOrder: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export const insertAboutInfoSchema = createInsertSchema(aboutInfo).pick({
  headline: true,
  bio: true,
  profileImageUrl: true,
  resumeUrl: true,
});

export const insertUploadSchema = createInsertSchema(uploads).pick({
  filename: true,
  originalName: true,
  mimeType: true,
  size: true,
  url: true,
  uploadedBy: true,
});

export const insertSocialLinkSchema = createInsertSchema(socialLinks).pick({
  platform: true,
  url: true,
  displayName: true,
  active: true,
  sortOrder: true,
});

// Export types for use in application
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type Hobby = typeof hobbies.$inferSelect;
export type InsertHobby = z.infer<typeof insertHobbySchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type AboutInfo = typeof aboutInfo.$inferSelect;
export type InsertAboutInfo = z.infer<typeof insertAboutInfoSchema>;

export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;

export type SocialLink = typeof socialLinks.$inferSelect;
export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
