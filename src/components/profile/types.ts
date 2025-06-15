// Shared types for profile components
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  role: string;
}

export interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
  address: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
