"use client";

import * as React from "react";
import { LogIn, Lock, Mail } from "lucide-react";

const SignIn2 = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSignIn,
  error,
  title = "Sign in with email",
  description = "Make a new doc to bring your words, data, and teams together. For free",
  buttonText = "Get Started",
  showPassword = true,
  loginMethod,
  setLoginMethod,
  role,
  onOAuthSignIn,
  showOtp,
  children
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center z-1 relative">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-white/50 text-black">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg">
          <LogIn className="w-7 h-7 text-[#0eb59a]" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center">
          {title}
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          {description}
        </p>
        <div className="w-full flex flex-col gap-3 mb-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Email"
              type="email"
              value={email}
              disabled={showOtp}
              className={`w-full pl-10 pr-3 py-2 rounded-xl border 
              focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 
              text-black text-sm transition-all
              ${showOtp 
                  ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-50/50 border-gray-200'
              }`}
              onChange={(e) => !showOtp && setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !showOtp && handleSignIn(e)}
            />
          </div>
          {showOtp && (
            <p className="text-xs text-[#0eb59a] font-medium mt-1 ml-1 
            flex items-center gap-1">
                <span>✓</span> OTP sent to {email}
            </p>
          )}

          {showPassword && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                placeholder="Password"
                type="password"
                value={password}
                className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 bg-gray-50/50 text-black text-sm"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {role === "expert" && setLoginMethod && (
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-semibold text-gray-500">Login Method</label>
              <div className="flex gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600 text-xs">
                  <input
                    type="radio"
                    name="method"
                    value="otp"
                    checked={loginMethod === "otp"}
                    onChange={() => setLoginMethod("otp")}
                    className="accent-[#0eb59a] w-3 h-3"
                  />
                  OTP
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-600 text-xs">
                  <input
                    type="radio"
                    name="method"
                    value="magiclink"
                    checked={loginMethod === "magiclink"}
                    onChange={() => setLoginMethod("magiclink")}
                    className="accent-[#0eb59a] w-3 h-3"
                  />
                  Magic Link
                </label>
              </div>
            </div>
          )}

          <div className="w-full flex flex-col items-end">
            {error && (
              <div className="text-xs text-red-500 text-left w-full mb-1">{error}</div>
            )}
            {showPassword && (
              <button className="text-xs hover:underline font-medium text-gray-600">
                Forgot password?
              </button>
            )}
          </div>
        </div>
        {!showOtp && (
          <button
            onClick={handleSignIn}
            className="w-full bg-gradient-to-b from-[#0eb59a] to-[#0a8c77] text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:brightness-105 cursor-pointer transition-all mb-4 mt-2"
          >
            {buttonText}
          </button>
        )}
        {children}
        {!showOtp && (
          <>
            <div className="flex items-center w-full my-2">
              <div className="flex-grow border-t border-dashed border-gray-200"></div>
              <span className="mx-2 text-xs text-gray-400">Or sign in with</span>
              <div className="flex-grow border-t border-dashed border-gray-200"></div>
            </div>
            <div className="flex gap-3 w-full justify-center mt-2">
              <button
                onClick={() => onOAuthSignIn && onOAuthSignIn('google')}
                className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-[#4285F4] hover:shadow-md hover:shadow-[#4285F4]/20 hover:scale-110 active:scale-95 transition-all duration-200 grow cursor-pointer"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-6 h-6"
                />
              </button>
              <button
                onClick={() => onOAuthSignIn && onOAuthSignIn('linkedin_oidc')}
                className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 bg-white hover:bg-[#0a66c2]/5 hover:border-[#0a66c2] hover:shadow-md hover:shadow-[#0a66c2]/20 hover:scale-110 active:scale-95 transition-all duration-200 grow cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#0a66c2]">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
              <button
                onClick={() => onOAuthSignIn && onOAuthSignIn('twitter')}
                className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-900 hover:shadow-md hover:shadow-black/10 hover:scale-110 active:scale-95 transition-all duration-200 grow cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-black">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-gray-400">
              New here?{" "}
              <a
                href={role === "company" ? "/join-company" : "/join-expert"}
                className="text-[#0eb59a] hover:underline font-semibold"
              >
                Join as {role === "company" ? "Company" : "Expert"}
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export { SignIn2 };
