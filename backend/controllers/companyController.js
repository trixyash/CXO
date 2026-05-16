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
