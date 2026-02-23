const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-1">
            <a href="/" className="font-display text-lg text-cream">
              SkillBridge
            </a>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              AI career guidance for students and early-career learners.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-dim">
                {heading}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-cream"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-dim">
            &copy; {new Date().getFullYear()} SkillBridge. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-dim">
            <span>Built with</span>
            <span className="text-cream">&#9830;</span>
            <span>for students everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
