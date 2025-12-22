// agency-signup-request.type.ts
export interface AgencySignupRequest {
  email: string;
  password: string;
  phone: string;
  description: string;
  vatNumber?: string;
  website?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  unitDetail?: string;
  houseNumber?: string;
  country?: string;
  longitude?: string;
  latitude?: string;
  managerAdminId?: number;
  addressId?: number;
}