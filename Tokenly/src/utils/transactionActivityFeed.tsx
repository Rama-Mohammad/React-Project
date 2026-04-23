import {
  HandCoins,
  Send,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  TransactionActivityFeedItem,
  TransactionActivityRow,
} from "../types/transactionActivity";

type TransactionActivityAppearance = {
  icon: LucideIcon;
  toneClass: string;
};

const transactionAppearanceMap: Record<string, TransactionActivityAppearance> = {
  earn: {
    icon: HandCoins,
    toneClass: "bg-indigo-100 text-indigo-700",
  },
  bonus: {
    icon: Sparkles,
    toneClass: "bg-violet-100 text-violet-700",
  },
  spend: {
    icon: Send,
    toneClass: "bg-sky-100 text-sky-700",
  },
};

export function formatTransactionType(type?: string | null) {
  if (!type) return "";

  return type
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveTokenAmount(item: TransactionActivityRow) {
  const rawAmount =
    item.amount ??
    item.credit_amount ??
    item.token_amount ??
    item.credits ??
    null;

  if (rawAmount == null) return null;

  const numericAmount = Number(rawAmount);
  if (!Number.isFinite(numericAmount) || numericAmount === 0) return null;

  return numericAmount;
}

function getTokenDirection(item: TransactionActivityRow): "added" | "deducted" | null {
  const amount = resolveTokenAmount(item);

  if (amount != null) {
    return amount > 0 ? "added" : "deducted";
  }

  const combinedText = `${item.type ?? ""} ${item.title ?? ""} ${item.description ?? ""}`.toLowerCase();

  if (
    combinedText.includes("credit") ||
    combinedText.includes("earned") ||
    combinedText.includes("released") ||
    combinedText.includes("added") ||
    combinedText.includes("received") ||
    combinedText.includes("bonus")
  ) {
    return "added";
  }

  if (
    combinedText.includes("spent") ||
    combinedText.includes("deduct") ||
    combinedText.includes("charged") ||
    combinedText.includes("paid") ||
    combinedText.includes("minus")
  ) {
    return "deducted";
  }

  return null;
}

export function getTransactionTokenBadge(item: TransactionActivityRow) {
  const amount = resolveTokenAmount(item);
  const direction = getTokenDirection(item);

  if (amount != null) {
    return {
      label: amount > 0 ? `+${amount}` : `${amount}`,
      toneClass: amount > 0
        ? "border-indigo-300 bg-indigo-50 text-indigo-700"
        : "border-sky-300 bg-sky-50 text-sky-700",
    };
  }

  if (direction === "added") {
    return {
      label: "Tokens added",
      toneClass: "border-indigo-300 bg-indigo-50 text-indigo-700",
    };
  }

  if (direction === "deducted") {
    return {
      label: "Tokens deducted",
      toneClass: "border-sky-300 bg-sky-50 text-sky-700",
    };
  }

  return {
    label: formatTransactionType(item.type) || "Transaction",
    toneClass: "border-slate-200 bg-slate-50 text-slate-700",
  };
}

export function mapTransactionFeedItem(
  item: TransactionActivityRow
): TransactionActivityFeedItem {
  const tokenBadge = getTransactionTokenBadge(item);
  const defaultTitle =
    item.type === "earn"
      ? "Tokens earned"
      : item.type === "bonus"
        ? "Bonus tokens"
        : item.type === "spend"
          ? "Tokens spent"
          : formatTransactionType(item.type) || "Transaction";

  return {
    ...item,
    displayTitle: item.title?.trim() || defaultTitle,
    displayDescription: item.description?.trim() || "",
    displayTypeLabel: formatTransactionType(item.type) || "Transaction",
    tokenBadgeLabel: tokenBadge.label,
    tokenBadgeToneClass: tokenBadge.toneClass,
  };
}

export function getTransactionAppearance(type?: string | null): TransactionActivityAppearance {
  if (!type) {
    return {
      icon: Sparkles,
      toneClass: "bg-slate-100 text-slate-700",
    };
  }

  return (
    transactionAppearanceMap[type] ?? {
      icon: Sparkles,
      toneClass: "bg-slate-100 text-slate-700",
    }
  );
}

