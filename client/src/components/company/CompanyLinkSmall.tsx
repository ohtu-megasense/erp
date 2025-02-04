import { Link } from "@mui/material";
import { CompanyLogo } from "./CompanyLogo";

export const CompanyLinkSmall = () => {
  return (
    <Link
      href="https://www.megasense.com/"
      target="_blank"
      sx={{
        all: "unset",
        cursor: "pointer",
      }}
    >
      <CompanyLogo />
    </Link>
  );
};
