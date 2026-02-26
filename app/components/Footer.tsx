const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "FAQ", href: "/#faq" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "#" },
    { label: "faizan91study@gmail.com", href: "mailto:faizan91study@gmail.com" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#e0dedb] bg-[#f7f5f3]">
      <div className="max-w-[1060px] mx-auto px-4 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div className="sm:col-span-1">
            <a href="/" className="font-display text-lg text-[#37322f]">
              SkillBridge
            </a>
            <p className="mt-3 text-sm leading-relaxed text-[#605A57]">
              AI career guidance for students and early-career learners.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#49423D]/60">
                {heading}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#49423D]/70 transition-colors hover:text-[#37322f]"
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
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#e0dedb] pt-8 sm:flex-row">
          <p className="text-xs text-[#49423D]/60">
            &copy; {new Date().getFullYear()} SkillBridge. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[#49423D]/60">
            <span>Built with</span>
            <span className="text-[#37322f]">&#9830;</span>
            <span>for students everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
