import { IconButton } from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { useAppDispatch } from "../../app/hooks";
import { openedDrawer } from "../../features/drawerSlice";

export const OpenDrawerButton = () => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(openedDrawer());
  };

  return (
    <IconButton
      onClick={onClick}
      size="large"
      sx={{
        color: "primary.light",
      }}
    >
      <DragHandleIcon />
    </IconButton>
  );
};
