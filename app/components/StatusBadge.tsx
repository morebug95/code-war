"use client";

type StatusBadgeProps = {
  status: "pending" | "receiving" | "completed";
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusClasses = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "receiving":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses()}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
