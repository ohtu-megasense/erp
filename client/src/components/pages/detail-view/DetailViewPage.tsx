import { Box } from "@mui/material";
import { HeadingSection } from "./HeadingSection";
import { DetailViewSection } from "../../rides/detail-view/DetailViewSection";

export const DetailViewPage = () => {
  return (
    <>
      <Box mt={2}>
        <HeadingSection />
      </Box>
      <Box mt={2}>
        <DetailViewSection />
      </Box>
    </>
  );
};
