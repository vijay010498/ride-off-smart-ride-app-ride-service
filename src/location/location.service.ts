import { Injectable, Logger } from '@nestjs/common';
import {
  AddressComponent,
  Client,
  Language,
  PlaceDetailsRequest,
  PlaceType2,
} from '@googlemaps/google-maps-services-js';
import { MyConfigService } from '../my-config/my-config.service';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);
  private readonly googleMapsClient: Client;

  constructor(private readonly configService: MyConfigService) {
    this.googleMapsClient = new Client({});
  }

  async getPlaceDetails(placeId: string) {
    try {
      const placeDetailsRequest: PlaceDetailsRequest = {
        params: {
          key: this.configService.getGoogleMapsPlacesKey(),
          place_id: placeId,
          language: Language.en,
          region: 'ca',
          fields: [
            'address_components',
            'formatted_address',
            'geometry',
            'url',
            'name',
          ],
        },
      };

      const {
        data: { result },
      } = await this.googleMapsClient.placeDetails(placeDetailsRequest);

      // TODO add code to check only for supported places

      if (!result) return {};
      const {
        postalCode,
        countryShortName,
        countryLongName,
        provinceShortName,
        provinceLongName,
      } = this.decodeAddressComponents(result.address_components);

      return {
        address: result.formatted_address,
        longitude: result.geometry.location.lng,
        latitude: result.geometry.location.lat,
        url: result.url,
        name: result.name,
        postalCode,
        countryShortName,
        countryLongName,
        provinceShortName,
        provinceLongName,
        placeId,
      };
    } catch (error) {
      this.logger.error('getPlaceDetails-error', error);
      throw new Error('Error in Getting Place Details');
    }
  }

  private decodeAddressComponents(addressComponents: AddressComponent[]) {
    let postalCode = null;
    let countryShortName = null;
    let countryLongName = null;
    let provinceShortName = null;
    let provinceLongName = null;

    for (const component of addressComponents) {
      if (component.types.includes(PlaceType2.postal_code)) {
        postalCode = component.short_name;
      }

      if (component.types.includes(PlaceType2.country)) {
        countryShortName = component.short_name;
        countryLongName = component.long_name;
      }

      if (component.types.includes(PlaceType2.administrative_area_level_1)) {
        provinceShortName = component.short_name;
        provinceLongName = component.long_name;
      }
    }

    return {
      postalCode,
      countryShortName,
      countryLongName,
      provinceShortName,
      provinceLongName,
    };
  }
}
