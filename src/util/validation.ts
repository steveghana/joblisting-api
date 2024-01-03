/* === Storage Utilities ===*/
import { OAuth2Client } from 'google-auth-library';
type value = {
  [key: string]: any;
};
export const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);
