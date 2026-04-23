import { useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  FileWarning,
  HeartHandshake,
  KeyRound,
  LifeBuoy,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import useAuth from "../hooks/useAuth";

type ResourceLink = {
  title: string;
  description: string;
  to: string;
  icon: typeof LifeBuoy;
  tone: string;
};

const resourceLinks: ResourceLink[] = [
  {
    title: "Help Center",
    description: "Get quick answers, guidance, and support information.",
    to: "/help",
    icon: LifeBuoy,
    tone: "bg-sky-100 text-sky-700",
  },
  {
    title: "Community Guidelines",
    description: "Review the standards for respectful and safe collaboration.",
    to: "/guidelines",
    icon: HeartHandshake,
    tone: "bg-violet-100 text-violet-700",
  },
  {
    title: "Report an Issue",
    description: "Tell us about bugs, abuse, or anything that needs attention.",
    to: "/report",
    icon: FileWarning,
    tone: "bg-amber-100 text-amber-700",
  },
  {
    title: "Account & Safety",
    description: "Read safety guidance and best practices for protecting your account.",
    to: "/account-safety",
    icon: ShieldCheck,
    tone: "bg-emerald-100 text-emerald-700",
  },
];



export default function AccountSettings() {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    setDeletingAccount(true);
    const success = await deleteAccount(user.id);
    setDeletingAccount(false);

    if (success) {
      navigate("/auth", { replace: true });
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="explore-pulse absolute -left-24 top-20 h-64 w-64 rounded-full bg-indigo-200/24 blur-3xl" />
        <div className="explore-float absolute -right-24 top-44 h-72 w-72 rounded-full bg-sky-200/22 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          Back to Profile
        </Link>

        <section className="mt-4 rounded-3xl border border-white/60 bg-white/82 p-5 shadow-sm backdrop-blur-xl sm:p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <Settings2 size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account Settings</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your account, password, support options, and sensitive actions.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-white/60 bg-white/82 p-5 shadow-sm backdrop-blur-xl sm:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Support & Safety</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quick access to the help and policy pages already available in Tokenly.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {resourceLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.to}
                  className="group rounded-2xl border border-slate-200/80 bg-white/90 p-4 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-2xl p-3 ${item.tone}`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                        <ChevronRight
                          size={16}
                          className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-600"
                        />
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-white/60 bg-white/82 p-5 shadow-sm backdrop-blur-xl sm:p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700">
              <KeyRound size={22} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900">Reset Password</h2>
              <p className="mt-1 text-sm text-slate-500">
                Change your password to keep your account secure.
              </p>

              <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
                <p className="text-sm text-slate-600 mb-4">
                  Click the button below to set a new password for your account.
                </p>
                <Link
                  to="/auth?mode=reset"
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 via-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  Reset Password
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-rose-200/80 bg-white/82 p-5 shadow-sm backdrop-blur-xl sm:p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-rose-100 p-3 text-rose-700">
              <ShieldAlert size={22} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">Danger Zone</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Delete Account</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                Permanently delete your account, profile, skills, requests, and offers. Sessions
                you participated in are kept for the other person, but your account will no longer
                be available.
              </p>

              <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
                <p className="text-sm font-medium text-slate-800">This action cannot be undone.</p>
                <p className="mt-1 text-xs leading-6 text-slate-500">
                  Only use this if you are sure you want to permanently remove your Tokenly account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteAccountModal(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 hover:border-rose-400"
              >
                <Trash2 size={15} />
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </main>

      <ConfirmDeleteModal
        isOpen={showDeleteAccountModal}
        title="Delete your account?"
        message="This is permanent and cannot be undone. Your profile, skills, requests, and offers will be removed."
        details="Sessions you participated in will remain visible to the other person, but your name will no longer be attached."
        confirmLabel="Yes, delete my account"
        loading={deletingAccount}
        onCancel={() => setShowDeleteAccountModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}

