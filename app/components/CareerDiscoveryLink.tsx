"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

interface CareerDiscoveryLinkProps {
    className?: string;
    children: React.ReactNode;
}

/**
 * A client-side link component for "Start Career Discovery" CTAs.
 * - Logged-in users → /discover
 * - Not logged-in users → /login
 */
export default function CareerDiscoveryLink({
    className,
    children,
}: CareerDiscoveryLinkProps) {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const supabase = getSupabaseBrowser();
        supabase.auth.getUser().then(({ data }: { data: { user: unknown } }) => {
            setIsLoggedIn(!!data.user);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event: string, session: { user: unknown } | null) => {
                setIsLoggedIn(!!session?.user);
            }
        );

        return () => listener.subscription.unsubscribe();
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (isLoggedIn) {
            router.push("/discover");
        } else {
            router.push("/login");
        }
    };

    // Default to /discover for the href (SEO / right-click open in new tab)
    // The click handler overrides navigation at runtime
    return (
        <a
            href={isLoggedIn === false ? "/login" : "/discover"}
            onClick={handleClick}
            className={className}
        >
            {children}
        </a>
    );
}
