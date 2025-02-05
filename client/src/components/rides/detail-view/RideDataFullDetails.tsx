import { List } from "@mui/material";
import {
  RideDataKeyType,
  isRideDataKeyType,
  RideData,
  translations,
} from "../../../data/rideData";
import { getLocaleCurrencyString, getLocaleString } from "../../../utils/utils";
import { TextItem } from "./TextItem";
import { LinkItem } from "./LinkItem";

interface RideDataFullDetailsProps {
  rideData: RideData;
}

const getFormattedValue = (
  key: RideDataKeyType,
  value: number | string
): string | number => {
  if (key === "rideDistance") {
    return getLocaleString(value as number);
  }

  if (key === "fareAmount") {
    return getLocaleCurrencyString(value as number);
  }

  return value;
};

export const RideDataFullDetails = ({ rideData }: RideDataFullDetailsProps) => {
  const googleMapsPickupHref = `https://www.google.com/maps/@${rideData?.latitudePickup},${rideData?.longitudePickup},13z`;
  const googleMapsDropoffHref = `https://www.google.com/maps/@${rideData?.latitudeDropoff},${rideData?.longitudeDropoff},13z`;
  const googleMapsDirectionsHref = `https://www.google.com/maps/dir/${rideData?.latitudePickup},${rideData?.longitudePickup}/${rideData?.latitudeDropoff},${rideData?.longitudeDropoff}/@${rideData?.latitudePickup},${rideData?.longitudePickup},13z`;

  return (
    <List disablePadding>
      <LinkItem
        primary="Pickup Location"
        secondary={`${rideData.latitudePickup}, ${rideData.longitudePickup}`}
        href={googleMapsPickupHref}
      />
      <LinkItem
        primary="Dropoff Location"
        secondary={`${rideData.latitudeDropoff}, ${rideData.longitudeDropoff}`}
        href={googleMapsDropoffHref}
      />
      <LinkItem
        primary="Directions"
        secondary=""
        href={googleMapsDirectionsHref}
      />

      {Object.keys(rideData).map((key) => {
        if (!isRideDataKeyType(key)) {
          return null;
        }

        const translation = translations[key];
        const value = rideData[key] as RideDataKeyType;
        const formattedValue = getFormattedValue(key, value);
        return (
          <TextItem
            key={key}
            primary={translation}
            secondary={formattedValue}
          />
        );
      })}
    </List>
  );
};
