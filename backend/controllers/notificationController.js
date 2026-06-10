import { supabaseAdmin } from "../utils/supabaseAdmin.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../data");
const jsonPath = path.join(dataDir, "notifications.json");

async function readJsonNotifications() {
  try {
    const content = await fs.readFile(jsonPath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}

async function writeJsonNotifications(data) {
  try {
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing notifications.json:", err);
  }
}

// Fetch notifications for the logged-in user
export const getNotifications = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (userId === "00000000-0000-0000-0000-000000000000") {
    const list = await readJsonNotifications();
    return res.json(list);
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

  if (userId === "00000000-0000-0000-0000-000000000000") {
    try {
      const list = await readJsonNotifications();
      let updatedNotif = null;
      const updatedList = list.map(n => {
        if (n.id === id) {
          updatedNotif = { ...n, is_read: true };
          return updatedNotif;
        }
        return n;
      });
      await writeJsonNotifications(updatedList);
      return res.json({ success: true, notification: updatedNotif });
    } catch (err) {
      console.error("Error marking local notification as read:", err);
      return res.status(500).json({ error: "Failed to update notification status" });
    }
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

  if (userId === "00000000-0000-0000-0000-000000000000") {
    try {
      const list = await readJsonNotifications();
      const count = list.filter(n => !n.is_read).length;
      const updatedList = list.map(n => ({ ...n, is_read: true }));
      await writeJsonNotifications(updatedList);
      return res.json({ success: true, count });
    } catch (err) {
      console.error("Error marking all local notifications as read:", err);
      return res.status(500).json({ error: "Failed to update notifications" });
    }
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
