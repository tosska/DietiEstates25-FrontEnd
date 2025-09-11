export interface Address {
  id?: number;
  street: string;
  houseNumber: string;
  city: string;
  state: string;      // provincia / stato interno
  country: string;
  unitDetail: string;
  postalCode: string;
  longitude?: number | null;
  latitude?: number | null;
}
