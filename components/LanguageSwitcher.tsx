"use client";

import { usePathname, useRouter } from "next/navigation";

const languages = [
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1 rounded-full bg-white/90 p-1 shadow-md ring-1 ring-black/5">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLocale(lang.code)}
          className="rounded-full px-3 py-1 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100"
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
