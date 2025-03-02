import {
  createTheme,
  PaletteOptions,
  Theme,
  ThemeOptions
} from '@mui/material/styles';
import { LinkProps, PaletteMode } from '@mui/material';
import { LinkBehavior } from './LinkBehavior';

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    vars: {
      'mui-drawer-width': number;
    };
  }

  interface PaletteOptions {
    vars?: {
      'mui-drawer-width': number;
    };
  }
}

const lightPalette: PaletteOptions = {};

const darkPalette: PaletteOptions = {
  background: {
    default: '#2a2a2aff',
    paper: '#393939'
  },
  text: {
    primary: '#fcfcfc',
    secondary: '#fcfcfc'
  },
  primary: {
    main: '#55009bff'
  },
  divider: '#79797977'
};

const getPalette = (mode: PaletteMode): PaletteOptions => {
  switch (mode) {
    case 'light':
      return lightPalette;
    case 'dark':
      return darkPalette;
    default:
      throw new Error('Invalid palette mode.');
  }
};

export const getTheme = (mode: PaletteMode): Theme => {
  const customPalette = getPalette(mode);
  const defaultPalette = createTheme().palette;

  const palette: PaletteOptions = {
    ...defaultPalette,
    ...customPalette
  };

  const themeOptions: ThemeOptions = {
    palette: {
      ...palette,
      vars: {
        'mui-drawer-width': 300
      }
    },
    typography: {},
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none'
          }
        }
      },
      MuiLink: {
        styleOverrides: {
          root: {
            all: 'unset'
          }
        },
        defaultProps: {
          component: LinkBehavior
        } as LinkProps
      },
      MuiTextField: {
        defaultProps: {
          autoComplete: 'off'
        }
      }
    }
  };

  return createTheme({ cssVariables: true, ...themeOptions });
};
