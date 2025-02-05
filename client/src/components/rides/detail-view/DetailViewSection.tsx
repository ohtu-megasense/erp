import { DetailView } from "./DetailView";
import { Box, Stack, TextField } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import { getRideData, RideData } from "../../../data/rideData";
import { SelectSearchOption } from "./SelectSearchOption";

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
      <DetailView rideDataArray={rideDataArray} />
    </Stack>
  );
};
