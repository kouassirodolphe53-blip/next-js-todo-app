import Link from "next/link";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export default async function HomePage() {
  const session = await auth();
  const t = await getTranslations();

  const features = [
    { title: t("home.feature1Title"), desc: t("home.feature1Desc"), color: "bg-indigo-600" },
    { title: t("home.feature2Title"), desc: t("home.feature2Desc"), color: "bg-amber-500" },
    { title: t("home.feature3Title"), desc: t("home.feature3Desc"), color: "bg-zinc-900" },
    { title: t("home.feature4Title"), desc: t("home.feature4Desc"), color: "bg-green-600" },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-6xl px-6">
        <nav className="flex items-center justify-between py-6">
          <span className={`${bricolage.className} text-lg font-semibold tracking-tight`}>
            {t("common.appName")}
          </span>
          <div className="flex items-center gap-3">
            {session ? (
              <Link
                href="/todos"
                className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                {t("home.goToTasks")}
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                  {t("common.login")}
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  {t("common.register")}
                </Link>
              </>
            )}
          </div>
        </nav>

        <section className="grid gap-12 py-12 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              {t("home.eyebrow")}
            </p>
            <h1 className={`${bricolage.className} mt-4 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl`}>
              {t("home.headlineLine1")}
              <br />
              {t("home.headlineLine2")}
            </h1>
            <p className="mt-6 max-w-md text-lg text-zinc-600">{t("home.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {session ? (
                <Link
                  href="/todos"
                  className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  {t("home.goToTasks")}
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    {t("home.ctaPrimary")}
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-white"
                  >
                    {t("home.ctaSecondary")}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-0 -rotate-6 translate-y-3 rounded-3xl bg-white/70 ring-1 ring-black/5" />
            <div className="absolute inset-0 rotate-3 translate-y-1.5 rounded-3xl bg-white/85 ring-1 ring-black/5" />
            <div className="relative rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <div className="status-demo-box relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2">
                  <svg
                    className="status-demo-check h-3.5 w-3.5 text-white"
                    viewBox="0 0 16 12"
                    fill="none"
                  >
                    <path
                      d="M1 6L6 11L15 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="font-medium text-zinc-900">{t("home.demoTaskTitle")}</p>
              </div>

              <div className="relative mt-4 h-6">
                <span className="status-demo-pill-1 absolute inline-flex rounded-full bg-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-700">
                  {t("taskForm.statusOpen")}
                </span>
                <span className="status-demo-pill-2 absolute inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  {t("taskForm.statusInProgress")}
                </span>
                <span className="status-demo-pill-3 absolute inline-flex rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                  {t("taskForm.statusDone")}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">
                  #{t("home.demoTag")}
                </span>
                <span className="text-xs text-zinc-400">{t("home.demoCategory")}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 border-t border-zinc-200 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-zinc-200 bg-white/60 p-6">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${f.color}`} />
              <h3 className="mt-3 font-semibold text-zinc-900">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{f.desc}</p>
            </div>
          ))}
        </section>

        <footer className="border-t border-zinc-200 py-8 text-center text-xs text-zinc-400">
          {t("home.footerTagline")}
        </footer>
      </div>
    </main>
  );
}
