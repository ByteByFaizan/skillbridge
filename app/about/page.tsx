import type { Metadata } from "next";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RevealOnScroll from "../components/RevealOnScroll";

export const metadata: Metadata = {
    title: "About — SkillBridge",
    description:
        "Learn why SkillBridge exists: AI-powered career guidance built for students who don't know where to start.",
};

/* ─── Inline SVG icons for values cards ─── */
const ClarityIcon = () => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
    </svg>
);

const StudentIcon = () => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
    </svg>
);

const PrivacyIcon = () => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);

const values = [
    {
        icon: ClarityIcon,
        number: "01",
        title: "Clarity Over Complexity",
        description:
            "Career guidance shouldn't need a glossary. We use plain language, grade-8 readability, and zero jargon — so every student can understand their options immediately.",
    },
    {
        icon: StudentIcon,
        number: "02",
        title: "Student-First Design",
        description:
            "Every feature exists because a student needed it. No upsells, no walls, no sign-up friction. You get personalized results in under two minutes — free.",
    },
    {
        icon: PrivacyIcon,
        number: "03",
        title: "Privacy By Default",
        description:
            "Your data is yours. We don't store sensitive information, sell profiles, or track you across the web. AI analysis runs per-session and stays private.",
    },
];

export default function AboutPage() {
    return (
        <>
            <Header />
            <main>
                {/* ━━━ Hero ━━━ */}
                <section className="relative pt-28 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-radial from-[#37322f]/[0.04] to-transparent rounded-full blur-3xl" />
                    </div>

                    {/* Floating orb for depth */}
                    <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-radial from-[#37322f]/[0.03] to-transparent rounded-full blur-2xl cta-orb-1 pointer-events-none" />

                    <div className="relative max-w-[1060px] mx-auto px-4">
                        <div className="flex flex-col items-center text-center gap-8">
                            {/* Animated accent line */}
                            <div className="about-line-grow w-[2px] h-16 bg-gradient-to-b from-transparent via-[#37322f]/30 to-[#37322f]/60 rounded-full" />

                            <h1 className="about-hero-shimmer max-w-[720px] text-4xl sm:text-5xl md:text-[72px] font-normal leading-tight md:leading-[1.15] font-display animate-fade-in-up text-balance">
                                Built for students who don&apos;t know where to start
                            </h1>

                            <p className="max-w-[540px] text-[#49423D] text-lg font-medium leading-7 animate-fade-in-up animation-delay-200">
                                SkillBridge is AI-powered career guidance that meets you where
                                you are — with clear language, honest options, and a plan you can
                                actually follow.
                            </p>
                        </div>
                    </div>

                    {/* Scroll-down indicator label */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-40 pointer-events-none">
                        <div className="about-scroll-indicator flex flex-col items-center gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#37322f]">
                                Scroll Down
                            </span>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#37322f"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 5v14" />
                                <path d="M19 12l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </section>

                {/* ━━━ Mission ━━━ */}
                <section className="py-16 sm:py-24">
                    <div className="max-w-[1060px] mx-auto px-4">
                        <RevealOnScroll>
                            <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16 items-start">
                                {/* Left column — body text */}
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#49423D]/50">
                                        Our Mission
                                    </span>
                                    <h2 className="mt-4 font-display text-3xl sm:text-4xl font-normal leading-snug text-[#37322f]">
                                        Career guidance should be free, fast, and actually useful
                                    </h2>
                                    <div className="mt-6 space-y-4 text-[15px] leading-[1.8] text-[#49423D]">
                                        <p className="about-text-reveal animation-delay-100">
                                            Most career tools assume you already know what you want.
                                            They ask for job titles, salary expectations, industry
                                            preferences — things a 19-year-old with zero work
                                            experience can&apos;t answer.
                                        </p>
                                        <p className="about-text-reveal animation-delay-300">
                                            SkillBridge flips the process. Instead of starting with
                                            jobs, we start with <em>you</em> — your education, the
                                            skills you&apos;ve picked up along the way, and the
                                            subjects that genuinely interest you. From there, our AI
                                            maps realistic career paths, identifies exactly what
                                            you&apos;d need to learn, and lays it out month by month.
                                        </p>
                                        <p className="about-text-reveal animation-delay-500">
                                            No overwhelming lists. No vague advice. Just a clear
                                            starting point.
                                        </p>
                                    </div>
                                </div>

                                {/* Right column — pull-quote card */}
                                <div className="relative">
                                    <div className="about-quote-border border-l-[3px] border-[#37322f]/20 bg-white p-8 sm:p-10 shadow-[0_2px_16px_rgba(55,50,47,0.04)] md:mt-12">
                                        <blockquote className="font-display text-xl sm:text-2xl leading-relaxed text-[#37322f] italic">
                                            &ldquo;The biggest barrier to a great career isn&apos;t talent — it&apos;s
                                            not knowing the first step.&rdquo;
                                        </blockquote>
                                        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#49423D]/50">
                                            — The idea behind SkillBridge
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </section>

                {/* ━━━ Values ━━━ */}
                <section className="py-16 sm:py-24 border-t border-[#e0dedb]">
                    <div className="max-w-[1060px] mx-auto px-4">
                        <RevealOnScroll>
                            <div className="text-center mb-14">
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#49423D]/50">
                                    What We Believe
                                </span>
                                <h2 className="mt-4 font-display text-3xl sm:text-4xl font-normal leading-snug text-[#37322f]">
                                    Three principles that shape everything
                                </h2>
                            </div>
                        </RevealOnScroll>

                        <div className="grid gap-6 sm:grid-cols-3">
                            {values.map((value, i) => (
                                <RevealOnScroll key={value.title} delay={i * 120}>
                                    <div className="group relative bg-white border border-[#e0dedb]/80 p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#37322f]/15 hover:shadow-[0_12px_40px_rgba(55,50,47,0.07)] hover:-translate-y-1.5 cursor-default h-full overflow-hidden">
                                        {/* Subtle gradient overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#37322f]/[0.01] to-[#37322f]/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        {/* Number badge */}
                                        <span className="absolute top-4 right-4 text-[11px] font-bold tracking-[0.15em] text-[#37322f]/10 group-hover:text-[#37322f]/20 transition-colors duration-500 font-display text-2xl">
                                            {value.number}
                                        </span>

                                        {/* Icon */}
                                        <div className="relative inline-flex rounded-xl bg-[#f7f5f3] p-3 text-[#37322f] transition-all duration-300 group-hover:bg-[#37322f] group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_4px_16px_rgba(55,50,47,0.2)]">
                                            <value.icon />
                                        </div>

                                        <h3 className="relative mt-6 text-lg font-semibold text-[#37322f]">
                                            {value.title}
                                        </h3>
                                        <p className="relative mt-3 text-sm leading-[1.75] text-[#49423D]/85">
                                            {value.description}
                                        </p>

                                        {/* Decorative bottom line on hover */}
                                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#37322f] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left" />
                                    </div>
                                </RevealOnScroll>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ━━━ Story / Origin ━━━ */}
                <section className="py-16 sm:py-24">
                    <div className="max-w-[1060px] mx-auto px-4">
                        <RevealOnScroll>
                            <div className="relative bg-[#37322f] text-white p-10 sm:p-16 overflow-hidden">
                                {/* Decorative corner accent */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/[0.06] to-transparent" />
                                <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-white/[0.03] to-transparent" />

                                {/* Animated dot pattern for texture */}
                                <div className="about-dots-drift absolute top-6 right-6 w-32 h-32 pointer-events-none"
                                    style={{
                                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
                                        backgroundSize: "12px 12px",
                                    }}
                                />
                                <div className="about-dots-drift absolute bottom-8 right-1/4 w-24 h-24 pointer-events-none"
                                    style={{
                                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
                                        backgroundSize: "10px 10px",
                                        animationDelay: "2s",
                                    }}
                                />

                                <div className="relative max-w-[640px]">
                                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                                        Our Story
                                    </span>
                                    <h2 className="mt-4 font-display text-3xl sm:text-4xl font-normal leading-snug text-white">
                                        Why SkillBridge exists
                                    </h2>
                                    <div className="mt-6 space-y-4 text-[15px] leading-[1.85] text-white/85">
                                        <p>
                                            Career guidance is broken. School counselors are
                                            overwhelmed, online tools are bloated with ads and
                                            paywalls, and the advice most students get boils down to
                                            &ldquo;follow your passion&rdquo; — which isn&apos;t
                                            helpful when you&apos;re 18 and don&apos;t have one yet.
                                        </p>
                                        <p>
                                            SkillBridge was built to fix that. We use AI not to
                                            replace human mentorship, but to give every student an
                                            informed starting point — the kind of structured,
                                            personalized analysis that used to require expensive
                                            career coaches or lucky connections.
                                        </p>
                                        <p>
                                            We believe that where you start shouldn&apos;t determine
                                            where you end up. A clear plan can change that.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </section>

                {/* ━━━ Meet the Team ━━━ */}
                <section className="py-16 sm:py-24 border-t border-[#e0dedb]">
                    <div className="max-w-[1060px] mx-auto px-4">
                        <RevealOnScroll>
                            <div className="text-center mb-14">
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#49423D]/50">
                                    The People Behind SkillBridge
                                </span>
                                <h2 className="mt-4 font-display text-3xl sm:text-4xl font-normal leading-snug text-[#37322f]">
                                    Meet the Team
                                </h2>
                            </div>
                        </RevealOnScroll>

                        <div className="grid gap-8 sm:grid-cols-2 max-w-[680px] mx-auto">
                            {/* Md Faizan — CEO */}
                            <RevealOnScroll delay={0}>
                                <a
                                    href="https://github.com/ByteByFaizan"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex flex-col items-center bg-white border border-[#e0dedb]/80 p-8 sm:p-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#37322f]/15 hover:shadow-[0_12px_40px_rgba(55,50,47,0.07)] hover:-translate-y-1.5 cursor-pointer relative overflow-hidden"
                                >
                                    {/* Decorative bottom line on hover */}
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#37322f] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left" />

                                    <div className="about-avatar-glow relative w-32 h-32 rounded-full overflow-hidden border-[3px] border-[#e0dedb] group-hover:border-[#37322f]/30 transition-all duration-500 group-hover:scale-105">
                                        <Image
                                            src="https://github.com/ByteByFaizan.png"
                                            alt="Md Faizan"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <h3 className="mt-5 text-lg font-semibold text-[#37322f]">
                                        Md Faizan
                                    </h3>
                                    <p className="mt-1.5 inline-block text-[11px] font-semibold text-[#49423D]/70 uppercase tracking-[0.12em] bg-[#f7f5f3] px-3 py-1 rounded-full">
                                        Founder &amp; Developer
                                    </p>

                                    {/* GitHub link indicator */}
                                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#49423D]/50 group-hover:text-[#37322f] transition-colors duration-300">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                        </svg>
                                        @ByteByFaizan
                                    </div>
                                </a>
                            </RevealOnScroll>

                            {/* Laiba Khan — CTO */}
                            <RevealOnScroll delay={120}>
                                <a
                                    href="https://github.com/ByteByLaiba"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex flex-col items-center bg-white border border-[#e0dedb]/80 p-8 sm:p-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#37322f]/15 hover:shadow-[0_12px_40px_rgba(55,50,47,0.07)] hover:-translate-y-1.5 cursor-pointer relative overflow-hidden"
                                >
                                    {/* Decorative bottom line on hover */}
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#37322f] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left" />

                                    <div className="about-avatar-glow relative w-32 h-32 rounded-full overflow-hidden border-[3px] border-[#e0dedb] group-hover:border-[#37322f]/30 transition-all duration-500 group-hover:scale-105">
                                        <Image
                                            src="https://github.com/ByteByLaiba.png"
                                            alt="Laiba Khan"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <h3 className="mt-5 text-lg font-semibold text-[#37322f]">
                                        Laiba Khan
                                    </h3>
                                    <p className="mt-1.5 inline-block text-[11px] font-semibold text-[#49423D]/70 uppercase tracking-[0.12em] bg-[#f7f5f3] px-3 py-1 rounded-full">
                                        Founder &amp; Developer
                                    </p>

                                    {/* GitHub link indicator */}
                                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#49423D]/50 group-hover:text-[#37322f] transition-colors duration-300">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                        </svg>
                                        @ByteByLaiba
                                    </div>
                                </a>
                            </RevealOnScroll>
                        </div>
                    </div>
                </section>

                {/* ━━━ CTA ━━━ */}
                <section className="relative py-16 sm:py-20 border-t border-b border-[rgba(55,50,47,0.12)] bg-[#f7f5f3] overflow-hidden">
                    {/* Floating orbs */}
                    <div className="cta-orb-1 absolute -top-20 -right-20 w-[300px] h-[300px] bg-gradient-radial from-[#37322f]/[0.04] to-transparent rounded-full blur-2xl pointer-events-none" />
                    <div className="cta-orb-2 absolute -bottom-20 -left-20 w-[250px] h-[250px] bg-gradient-radial from-[#37322f]/[0.03] to-transparent rounded-full blur-2xl pointer-events-none" />

                    <div className="relative max-w-[1060px] mx-auto px-4 text-center">
                        <RevealOnScroll>
                            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-[#37322f]">
                                Ready to find your path?
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-base text-[#49423D] sm:text-lg font-medium leading-7">
                                Start your career discovery in minutes. No sign-up. No cost.
                                Just clear, personalized guidance.
                            </p>
                            <div className="mt-10">
                                <a
                                    href="/discover"
                                    className="about-cta-shine group inline-flex items-center gap-2 rounded-full bg-[#37322f] px-8 py-3.5 text-sm font-medium text-white shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Start Career Discovery
                                    <svg
                                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </RevealOnScroll>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
