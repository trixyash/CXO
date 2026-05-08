import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import OTPBox from "../components/OTPBox";

const SignIn = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const role = queryParams.get("role") || "company";

	const [identifier, setIdentifier] = useState("");
	const [loginMethod, setLoginMethod] = useState("otp"); // for experts
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [otp, setOtp] = useState("");
	const [showOtp, setShowOtp] = useState(false);
	const [resolvedEmail, setResolvedEmail] = useState("");

	const handleSendOTP = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setMessage("");

		try {
			if (role === "company") {
				const cleanEmail = identifier.trim();
				console.log("🔍 Searching for company admin email:", `"${cleanEmail}"`);

				const { data, error: dbError } = await supabase
					.from("company_applications")
					.select("admin_email")
					.eq("admin_email", cleanEmail)
					.limit(1)
					.maybeSingle();

				if (dbError || !data) {
					console.error("DB Error:", dbError);
					throw new Error("Company not found");
				}

				const targetEmail = data.admin_email?.trim();
				setResolvedEmail(targetEmail);

				const { error: authError } = await supabase.auth.signInWithOtp({
					email: targetEmail,
				});

				if (authError) throw authError;

				setMessage(`✅ OTP sent to ${targetEmail}`);
				setShowOtp(true);
			} else {
				// 👨‍💼 EXPERT LOGIN
				const cleanIdentifier = identifier.trim();
				if (loginMethod === "otp") {
					const { error } = await supabase.auth.signInWithOtp({
						email: cleanIdentifier,
					});

					if (error) throw error;

					setMessage(`✅ OTP sent to ${cleanIdentifier}`);
					setShowOtp(true);
				} else {
					const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/send-magic-link`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ 
							email: cleanIdentifier,
							redirectTo: window.location.origin + "/expert-dashboard"
						}),
					});

					const data = await response.json();
					if (!response.ok) throw new Error(data.error || "Failed to send magic link");

					setMessage(`✅ Magic link sent to ${cleanIdentifier}`);
				}
			}
		} catch (err) {
			console.error("SignIn Error:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen py-20 px-5 flex justify-center items-center overflow-hidden z-10 bg-gray-50">
			<div className="absolute inset-0 z-0 pointer-events-none">
				<div className="w-full h-full bg-gradient-radial from-[var(--primary-accent)]/10 to-transparent"></div>
			</div>

			<div className="relative max-w-md w-full mx-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-10">
				<div className="text-center mb-10">
					<h2 className="text-3xl font-bold text-gray-800 mb-3">Sign In as {role === "company" ? "Company" : "Expert"}</h2>
					<p className="text-gray-500">
						{role === "company"
							? "Enter your Admin Email Address"
							: "Enter your registered email"}
					</p>
				</div>

				<form onSubmit={handleSendOTP} className="flex flex-col gap-5">
					<div className="flex flex-col gap-2">
						<label className="text-sm font-semibold text-gray-700">
							{role === "company"
								? "Admin Email Address *"
								: "Registered Email Address *"}
						</label>
						<input
							type="email"
							className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] focus:bg-white transition-all text-gray-800"
							placeholder={
								role === "company"
									? "admin@company.com"
									: "you@example.com"
							}
							value={identifier}
							onChange={(e) => setIdentifier(e.target.value)}
							required
						/>
					</div>

					{role === "expert" && (
						<div className="flex flex-col gap-2">
							<label className="text-sm font-semibold text-gray-700">Login Method</label>
							<div className="flex gap-5 mt-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
								<label className="flex items-center gap-2 cursor-pointer text-gray-700 text-sm">
									<input
										type="radio"
										name="method"
										value="otp"
										checked={loginMethod === "otp"}
										onChange={() => setLoginMethod("otp")}
										className="accent-[var(--primary-accent)] w-4 h-4"
									/>
									Send OTP
								</label>
								<label className="flex items-center gap-2 cursor-pointer text-gray-700 text-sm">
									<input
										type="radio"
										name="method"
										value="magiclink"
										checked={loginMethod === "magiclink"}
										onChange={() => setLoginMethod("magiclink")}
										className="accent-[var(--primary-accent)] w-4 h-4"
									/>
									Send Magic Link
								</label>
							</div>
						</div>
					)}

					{error && <span className="text-red-500 text-sm font-medium p-3 bg-red-50 rounded-lg border border-red-100 flex items-center">{error}</span>}
					{message && (
						<span className="text-green-600 text-sm font-medium p-3 bg-green-50 rounded-lg border border-green-100 flex items-center whitespace-pre-line">
							{message}
						</span>
					)}

					<div className="mt-4">
						<button
							type="submit"
							className="w-full py-3.5 bg-[var(--primary-accent)] text-white font-bold tracking-wide rounded-lg hover:bg-[#2d9e90] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
							disabled={loading || !identifier}
						>
							{loading
								? "SENDING..."
								: role === "company"
									? "SEND OTP"
									: loginMethod === "magiclink"
										? "SEND MAGIC LINK"
										: "SEND OTP"}
						</button>
					</div>
				</form>

				<p className="mt-8 text-center text-sm text-gray-500 font-medium">
					New here?{" "}
					<a
						href={role === "company" ? "/join-company" : "/join-expert"}
						className="text-[var(--primary-accent)] hover:text-[#2d9e90] font-semibold transition-colors hover:underline"
					>
						Join as {role === "company" ? "Company" : "Expert"}
					</a>
				</p>
				{showOtp && (
					<OTPBox
						email={role === "company" ? resolvedEmail : identifier}
						role={role}
						onSuccess={() => navigate(role === "company" ? "/company-dashboard" : "/expert-dashboard")}
					/>
				)}
			</div>
		</div>

	);
};

export default SignIn;
