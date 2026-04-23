import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getSessionById } from "../services/sessionService";

export default function SessionRequestDetails() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setErrorMessage("We could not find this session.");
      setIsLoading(false);
      return;
    }

    let mounted = true;
    setIsLoading(true);
    setErrorMessage("");

    void getSessionById(sessionId).then(({ data, error }) => {
      if (!mounted) return;

      if (error || !data) {
        setErrorMessage(error?.message ?? "We could not find this session request.");
        setIsLoading(false);
        return;
      }

      const linkedRequestId =
        (data as { request_id?: string | null; request?: { id?: string | null } | null }).request?.id ??
        (data as { request_id?: string | null }).request_id ??
        null;

      if (!linkedRequestId) {
        setErrorMessage("This session is not linked to a request anymore.");
        setIsLoading(false);
        return;
      }

      setRequestId(linkedRequestId);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [sessionId]);

  if (requestId) {
    return <Navigate to={`/requests/${requestId}`} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
        <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Opening request...</h1>
          <p className="mt-2 text-slate-600">
            We&apos;re finding the request linked to this session.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Request not found</h1>
        <p className="mt-2 text-slate-600">
          {errorMessage || "We could not find the request linked to this session."}
        </p>
        <Link
          to="/sessions"
          className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          Back to Sessions
        </Link>
      </main>
    </div>
  );
}


