import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      
      <div className="bg-white shadow-xl rounded-2xl p-6 w-96 text-center">
        
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Welcome to SkillSwap 🚀
        </h1>
        
        <p className="text-gray-600 mb-6">
          Exchange skills, earn credits, and grow together.
        </p>

        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
          Get Started
        </button>

      </div>

    </div>
  )
}

export default App