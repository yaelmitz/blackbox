import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type ExpandedState,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { Fragment, useMemo } from "react";
import { Plate } from "../../../components/ui/Plate";
import { PAGE_SIZES } from "../../../constants/query";
import type { Case } from "../../../types/models";
import { CaseLessons } from "../CaseLessons";
import { caseColumns } from "../caseColumns";
import { useStyles } from "./CasesTable.styles";

interface Props {
  rows: Case[];
  total: number;
  loading: boolean;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  expanded: ExpandedState;
  onExpandedChange: OnChangeFn<ExpandedState>;
  highlightId?: number;
  onOpenCase: (id: number) => void;
  onGoToLesson: (lessonId: number) => void;
}

/**
 * Investigations table: TanStack Table for state (pagination, sorting, expanded rows),
 * MUI Table for rendering. Pagination and sorting are done by the server (manual mode).
 */

export function CasesTable(p: Props) {
  const { classes, cx } = useStyles();
  const columns = useMemo(() => caseColumns(p.onOpenCase), [p.onOpenCase]);
  const table = useReactTable({
    data: p.rows,
    columns,
    getRowId: (r) => String(r.id),
    state: { pagination: p.pagination, sorting: p.sorting, expanded: p.expanded },
    onPaginationChange: p.onPaginationChange,
    onSortingChange: p.onSortingChange,
    onExpandedChange: p.onExpandedChange,
    manualPagination: true,
    manualSorting: true,
    rowCount: p.total,
    enableSortingRemoval: false,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const colCount = table.getVisibleLeafColumns().length;

  return (
    <Plate noScrews className={classes.root}>
      <Box className={classes.progress}>{p.loading && <LinearProgress />}</Box>
      <TableContainer className={classes.scroll}>
        <Table className={classes.table} aria-label="טבלת תחקירים">
          <TableHead>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableCell key={h.id} className={cx(classes.head, (h.column.id === "expand" || h.column.id === "edit") && classes.expandCol)} sortDirection={h.column.getIsSorted() || false}>
                    {h.column.getCanSort() ? (
                      <TableSortLabel
                        active={!!h.column.getIsSorted()}
                        direction={h.column.getIsSorted() === "asc" ? "asc" : "desc"}
                        onClick={h.column.getToggleSortingHandler()}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </TableSortLabel>
                    ) : (
                      flexRender(h.column.columnDef.header, h.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow hover className={cx(classes.row, row.original.id === p.highlightId && classes.highlight)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow className={classes.openRow}>
                    <TableCell colSpan={colCount} className={classes.openCell}>
                      <CaseLessons c={row.original} onGoToLesson={p.onGoToLesson} />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={p.total}
        page={table.getState().pagination.pageIndex}
        rowsPerPage={table.getState().pagination.pageSize}
        rowsPerPageOptions={[...PAGE_SIZES]}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={(e) => table.setPagination({ pageIndex: 0, pageSize: Number(e.target.value) })}
        labelRowsPerPage="שורות בעמוד"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} מתוך ${count}`}
        getItemAriaLabel={(type) => (type === "next" ? "העמוד הבא" : type === "previous" ? "העמוד הקודם" : type === "first" ? "העמוד הראשון" : "העמוד האחרון")}
        showFirstButton
        showLastButton
        className={classes.pagination}
      />
    </Plate>
  );
}
