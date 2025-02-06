import { Button, Link, Typography } from '@mui/material';
import { CompanyLogo } from './CompanyLogo';

export const CompanyLinkFull = () => {
  return (
    <Button
      LinkComponent={Link}
      href="https://www.megasense.com/"
      target="_blank"
      sx={{ textTransform: 'none', gap: 2 }}
    >
      <CompanyLogo />
      <Typography color="text.primary" variant="body2">
        Megasense
      </Typography>
    </Button>
  );
};
