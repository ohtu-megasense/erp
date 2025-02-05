import { List } from "@mui/material";
import {
  RideDataKeyType,
  isRideDataKeyType,
  RideData,
  translations,
} from "../../../data/rideData";
import {
  getLocaleCurrencyString,
  getLocaleString,
  getLocaleTimeString,
} from "../../../utils/utils";
import PlaceIcon from "@mui/icons-material/Place";
import MapIcon from "@mui/icons-material/Map";
import { LinkItem } from "./items/LinkItem";
import { TextItem } from "./items/TextItem";

interface RideDataFullDetailsProps {
  rideData: RideData;
}

const getFormattedValue = (
  key: RideDataKeyType,
  value: number | string
): string | number => {
  if (key === "rideDistance") {
    return getLocaleString(value as number) + " miles";
  }

  if (key === "fareAmount") {
    return getLocaleCurrencyString(value as number) + " USD";
  }

  if (key === "requestTime") {
    const date = new Date(value);
    return getLocaleTimeString(date);
  }

  return value;
};

export const RideDataFullDetails = ({ rideData }: RideDataFullDetailsProps) => {
  const googleMapsPickupHref = `https://www.google.com/maps/@${rideData?.latitudePickup},${rideData?.longitudePickup},13z`;
  const googleMapsDropoffHref = `https://www.google.com/maps/@${rideData?.latitudeDropoff},${rideData?.longitudeDropoff},13z`;
  const googleMapsDirectionsHref = `https://www.google.com/maps/dir/${rideData?.latitudePickup},${rideData?.longitudePickup}/${rideData?.latitudeDropoff},${rideData?.longitudeDropoff}/@${rideData?.latitudePickup},${rideData?.longitudePickup},13z`;

  const ignoredKeys: RideDataKeyType[] = [
    "pickupLocation",
    "dropoffLocation",
    "latitudeDropoff",
    "longitudeDropoff",
    "latitudePickup",
    "longitudePickup",
    "rideId",
    "driverId",
  ];

  return (
    <List disablePadding>
      <LinkItem
        primary="Pickup Location"
        secondary={`${rideData.latitudePickup}, ${rideData.longitudePickup}`}
        href={googleMapsPickupHref}
        icon={<PlaceIcon />}
      />
      <LinkItem
        primary="Dropoff Location"
        secondary={`${rideData.latitudeDropoff}, ${rideData.longitudeDropoff}`}
        href={googleMapsDropoffHref}
        icon={<PlaceIcon />}
      />
      <LinkItem
        primary="Directions"
        secondary=""
        href={googleMapsDirectionsHref}
        icon={<MapIcon />}
      />
      <TextItem primary="Ride ID" secondary={rideData.rideId} />
      <TextItem primary="Driver ID" secondary={rideData.driverId} />
      {Object.keys(rideData).map((key) => {
        if (!isRideDataKeyType(key)) {
          return null;
        }

        if (ignoredKeys.includes(key)) {
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
