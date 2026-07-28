function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white p-4">
      <div className="rounded-2xl bg-slate-800 p-8 shadow-2xl border border-slate-700 max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 mb-4">
          Assura Insurance
        </h1>
        <p className="text-slate-400 mb-6">
          Tailwind CSS v4 is successfully configured and working!
        </p>
        <span className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105">
          Get Started
        </span>
      </div>
    </div>
  )
}

export default App
