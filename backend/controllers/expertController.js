import { supabaseAdmin } from "../utils/supabaseAdmin.js";

// ================= GET EXPERT PROFILE =================
export const getExpertProfile = async (req, res) => {
  try {
    const email = req.user.email; // Extracted from Supabase JWT by requireAuth middleware

    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    const { data, error } = await supabaseAdmin
      .from("expert_applications")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 is code for no rows returned
      console.error("Error fetching expert profile:", error);
      return res.status(500).json({ error: "Failed to fetch expert profile" });
    }

    if (!data) {
      return res.status(404).json({ error: "Expert profile not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("getExpertProfile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= UPDATE / UPSERT EXPERT PROFILE =================
export const updateExpertProfile = async (req, res) => {
  try {
    const email = req.user.email;
    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    const {
      full_name,
      headline,
      primary_domain,
      years_experience,
      current_role,
      current_company,
      key_skills,
      services_offered,
      hourly_rate,
      profile_url,
      linkedin,
      github,
      work_samples,
      phone,
      portfolio_website,
      previous_experience,
      tools_technologies,
      experience_history,
      education_history,
      industries,
      engagement_types
    } = req.body;

    // Check if expert profile exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("expert_applications")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking existing profile:", fetchError);
      return res.status(500).json({ error: "Database error checking profile" });
    }

    const profileData = {
      full_name,
      headline,
      primary_domain,
      years_experience,
      current_role,
      current_company,
      key_skills,
      services_offered,
      hourly_rate,
      profile_url,
      linkedin,
      github,
      work_samples,
      phone,
      portfolio_website,
      previous_experience,
      tools_technologies,
      experience_history,
      education_history,
      industries,
      engagement_types,
      user_id: req.user.id
    };

    let result;
    if (existing) {
      // Update existing record
      const { data, error } = await supabaseAdmin
        .from("expert_applications")
        .update(profileData)
        .eq("email", email)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Insert new record
      const { data, error } = await supabaseAdmin
        .from("expert_applications")
        .insert([{ ...profileData, email }])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    res.json(result);
  } catch (err) {
    console.error("updateExpertProfile error:", err);
    res.status(500).json({ error: "Failed to update expert profile" });
  }
};
