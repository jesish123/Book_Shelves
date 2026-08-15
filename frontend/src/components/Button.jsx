
const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  type = "button",
  className = "",
  leftIcon = null,
  rightIcon = null,
  loading = false,
  outline = false,
  fullWidth = false,
  pill = false,
  ...rest
}) => {
  const base = "inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-2.5 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const variantMap = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
    warning: "bg-amber-400 text-slate-900 hover:bg-amber-500 focus:ring-amber-400",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100/50 active:bg-slate-100/70 dark:text-white dark:hover:bg-slate-800/50 dark:active:bg-slate-800/70 focus:ring-slate-400",
  };

  const colorClass = variantMap[variant] || variantMap.primary;

  const outlineClass = outline
    ? `bg-transparent border ${colorClass.split(' ')[0].replace('bg-', 'border-')} text-current hover:opacity-90`
    : colorClass;

  const widthClass = fullWidth ? "w-full" : "inline-block";
  const radiusClass = pill ? "rounded-full" : "rounded-md";

  const spinner = (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  );

  const cls = [base, sizes[size] || sizes.md, outline ? outlineClass : colorClass, widthClass, radiusClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={cls} {...rest}>
      {loading && spinner}
      {!loading && leftIcon}
      <span className={loading ? "opacity-90" : ""}>{children}</span>
      {!loading && rightIcon}
    </button>
  );
}


export default Button;
