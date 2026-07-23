"use client";

import * as React from "react";
import { Button, Checkbox } from "@/components/br/primitives";
import { ChevronL, ChevronR, ChevronsUpDown, Sort } from "@/components/br/icons";
import { EmptyState, ErrorState, LoadingState } from "@/components/br/states";
import { cn } from "@/lib/utils";

type SortDirection = "asc" | "desc";
type SortValue = string | number | Date | null | undefined;

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  numeric?: boolean;
  width?: string;
  sortValue?: (row: T) => SortValue;
}

export interface DataTableProps<T> {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId?: (row: T, index: number) => string;
  loading?: boolean;
  error?: React.ReactNode;
  empty?: React.ReactNode;
  pageSize?: number;
  selectable?: boolean;
  stickyHeader?: boolean;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (ids: string[], rows: T[]) => void;
  initialSort?: { id: string; direction: SortDirection };
  className?: string;
}

function normalizeSortValue(value: SortValue) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string") return value.toLocaleLowerCase();
  return value ?? "";
}

function getCellValue<T>(row: T, column: DataTableColumn<T>) {
  if (column.cell) return column.cell(row);
  if (typeof column.accessor === "function") return column.accessor(row);
  if (column.accessor) return row[column.accessor] as React.ReactNode;
  return null;
}

function getSortValue<T>(row: T, column: DataTableColumn<T>) {
  if (column.sortValue) return column.sortValue(row);
  const value = getCellValue(row, column);
  if (typeof value === "string" || typeof value === "number" || value instanceof Date) return value;
  return "";
}

export function DataTable<T>({
  title,
  actions,
  columns,
  rows,
  getRowId = (_row, index) => String(index),
  loading,
  error,
  empty,
  pageSize,
  selectable,
  stickyHeader = true,
  onRowClick,
  onSelectionChange,
  initialSort,
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState(initialSort);
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const rowIds = React.useMemo(() => rows.map((row, index) => getRowId(row, index)), [rows, getRowId]);
  const sortedRows = React.useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((item) => item.id === sort.id);
    if (!column) return rows;
    return [...rows].sort((a, b) => {
      const aValue = normalizeSortValue(getSortValue(a, column));
      const bValue = normalizeSortValue(getSortValue(b, column));
      const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sort.direction === "asc" ? result : -result;
    });
  }, [columns, rows, sort]);

  const paginated = Boolean(pageSize && pageSize > 0 && sortedRows.length > pageSize);
  const pageCount = paginated && pageSize ? Math.ceil(sortedRows.length / pageSize) : 1;
  const safePage = Math.min(page, pageCount - 1);
  const visibleRows =
    paginated && pageSize
      ? sortedRows.slice(safePage * pageSize, safePage * pageSize + pageSize)
      : sortedRows;

  const publishSelection = (next: Set<string>) => {
    setSelected(next);
    onSelectionChange?.(
      [...next],
      rows.filter((row, index) => next.has(rowIds[index]))
    );
  };

  const toggleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) return;
    setSort((current) => {
      if (!current || current.id !== column.id) return { id: column.id, direction: "asc" };
      return { id: column.id, direction: current.direction === "asc" ? "desc" : "asc" };
    });
    setPage(0);
  };

  const visibleIds = visibleRows.map((row) => rowIds[rows.indexOf(row)]);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

  return (
    <div className={cn("br-data-table", stickyHeader && "sticky", className)}>
      {(title || actions) && (
        <div className="br-data-table-head">
          <div>
            {title && <h3>{title}</h3>}
            <span>{rows.length} rows</span>
          </div>
          {actions && <div className="actions">{actions}</div>}
        </div>
      )}

      {loading ? (
        <LoadingState compact title="Loading rows." description="The table will update when data arrives." />
      ) : error ? (
        <ErrorState compact title="Table unavailable." description={error} action={null} />
      ) : rows.length === 0 ? (
        empty || <EmptyState compact title="No rows found." description="Try changing filters or add a new item." />
      ) : (
        <>
          <div className="br-data-table-scroll">
            <table>
              <thead>
                <tr>
                  {selectable && (
                    <th className="select">
                      <Checkbox
                        checked={allVisibleSelected}
                        aria-label="Select visible rows"
                        onChange={(checked) => {
                          const next = new Set(selected);
                          visibleIds.forEach((id) => {
                            if (checked) next.add(id);
                            else next.delete(id);
                          });
                          publishSelection(next);
                        }}
                      />
                    </th>
                  )}
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      className={cn(column.numeric && "num", column.sortable && "sortable")}
                      style={{ width: column.width }}
                      aria-sort={
                        sort?.id === column.id
                          ? sort.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : undefined
                      }
                    >
                      {column.sortable ? (
                        <button type="button" onClick={() => toggleSort(column)}>
                          {column.header}
                          {sort?.id === column.id ? <Sort size={12} /> : <ChevronsUpDown size={12} />}
                        </button>
                      ) : (
                        column.header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => {
                  const originalIndex = rows.indexOf(row);
                  const rowId = rowIds[originalIndex];
                  return (
                    <tr
                      key={rowId}
                      data-selected={selected.has(rowId) || undefined}
                      onClick={() => onRowClick?.(row)}
                    >
                      {selectable && (
                        <td className="select" onClick={(event) => event.stopPropagation()}>
                          <Checkbox
                            checked={selected.has(rowId)}
                            aria-label={`Select row ${rowId}`}
                            onChange={(checked) => {
                              const next = new Set(selected);
                              if (checked) next.add(rowId);
                              else next.delete(rowId);
                              publishSelection(next);
                            }}
                          />
                        </td>
                      )}
                      {columns.map((column) => (
                        <td key={column.id} className={cn(column.numeric && "num")}>
                          {getCellValue(row, column)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {paginated && (
            <div className="br-data-table-foot">
              <span>
                Page {safePage + 1} of {pageCount}
              </span>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<ChevronL size={13} />}
                  disabled={safePage === 0}
                  onClick={() => setPage((value) => Math.max(0, value - 1))}
                >
                  Prev
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconRight={<ChevronR size={13} />}
                  disabled={safePage >= pageCount - 1}
                  onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

