import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import logo from '../assets/logo.svg';
import loginText from '../assets/loginText.svg';
import clip1 from '../assets/clip1.svg';
import clip2 from '../assets/clip2.svg';
import clip3 from '../assets/clip3.svg';
import loginBG from '../assets/loginBG.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted:', { email, password });
  };

  return (
    <Layout showHeader={false}>
      <div className="h-screen flex flex-col md:flex-row bg-[#FBFFF5] overflow-hidden py-4 px-4">
      {/* Left Side - Decorative */}
      <div 
        className="hidden md:flex md:w-1/2 lg:w-1/2 relative overflow-hidden rounded-2xl"
        style={{
          backgroundImage: `url(${loginBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        
          {/* Decorative Content */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full space-y-4 overflow-hidden">
          {/* Login Text SVG vertically */}
          <div className="absolute left-[9%] xl:left-[27%] top-1/2 -translate-y-1/2 origin-center">
            <img 
              src={loginText} 
              alt="Let's get into it" 
              className="h-auto w-auto"
            />
          </div>
          
          {/* Clip Images */}
          <div className="flex flex-col items-center justify-center space-y-1 ml-20 overflow-hidden h-full">
            <img src={clip1} alt="Farm illustration" className="w-48 lg:w-74 h-auto drop-shadow-lg" />
            <img src={clip2} alt="Coloring book" className="w-48 lg:w-74 h-auto drop-shadow-lg" />
            <img src={clip3} alt="Dot the numbers" className="w-48 lg:w-74 h-auto drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="h-16 md:h-20" />
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              Welcome back!
            </h2>
            <p className="text-[#595959] text-sm md:text-base">
              Enter your email and password to get back into app
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <Input
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />

            {/* Password Input */}
            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              showPasswordToggle={true}
              required
            />

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
            >
              Login
            </Button>
          </form>
        </div>
      </div>
      </div>
    </Layout>
  );
}

export default Login;

