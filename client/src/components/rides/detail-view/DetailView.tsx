import { Box, Stack, Typography } from "@mui/material";
import { RideData } from "../../../data/rideData";
import { getPickupDateString } from "../../../utils/utils";
import { AccordionWrapper } from "./AccordionWrapper";
import { RideDataFullDetails } from "./RideDataFullDetails";

interface DetailViewProps {
  rideDataArray: RideData[];
}

export const DetailView = ({ rideDataArray }: DetailViewProps) => {
  return (
    <Box>
      <Typography sx={{ py: 2 }}>
        Found {rideDataArray.length}{" "}
        {rideDataArray.length === 1 ? "ride" : "rides"}
      </Typography>
      <Stack gap={2}>
        {rideDataArray.map((rideData) => (
          <AccordionWrapper
            title={`Ride ${rideData.rideId} - ${getPickupDateString(
              rideData.requestTime
            )}`}
            key={rideData.rideId}
            defaultExpanded={rideDataArray.length === 1}
          >
            <RideDataFullDetails key={rideData.rideId} rideData={rideData} />
          </AccordionWrapper>
        ))}
      </Stack>
    </Box>
  );
};
