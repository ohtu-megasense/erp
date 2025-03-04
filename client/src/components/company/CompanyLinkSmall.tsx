import { Button, Link } from '@mui/material';
import { CompanyLogo } from './CompanyLogo';

export const CompanyLinkSmall = () => {
  return (
    <Button
      LinkComponent={Link}
      href="https://www.megasense.com/"
      target="_blank"
    >
      <CompanyLogo />
    </Button>
  );
};
