import { IconCoffee } from "@tabler/icons-react";

export function UnauthenticatedState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <IconCoffee className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Please Login
        </h2>
        <p className="text-gray-600">
          You need to be logged in to view your order history.
        </p>
      </div>
    </div>
  );
}
