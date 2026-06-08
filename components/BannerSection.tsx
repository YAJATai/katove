export default function BannerSection() {
  return (
    <section className="py-8 sm:py-10 px-3 sm:px-6 bg-[var(--color-surface-default)]">
      <div className="max-w-[1400px] mx-auto relative rounded-[28px] sm:rounded-[40px] overflow-hidden min-h-[340px] sm:min-h-[420px] md:min-h-[600px] flex items-center justify-center border border-[var(--color-border-default)] group elevation-4">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface-elevated)] via-[var(--color-surface-overlay)] to-[var(--color-surface-raised)]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>

        {/* Ambient glow — naksha spec: subtle brand glow */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[var(--color-brand-400)] blur-[80px]" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[var(--color-brand-400)] blur-[100px]" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4 sm:px-6 py-8 sm:py-10 stagger-children">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-5 sm:mb-8 backdrop-blur-sm border"
            style={{ backgroundColor: "rgba(204, 255, 0, 0.08)", borderColor: "rgba(204, 255, 0, 0.15)" }}
          >
            <div className="w-2 h-2 rounded-full bg-[var(--color-brand-400)] animate-pulse" />
            <span className="text-[var(--color-brand-400)] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              Private Collection
            </span>
          </div>
          <h2 className="text-[clamp(2rem,10vw,4.5rem)] font-bold text-[var(--color-text-primary)] leading-[1.08] mb-5 sm:mb-8 tracking-tighter whitespace-pre-line">
            The Black Market<br />For The World's Finest<br />Luxury Goods
          </h2>
          <button
            className="btn-primary relative text-[var(--color-text-on-primary)] font-bold text-base sm:text-lg px-7 sm:px-10 py-3 sm:py-4 rounded-full overflow-hidden group/btn"
            style={{ backgroundColor: "var(--color-brand-400)" }}
          >
            <span className="relative z-10">Explore Now</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-200" />
          </button>
        </div>
      </div>
    </section>
  );
}
