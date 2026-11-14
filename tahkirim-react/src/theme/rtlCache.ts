import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

/** Emotion cache that flips left/right so MUI lays out right-to-left (Hebrew). */
export const rtlCache = createCache({ key: "muirtl", stylisPlugins: [prefixer, rtlPlugin] });
