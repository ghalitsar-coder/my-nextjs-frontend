import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IconUser } from "@tabler/icons-react";
import { type UserProfile } from "./types";

interface ProfileSummaryCardProps {
  profile: UserProfile;
}

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconUser className="h-10 w-10 text-orange-600" />
          </div>
          <h3 className="font-semibold text-lg">
            {profile.fullName || "User"}
          </h3>
          <p className="text-gray-600">{profile.email}</p>
          <Badge variant="outline" className="mt-2">
            {profile.role || "Customer"}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Member Since</span>
            <span className="font-medium">Recently</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Account Status</span>
            <Badge variant="default" className="text-xs">
              Active
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
