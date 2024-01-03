import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import fetch from 'node-fetch';
interface IOAuthUser {
  accessToken: string;
  email: string;
  names: Record<string, any>[];
  photos: Record<string, any>[];
  emailAddresses: any[];
  googleVerified: boolean;
}
@Injectable()
export class GoogleAuthMiddleware implements NestMiddleware {
  // Define the necessary scopes for your application
  private static readonly SCOPES = [
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/user.phoneNumbers.read',
    'https://www.googleapis.com/auth/user.addresses.read',
  ];

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.body.accessToken;
    console.log('Google middleware entered.....................');
    if (!accessToken) {
      throw new HttpException('Unauthorised', HttpStatus.BAD_REQUEST);
    }

    try {
      console.log('Verifying access token...');
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`,
      );
      const data = await response.json();
      if (data.error) {
        throw new HttpException(data.error_description, HttpStatus.BAD_REQUEST);
      }
      console.log('Token Verified...');

      // Fetch additional user info from the People API
      const additionalInfo = await this.fetchAdditionalUserInfo(
        accessToken,
        GoogleAuthMiddleware.SCOPES, // Pass the scopes when calling the method
      );

      req.body.user = {
        googleVerified: data.verified_email,
        email: data.email,
        names: additionalInfo.names,
        photos: additionalInfo.photos,
        emailAddresses: additionalInfo.emailAddresses,
      } as IOAuthUser;
      console.log('authcompleted ..................');
      next();
    } catch (error) {
      console.error('Error during token verification:', error);
      throw new HttpException('Invalid access token', HttpStatus.BAD_REQUEST);
    }
  }

  private async fetchAdditionalUserInfo(
    accessToken: string,
    scopes: string[], // Receive the scopes as a parameter
  ) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    auth.setCredentials({ access_token: accessToken, scope: scopes.join(' ') }); // Set the scopes for the OAuth2 client

    const people = google.people({ version: 'v1', auth });

    try {
      const response = await people.people.get({
        resourceName: 'people/me',
        personFields:
          'names,photos,phoneNumbers,nicknames,locations,addresses,emailAddresses',
      });

      return response.data;
    } catch (error) {
      console.error('Error during fetching additional user info:', error);
      return {};
    }
  }
}
