import { Building2, CreditCard, PlusCircle, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { createTransaction } from "../services/transactionService";

type TokenActionTab = "earn" | "buy";

export default function TokenOptions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TokenActionTab>("earn");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [liveBalance, setLiveBalance] = useState<number | null>(null);
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [iban, setIban] = useState("");
  const [tokenAmount, setTokenAmount] = useState("10");
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const requiredTokens = Number(searchParams.get("required") ?? 0);
  const queryBalance = Number(searchParams.get("balance") ?? 0);
  const currentBalance = liveBalance ?? queryBalance;

  useEffect(() => {
    let mounted = true;

    void supabase.auth.getUser().then(async ({ data, error }) => {
      if (!mounted || error || !data.user?.id) return;

      setCurrentUserId(data.user.id);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("credit_balance")
        .eq("id", data.user.id)
        .single();

      if (!mounted || profileError) return;

      setLiveBalance(Number(profileData?.credit_balance ?? 0));
    });

    return () => {
      mounted = false;
    };
  }, []);

  const shortage = useMemo(
    () => Math.max(0, requiredTokens - currentBalance),
    [currentBalance, requiredTokens]
  );
  const tokenCount = Number(tokenAmount) || 0;
  const tokenUnitPrice = 4;
  const purchaseTotal = tokenCount * tokenUnitPrice;
  const normalizedIban = iban.trim();

  const handleBuyTokens = async () => {
    if (!bankName.trim() || !accountName.trim() || !iban.trim() || !tokenAmount.trim()) {
      setPurchaseMessage("Please fill in all bank account fields first.");
      return;
    }

    if (normalizedIban.length !== 28) {
      setPurchaseMessage("IBAN / account number must be exactly 28 characters.");
      return;
    }

    const tokenAmountNumber = Number(tokenAmount);
    if (!Number.isFinite(tokenAmountNumber) || tokenAmountNumber <= 0) {
      setPurchaseMessage("Please enter a valid number of tokens first.");
      return;
    }

    if (!currentUserId) {
      setPurchaseMessage("Please sign in again to complete your purchase.");
      return;
    }

    setPurchaseLoading(true);

    const nextBalance = currentBalance + tokenAmountNumber;
    const { error: balanceError } = await supabase
      .from("profiles")
      .update({ credit_balance: nextBalance })
      .eq("id", currentUserId);

    if (balanceError) {
      setPurchaseMessage(balanceError.message ?? "Could not update your token balance.");
      setPurchaseLoading(false);
      return;
    }

    const { error: transactionError } = await createTransaction({
      user_id: currentUserId,
      amount: tokenAmountNumber,
      type: "bonus",
      description: `Bank purchase credited ${tokenAmountNumber} tokens.`,
    });

    if (transactionError) {
      setPurchaseMessage(transactionError.message ?? "Your balance was updated, but we could not record the transaction.");
      setLiveBalance(nextBalance);
      setPurchaseLoading(false);
      return;
    }

    setLiveBalance(nextBalance);
    setPurchaseMessage(`Bank purchase completed. ${tokenAmountNumber} tokens were added to your balance.`);
    setPurchaseLoading(false);
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)] text-slate-900">

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-5 lg:px-6 lg:py-8">
        <div className="mb-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/50 bg-white/75 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur transition hover:bg-white"
          >
            Back
          </button>
        </div>

        <section className="explore-glass rounded-3xl border border-white/55 bg-white/80 p-5 backdrop-blur-xl md:p-6">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            Not enough tokens to accept this offer. You have {currentBalance} tokens, but you need {requiredTokens}.
            {shortage > 0 ? ` Add at least ${shortage} more tokens to continue.` : ""}
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">Choose how you want to get tokens</h1>
          <p className="mt-2 text-sm text-slate-600">
            You can earn more by publishing your own offer, or continue with a bank-account token purchase flow.
          </p>

          <div className="mt-5 inline-flex rounded-2xl bg-white/80 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("earn")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "earn"
                  ? "bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Earn Tokens
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("buy")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "buy"
                  ? "bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Buy Tokens
            </button>
          </div>

          {activeTab === "earn" ? (
            <div className="mt-5 rounded-3xl border border-indigo-200 bg-indigo-50/70 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-3 text-indigo-600">
                  <PlusCircle size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Earn tokens by creating your own offer</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Publish a skill offer so other people can book you. Completed sessions help you earn tokens back into your balance.
                  </p>
                </div>
              </div>

              <Link
                to="/create-offer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
              >
                <Wallet size={16} />
                Go to Create Offer
              </Link>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-slate-200 bg-white/90 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Buy tokens with your bank account</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Enter your bank details and token amount to continue with the purchase flow.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Token pricing</p>
                      <p className="mt-1 text-sm text-amber-700">5 tokens = $20</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-600">Estimated total</p>
                      <p className="mt-1 text-lg font-semibold text-amber-900">
                        ${purchaseTotal}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-800">Bank name</label>
                  <input
                    value={bankName}
                    onChange={(event) => setBankName(event.target.value)}
                    placeholder="Your bank"
                    className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-800">Account holder</label>
                  <input
                    value={accountName}
                    onChange={(event) => setAccountName(event.target.value)}
                    placeholder="Full account name"
                    className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-800">IBAN / account number</label>
                  <input
                    value={iban}
                    onChange={(event) => setIban(event.target.value.slice(0, 28))}
                    placeholder="Bank account number"
                    maxLength={28}
                    className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                  <p className="mt-1 text-xs text-slate-400">{normalizedIban.length}/28 characters</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-800">Tokens to buy</label>
                  <input
                    value={tokenAmount}
                    onChange={(event) => setTokenAmount(event.target.value)}
                    placeholder="e.g. 20"
                    className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleBuyTokens()}
                disabled={purchaseLoading}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Building2 size={16} />
                {purchaseLoading ? "Processing..." : "Continue with Bank Account"}
              </button>

              {purchaseMessage ? (
                <p className={`mt-3 text-sm font-medium ${purchaseMessage.startsWith("Please") ? "text-rose-600" : "text-emerald-600"}`}>
                  {purchaseMessage}
                </p>
              ) : null}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


