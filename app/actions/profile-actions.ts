"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export const updateProfile = updateUserProfile

export async function updateUserProfile(formData: FormData) {
  try {
    const supabase = getSupabaseServerClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Extract form data
    const fullName = formData.get("fullName") as string
    const bio = formData.get("bio") as string
    const website = formData.get("website") as string
    const location = formData.get("location") as string

    // Update profile
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      bio,
      website,
      location,
      email: user.email,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      throw error
    }

    revalidatePath("/profile")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    }
  }
}

export async function uploadProfileImage(formData: FormData) {
  try {
    const supabase = getSupabaseServerClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get the file from form data
    const avatarFile = formData.get("avatar") as File

    if (!avatarFile) {
      return { success: false, error: "No file provided" }
    }

    // Generate a unique file name
    const fileExt = avatarFile.name.split(".").pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    // Upload the file to Supabase Storage
    const { error: uploadError, data } = await supabase.storage.from("avatars").upload(fileName, avatarFile, {
      cacheControl: "3600",
      upsert: true,
    })

    if (uploadError) {
      throw uploadError
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName)

    // Update the user's profile with the new avatar URL
    const { error: updateError } = await supabase.from("profiles").upsert({
      id: user.id,
      avatar_url: publicUrl,
      updated_at: new Date().toISOString(),
    })

    if (updateError) {
      throw updateError
    }

    revalidatePath("/profile")
    revalidatePath("/dashboard")

    return { success: true, avatarUrl: publicUrl }
  } catch (error) {
    console.error("Error uploading profile image:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload profile image",
    }
  }
}
