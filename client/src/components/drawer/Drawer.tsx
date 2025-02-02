import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Drawer as MuiDrawer,
  Toolbar,
  useTheme,
} from "@mui/material";
import { NavigationCategory } from "./NavigationCategory";

export const Drawer = () => {
  const theme = useTheme();

  return (
    <MuiDrawer
      sx={{
        width: theme.palette.vars["mui-drawer-width"],
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: theme.palette.vars["mui-drawer-width"],
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <Box sx={{ overflow: "auto", px: 2 }}>
        <List>
          <ListItemButton>
            <ListItemText
              primary={`Home`}
              slotProps={{
                primary: {
                  sx: {},
                },
              }}
            />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary={`Recent`} />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary={`Pinned`} />
          </ListItemButton>
        </List>
        <Divider />
        <NavigationCategory title="My Work" />
        <Divider />
        <NavigationCategory title="Insights" />
        <Divider />
        <NavigationCategory title="Providers" />
        <Divider />
        <NavigationCategory title="Orders" />
        <Divider />
        <NavigationCategory title="Orchestration" />
      </Box>
    </MuiDrawer>
  );
};
