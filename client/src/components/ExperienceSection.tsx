import { FaChevronRight } from "react-icons/fa";

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20 px-4 bg-gray-50 section-fade">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Work Experience</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
              <div>
                <h3 className="text-xl font-display font-semibold">Software Developer Intern</h3>
                <p className="text-primary font-medium">Numetry Technologies</p>
              </div>
              <p className="text-gray-600 mt-2 md:mt-0">January 2024 - July 2024</p>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex">
                <FaChevronRight className="text-primary mt-1.5 mr-3 text-xs" />
                <p>Designed, developed, and deployed responsive web applications using React.js and HTML, increasing user engagement by 30% through enhanced interactive features and a mobile-first design approach.</p>
              </li>
              <li className="flex">
                <FaChevronRight className="text-primary mt-1.5 mr-3 text-xs" />
                <p>Developed and deployed responsive web applications using React.js and HTML, leading to a 30% increase in user engagement and reducing bounce rates by 15%.</p>
              </li>
              <li className="flex">
                <FaChevronRight className="text-primary mt-1.5 mr-3 text-xs" />
                <p>Conducted 50+ test cases for cross-browser testing, ensuring 95% usability across mobile and desktop devices, reducing bug reports by 40%.</p>
              </li>
              <li className="flex">
                <FaChevronRight className="text-primary mt-1.5 mr-3 text-xs" />
                <p>Collaborated effectively with a team of developers, adhering to Agile methodologies to deliver projects on time.</p>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">React.js</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">HTML/CSS</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Responsive Design</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Cross-browser Testing</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Agile Methodology</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
