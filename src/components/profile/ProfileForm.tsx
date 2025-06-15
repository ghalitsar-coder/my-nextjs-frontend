import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconDeviceFloppy,
  IconX,
  IconUser,
} from "@tabler/icons-react";
import { type UserProfile, type ProfileFormData } from "./types";

interface ProfileFormProps {
  profile: UserProfile;
  formData: ProfileFormData;
  editing: boolean;
  saving: boolean;
  onInputChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileForm({
  profile,
  formData,
  editing,
  saving,
  onInputChange,
  onSave,
  onCancel,
}: ProfileFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconUser className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile.username || ""}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Username cannot be changed
            </p>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <IconMail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                value={profile.email || ""}
                disabled
                className="pl-10 bg-gray-50"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>
        </div>

        <Separator />

        {/* Editable Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => onInputChange("fullName", e.target.value)}
              disabled={!editing}
              className={!editing ? "bg-gray-50" : ""}
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <IconPhone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => onInputChange("phoneNumber", e.target.value)}
                disabled={!editing}
                className={`pl-10 ${!editing ? "bg-gray-50" : ""}`}
                placeholder="+62 xxx-xxxx-xxxx"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <IconMapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => onInputChange("address", e.target.value)}
                disabled={!editing}
                className={`pl-10 ${!editing ? "bg-gray-50" : ""}`}
                placeholder="Enter your full address"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {editing && (
          <div className="flex gap-2 pt-4">
            <Button onClick={onSave} disabled={saving} className="flex-1">
              <IconDeviceFloppy className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button onClick={onCancel} variant="outline" disabled={saving}>
              <IconX className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
