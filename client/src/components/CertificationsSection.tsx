import { FaCode, FaCloud, FaLaptopCode } from "react-icons/fa";

export default function CertificationsSection() {
  return (
    <section id="certifications" className="py-20 px-4 bg-white section-fade">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Certifications</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Certification 1 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FaCode className="text-primary text-xl" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">Programming Foundations</h3>
            <p className="text-gray-600 text-sm">Basic To Advanced Crash Course</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">Issued by: <span className="font-medium text-gray-700">Coding Academy</span></span>
            </div>
          </div>
          
          {/* Certification 2 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FaCloud className="text-primary text-xl" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">Google Cloud Fundamentals</h3>
            <p className="text-gray-600 text-sm">Big Data & Machine Learning Foundation Development Certificate</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">Issued by: <span className="font-medium text-gray-700">Google</span></span>
            </div>
          </div>
          
          {/* Certification 3 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FaLaptopCode className="text-primary text-xl" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">Full Stack Web Development</h3>
            <p className="text-gray-600 text-sm">Introduction to Full Stack Web Development</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">Issued by: <span className="font-medium text-gray-700">Web Development Institute</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
