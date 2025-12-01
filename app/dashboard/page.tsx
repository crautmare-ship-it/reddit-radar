import Link from "next/link";

const fakeLeads = [
  {
    id: 1,
    title: "Looking for a simple tool to track churn for my small SaaS",
    subreddit: "SaaS",
    url: "https://www.reddit.com/r/SaaS/",
    score: 92,
  },
  {
    id: 2,
    title: "Best CRM for freelancers that is not too expensive?",
    subreddit: "Entrepreneur",
    url: "https://www.reddit.com/r/Entrepreneur/",
    score: 78,
  },
  {
    id: 3,
    title: "Alternative to HubSpot for early-stage B2B startup",
    subreddit: "indiehackers",
    url: "https://www.reddit.com/r/indiehackers/",
    score: 65,
  },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="max-w-3xl w-full px-6 py-16">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-4">
          Dashboard
        </h1>
        <p className="text-lg text-zinc-700 dark:text-zinc-400 mb-4">
          These are example Reddit threads. Later, this list will be filled
          automatically based on your keywords.
        </p>

        <div className="mb-6 flex gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-zinc-200 text-black px-4 py-2 text-sm font-medium hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50"
          >
            Home
          </Link>
          <Link
            href="/settings"
            className="inline-flex items-center justify-center rounded-full bg-black text-white px-4 py-2 text-sm font-medium hover:bg-[#383838] dark:bg-white dark:text-black"
          >
            Go to Settings
          </Link>
        </div>

        <div className="space-y-3">
          {fakeLeads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-black dark:text-zinc-50">
                  {lead.title}
                </h2>
                <span className="text-xs rounded-full bg-zinc-100 px-2 py-1 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  Score: {lead.score}
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                r/{lead.subreddit}
              </p>
              <a
                href={lead.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Open thread on Reddit
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
