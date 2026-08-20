import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { signInAction, signInWithGoogle } from "@/lib/actions";
import { getTranslations } from "next-intl/server";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export default async function HomePage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const session = await auth();
  const t = await getTranslations();

  const features = [
    {
      title: t("home.feature1Title"),
      desc: t("home.feature1Desc"),
      color: "bg-indigo-600",
    },
    {
      title: t("home.feature2Title"),
      desc: t("home.feature2Desc"),
      color: "bg-amber-500",
    },
    {
      title: t("home.feature3Title"),
      desc: t("home.feature3Desc"),
      color: "bg-zinc-900",
    },
    {
      title: t("home.feature4Title"),
      desc: t("home.feature4Desc"),
      color: "bg-green-600",
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        {/* NAVBAR */}
        <nav className="flex items-center justify-between py-6">
          <Link
            href={`/${locale}`}
            className={`${bricolage.className} text-xl font-bold tracking-tight`}
          >
            {t("common.appName")}
          </Link>

          {session && (
            <Link
              href={`/${locale}/todos`}
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              {t("home.goToTasks")}
            </Link>
          )}
        </nav>

        {/* HERO */}
        <section className="grid gap-12 py-10 sm:py-16 lg:grid-cols-[1fr_420px] lg:items-center lg:gap-20">
          
          {/* LEFT SIDE */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">
              {t("home.eyebrow")}
            </p>

            <h1
              className={`${bricolage.className} mt-5 max-w-2xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl`}
            >
              {t("home.headlineLine1")}
              <br />
              {t("home.headlineLine2")}
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-600">
              {t("home.subtitle")}
            </p>

            {/* ANIMATED TASK CARD */}
            <div className="relative mt-10 max-w-md">
              {/* Back cards */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 -rotate-3 rounded-3xl bg-white/60 ring-1 ring-black/5" />
              <div className="absolute inset-0 -translate-x-2 translate-y-1 rotate-2 rounded-3xl bg-white/80 ring-1 ring-black/5" />

              {/* Main card */}
              <div className="relative rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5">
                <div className="flex items-center gap-3">
                  <div className="status-demo-box relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2">
                    <svg
                      className="status-demo-check h-4 w-4 text-white"
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

                  <p className="font-semibold text-zinc-900">
                    {t("home.demoTaskTitle")}
                  </p>
                </div>

                <div className="relative mt-5 h-7">
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

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                    #{t("home.demoTag")}
                  </span>

                  <span className="text-xs text-zinc-400">
                    {t("home.demoCategory")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — LOGIN CARD */}
          {!session ? (
            <div className="w-full">
              <div className="rounded-[2rem] bg-white p-7 shadow-xl ring-1 ring-black/5 sm:p-8">
                
                {/* Login header */}
                <header className="mb-7 text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">
                    {t("common.appName")}
                  </p>

                  <h2
                    className={`${bricolage.className} mt-3 text-3xl font-semibold tracking-tight text-zinc-950`}
                  >
                    {t("common.login")}
                  </h2>

                  <p className="mt-2 text-sm text-zinc-500">
                    {t("home.subtitle")}
                  </p>
                </header>

                {/* GOOGLE */}
                <form action={signInWithGoogle}>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#4285F4"
                        d="M23.52 12.27c0-.85-.08-1.67-.22-2.46H12v4.66h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1C3.25 21.3 7.31 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.27 14.28A7.2 7.2 0 0 1 4.88 12c0-.79.14-1.56.39-2.28V6.62H1.27A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l4-3.1z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.62l4 3.1C6.22 6.86 8.87 4.75 12 4.75z"
                      />
                    </svg>

                    Google
                  </button>
                </form>

                {/* DIVIDER */}
                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-zinc-200" />
                  <span className="text-xs text-zinc-400">
                    {t("common.or")}
                  </span>
                  <div className="h-px flex-1 bg-zinc-200" />
                </div>

                {/* EMAIL LOGIN */}
                <form action={signInAction} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">
                      {t("common.email")}
                    </label>

                    <input
                      type="email"
                      name="email"
                      required
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder={t("common.email")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700">
                      {t("common.password")}
                    </label>

                    <input
                      type="password"
                      name="password"
                      required
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder={t("common.password")}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    {t("common.login")}
                  </button>
                </form>

                {/* SIGN UP */}
                <p className="mt-6 text-center text-sm text-zinc-600">
                  {t("common.noAccount")}{" "}
                  <Link
                    href={`/${locale}/signup`}
                    className="font-semibold text-indigo-600 hover:underline"
                  >
                    {t("common.register")}
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            /* CONNECTED USER */
            <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl ring-1 ring-black/5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                <svg
                  className="h-7 w-7 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M5 12l4 4L19 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2
                className={`${bricolage.className} mt-5 text-2xl font-semibold`}
              >
                {t("home.goToTasks")}
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                {t("dashboard.loggedInAs")}{" "}
                {session.user?.name || session.user?.email}
              </p>

              <Link
                href={`/${locale}/todos`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                {t("home.goToTasks")}
              </Link>
            </div>
          )}
        </section>

        {/* FEATURES */}
        <section className="grid gap-6 border-t border-zinc-200 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-200 bg-white/60 p-6"
            >
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${feature.color}`}
              />

              <h3 className="mt-3 font-semibold text-zinc-900">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {feature.desc}
              </p>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer className="border-t border-zinc-200 py-8 text-center text-xs text-zinc-400">
          {t("home.footerTagline")}
        </footer>
      </div>
    </main>
  );
}