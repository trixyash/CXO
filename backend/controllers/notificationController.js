import { supabaseAdmin } from "../utils/supabaseAdmin.js";

// Fetch notifications for the logged-in user
export const getNotifications = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error query from Supabase:", error);
      throw error;
    }
    
    res.json(data || []);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to retrieve notifications" });
  }
};

// Mark a specific notification as read
export const markAsRead = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId || !id) {
    return res.status(400).json({ error: "User ID and notification ID are required" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", userId)
      .select();

    if (error) throw error;
    res.json({ success: true, notification: data ? data[0] : null });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to update notification status" });
  }
};

// Mark all notifications as read for the current user
export const markAllAsRead = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .select();

    if (error) throw error;
    res.json({ success: true, count: data ? data.length : 0 });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Failed to update notifications" });
  }
};
