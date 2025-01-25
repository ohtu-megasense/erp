import {
  createTheme,
  PaletteOptions,
  Theme,
  ThemeOptions,
} from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

declare module "@mui/material/styles/createPalette" {
  interface Palette {}
  interface PaletteOptions {}
}

const lightPalette: PaletteOptions = {};

const darkPalette: PaletteOptions = {
  background: {
    default: "#2a2a2aff",
    paper: "#393939",
  },
  text: {
    primary: "#fcfcfc",
    secondary: "#fcfcfc",
  },
  primary: {
    main: "#55009bff",
  },
  divider: "#79797977",
};

const getPalette = (mode: PaletteMode): PaletteOptions => {
  switch (mode) {
    case "light":
      return lightPalette;
    case "dark":
      return darkPalette;
    default:
      throw new Error("Invalid palette mode.");
  }
};

export const getTheme = (mode: PaletteMode): Theme => {
  const customPalette = getPalette(mode);
  const defaultPalette = createTheme().palette;

  const palette = {
    ...defaultPalette,
    ...customPalette,
  };

  const themeOptions: ThemeOptions = {
    palette,
    typography: {},
    components: {},
  };

  return createTheme(themeOptions);
};
