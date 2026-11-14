import Typography from "@mui/material/Typography";
import { createColumnHelper } from "@tanstack/react-table";
import { Annunciator } from "../../components/ui/Annunciator";
import { UnitChips } from "../../components/ui/UnitChips";
import type { Case } from "../../types/models";
import { ChannelCell } from "./ChannelCell";
import { DateCell } from "./DateCell";
import { EditButton, EditHeader } from "./EditButton";
import { ExpandButton, ExpandHeader } from "./ExpandButton";
import { TitleCell } from "./TitleCell";
import { TypeCell } from "./TypeCell";

const col = createColumnHelper<Case>();

/** Server sort field per sortable column */
export const SORT_FIELD: Record<string, "id" | "subject" | "date"> = { id: "id", title: "subject", date: "date" };

/** Columns of the investigations table (TanStack Table). Sorting is done by the server. */
export const caseColumns = (onOpenCase: (id: number) => void) => [
  col.display({
    id: "expand",
    header: () => <ExpandHeader />,
    cell: ({ row }) => <ExpandButton id={row.original.id} open={row.getIsExpanded()} onToggle={row.getToggleExpandedHandler()} />,
  }),
  col.accessor("id", { header: "מספר", cell: (c) => <ChannelCell id={c.getValue()} /> }),
  col.accessor("title", { header: "נושא", cell: (c) => <TitleCell title={c.getValue()} onOpen={() => onOpenCase(c.row.original.id)} /> }),
  col.accessor("date", { header: "תאריך", cell: (c) => <DateCell date={c.getValue()} /> }),
  col.accessor("type", { header: "סוג", enableSorting: false, cell: (c) => <TypeCell type={c.getValue()} /> }),
  col.accessor("units", { header: "מסגרות", enableSorting: false, cell: (c) => <UnitChips units={c.getValue()} /> }),
  col.accessor("cls", { header: "סיווג", enableSorting: false, cell: (c) => <Annunciator cls={c.getValue()} /> }),
  col.accessor("by", {
    header: "מפרסם",
    enableSorting: false,
    cell: (c) => <Typography variant="body2" color="text.secondary">{c.getValue()}</Typography>,
  }),
  col.display({ id: "edit", header: () => <EditHeader />, cell: ({ row }) => <EditButton id={row.original.id} /> }),
];
