import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconLock, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { type PasswordChangeData } from "./types";

interface PasswordChangeFormProps {
  passwordData: PasswordChangeData;
  saving: boolean;
  onPasswordChange: (field: string, value: string) => void;
  onChangePassword: () => void;
  onCancel: () => void;
}

export function PasswordChangeForm({
  passwordData,
  saving,
  onPasswordChange,
  onChangePassword,
  onCancel,
}: PasswordChangeFormProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconLock className="h-5 w-5" />
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              onPasswordChange("currentPassword", e.target.value)
            }
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => onPasswordChange("newPassword", e.target.value)}
            placeholder="Enter your new password"
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              onPasswordChange("confirmPassword", e.target.value)
            }
            placeholder="Confirm your new password"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={onChangePassword}
            disabled={saving}
            className="flex-1"
          >
            <IconDeviceFloppy className="h-4 w-4 mr-2" />
            {saving ? "Changing..." : "Change Password"}
          </Button>
          <Button onClick={onCancel} variant="outline" disabled={saving}>
            <IconX className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
