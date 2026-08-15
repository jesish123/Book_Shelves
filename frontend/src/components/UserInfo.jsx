export default function UserInfo({ user }) {
  const displayName =
    user?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    "User";

  const hasToken = Boolean(localStorage.getItem("token"));
  const statusValue = String(user?.status || (hasToken ? "online" : "offline")).toLowerCase();
  const statusText = statusValue === "online" ? "Online" : "Offline";
  const dotColor = statusValue === "online" ? "bg-emerald-500" : "bg-slate-400";

  return (
    <div className="mt-6 space-y-4 text-sm text-slate-700 dark:text-slate-300">
      <div>
        <p className="font-semibold text-slate-900 dark:text-slate-100">Name</p>
        <p>{displayName}</p>
      </div>

      <div>
        <p className="font-semibold text-slate-900 dark:text-slate-100">Email</p>
        <p>{user?.email || "—"}</p>
      </div>

      <div>
        <p className="font-semibold text-slate-900 dark:text-slate-100">Role</p>
        <p>{user?.role || "user"}</p>
      </div>

      <div>
        <p className="font-semibold text-slate-900 dark:text-slate-100">Status</p>
        <div className="mt-1 flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              statusText === "Online"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {statusText}
          </span>
        </div>
      </div>
    </div>
  );
}