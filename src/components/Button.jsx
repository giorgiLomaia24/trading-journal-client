import React from "react";

export default function Button({
  children,
  onClick,
  to,
  href,
  variant = "solid", // solid, outline, ghost, card-action, icon-only
  subText,
  icon,
  className = "",
  disabled = false,
  active = false,
  danger = false,
  type = "button"    // 👈 დაემატა ნაგულისხმევი მნიშვნელობა. თუ არ გადავცემთ, იქნება "button"
}) {

  const baseStyles = "inline-flex items-center justify-center font-sans font-semibold transition-all select-none focus:outline-none cursor-pointer";

  const variants = {
    solid: "bg-[#0ecb81] hover:bg-[#0bb572] text-[#040405] text-sm px-5 py-2.5 rounded-lg shadow-lg shadow-[#0ecb81]/5 active:scale-[0.98]",
    outline: "bg-[#0d0d0e] border border-[#1f2023] hover:border-[#2f3036] hover:bg-[#141517] text-[#f3f4f6] text-sm px-4 py-2 rounded-lg active:scale-[0.98]",
    ghost: `w-full !justify-start gap-3 px-4 py-3 rounded-lg text-sm transition-colors text-left ${active
        ? "bg-[#0ecb81]/10 text-[#0ecb81]"
        : "text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#0d0d0e]/50"
      }`,
    "card-action": `w-full !justify-start gap-4 p-4 bg-[#0d0d0e] border border-[#1f2023] hover:border-[#0ecb81]/30 rounded-xl text-left transition-all group ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`,
    "icon-only": `p-2 rounded-md bg-transparent transition-colors ${danger
        ? "text-[#ef4444]/70 hover:text-[#ef4444] hover:bg-[#ef4444]/10"
        : "text-[#9ca3af] hover:text-[#0ecb81] hover:bg-[#0ecb81]/10"
      }`
  };

  const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";

  const renderContent = () => {
    if (variant === "icon-only") {
      return icon;
    }

    if (variant === "card-action") {
      return (
        <>
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0ecb81]/10 text-[#0ecb81] group-hover:bg-[#0ecb81]/20 transition-colors">
            {icon ? icon : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-[#0ecb81] group-hover:text-[#0bd587] transition-colors">
              {children}
            </span>
            {subText && (
              <span className="text-xs text-[#6b7280]">{subText}</span>
            )}
          </div>
        </>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {icon && <span className="flex items-center justify-center">{icon}</span>}
        <span>{children}</span>
      </div>
    );
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${disabled ? disabledStyles : ""} ${className}`;

  if (to && !disabled) {
    return (
      <a href={to} className={combinedClasses}>
        {renderContent()}
      </a>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClasses}>
        {renderContent()}
      </a>
    );
  }

  return (
    <button
      type={type} // 👈 აქ ჩაჯდება დინამიური ტიპი ("button" ან "submit")
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {renderContent()}
    </button>
  );
}
