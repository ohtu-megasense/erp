import { Divider, Grid2, Stack, Typography } from "@mui/material";

interface KPIItemProps {
  label: string;
  value: string;
}

export const KPIItem = ({ label, value }: KPIItemProps) => {
  return (
    <Grid2>
      <Stack
        sx={{
          textAlign: "center",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          sx={{
            fontWeight: 400,
            p: 2,
            pb: 1,
          }}
        >
          {label}
        </Typography>
        <Divider />
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 20,
            p: 2,
            pt: 1,
          }}
        >
          {value}
        </Typography>
      </Stack>
    </Grid2>
  );
};
