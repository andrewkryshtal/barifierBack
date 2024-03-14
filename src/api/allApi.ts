import api from "api";
import { config } from "dotenv";

const { parsed } = config();

export const fsqSdk = api("@fsq-docs/v1.0#3qzzviakl47e7mgp").auth(
  parsed.FOURSQUARE_TOKEN
);
