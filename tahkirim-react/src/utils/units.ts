import type { Unit } from "../types/models";

/** Unit names for one line of text: "אגף לוגיסטיקה, מפעל ראשי" (or "—" when there are none) */
export const unitNames = (units: Unit[]) => (units.length ? units.map((u) => u.name).join(", ") : "—");
