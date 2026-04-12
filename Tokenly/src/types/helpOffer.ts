export type HelpOfferStatus = "open" | "closed" | "accepted";

export type HelpOffer = {
  id: string;
  helper_id: string;
  title: string;
  description: string;
  category: string | null;
  urgency: "low" | "medium" | "high" | null;
  duration_minutes: number | null;
  credit_cost: number;
  status: HelpOfferStatus;
  created_at: string;
};

export type HelpOfferInput = {
  helper_id: string;
  title: string;
  description: string;
  category?: string;
  urgency?: "low" | "medium" | "high";
  duration_minutes?: number;
  credit_cost: number;
};

export type HelpOfferUpdateInput = {
  title?: string;
  description?: string;
  category?: string;
  urgency?: "low" | "medium" | "high";
  duration_minutes?: number;
  credit_cost?: number;
  status?: HelpOfferStatus;
};

export type HelpOfferRequestStatus = "pending" | "accepted" | "rejected";

export type HelpOfferRequest = {
  id: string;
  help_offer_id: string;
  requester_id: string;
  message: string | null;
  status: HelpOfferRequestStatus;
  created_at: string;
};

export type HelpOfferRequestInput = {
  help_offer_id: string;
  requester_id: string;
  message?: string;
};

export type UseHelpOffersResult = {
  helpOffer: HelpOffer | null;
  helpOffers: HelpOffer[];
  loading: boolean;
  error: string;
  fetchHelpOfferById: (id: string) => Promise<void>;
  fetchHelpOffersByHelper: (helper_id: string) => Promise<void>;
  fetchOpenHelpOffers: () => Promise<void>;
  createHelpOffer: (data: HelpOfferInput) => Promise<HelpOffer | null>;
  updateHelpOffer: (id: string, updates: HelpOfferUpdateInput) => Promise<boolean>;
  deleteHelpOffer: (id: string) => Promise<boolean>;
};

export type UseHelpOfferRequestsResult = {
  requests: HelpOfferRequest[];
  loading: boolean;
  error: string;
  fetchRequestsForOffer: (help_offer_id: string) => Promise<void>;
  fetchRequestsByUser: (requester_id: string) => Promise<void>;
  submitRequest: (data: HelpOfferRequestInput) => Promise<HelpOfferRequest | null>;
  acceptRequest: (id: string) => Promise<boolean>;
  rejectRequest: (id: string) => Promise<boolean>;
  withdrawRequest: (id: string) => Promise<boolean>;
};