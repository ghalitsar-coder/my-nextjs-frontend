"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

// Import our new components
import {
  type UserProfile,
  type ProfileFormData,
  type PasswordChangeData,
  ProfileHeader,
  ErrorAlert,
  UnauthenticatedState,
  LoadingState,
  ProfileForm,
  PasswordChangeForm,
  ProfileSummaryCard,
  QuickActionsCard,
  SecurityTipsCard,
} from "@/components/profile";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    phoneNumber: "",
    address: "",
  });

  // Password change states
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SPRING_BOOT_URL || "http://localhost:8080"
        }/users/${session.user.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProfile(data);
      setFormData({
        fullName: data.fullName || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SPRING_BOOT_URL || "http://localhost:8080"
        }/users/${profile.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...profile,
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      toast.error("Failed to update profile");
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SPRING_BOOT_URL || "http://localhost:8080"
        }/users/${profile?.id}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setChangingPassword(false);
      toast.success("Password changed successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change password"
      );
      toast.error(
        err instanceof Error ? err.message : "Failed to change password"
      );
      console.error("Error changing password:", err);
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
      });
    }
    setEditing(false);
    setError("");
  };

  // Cancel password change
  const handleCancelPasswordChange = () => {
    setChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
  };

  // Authentication check
  if (!session) {
    return <UnauthenticatedState />;
  }

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Profile not found
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <ProfileHeader
          editing={editing}
          changingPassword={changingPassword}
          onEditClick={() => setEditing(true)}
          onChangePasswordClick={() => setChangingPassword(true)}
        />

        {/* Error Alert */}
        {error && <ErrorAlert error={error} />}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <ProfileForm
              profile={profile}
              formData={formData}
              editing={editing}
              saving={saving}
              onInputChange={handleInputChange}
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
            />

            {/* Password Change Section */}
            {changingPassword && (
              <PasswordChangeForm
                passwordData={passwordData}
                saving={saving}
                onPasswordChange={handlePasswordChange}
                onChangePassword={handleChangePassword}
                onCancel={handleCancelPasswordChange}
              />
            )}
          </div>

          {/* Profile Summary & Quick Actions */}
          <div className="space-y-6">
            <ProfileSummaryCard profile={profile} />
            <QuickActionsCard />
            <SecurityTipsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
