import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useCallback, useState, type ReactNode } from "react";
import { NotifyContext, type NoticeSeverity } from "../../hooks/useNotify";
import { useStyles } from "./NoticeProvider.styles";

/** Provides useNotify(): short messages at the bottom of the screen. */
export function NoticeProvider({ children }: { children: ReactNode }) {
  const { classes } = useStyles();
  const [notice, setNotice] = useState<{ message: string; severity: NoticeSeverity; key: number } | null>(null);
  const notify = useCallback((message: string, severity: NoticeSeverity = "success") => setNotice({ message, severity, key: Date.now() }), []);

  return (
    <NotifyContext.Provider value={notify}>
      {children}
      <Snackbar
        key={notice?.key}
        open={!!notice}
        autoHideDuration={notice?.severity === "error" ? 6000 : 3000}
        onClose={() => setNotice(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {notice ? (
          <Alert severity={notice.severity} variant="filled" onClose={() => setNotice(null)} className={classes.alert}>
            {notice.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </NotifyContext.Provider>
  );
}
