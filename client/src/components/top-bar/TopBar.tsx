import {
  AppBar,
  Box,
  Divider,
  Link,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

export const TopBar = () => {
  const theme = useTheme();

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "background.default",
          cursor: "default",
        }}
      >
        <Toolbar sx={{ gap: 2, color: "text.primary" }}>
          <Link
            href="https://www.megasense.com/"
            target="_blank"
            sx={{
              all: "unset",
              cursor: "pointer",
            }}
          >
            <Stack flexDirection="row" gap={2}>
              <Box
                component="img"
                src="https://www.megasense.com/_astro/go2-logo.788a5759.svg"
                sx={{
                  height: 24,
                }}
              />
              <Typography>Megasense</Typography>
            </Stack>
          </Link>
          <Divider
            orientation="vertical"
            sx={{
              height: 24,
            }}
          />
          <Typography variant="caption">Dashboard UI Mockup</Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          mb: theme.mixins.toolbar,
        }}
      />
    </>
  );
};
