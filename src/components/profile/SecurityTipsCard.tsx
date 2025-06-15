import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SecurityTipsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Security Tips</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-gray-600 space-y-2">
        <p>• Use a strong, unique password</p>
        <p>• Keep your contact information updated</p>
        <p>• Review your order history regularly</p>
        <p>• Log out from shared devices</p>
      </CardContent>
    </Card>
  );
}
