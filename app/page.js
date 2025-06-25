'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { adminLogin } from './actions/api';
import Link from 'next/link';

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEmailError('');
    setPasswordError('');

    // Validation
    if (!email) {
      setEmailError('Admin email is required');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    setLoading(true);

    try {
      console.log(email, password)
      // Use the adminLogin API function
      const { data, error } = await adminLogin({ email, password });

      if (error || !data) {
        throw new Error(error || 'Invalid admin credentials');
      }

      // Store admin data in localStorage
      if (data.token && data.admin) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        console.log('Admin authentication successful');

        // Redirect to admin dashboard
        router.push("/admin/agents");
      } else {
        throw new Error('Authentication data missing');
      }

    } catch (err) {
      console.error("Admin login error:", err);

      // Clear any partial auth state on failure
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');

      setError(
        err.message === 'Failed to fetch'
          ? 'Network error. Please check your connection.'
          : err.message || 'Invalid admin credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex h-screen overflow-hidden bg-white'>
      {/* Left side image - hidden on mobile */}
      <div className='md:w-1/2 sm:w-[40%] hidden sm:flex relative'>
        <Image
          src='/assets/leftside.svg' // Update with your admin login image
          alt='Admin portal background'
          layout='fill'
          objectFit='cover'
          priority
        />
      </div>

      {/* Right side form */}
      <div className='md:w-1/2 sm:w-[60%] w-full flex flex-col justify-center p-4'>
        <div className='w-full max-w-sm mx-auto my-auto'>
          {/* Heading */}
          <h2 className='text-[#002B4B] text-[32px] tiny:text-[26px] mb-10 tiny:mb-8 font-[800] text-center'>
            Admin Portal
          </h2>

          {/* Form */}
          <form className='space-y-6 tiny:space-y-4' onSubmit={handleSubmit}>
            {/* Email field */}
            <div>
              {emailFocus && (
                <label className='text-[#000000] text-[12px] block mb-1'>
                  Admin Email <span className="text-red-500">*</span>
                </label>
              )}
              <div className={`border-b ${emailFocus ? 'border-[#000113]' : 'border-[#CBD5E1]'} ${emailError ? 'border-red-500' : ''}`}>
                <input
                  type='email'
                  placeholder={emailFocus ? '' : 'Enter admin email'}
                  className='w-full py-2 text-[14px] font-[400] text-[#000113] bg-transparent focus:ring-0 focus:outline-none'
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(email.length > 0)}
                />
              </div>
              {emailError && <p className='text-red-500 text-[14px] font-[400] mt-1'>{emailError}</p>}
            </div>

            {/* Password field */}
            <div>
              {passwordFocus && (
                <label className='text-[#000000] text-[12px] block mb-1'>
                  Password <span className="text-red-500">*</span>
                </label>
              )}
              <div className={`border-b flex items-center ${passwordFocus ? 'border-[#000113]' : 'border-[#CBD5E1]'} ${passwordError ? 'border-red-500' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={passwordFocus ? '' : 'Enter password'}
                  className='flex-grow py-2 text-[14px] font-[400] text-[#000113] bg-transparent focus:ring-0 focus:outline-none'
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(password.length > 0)}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='text-gray-500 ml-2 p-1'
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {passwordError && <p className='text-red-500 text-[14px] font-[400] mt-1'>{passwordError}</p>}
            </div>

            {/* Error message */}
            {error && <p className='text-red-500 text-[14px] font-[400] text-center'>{error}</p>}

            {/* Login button */}
            <button
              type='submit'
              className={`w-full text-white bg-[#002B4B] h-[40px] font-[500] text-[14px] p-2 rounded-[4px] hover:bg-blue-900 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Loging in...' : 'Login'}
            </button>

            {/* Forgot password link only */}
            <div className='text-center'>
              <Link
                href='/forgot-pass'
                className='text-[#002B4B] text-[14px] font-[500] hover:underline'
              >
                Forgot Admin Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;