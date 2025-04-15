import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { List, ListItemButton } from '@mui/material';
import { getRandomInt } from '../../utils/utils';
import { DrawerNavigationLink } from './DrawerNavigationLink';
import { ReactNode } from 'react';

interface NavigationAccordionProps {
  title: string;
  isPlaceholder: boolean;
  children?: ReactNode;
}

export const NavigationAccordion = ({
  title,
  isPlaceholder,
  children
}: NavigationAccordionProps) => {
  return (
    <Accordion
      disableGutters
      sx={{
        boxShadow: 'none',
        '&.Mui-expanded': {
          margin: 0
        },
        '&:before': {
          display: 'none'
        }
      }}
    >
      <AccordionSummary
        component={ListItemButton}
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography component="span">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <List
          sx={{
            py: 0
          }}
        >
          {isPlaceholder &&
            Array.from({ length: getRandomInt(2, 4) }).map((_, index) => (
              <DrawerNavigationLink
                key={index}
                href={''}
                text={`Item ${index + 1}`}
              />
            ))}
          {children}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
