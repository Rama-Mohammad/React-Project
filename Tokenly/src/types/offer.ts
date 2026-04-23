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
  submitOffer: (request_id: string, message?: string, availability?: string) => Promise<boolean>;
  fetchOffersByRequest: (request_id: string) => Promise<void>;
  fetchOffersByHelper: (helper_id: string) => Promise<void>;
  changeOfferStatus: (id: string, status: OfferStatus) => Promise<boolean>;
  removeOffer: (id: string) => Promise<boolean>;
};

export type OfferForRequestRow = {
  id: string;
  request_id: string;
  helper_id: string;
  message: string | null;
  availability: string | null;
  status: OfferStatus;
  created_at: string;
  helper: {
    id: string;
    full_name: string | null;
    username: string | null;
    avg_rating: number | null;
    profile_image_url: string | null;
  } | null;
};

export type OfferForHelperRow = {
  id: string;
  request_id: string;
  helper_id: string;
  message: string | null;
  availability: string | null;
  status: OfferStatus;
  created_at: string;
  request: {
    id: string;
    title: string;
    category: string | null;
    status: string;
    urgency: string | null;
    credit_cost: number | null;
    duration_minutes: number | null;
  } | null;
};

export type OfferAppointmentRow = {
  id: string;
  request_id: string;
  helper_id: string;
  message: string | null;
  availability: string | null;
  status: OfferStatus;
  created_at: string;
  request: {
    id: string;
    requester_id: string;
    title: string;
    description: string;
    category: string | null;
    urgency: string | null;
    credit_cost: number | null;
    duration_minutes: number | null;
    status: string;
  } | null;
  helper: {
    id: string;
    full_name: string | null;
    username: string | null;
    avg_rating: number | null;
    profile_image_url: string | null;
  } | null;
};

export type HelpOfferAppointmentRow = {
  id: string;
  helper_id: string;
  title: string;
  description: string | null;
  category: string | null;
  urgency: string | null;
  duration_minutes: number | null;
  credit_cost: number | null;
  status: string;
  created_at: string;
  helper: {
    id: string;
    full_name: string | null;
    username: string | null;
    avg_rating: number | null;
    profile_image_url: string | null;
  } | null;
};

