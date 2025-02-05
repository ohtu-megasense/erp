import { Box } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface SelectVariantsProps {
  searchBy: "rideId" | "driverId";
  onChange: (event: SelectChangeEvent) => void;
}

export const SelectSearchOption = ({
  searchBy,
  onChange,
}: SelectVariantsProps) => {
  return (
    <Box>
      <FormControl variant="standard" sx={{ minWidth: 120 }}>
        <InputLabel>Search by</InputLabel>
        <Select value={searchBy} onChange={onChange} label="Age">
          <MenuItem value={"rideId"}>Ride ID</MenuItem>
          <MenuItem value={"driverId"}>Driver ID</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
