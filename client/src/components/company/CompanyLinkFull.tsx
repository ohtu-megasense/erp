import { Link, Stack, Typography } from "@mui/material";
import { CompanyLogo } from "./CompanyLogo";

export const CompanyLinkFull = () => {
  return (
    <Link
      href="https://www.megasense.com/"
      target="_blank"
      sx={{
        all: "unset",
        cursor: "pointer",
      }}
    >
      <Stack flexDirection="row" gap={2}>
        <CompanyLogo />
        <Typography>Megasense</Typography>
      </Stack>
    </Link>
  );
};
