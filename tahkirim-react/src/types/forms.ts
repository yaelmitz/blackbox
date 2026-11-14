import type { TextOrFile } from "./models";

/** react-hook-form values of the create / edit investigation form */
export interface CaseFormValues {
  id: number;
  title: string;
  date: string;
  type: string;
  cls: "" | "0" | "1" | "2";
  /** מסגרות – unit ids */
  unitIds: number[];
  by: string;
  background: string;
  questions: string;
  location: TextOrFile;
  coordinates: TextOrFile;
  whatHappenedHtml: string;
  whatPlannedHtml: string;
  conclusionsHtml: string;
  /** `rid`: server id of an existing recommendation (edit mode) */
  recommendations: { rid?: number; text: string }[];
  /** `lid`: server id of an existing lesson (edit mode) */
  lessons: { lid?: number; title: string }[];
  sources: TextOrFile;
  roles: string;
}
