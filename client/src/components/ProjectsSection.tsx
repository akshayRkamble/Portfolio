import { FaUserFriends, FaSeedling, FaCheckCircle, FaArrowRight, FaCode, FaBlog, FaBrain, FaDesktop } from "react-icons/fa";

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20 px-4 bg-white section-fade">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">My Projects</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Here are some of the projects I've worked on, showcasing my skills and problem-solving abilities.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* Personal Portfolio Website */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="h-56 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
              <FaBlog className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-display font-semibold mb-2">Personal Portfolio & Blog Website</h3>
              <p className="text-gray-600 mb-4">
                A modern, responsive personal portfolio website with a dynamic content management system and blog functionality.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Full-stack React.js application with Express.js backend</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">PostgreSQL database with Drizzle ORM for data persistence</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Admin dashboard with content management for all sections</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Blog system with full CRUD functionality</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">React.js</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">Node.js</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">PostgreSQL</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">Tailwind CSS</span>
              </div>
              <a href="#" className="text-primary font-medium hover:underline inline-flex items-center">
                View Project <FaArrowRight className="ml-1 text-sm" />
              </a>
            </div>
          </div>

          {/* Mental Health Assessment Project */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="h-56 bg-gradient-to-r from-cyan-400 to-teal-500 flex items-center justify-center">
              <FaBrain className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-display font-semibold mb-2">Mental Wellness Companion</h3>
              <p className="text-gray-600 mb-4">
                A comprehensive platform for mental health assessment and a smart journaling app that uses NLP to improve mental well-being.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Daily journaling with NLP analysis of user entries</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Sentiment-aware GANs generating empathetic responses</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Motivational and calming content tailored to emotional state</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Connection to mental health professionals when needed</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-medium">Python</span>
                <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-medium">Streamlit</span>
                <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-medium">NLP</span>
                <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-medium">GANs</span>
              </div>
              <a href="https://health-journal-myapp.streamlit.app/" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline inline-flex items-center">
                View Project <FaArrowRight className="ml-1 text-sm" />
              </a>
            </div>
          </div>

          {/* Project 1 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="h-56 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
              <FaUserFriends className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-display font-semibold mb-2">Group Photo Based Attendance System</h3>
              <p className="text-gray-600 mb-4">
                An automated attendance system that uses machine learning to detect and recognize student faces from group photos.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Utilizing machine learning to detect student faces in the database</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Interface for teachers to upload and track attendance records</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Student portal to view individual attendance statistics</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Python</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Machine Learning</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">OpenCV</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Web Development</span>
              </div>
              <a href="#" className="text-primary font-medium hover:underline inline-flex items-center">
                View Project <FaArrowRight className="ml-1 text-sm" />
              </a>
            </div>
          </div>
          
          {/* Project 2 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="h-56 bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
              <FaSeedling className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-display font-semibold mb-2">Crop Recommendation System</h3>
              <p className="text-gray-600 mb-4">
                A data-driven system that recommends optimal crops based on soil composition, weather patterns, and environmental factors.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Recommends optimal crops based on soil, weather, and environmental data</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Utilizes machine learning for accurate and data-driven predictions</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Enhances productivity and promotes sustainable agriculture practices</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">Python</span>
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">Data Science</span>
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">Machine Learning</span>
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">Agriculture</span>
              </div>
              <a href="https://crop-recomendation-farm.streamlit.app/" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline inline-flex items-center">
                View Project <FaArrowRight className="ml-1 text-sm" />
              </a>
            </div>
          </div>

          {/* System Monitor Project */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="h-56 bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
              <FaDesktop className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-display font-semibold mb-2">System Monitor and Process Manager</h3>
              <p className="text-gray-600 mb-4">
                A cross-platform system resource and process manager that runs on both Windows and Linux, providing real-time monitoring and management capabilities.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Real-time monitoring of CPU, RAM, disk usage and network stats</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Process management including listing and terminating processes</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Sorting processes by resource usage for performance analysis</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">Export functionality for usage logs in CSV/JSON formats</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium">Python</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium">Streamlit</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium">System Monitoring</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium">Cross-Platform</span>
              </div>
              <a href="https://system-monitor-ak.streamlit.app/" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline inline-flex items-center">
                View Project <FaArrowRight className="ml-1 text-sm" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
