import EditOutlined from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { routes } from "../../../constants/routes";
import { useStyles } from "./EditButton.styles";

/** Header of the edit column (screen-reader only) */
export function EditHeader() {
  const { classes } = useStyles();
  return <Typography component="span" variant="inherit" className={classes.hidden}>עריכה</Typography>;
}

/** Small pencil button in the investigation's row: opens the edit form without opening the row */
export function EditButton({ id }: { id: number }) {
  const { classes } = useStyles();
  return (
    <Tooltip title="עריכת תחקיר">
      <IconButton component={RouterLink} to={routes.editCase(id)} size="small" aria-label={`עריכת תחקיר ${id}`} className={classes.root}>
        <EditOutlined fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
