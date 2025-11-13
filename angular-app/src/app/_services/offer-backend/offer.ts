import { Customer } from "../customer-backend/customer";

export interface Offer {
  id: number;
  amount: number;
  message?: string;
  status: 'Accepted' | 'Rejected' | 'Pending';
  offer_Date: Date;
  response_Date?: Date;
  counteroffer: boolean;
  externalName: string;
  customer_id: number;
  agent_id: number;
  listing_id: number;
  customer?: Customer;
}