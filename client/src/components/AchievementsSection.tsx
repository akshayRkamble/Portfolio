import { FaTrophy, FaMedal, FaAward, FaUsers, FaProjectDiagram } from "react-icons/fa";

export default function AchievementsSection() {
  return (
    <section id="achievements" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 section-fade">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Achievements</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Achievement 1 */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20">
              <div className="absolute transform rotate-45 bg-primary text-white text-xs font-bold py-1 right-[-35px] top-[12px] w-[140px] text-center">
                AIR 800
              </div>
            </div>
            <div className="mb-4">
              <FaTrophy className="text-yellow-500 text-3xl" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">CN Foundation Competition</h3>
            <p className="text-gray-600 mb-2">Coding Ninjas</p>
            <p className="text-gray-700">Secured AIR 800 out of 10,000+ participants</p>
            <p className="text-gray-500 text-sm mt-2">2023</p>
          </div>
          
          {/* Achievement 2 */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20">
              <div className="absolute transform rotate-45 bg-primary text-white text-xs font-bold py-1 right-[-35px] top-[12px] w-[140px] text-center">
                AIR 5867
              </div>
            </div>
            <div className="mb-4">
              <FaMedal className="text-amber-500 text-3xl" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">Codekaze Competition</h3>
            <p className="text-gray-600 mb-2">Coding Ninjas</p>
            <p className="text-gray-700">Secured AIR 5867 among thousands of participants</p>
            <p className="text-gray-500 text-sm mt-2">2023</p>
          </div>
          
          {/* Achievement 3 */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="mb-4">
              <FaAward className="text-purple-500 text-3xl" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">Project Competition Winner</h3>
            <p className="text-gray-600 mb-2">Reflex Event</p>
            <p className="text-gray-700">Won first place in the technical project competition</p>
            <p className="text-gray-500 text-sm mt-2">2022</p>
          </div>
        </div>
        
        {/* Positions of Responsibility */}
        <div className="mt-12">
          <h3 className="text-2xl font-display font-semibold mb-6 text-center">Positions of Responsibility</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaUsers className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-semibold mb-2">Team Leader</h4>
                  <p className="text-gray-600">Cricket Team Captain at AMGOI, Vathar</p>
                  <p className="text-gray-700 mt-2">Led the college cricket team in annual sports events, managing team strategy and player coordination.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaProjectDiagram className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-semibold mb-2">Project Team Leader</h4>
                  <p className="text-gray-600">Technical Project Competitions</p>
                  <p className="text-gray-700 mt-2">Led a team of developers to create and present technical projects, overseeing development and coordination.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
