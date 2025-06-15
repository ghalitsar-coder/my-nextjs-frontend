import { Button } from "@/components/ui/button";
import { IconUser, IconEdit, IconLock } from "@tabler/icons-react";

interface ProfileHeaderProps {
  editing: boolean;
  changingPassword: boolean;
  onEditClick: () => void;
  onChangePasswordClick: () => void;
}

export function ProfileHeader({
  editing,
  changingPassword,
  onEditClick,
  onChangePasswordClick,
}: ProfileHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <IconUser className="h-8 w-8 text-orange-500" />
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>
        <div className="flex gap-2">
          {!editing && !changingPassword && (
            <Button onClick={onEditClick} variant="outline">
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
          {!editing && !changingPassword && (
            <Button onClick={onChangePasswordClick} variant="outline">
              <IconLock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
