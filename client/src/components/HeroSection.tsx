import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section id="home" className="pt-32 pb-20 px-4 min-h-screen flex items-center bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-3/5 mb-10 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary font-semibold mb-3">Hello, I'm</p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Akshay Kamble</h1>
            <h2 className="text-2xl md:text-3xl font-display text-gray-600 mb-6">Software Developer</h2>
            <p className="text-gray-700 text-lg mb-8 max-w-xl leading-relaxed">
              Aspiring software developer with expertise in web design, full-stack development, and database management to
              contribute to innovative projects. Committed to continuous learning and problem-solving in dynamic environments.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#contact">
                <Button className="px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors font-medium">
                  Get in Touch
                </Button>
              </a>
              <a href="#projects">
                <Button variant="outline" className="px-6 py-3 border border-gray-300 rounded-md hover:border-primary hover:text-primary transition-colors font-medium">
                  View Projects
                </Button>
              </a>
            </div>
            <div className="flex space-x-5 mt-8">
              <a href="https://www.linkedin.com/in/akshay-kamble-sd/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors">
                <FaLinkedin className="text-2xl" />
              </a>
              <a href="mailto:akshaykamble7776@gmail.com" className="text-gray-600 hover:text-primary transition-colors">
                <FaEnvelope className="text-2xl" />
              </a>
              <a href="tel:+917776995166" className="text-gray-600 hover:text-primary transition-colors">
                <FaPhone className="text-2xl" />
              </a>
            </div>
          </motion.div>
          <motion.div 
            className="md:w-2/5 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden border-4 border-white shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold">
                AK
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
