import UserInfo from "./UserInfo";
import StatusButton from "./StatusButton";

export default function ProfileContent({ user, toggleStatus }) {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Account Details
      </h3>
      {/* This Intermediate component takes no props */}
      <UserInfo user={user} />
      <StatusButton toggleStatus={toggleStatus} />
    </div>
  );
}