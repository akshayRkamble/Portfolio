import { 
  users, 
  type User, 
  type InsertUser, 
  contactMessages, 
  type ContactMessage, 
  type InsertContactMessage,
  projects,
  type Project,
  type InsertProject,
  experiences,
  type Experience,
  type InsertExperience,
  skills,
  type Skill,
  type InsertSkill,
  certifications,
  type Certification,
  type InsertCertification,
  achievements,
  type Achievement,
  type InsertAchievement,
  hobbies,
  type Hobby,
  type InsertHobby,
  aboutInfo,
  type AboutInfo,
  type InsertAboutInfo,
  uploads,
  type Upload,
  type InsertUpload,
  socialLinks,
  type SocialLink,
  type InsertSocialLink,
  blogPosts,
  type BlogPost,
  type InsertBlogPost
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, lte } from "drizzle-orm";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";

const PostgresStore = connectPgSimple(session);

// Enhanced storage interface with all CRUD operations needed for the portfolio
export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
  archiveContactMessage(id: number): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: number): Promise<void>;
  
  // Projects management
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<void>;
  
  // Experiences management
  getExperiences(): Promise<Experience[]>;
  getExperience(id: number): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: number): Promise<void>;
  
  // Skills management
  getSkills(): Promise<Skill[]>;
  getSkillsByCategory(category: string): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<void>;
  
  // Certifications management
  getCertifications(): Promise<Certification[]>;
  getCertification(id: number): Promise<Certification | undefined>;
  createCertification(certification: InsertCertification): Promise<Certification>;
  updateCertification(id: number, certification: Partial<InsertCertification>): Promise<Certification | undefined>;
  deleteCertification(id: number): Promise<void>;
  
  // Achievements management
  getAchievements(): Promise<Achievement[]>;
  getAchievement(id: number): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: number, achievement: Partial<InsertAchievement>): Promise<Achievement | undefined>;
  deleteAchievement(id: number): Promise<void>;
  
  // Hobbies management
  getHobbies(): Promise<Hobby[]>;
  getHobby(id: number): Promise<Hobby | undefined>;
  createHobby(hobby: InsertHobby): Promise<Hobby>;
  updateHobby(id: number, hobby: Partial<InsertHobby>): Promise<Hobby | undefined>;
  deleteHobby(id: number): Promise<void>;
  
  // About information
  getAboutInfo(): Promise<AboutInfo | undefined>;
  createOrUpdateAboutInfo(info: InsertAboutInfo): Promise<AboutInfo>;
  
  // File uploads
  createUpload(upload: InsertUpload): Promise<Upload>;
  getUploads(): Promise<Upload[]>;
  getUpload(id: number): Promise<Upload | undefined>;
  deleteUpload(id: number): Promise<void>;
  
  // Blog posts
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Social links
  getSocialLinks(): Promise<SocialLink[]>;
  getSocialLink(id: number): Promise<SocialLink | undefined>;
  createSocialLink(link: InsertSocialLink): Promise<SocialLink>;
  updateSocialLink(id: number, link: Partial<InsertSocialLink>): Promise<SocialLink | undefined>;
  deleteSocialLink(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Initialize session store with Postgres
    this.sessionStore = new PostgresStore({
      pool,
      tableName: 'session', // Default is "session"
      createTableIfMissing: true,
    });
  }

  // User Management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Contact Message Management
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message;
  }

  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db
      .update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return message;
  }

  async archiveContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db
      .update(contactMessages)
      .set({ archived: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return message;
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  // Project Management
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(asc(projects.sortOrder));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Experience Management
  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences).orderBy(asc(experiences.sortOrder));
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    const [experience] = await db.select().from(experiences).where(eq(experiences.id, id));
    return experience;
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const [newExperience] = await db.insert(experiences).values(experience).returning();
    return newExperience;
  }

  async updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience | undefined> {
    const [updatedExperience] = await db
      .update(experiences)
      .set(experience)
      .where(eq(experiences.id, id))
      .returning();
    return updatedExperience;
  }

  async deleteExperience(id: number): Promise<void> {
    await db.delete(experiences).where(eq(experiences.id, id));
  }

  // Skills Management
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(asc(skills.sortOrder));
  }

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    return await db
      .select()
      .from(skills)
      .where(eq(skills.category, category))
      .orderBy(asc(skills.sortOrder));
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill;
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db.insert(skills).values(skill).returning();
    return newSkill;
  }

  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const [updatedSkill] = await db
      .update(skills)
      .set(skill)
      .where(eq(skills.id, id))
      .returning();
    return updatedSkill;
  }

  async deleteSkill(id: number): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  // Certifications Management
  async getCertifications(): Promise<Certification[]> {
    return await db.select().from(certifications).orderBy(asc(certifications.sortOrder));
  }

  async getCertification(id: number): Promise<Certification | undefined> {
    const [certification] = await db.select().from(certifications).where(eq(certifications.id, id));
    return certification;
  }

  async createCertification(certification: InsertCertification): Promise<Certification> {
    const [newCertification] = await db.insert(certifications).values(certification).returning();
    return newCertification;
  }

  async updateCertification(id: number, certification: Partial<InsertCertification>): Promise<Certification | undefined> {
    const [updatedCertification] = await db
      .update(certifications)
      .set(certification)
      .where(eq(certifications.id, id))
      .returning();
    return updatedCertification;
  }

  async deleteCertification(id: number): Promise<void> {
    await db.delete(certifications).where(eq(certifications.id, id));
  }

  // Achievements Management
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).orderBy(asc(achievements.sortOrder));
  }

  async getAchievement(id: number): Promise<Achievement | undefined> {
    const [achievement] = await db.select().from(achievements).where(eq(achievements.id, id));
    return achievement;
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values(achievement).returning();
    return newAchievement;
  }

  async updateAchievement(id: number, achievement: Partial<InsertAchievement>): Promise<Achievement | undefined> {
    const [updatedAchievement] = await db
      .update(achievements)
      .set(achievement)
      .where(eq(achievements.id, id))
      .returning();
    return updatedAchievement;
  }

  async deleteAchievement(id: number): Promise<void> {
    await db.delete(achievements).where(eq(achievements.id, id));
  }

  // Hobbies Management
  async getHobbies(): Promise<Hobby[]> {
    return await db.select().from(hobbies).orderBy(asc(hobbies.sortOrder));
  }

  async getHobby(id: number): Promise<Hobby | undefined> {
    const [hobby] = await db.select().from(hobbies).where(eq(hobbies.id, id));
    return hobby;
  }

  async createHobby(hobby: InsertHobby): Promise<Hobby> {
    const [newHobby] = await db.insert(hobbies).values(hobby).returning();
    return newHobby;
  }

  async updateHobby(id: number, hobby: Partial<InsertHobby>): Promise<Hobby | undefined> {
    const [updatedHobby] = await db
      .update(hobbies)
      .set(hobby)
      .where(eq(hobbies.id, id))
      .returning();
    return updatedHobby;
  }

  async deleteHobby(id: number): Promise<void> {
    await db.delete(hobbies).where(eq(hobbies.id, id));
  }

  // About Info Management
  async getAboutInfo(): Promise<AboutInfo | undefined> {
    const [info] = await db.select().from(aboutInfo);
    return info;
  }

  async createOrUpdateAboutInfo(info: InsertAboutInfo): Promise<AboutInfo> {
    const existingInfo = await this.getAboutInfo();
    
    if (existingInfo) {
      const [updatedInfo] = await db
        .update(aboutInfo)
        .set({...info, updatedAt: new Date()})
        .where(eq(aboutInfo.id, existingInfo.id))
        .returning();
      return updatedInfo;
    } else {
      const [newInfo] = await db.insert(aboutInfo).values(info).returning();
      return newInfo;
    }
  }

  // Upload Management
  async createUpload(upload: InsertUpload): Promise<Upload> {
    const [newUpload] = await db.insert(uploads).values(upload).returning();
    return newUpload;
  }

  async getUploads(): Promise<Upload[]> {
    return await db.select().from(uploads).orderBy(desc(uploads.createdAt));
  }

  async getUpload(id: number): Promise<Upload | undefined> {
    const [upload] = await db.select().from(uploads).where(eq(uploads.id, id));
    return upload;
  }

  async deleteUpload(id: number): Promise<void> {
    await db.delete(uploads).where(eq(uploads.id, id));
  }

  // Social Links Management
  async getSocialLinks(): Promise<SocialLink[]> {
    return await db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder));
  }

  async getSocialLink(id: number): Promise<SocialLink | undefined> {
    const [link] = await db.select().from(socialLinks).where(eq(socialLinks.id, id));
    return link;
  }

  async createSocialLink(link: InsertSocialLink): Promise<SocialLink> {
    const [newLink] = await db.insert(socialLinks).values(link).returning();
    return newLink;
  }

  async updateSocialLink(id: number, link: Partial<InsertSocialLink>): Promise<SocialLink | undefined> {
    const [updatedLink] = await db
      .update(socialLinks)
      .set(link)
      .where(eq(socialLinks.id, id))
      .returning();
    return updatedLink;
  }

  async deleteSocialLink(id: number): Promise<void> {
    await db.delete(socialLinks).where(eq(socialLinks.id, id));
  }

  // Blog Posts Management
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishDate));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(and(
        eq(blogPosts.published, true),
        lte(blogPosts.publishDate, new Date())
      ))
      .orderBy(desc(blogPosts.publishDate));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values({
      ...post,
      updatedAt: new Date(),
    }).returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({
        ...post,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
}

export const storage = new DatabaseStorage();
