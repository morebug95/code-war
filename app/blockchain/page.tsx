import BlockchainExplorer from "../components/BlockchainExplorer";
import Navigation from "../components/Navigation";

export default function BlockchainPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <BlockchainExplorer />
      </div>
    </div>
  );
}
