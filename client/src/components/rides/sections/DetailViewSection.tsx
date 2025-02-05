import { Box, Stack, TextField, Typography } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import { getRideData, RideData } from "../../../data/rideData";
import { SelectSearchOption } from "../detail-view/search/SelectSearchOption";
import { getRequestTimeString } from "../../../utils/utils";
import { RideDataFullDetails } from "../detail-view/RideDataFullDetails";
import { AccordionWrapper } from "../detail-view/AccordionWrapper";

export const DetailViewSection = () => {
  const [id, setId] = useState<string | null>(null);
  const [searchBy, setSearchBy] = useState<"rideId" | "driverId">("rideId");

  const allRideData = getRideData();

  const onChangeSearchBy = (event: SelectChangeEvent) => {
    if (event.target.value === "rideId" || event.target.value === "driverId") {
      setSearchBy(event.target.value);
      return;
    }

    setSearchBy("rideId");
  };

  const getRideDataArray = (): RideData[] => {
    if (id === null) {
      return [];
    }

    if (searchBy === "rideId" && !isNaN(Number(id))) {
      const rideId = Number(id);
      const rideData = allRideData.find(
        (rideData) => rideData.rideId === rideId
      );
      return rideData ? [rideData] : [];
    }

    if (searchBy === "driverId") {
      const driverId = id;
      return allRideData.filter((rideData) => rideData.driverId === driverId);
    }

    return [];
  };

  const rideDataArray = getRideDataArray();

  return (
    <Stack gap={2}>
      <SelectSearchOption onChange={onChangeSearchBy} searchBy={searchBy} />
      <Box>
        <TextField
          variant="standard"
          placeholder={
            searchBy === "rideId" ? "Enter Ride ID" : "Enter Driver ID"
          }
          onChange={({ target }) => setId(target.value)}
        />
      </Box>
      <Box>
        <Typography sx={{ py: 2 }}>
          Found {rideDataArray.length}{" "}
          {rideDataArray.length === 1 ? "ride" : "rides"}
        </Typography>
        <Stack gap={2}>
          {rideDataArray.map((rideData) => (
            <AccordionWrapper
              title={`Ride ${rideData.rideId} - ${getRequestTimeString(
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
    </Stack>
  );
};
