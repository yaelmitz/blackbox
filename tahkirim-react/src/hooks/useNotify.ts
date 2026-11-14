import { createContext, useContext } from "react";

export type NoticeSeverity = "success" | "error" | "info";
export type Notify = (message: string, severity?: NoticeSeverity) => void;

export const NotifyContext = createContext<Notify>(() => {});

/** Shows a short message at the bottom of the screen (see components/NoticeProvider). */
export const useNotify = () => useContext(NotifyContext);
