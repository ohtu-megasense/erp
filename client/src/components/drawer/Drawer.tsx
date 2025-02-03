import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Drawer as MuiDrawer,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NavigationCategory } from "./NavigationCategory";
import { NavigationAccordion } from "./NavigationAccordion";
import { CompanyLink } from "../company/CompanyLink";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closedDrawer } from "../../features/drawerSlice";

export const Drawer = () => {
  const isOpen = useAppSelector((state) => state.drawer.isOpen);
  const theme = useTheme();
  const isAtleastLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(closedDrawer());
  };

  return (
    <MuiDrawer
      sx={{
        width: theme.palette.vars["mui-drawer-width"],
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: theme.palette.vars["mui-drawer-width"],
          boxSizing: "border-box",
          borderRight: 0,
        },
      }}
      variant={isAtleastLarge ? "permanent" : "temporary"}
      anchor="left"
      open={isOpen}
      onClose={onClose}
    >
      <Toolbar sx={{ gap: 2, color: "text.primary" }}>
        <CompanyLink />
        <Divider
          orientation="vertical"
          sx={{
            height: 24,
          }}
        />
        <Typography variant="caption" component="span">
          UI Mockup
        </Typography>
      </Toolbar>
      <Box
        sx={{
          overflow: "auto",
          px: 2,
          borderRight: 1,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <List>
          <ListItemButton>
            <ListItemText primary="Home" />
          </ListItemButton>
          <NavigationAccordion title="Recent" />
          <NavigationAccordion title="Pinned" />
        </List>
        <NavigationCategory title="My Work" />
        <NavigationCategory title="Insights" />
        <NavigationCategory title="Providers" />
        <NavigationCategory title="Orders" />
        <NavigationCategory title="Orchestration" />
      </Box>
    </MuiDrawer>
  );
};
