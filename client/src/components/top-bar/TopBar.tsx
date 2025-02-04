import {
  AppBar,
  Divider,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { OpenDrawerButton } from "../drawer/OpenDrawerButton";
import { CompanyLinkSmall } from "../company/CompanyLinkSmall";

export const TopBar = () => {
  const theme = useTheme();
  const isAtleastLarge = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: isAtleastLarge
            ? "calc(100% - var(--mui-palette-vars-mui-drawer-width))"
            : undefined,
          bgcolor: "background.default",
        }}
      >
        <Toolbar sx={{ gap: 2, color: "text.primary" }}>
          {!isAtleastLarge && (
            <>
              <OpenDrawerButton />
              <CompanyLinkSmall />
              <Divider
                orientation="vertical"
                sx={{
                  height: 24,
                  bgcolor: "primary.light",
                }}
              />
              <Typography variant="caption" component="span">
                UI Mockup
              </Typography>
            </>
          )}
        </Toolbar>
        <Divider />
      </AppBar>
      <Toolbar />
    </>
  );
};
