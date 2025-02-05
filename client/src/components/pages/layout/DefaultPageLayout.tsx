import { Box, Container } from "@mui/material";
import { TopBar } from "../../top-bar/TopBar";
import { Drawer } from "../../drawer/Drawer";
import { ReactNode } from "react";
import { Outlet } from "react-router";

export const DefaultPageLayout = () => {
  return (
    <>
      <TopBar />
      <Box display="flex">
        <Drawer />
        <Container
          maxWidth="xl"
          sx={{
            mb: 2,
          }}
        >
          <Box component="main">
            <Outlet />
          </Box>
        </Container>
      </Box>
    </>
  );
};
