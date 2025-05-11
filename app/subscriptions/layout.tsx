import Navigation from "../components/Navigation";

export default function SubscriptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="py-8 px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
