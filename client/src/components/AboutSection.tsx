export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-white section-fade">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">About Me</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-display font-semibold mb-4">My Journey</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              I'm a passionate software developer with a focus on creating responsive and user-friendly web applications. 
              My journey in tech started with my diploma studies and continued through my Bachelor's degree in Computer Engineering, 
              where I've honed my skills in various programming languages and frameworks.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              During my internship at Numetry Technologies, I gained valuable hands-on experience in developing and deploying 
              web applications using React.js, which significantly improved my understanding of modern web development practices.
            </p>
            <p className="text-gray-700 leading-relaxed">
              I'm constantly learning and exploring new technologies to stay current in this ever-evolving field. 
              My goal is to create innovative solutions that make a positive impact.
            </p>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-display font-semibold text-xl mb-4 text-primary">Education</h4>
              <ul className="space-y-4">
                <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-primary before:rounded-full">
                  <p className="font-medium">Bachelor of Technology in Computer Engineering</p>
                  <p className="text-gray-600">Ashokrao Mane Group of Institutions</p>
                  <p className="text-gray-500 text-sm">Dec 2021 - July 2024 • CGPA: 7.17</p>
                </li>
                <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-primary before:rounded-full">
                  <p className="font-medium">Diploma in Computer Engineering</p>
                  <p className="text-gray-600">Yashwantrao Chavan Polytechnic</p>
                  <p className="text-gray-500 text-sm">July 2017 – Aug 2021 • Percentage: 78.11</p>
                </li>
                <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-primary before:rounded-full">
                  <p className="font-medium">Secondary (Class X)</p>
                  <p className="text-gray-600">Khotwadi High School</p>
                  <p className="text-gray-500 text-sm">March 2017 • Percentage: 83.40</p>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
              <h4 className="font-display font-semibold text-xl mb-4 text-primary">Coursework</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white text-sm rounded-full text-gray-700">Data Structures & Algorithms</span>
                <span className="px-3 py-1 bg-white text-sm rounded-full text-gray-700">Operating Systems</span>
                <span className="px-3 py-1 bg-white text-sm rounded-full text-gray-700">Database Management</span>
                <span className="px-3 py-1 bg-white text-sm rounded-full text-gray-700">Software Engineering</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
