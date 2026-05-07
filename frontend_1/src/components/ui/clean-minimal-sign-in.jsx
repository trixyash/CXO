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
  role
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
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 bg-gray-50/50 text-black text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
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
        <button
          onClick={handleSignIn}
          className="w-full bg-gradient-to-b from-[#0eb59a] to-[#0a8c77] text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:brightness-105 cursor-pointer transition-all mb-4 mt-2"
        >
          {buttonText}
        </button>
        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
          <span className="mx-2 text-xs text-gray-400">Or sign in with</span>
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
        </div>
        <div className="flex gap-3 w-full justify-center mt-2">
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow">
            <img
              src="https://www.svgrepo.com/show/448224/facebook.svg"
              alt="Facebook"
              className="w-6 h-6"
            />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow">
            <img
              src="https://www.svgrepo.com/show/511330/apple-173.svg"
              alt="Apple"
              className="w-6 h-6"
            />
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
      </div>
    </div>
  );
};

export { SignIn2 };
