import SvgIcon from "@mui/material/SvgIcon";
import { useStyles } from "./Logo.styles";

/** 3D black box with orange edges and a status light (colours from the theme's CSS variables) */
export function Logo() {
  const { classes } = useStyles();
  return (
    <SvgIcon viewBox="0 0 40 40" aria-hidden="true" className={classes.root} inheritViewBox>
      <path d="M20 3 36 11 20 19 4 11Z" fill="var(--mui-palette-bb-logoTop)" stroke="var(--mui-palette-primary-main)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 11 20 19V37L4 29Z" fill="var(--mui-palette-bb-logoLeft)" stroke="var(--mui-palette-primary-main)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M36 11 20 19V37L36 29Z" fill="var(--mui-palette-bb-logoRight)" stroke="var(--mui-palette-primary-main)" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="28" cy="24" r="2.2" fill="var(--mui-palette-error-main)" />
    </SvgIcon>
  );
}
