import { Suspense } from "react";
import PovertyList from "./components/PovertyList";
import Navigation from "./components/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <PovertyList />
        </Suspense>
      </div>
    </div>
  );
}
