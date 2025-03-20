import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

interface CommonDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  setPageIndex: (pageIndex: number) => void;
}

// Type declaration to extend ColumnDef with our custom meta properties
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    alignment?: 'left' | 'right' | 'center';
  }
}

export function CommonDataTable<TData, TValue>({
  columns,
  data,
  pageCount,
}: CommonDataTableProps<TData, TValue>): JSX.Element {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  });

  return (
    <Table className="[&_tr:nth-child(odd)>td]:bg-brand-weak [&_tr:nth-child(odd)>td:first-child]:rounded-l-sm [&_tr:nth-child(odd)>td:last-child]:rounded-r-sm">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                className={cn(
                  'font-semibold text-neutral-weak text-xs',
                  header.column.columnDef.meta?.alignment === 'right' &&
                    'text-right',
                  header.column.columnDef.meta?.alignment === 'center' &&
                    'text-center',
                )}
                key={header.id}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow data-state={row.getIsSelected() && 'selected'} key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                className={cn(
                  'p-3 text-xs',
                  cell.column.columnDef.meta?.alignment === 'right' &&
                    'text-right',
                  cell.column.columnDef.meta?.alignment === 'center' &&
                    'text-center',
                )}
                key={cell.id}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
