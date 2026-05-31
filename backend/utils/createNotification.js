import { supabaseAdmin } from "./supabaseAdmin.js";

/**
 * Creates and saves a notification in the database.
 * @param {string} userId - Target user ID (auth.users)
 * @param {string} title - Short headline
 * @param {string} description - Message body
 * @param {string} type - 'match' | 'milestone' | 'payment' | 'contract' | 'message' | 'system'
 * @param {object} metadata - Optional additional payload (e.g. redirect path)
 * @returns {object|null} - The created notification object, or null on error
 */
export const createNotification = async (userId, title, description, type, metadata = {}) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .insert([{ 
        user_id: userId, 
        title, 
        description, 
        type, 
        metadata 
      }])
      .select();

    if (error) {
      console.error("Failed to insert notification into database:", error);
      return null;
    }
    return data ? data[0] : null;
  } catch (error) {
    console.error("Exception in createNotification utility:", error);
    return null;
  }
};
