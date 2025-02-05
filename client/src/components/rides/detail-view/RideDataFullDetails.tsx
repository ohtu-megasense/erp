import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
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
import { TableRowItem } from "./TableRowItem";
import { LocationTableRow } from "./LocationTableRow";

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
  const googleMapsDirectionsHref = `https://www.google.com/maps/dir/${rideData?.latitudePickup},${rideData?.longitudePickup}/${rideData?.latitudeDropoff},${rideData?.longitudeDropoff}/@${rideData?.latitudePickup},${rideData?.longitudePickup},13z`;
  const googleMapsPickupHref = `https://www.google.com/maps/@${rideData?.latitudePickup},${rideData?.longitudePickup},13z`;
  const googleMapsDropoffHref = `https://www.google.com/maps/@${rideData?.latitudeDropoff},${rideData?.longitudeDropoff},13z`;

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
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRowItem property="Property" value="Value" />
          </TableHead>
          <TableBody>
            <TableRowItem property="Ride ID" value={rideData.rideId} />
            <TableRowItem property="Driver ID" value={rideData.driverId} />
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
                <TableRowItem
                  key={key}
                  property={translation}
                  value={formattedValue}
                />
              );
            })}
            <LocationTableRow
              href={googleMapsDirectionsHref}
              label="Directions"
              Icon={MapIcon}
            />
            <LocationTableRow
              href={googleMapsPickupHref}
              label="Pickup Location"
              value={rideData.pickupLocation}
              Icon={PlaceIcon}
            />
            <LocationTableRow
              href={googleMapsDropoffHref}
              label="Dropoff Location"
              value={rideData.dropoffLocation}
              Icon={PlaceIcon}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
