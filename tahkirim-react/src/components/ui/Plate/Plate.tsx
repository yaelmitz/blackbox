import Paper, { type PaperProps } from "@mui/material/Paper";
import { forwardRef, type ElementType, type JSX, type Ref } from "react";
import { useStyles } from "./Plate.styles";

interface PlateOwnProps {
  /** orange corner caps instead of metal (highlighted instrument) */
  hot?: boolean;
  /** hide the two screw heads in the top corners */
  noScrews?: boolean;
}

type PlateProps<C extends ElementType> = PaperProps<C, { component?: C }> & PlateOwnProps;

/**
 * Instrument panel of the recorder: armoured corner caps, two screw heads and a soft sheen.
 * Accepts every MUI Paper prop, including `component`.
 */
export const Plate = forwardRef(function Plate({ hot = false, noScrews = false, className, ...rest }: PlateProps<ElementType>, ref: Ref<HTMLElement>) {
  const { classes, cx } = useStyles({ hot, noScrews });
  return <Paper ref={ref as Ref<HTMLDivElement>} className={cx(classes.root, className)} {...(rest as PaperProps)} />;
}) as <C extends ElementType = "div">(props: PlateProps<C> & { ref?: Ref<HTMLElement> }) => JSX.Element;
