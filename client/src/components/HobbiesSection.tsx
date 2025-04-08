import { FaChess, FaRoute, FaMusic } from "react-icons/fa";
import { GiCricketBat } from "react-icons/gi";

export default function HobbiesSection() {
  return (
    <section id="hobbies" className="py-20 px-4 bg-white section-fade">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Hobbies & Interests</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">When I'm not coding, here's what I enjoy doing.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaChess className="text-primary text-2xl" />
            </div>
            <h3 className="font-display font-semibold">Chess</h3>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaRoute className="text-primary text-2xl" />
            </div>
            <h3 className="font-display font-semibold">Traveling</h3>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GiCricketBat className="text-primary text-2xl" />
            </div>
            <h3 className="font-display font-semibold">Cricket</h3>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMusic className="text-primary text-2xl" />
            </div>
            <h3 className="font-display font-semibold">Music</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
