import React from "react";

const PanelLayout = ({
  title,
  subtitle,
  action,
  accent,
  badge,
  children,
}) => (
  <section className="space-y-6">
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-700 to-indigo-500 p-6 text-white shadow-2xl">
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              {accent || "Panel Administrator"}
            </p>
            <h1 className="text-3xl font-semibold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-white/80 max-w-2xl">{subtitle}</p>
            )}
          </div>
          {badge && (
            <p className="rounded-full border border-white/30 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white/80">
              {badge}
            </p>
          )}
        </div>
      </div>
      {action && (
        <div className="mt-4 flex flex-wrap gap-3">
          {action}
        </div>
      )}
    </div>
    <div className="rounded-3xl border border-white/10 bg-white/90 p-6 shadow-xl backdrop-blur">
      {children}
    </div>
  </section>
);

export default PanelLayout;
