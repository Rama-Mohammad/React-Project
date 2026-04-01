import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCheck } from "@fortawesome/free-solid-svg-icons";

const CTASection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <div className="inline-block bg-blue-50 rounded-full px-5 py-2 text-blue-600 text-sm font-medium mb-6">
              Free to join — start with 5 credits
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to start 
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">exchanging skills?</span>
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              Join 8,500+ peers already helping each other. Every new member gets 5 starter credits — enough to book your first session.
            </p>
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Get started today
              </h2>
              <p className="text-gray-600 mb-6">
                No credit card. No payments. Just skills.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all">
                  Browse Requests
                </button>
                <button className="border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold px-6 py-2.5 rounded-xl transition-all">
                  Post a Request
                </button>
              </div>

              <div className="mb-6">
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-2 text-sm font-medium">
                  <FontAwesomeIcon icon={faChartLine} className="text-sm" />
                  View your dashboard
                </a>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500 text-sm" />
                    <span className="text-gray-700 text-sm">5 free starter credits on sign-up</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500 text-sm" />
                    <span className="text-gray-700 text-sm">No money ever changes hands</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500 text-sm" />
                    <span className="text-gray-700 text-sm">Cancel or pause anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;