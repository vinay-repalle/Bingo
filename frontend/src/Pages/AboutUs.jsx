import React from 'react';
import { useTheme } from '../App';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import devPhoto from '../assets/developer.png';

function AboutUs() {
  const { isDarkMode } = useTheme();
  
  return (
    <>
      <Navbar />
      <div className={isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}>
        {/* About the Game Section */}
        <section className={`py-20 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' 
            : 'bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-50'
        }`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                About <span className={`${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}>BingoV</span>
              </h1>
              <p className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Experience the classic game of Bingo reimagined for the digital age with stunning graphics, 
                smooth animations, and exciting multiplayer features.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className={`rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className={`text-xl font-bold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Classic Gameplay</h3>
                <p className={`leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Enjoy the traditional Bingo experience with our beautifully designed 5x5 grid. 
                  Mark your numbers and shout "BINGO!" when you complete a line.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className={`rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <div className="text-4xl mb-4">🌐</div>
                <h3 className={`text-xl font-bold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Online Multiplayer</h3>
                <p className={`leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Connect with friends and family from anywhere in the world. 
                  Create private rooms or join public games with players worldwide.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className={`rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <div className="text-4xl mb-4">🏆</div>
                <h3 className={`text-xl font-bold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Achievements & Rewards</h3>
                <p className={`leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Earn points, unlock achievements, and climb the leaderboard. 
                  Special rewards await the most skilled Bingo players!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section className={`py-20 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
        }`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                About <span className={`${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}>Me</span>
              </h2>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-shrink-0">
                <img
                  src={devPhoto}
                  alt="Vinay Kumar - Developer"
                  className="w-48 h-48 rounded-full object-cover border-4 border-blue-500 shadow-2xl"
                />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl font-bold mb-4">Vinay Repalle</h3>
                <h4 className="text-xl font-semibold mb-6 text-blue-500">Full Stack Developer</h4>
                <div className="space-y-4">
                  <p className={`text-lg leading-relaxed ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Hi! I'm Vinay, the creator of BingoV. I love building fun, interactive web apps that bring people together. 
                    My passion for coding and games inspired me to create this modern Bingo experience for everyone to enjoy.
                  </p>
                  <p className={`text-lg leading-relaxed ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    This project was built using the MERN stack (MongoDB, Express, React, Node.js) and showcases my skills in 
                    full stack development, real-time features, and UI/UX design.
                  </p>
                  <p className={`text-lg leading-relaxed ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    My motivation was to create a game that not only entertains but also connects people. BingoV is designed to be 
                    accessible, social, and rewarding, with a focus on user experience and modern web technologies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className={`py-20 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' 
            : 'bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-50'
        }`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Get in <span className={`${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}>Touch</span>
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Feel free to reach out for collaborations, questions, or just to say hello!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">📧</div>
                  <h3 className={`text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Email</h3>
                </div>
                <p className={`text-lg mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  bingovman@gmail.com
                </p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Available for freelance work and collaborations
                </p>
              </div>
              
              <div className={`rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">📱</div>
                  <h3 className={`text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Phone</h3>
                </div>
                <p className={`text-lg mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  +91 9381281464
                </p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Available Mon-Fri, 9 AM - 6 PM IST
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
}

export default AboutUs;
