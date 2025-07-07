// agency-signup-request.type.ts
export interface AgencySignupRequest {
  email: string;
  password: string;
  phone: string;
  description: string;
  vatNumber?: string;
  website?: string;
  managerAdminId: number;
  addressId: number;
}