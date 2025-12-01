import Link from "next/link";

export default function Settings() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="max-w-3xl w-full px-6 py-16 space-y-8">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
          Settings
        </h1>

        <div className="mt-1 mb-6 flex gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-zinc-200 text-black px-4 py-2 text-sm font-medium hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-black text-white px-4 py-2 text-sm font-medium hover:bg-[#383838] dark:bg-white dark:text-black"
          >
            Dashboard
          </Link>
        </div>

        {/* Product section */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            Product
          </h2>
          <p className="text-zinc-700 dark:text-zinc-400">
            Tell us about your SaaS. This will be used when generating replies.
          </p>
          <form className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Product name
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="Example: ChurnWatch"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Product website
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="https://your-saas.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Who is it for?
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="Example: small B2B SaaS founders, HR managers..."
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-black text-white px-4 py-2 text-sm font-medium hover:bg-[#383838] dark:bg-white dark:text-black"
            >
              Save product (not working yet)
            </button>
          </form>
        </section>

        {/* Keywords section */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            Keywords & Subreddits
          </h2>
          <p className="text-zinc-700 dark:text-zinc-400">
            These will later tell the system what to look for on Reddit.
          </p>
          <form className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Problem keywords (one per line)
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                rows={3}
                placeholder={"how to reduce churn\nbest crm for freelancers\nalternative to X"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Competitor / tool names (one per line)
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                rows={2}
                placeholder={"HubSpot\nIntercom"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Subreddits to monitor (one per line)
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                rows={2}
                placeholder={"SaaS\nEntrepreneur\nindiehackers"}
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-black text-white px-4 py-2 text-sm font-medium hover:bg-[#383838] dark:bg-white dark:text-black"
            >
              Save keywords (not working yet)
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
