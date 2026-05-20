import { supabaseAdmin } from "../utils/supabaseAdmin.js";

// ================= GET COMPANY PROFILE =================
export const getCompanyProfile = async (req, res) => {
  try {
    const email = req.user.email; // Extracted from Supabase JWT by requireAuth middleware

    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    const { data, error } = await supabaseAdmin
      .from("company_applications")
      .select("*")
      .eq("admin_email", email)
      .single();

    if (error && error.code !== "PGRST116") { // Ignore 'no rows returned' error if not found, but it throws PGRST116 for .single()
      console.error("Error fetching company profile:", error);
      return res.status(500).json({ error: "Failed to fetch company profile" });
    }

    if (!data) {
      return res.status(404).json({ error: "Company profile not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("getCompanyProfile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper function to map DB expert record to frontend component format
export const mapDbExpert = (expert, idx = 0) => {
  const initials = expert.full_name
    ? expert.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "EX";

  const colors = ["bg-purple-500", "bg-blue-500", "bg-teal-600", "bg-rose-500", "bg-amber-600"];
  const color = colors[idx % colors.length];

  const gradients = [
    "from-teal-600 to-emerald-500",
    "from-blue-600 to-indigo-500",
    "from-purple-600 to-violet-500",
    "from-emerald-600 to-teal-500",
    "from-indigo-600 to-blue-500"
  ];
  const coverGradient = gradients[idx % gradients.length];

  // Format budget: e.g. "₹2L - ₹3L/mo" based on expected monthly hourly_rate
  let rate = "₹2.0L/mo";
  if (expert.hourly_rate) {
    const rateNum = parseInt(expert.hourly_rate);
    if (!isNaN(rateNum)) {
      if (rateNum >= 100000) {
        rate = `₹${(rateNum / 100000).toFixed(1)}L/mo`;
      } else {
        rate = `₹${rateNum.toLocaleString('en-IN')}/mo`;
      }
    }
  }

  // Generate dynamic highlights
  const highlights = [];
  if (expert.current_role) {
    highlights.push(`Worked as ${expert.current_role}${expert.current_company ? ` at ${expert.current_company}` : ""}`);
  }
  if (expert.primary_domain) {
    highlights.push(`Specializes in ${expert.primary_domain}`);
  }
  if (expert.key_skills) {
    const skillsList = expert.key_skills.split(",").slice(0, 3).map(s => s.trim()).join(", ");
    highlights.push(`Expert in: ${skillsList}`);
  }
  if (expert.tools_technologies) {
    highlights.push(`Proficient with: ${expert.tools_technologies}`);
  }
  // Fill in placeholders if we have fewer than 3 highlights
  while (highlights.length < 4) {
    const fallbackHighlights = [
      "Led cross-functional teams to deliver high-impact results",
      "Managed business units scaling from early-stage to growth",
      "Expertise in designing strategic roadmaps and execution frameworks",
      "Trusted advisor to startup founders and corporate executives"
    ];
    highlights.push(fallbackHighlights[highlights.length]);
  }

  return {
    id: expert.id,
    name: expert.full_name,
    title: expert.current_role || "CXO Advisor",
    role: expert.current_role || "CXO Advisor",
    exRole: expert.headline || "Independent Consultant",
    avatar: expert.profile_url || `https://i.pravatar.cc/150?u=${expert.id}`,
    initials,
    color,
    coverGradient,
    rating: 4.9, // fallback placeholder
    reviews: 12 + (idx % 10), // fallback placeholder
    match: 90 + (idx % 9), // fallback placeholder
    availability: expert.years_experience ? `${expert.years_experience} years exp` : "Part-time",
    availabilityType: "Part-time",
    location: "Remote",
    budget: rate,
    budgetNum: parseInt(expert.hourly_rate) || 200000,
    rate: rate,
    experience: expert.years_experience ? `${expert.years_experience} years` : "10+ years",
    industries: ["SaaS", "Fintech", "Consumer Tech"], // fallback
    skills: expert.key_skills ? expert.key_skills.split(",").map(s => s.trim()) : [],
    roles: [expert.current_role || "CXO Advisor"],
    engagementTypes: ["Fractional", "Advisory"],
    verified: true,
    topExpert: idx % 3 === 0,
    responseTime: "< 2 hours",
    bio: expert.services_offered || expert.headline || "Premium CXO Advisor.",
    completedEngagements: 4 + (idx % 5),
    linkedIn: expert.linkedin || "https://linkedin.com",
    github: expert.github || "",
    languages: ["English", "Hindi"],
    timezone: "IST (UTC+5:30)",
    highlights
  };
};

// ================= GET REGISTERED EXPERTS =================
export const getRegisteredExperts = async (req, res) => {
  try {
    const { data: rawExperts, error } = await supabaseAdmin
      .from("expert_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching registered experts:", error);
      return res.status(500).json({ error: "Failed to fetch experts" });
    }

    // Map DB fields to the format expected by frontend components
    const mappedExperts = rawExperts.map((expert, idx) => mapDbExpert(expert, idx));

    res.json(mappedExperts);
  } catch (err) {
    console.error("getRegisteredExperts error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= GET REGISTERED EXPERT BY ID =================
export const getRegisteredExpertById = async (req, res) => {
  try {
    const { expertId } = req.params;

    if (!expertId) {
      return res.status(400).json({ error: "Expert ID is required" });
    }

    const { data: expert, error } = await supabaseAdmin
      .from("expert_applications")
      .select("*")
      .eq("id", expertId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching registered expert by ID:", error);
      return res.status(500).json({ error: "Failed to fetch expert details" });
    }

    if (!expert) {
      return res.status(404).json({ error: "Expert not found" });
    }

    const mapped = mapDbExpert(expert, 0);
    res.json(mapped);
  } catch (err) {
    console.error("getRegisteredExpertById error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
