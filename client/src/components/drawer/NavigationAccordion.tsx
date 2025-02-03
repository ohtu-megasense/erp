import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { getRandomInt } from "../../utils/utils";

interface NavigationAccordionProps {
  title: string;
}

export const NavigationAccordion = ({ title }: NavigationAccordionProps) => {
  return (
    <Accordion
      disableGutters
      sx={{
        boxShadow: "none",
        "&.Mui-expanded": {
          margin: 0,
        },
        "&:before": {
          display: "none",
        },
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
            py: 0,
          }}
        >
          {Array.from({ length: getRandomInt(2, 4) }).map((_, index) => (
            <ListItemButton key={index} sx={{ gap: 2 }}>
              <ListItemText primary={`Item ${index + 1}`} />
            </ListItemButton>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
