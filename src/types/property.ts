export interface Host {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  photo_id: number;
  image: string;
  description: string | null;
  uploaded_at: string;
  property: number;
}

export interface Property {
  property_id: number;
  host: Host;
  photos: Photo[];
  availabilities: any[]; // TODO: Define availability interface if needed
  title: string;
  description: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip_code: string;
  address_country: string;
  latitude: number | null;
  longitude: number | null;
  property_type: string;
  room_category: string;
  price_per_night: string;
  max_guests: number;
  num_bedrooms: number | null;
  num_beds: number | null;
  num_bathrooms: number | null;
  created_at: string;
  updated_at: string;
}

// House is just another name for Property, which includes Host and Photo
export type House = Property;


export interface PropertyResponse {
  data: Property;
  message?: string;
  status?: string;
} 