import { Link } from "react-router-dom";

export default function Tutorial() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">How It Works</h1>
        <p className="mt-2 text-gray-600">
          Simple tutorial to start using PeerCredit.
        </p>

        <div className="mt-8 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Post a request</h2>
            <p className="mt-1 text-sm text-gray-600">
              Describe what you need help with, add topic tags, and set session duration.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Receive offers</h2>
            <p className="mt-1 text-sm text-gray-600">
              Helpers browse your request and send offers based on their skills.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Complete the session</h2>
            <p className="mt-1 text-sm text-gray-600">
              Meet, solve the problem together, and mark the request complete.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Credits transfer</h2>
            <p className="mt-1 text-sm text-gray-600">
              Credits move from requester to helper when the session is finished.
            </p>
          </section>
        </div>

        <div className="mt-8">
          <Link
            to="/explore"
            className="inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    </div>
  );
}




