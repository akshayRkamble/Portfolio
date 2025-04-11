import { FaLinkedinIn, FaEnvelope } from "react-icons/fa";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a href="#" className="text-2xl font-display font-bold">
              AK<span className="text-primary">.</span>
            </a>
            <p className="text-gray-400 mt-2">Software Developer</p>
          </div>
          <div className="flex space-x-8 mb-6 md:mb-0">
            <a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a>
            <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
            <a href="#projects" className="text-gray-400 hover:text-white transition-colors">Projects</a>
            <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
          </div>
          <div className="flex space-x-4">
            <a 
              href="https://www.linkedin.com/in/akshay-kamble-sd/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
            >
              <FaLinkedinIn />
            </a>
            <a 
              href="mailto:akshaykamble7776@gmail.com" 
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Akshay Kamble. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
