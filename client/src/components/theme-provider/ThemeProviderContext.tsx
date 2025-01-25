import { PaletteMode } from "@mui/material";
import { Dispatch } from "react";
import { createContext } from "react";

interface ISetThemeModeContext {
  mode: PaletteMode;
  setMode: Dispatch<React.SetStateAction<PaletteMode>>;
}

export const SetThemeModeContext = createContext<ISetThemeModeContext>({
  mode: "light",
  setMode: () => {},
});
