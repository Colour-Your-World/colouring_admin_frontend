import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import logo from '../assets/logo.svg'

function Home() {
  const user = {
    name: 'Emma Watson',
    email: 'emma08@example.com'
  };

  return (
    <Layout user={user}>
      <div className="min-h-screen bg-primary flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="h-20" />
        </div>

        {/* Welcome Text */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Coloring App
          </h1>
          <p className="text-white/90 text-lg">
            Start your creative journey with our amazing coloring books
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-white text-[#048B50] font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Login
          </Link>
          
          <button className="block w-full border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-[#048B50] transition-colors">
            Sign Up
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-white/80 text-sm">
          <p>Join thousands of users creating beautiful artwork</p>
        </div>
      </div>
      </div>
    </Layout>
  )
}

export default Home
