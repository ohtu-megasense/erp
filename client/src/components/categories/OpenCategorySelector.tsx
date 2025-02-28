import { ListItemButton, ListItemText } from "@mui/material";
import { useAppDispatch } from "../../app/hooks";
import { openedModal } from "../../features/categorySlice";
import { DrawerNavigationLink } from "../drawer/DrawerNavigationLink";

export const OpenCategorySelector = () => {
	const dispatch = useAppDispatch();

	const onClick = () => {
		dispatch(openedModal());
	};

	return <DrawerNavigationLink href="/categories" text="Categories" />;
};
