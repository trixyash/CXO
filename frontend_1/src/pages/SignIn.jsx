import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import OTPBox from "../components/OTPBox";
import { SignIn2 } from "@/components/ui/clean-minimal-sign-in";

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
		if (e) e.preventDefault();
		setLoading(true);
		setError("");
		setMessage("");

		try {
			if (role === "company") {
				const cleanEmail = identifier.trim();
				console.log("🔍 Searching for company admin email:", `"${cleanEmail}"`);

				if (cleanEmail === "demo@cxo.com") {
					localStorage.setItem('demo_company', 'true');
					navigate("/company-dashboard");
					return;
				}

				const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/check-company-email`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email: cleanEmail })
				});

				const data = await res.json();
				if (!res.ok) {
					console.error("DB Error:", data.error);
					throw new Error("Company not found");
				}

				const targetEmail = data.email?.trim();
				setResolvedEmail(targetEmail);

				const targetEmailForAuth = cleanEmail === "demo@cxo.com" ? cleanEmail : resolvedEmail || cleanEmail;
				
				localStorage.removeItem('demo_company');
				const { error: authError } = await supabase.auth.signInWithOtp({
					email: targetEmailForAuth
				});
				if (authError) throw authError;

				setMessage(`✅ OTP sent to ${targetEmailForAuth}`);
				setShowOtp(true);
			} else {
				// 👨‍💼 EXPERT LOGIN
				const cleanIdentifier = identifier.trim();
				if (cleanIdentifier === "demo@cxo.com") {
					localStorage.setItem("sb-mock-auth", "true");
					localStorage.setItem("mock-role", "expert");
					window.location.href = "/expert-dashboard";
					return;
				}
				if (loginMethod === "otp") {
					const { error } = await supabase.auth.signInWithOtp({
						email: cleanIdentifier,
						options: {
							emailRedirectTo: window.location.origin + "/expert-dashboard"
						}
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

	const handleOAuthSignIn = async (provider) => {
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: provider,
				options: {
					redirectTo: window.location.origin + (role === "company" ? "/company-dashboard" : "/expert-dashboard")
				}
			});
			if (error) throw error;
		} catch (err) {
			console.error("OAuth Error:", err);
			setError(err.message);
		}
	};

	return (
		<div className="relative min-h-screen bg-gray-50 flex items-center justify-center">
			<SignIn2
				email={identifier}
				setEmail={setIdentifier}
				handleSignIn={handleSendOTP}
				error={error || message}
				title={`Sign In as ${role === "company" ? "Company" : "Expert"}`}
				description={role === "company" ? "Enter your Admin Email Address" : "Enter your registered email"}
				buttonText={loading ? "SENDING..." : (loginMethod === "magiclink" ? "SEND MAGIC LINK" : "SEND OTP")}
				showPassword={false}
				role={role}
				loginMethod={loginMethod}
				setLoginMethod={setLoginMethod}
				onOAuthSignIn={handleOAuthSignIn}
			/>

			{showOtp && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="max-w-md w-full p-6">
						<OTPBox
							email={role === "company" ? resolvedEmail : identifier}
							role={role}
							onSuccess={() => navigate(role === "company" ? "/company-dashboard" : "/expert-dashboard")}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default SignIn;
