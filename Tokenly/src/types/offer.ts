export type OfferStatus = 'pending' | 'accepted' | 'rejected';

export type Offer = {
  id: string;
  request_id: string;
  helper_id: string;
  message?: string;
  availability?: string;
  status: OfferStatus;
  created_at: string;
};

export type UseOffersResult = {
  offer: Offer | null;
  offers: Offer[];
  loading: boolean;
  error: string;
  submitOffer: (request_id: string, helper_id: string, message?: string, availability?: string) => Promise<boolean>;
  fetchOffersByRequest: (request_id: string) => Promise<void>;
  fetchOffersByHelper: (helper_id: string) => Promise<void>;
  changeOfferStatus: (id: string, status: OfferStatus) => Promise<boolean>;
  removeOffer: (id: string) => Promise<boolean>;
};
