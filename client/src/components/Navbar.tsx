import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 transition-shadow duration-300 ${scrolled ? "shadow-sm" : ""}`}>
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-display font-bold text-primary">
          AK<span className="text-secondary">.</span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 font-medium">
          <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
          <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
          <li><a href="#skills" className="hover:text-primary transition-colors">Skills</a></li>
          <li><a href="#projects" className="hover:text-primary transition-colors">Projects</a></li>
          <li><a href="#experience" className="hover:text-primary transition-colors">Experience</a></li>
          <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
          <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
          {isAdmin && (
            <li>
              <Link href="/admin" className="flex items-center text-primary font-medium">
                <LayoutDashboard className="w-4 h-4 mr-1" />
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Resume Button */}
        <div className="hidden md:flex items-center gap-2">
          {isAdmin && (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          )}
          <a 
            href="/Akshay Kamble Resume.pdf" 
            download="Akshay_Kamble_Resume.pdf"
            className="px-5 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Resume
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div 
          className={`md:hidden hamburger cursor-pointer ${mobileMenuOpen ? 'menu-open' : ''}`} 
          onClick={toggleMobileMenu}
        >
          <div className="hamburger-top w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300"></div>
          <div className="hamburger-middle w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300"></div>
          <div className="hamburger-bottom w-6 h-0.5 bg-gray-800 transition-all duration-300"></div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div id="mobile-menu" className={`md:hidden bg-white py-4 px-4 shadow-md ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <ul className="space-y-4 font-medium">
          <li><a href="#home" onClick={closeMobileMenu} className="block py-2 hover:text-primary transition-colors">Home</a></li>
          <li><a href="#about" onClick={closeMobileMenu} className="block py-2 hover:text-primary transition-colors">About</a></li>
          <li><a href="#skills" onClick={closeMobileMenu} className="block py-2 hover:text-primary transition-colors">Skills</a></li>
          <li><a href="#projects" onClick={closeMobileMenu} className="block py-2 hover:text-primary transition-colors">Projects</a></li>
          <li><a href="#experience" onClick={closeMobileMenu} className="block py-2 hover:text-primary transition-colors">Experience</a></li>
          <li><a href="#contact" onClick={closeMobileMenu} className="block py-2 hover:text-primary transition-colors">Contact</a></li>
          <li>
            <Link href="/blog" onClick={closeMobileMenu} className="block py-2 hover:text-primary transition-colors">
              Blog
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link 
                href="/admin" 
                onClick={closeMobileMenu} 
                className="flex items-center py-2 text-primary font-semibold"
              >
                <LayoutDashboard className="w-4 h-4 mr-1" />
                Admin Dashboard
              </Link>
            </li>
          )}
          <li>
            <a 
              href="/Akshay Kamble Resume.pdf"
              download="Akshay_Kamble_Resume.pdf"
              onClick={closeMobileMenu} 
              className="block py-2 text-primary font-semibold"
            >
              Download Resume
            </a>
          </li>
        </ul>
      </div>

      {/* Adding styles directly in CSS classes instead of style jsx */}
    </header>
  );
}
