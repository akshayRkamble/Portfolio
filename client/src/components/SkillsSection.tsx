import { FaCode, FaLaptopCode, FaLayerGroup, FaDatabase } from "react-icons/fa";

export default function SkillsSection() {
  return (
    <section id="skills" className="py-20 px-4 bg-gray-50 section-fade">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">My Skills</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Here are the technologies and tools I work with to build efficient and user-friendly applications.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Programming Languages */}
          <div className="skill-card bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
              <FaCode className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Programming Languages</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">C++</span>
                  <span className="text-gray-500 text-sm">Advanced</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "90%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">Python</span>
                  <span className="text-gray-500 text-sm">Intermediate</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">JavaScript</span>
                  <span className="text-gray-500 text-sm">Intermediate</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Frontend Technologies */}
          <div className="skill-card bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
              <FaLaptopCode className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Frontend Technologies</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">HTML/CSS</span>
                  <span className="text-gray-500 text-sm">Advanced</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "90%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">Bootstrap</span>
                  <span className="text-gray-500 text-sm">Intermediate</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">Tailwind CSS</span>
                  <span className="text-gray-500 text-sm">Intermediate</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Frameworks */}
          <div className="skill-card bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
              <FaLayerGroup className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Frameworks</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">React.js</span>
                  <span className="text-gray-500 text-sm">Intermediate</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">Django</span>
                  <span className="text-gray-500 text-sm">Intermediate</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">Node.js</span>
                  <span className="text-gray-500 text-sm">Basic</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Database/Cloud */}
          <div className="skill-card bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
              <FaDatabase className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Database/Cloud</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">SQL</span>
                  <span className="text-gray-500 text-sm">Intermediate</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">AWS</span>
                  <span className="text-gray-500 text-sm">Basic</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">Git/GitHub</span>
                  <span className="text-gray-500 text-sm">Intermediate</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Soft Skills */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-display font-semibold mb-4">Soft Skills</h3>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-medium">Critical Thinking</span>
            <span className="px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-medium">Data-Driven Decision Making</span>
            <span className="px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-medium">Project Ownership</span>
            <span className="px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-medium">Team Collaboration</span>
            <span className="px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-medium">Problem Solving</span>
            <span className="px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-medium">Adaptability</span>
            <span className="px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-medium">Time Management</span>
          </div>
        </div>
      </div>
    </section>
  );
}
