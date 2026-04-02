export type OfferStatus = 'pending' | 'accepted' | 'rejected';

export type Offer = {
  id: string;
  request_id: string;
  helper_id: string;
  message?: string;
  status: OfferStatus;
  created_at: string;
}