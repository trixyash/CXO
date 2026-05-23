import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import OTPBox from "../components/OTPBox";
import { SignIn2 } from "@/components/ui/clean-minimal-sign-in";

const SignIn = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const role = queryParams.get("role") || "company";

	useEffect(() => {
		const isExpertMock = localStorage.getItem("sb-mock-auth") === "true";
		const isCompanyDemo = localStorage.getItem("demo_company") === "true";
		
		if (isExpertMock || isCompanyDemo) {
			localStorage.removeItem("sb-mock-auth");
			localStorage.removeItem("demo_company");
			localStorage.removeItem("mock-role");
			// Force a hard reload to re-initialize the Supabase client
			window.location.reload();
		}
	}, []);

	useEffect(() => {
		// Handle error query parameter from redirects (e.g. from expired magic link)
		const urlError = queryParams.get("error");
		if (urlError) {
			setError(decodeURIComponent(urlError));
			
			// Clean up the URL search params so the error message doesn't persist on page reloads
			const newParams = new URLSearchParams(location.search);
			newParams.delete("error");
			const newSearch = newParams.toString();
			navigate({
				pathname: location.pathname,
				search: newSearch ? `?${newSearch}` : ""
			}, { replace: true });
		}
	}, [location.search, navigate]);

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
			localStorage.setItem('logging_in_role', role);
			if (role === "company") {
				const cleanEmail = identifier.trim();
				console.log("🔍 Searching for company admin email:", `"${cleanEmail}"`);

				if (cleanEmail === "demo@cxo.com") {
					localStorage.setItem('demo_company', 'true');
					navigate("/company-dashboard");
					return;
				}

				let targetEmail = cleanEmail;
				let backendVerified = false;

				// Try to verify company email with the backend if available
				try {
					const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
					const res = await fetch(`${baseUrl}/api/auth/check-company-email`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email: cleanEmail })
					});

					if (res.ok) {
						const data = await res.json();
						if (data && data.email) {
							targetEmail = data.email.trim();
							backendVerified = true;
						}
					} else {
						// If backend explicitly says company not found (404), respect it
						if (res.status === 404) {
							throw new Error("Company not found");
						}
						console.warn(`Backend responded with status ${res.status}. Falling back.`);
					}
				} catch (fetchErr) {
					// If it was a "Company not found" error, propagate it
					if (fetchErr.message === "Company not found") {
						throw fetchErr;
					}

					console.warn("Backend fetch failed, trying direct Supabase check:", fetchErr);
					
					// Fallback to querying Supabase directly
					try {
						const { data: sbData, error: sbError } = await supabase
							.from("company_applications")
							.select("admin_email")
							.eq("admin_email", cleanEmail)
							.limit(1)
							.maybeSingle();

						if (!sbError && sbData) {
							if (sbData.admin_email) {
								targetEmail = sbData.admin_email.trim();
								backendVerified = true;
							}
						} else if (sbError) {
							console.error("Supabase query error:", sbError);
						} else {
							// If query succeeded but returned no data, it means company not found
							throw new Error("Company not found");
						}
					} catch (sbErr) {
						if (sbErr.message === "Company not found") {
							throw sbErr;
						}
						console.error("Supabase fallback query failed:", sbErr);
						// If Supabase RLS blocked it or failed, we just proceed with cleanEmail to avoid blocking valid users
					}
				}

				setResolvedEmail(targetEmail);
				
				localStorage.removeItem('demo_company');
				const { error: authError } = await supabase.auth.signInWithOtp({
					email: targetEmail,
					options: {
						emailRedirectTo: window.location.origin + "/company-dashboard"
					}
				});
				if (authError) throw authError;

				setMessage(`✅ OTP sent to ${targetEmail}`);
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
					const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
					const response = await fetch(`${baseUrl}/api/auth/send-magic-link`, {
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
			localStorage.setItem('logging_in_role', role);
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
