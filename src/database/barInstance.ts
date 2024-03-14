import mongoose from "mongoose";

interface IGooglePhotoInterface {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

export type BarSchemaType = {
  address_components: Record<string, any>[];
  adr_address: string;
  business_status: string;
  delivery: boolean;
  dine_in: boolean;
  formatted_address: string;
  formatted_phone_number: string;
  geometry: {
    location: Record<"lat" | "lng", any>[];
  };
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  international_phone_number: string;
  name: string;
  opening_hours: Record<string, any>[];
  photos: IGooglePhotoInterface[];
  place_id: string;
  plus_code: Record<string, any>;
  rating: number;
  reference: string;
  reviews: Record<string, any>[];
  types: string[];
  url: string;
  user_ratings_total: number;
  utc_offset: number;
  vicinity: string;
  website: string;
};

export const barSchema = new mongoose.Schema<BarSchemaType>({
  geometry: {
    location: {
      lat: Number,
      lng: Number,
    },
  },
  address_components: Array,
  adr_address: String,
  business_status: String,
  delivery: Boolean,
  dine_in: Boolean,
  formatted_address: String,
  formatted_phone_number: String,
  icon: String,
  icon_background_color: String,
  icon_mask_base_uri: String,
  international_phone_number: String,
  name: String,
  opening_hours: Array,
  photos: Array,
  place_id: String,
  plus_code: Object,
  rating: Number,
  reference: String,
  reviews: Array,
  types: Array<String>,
  url: String,
  user_ratings_total: Number,
  utc_offset: Number,
  vicinity: String,
  website: String,
});

export const Bar = mongoose.model("Bar", barSchema);
