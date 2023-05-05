import * as React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  SortingState,
  getSortedRowModel,
  Row,
} from '@tanstack/react-table';
import { ItemSummary, makeData } from './makeData';

const columnHelper = createColumnHelper<ItemSummary>();

const columns = [
  columnHelper.accessor('description', {
    header: 'Description',
  }),
  columnHelper.accessor('coverType', {
    header: 'Cover Type',
  }),
  columnHelper.accessor('sumInsured', {
    header: 'Sum Insured',
  }),
  columnHelper.accessor('excess', {
    header: 'Excess',
  }),
  columnHelper.accessor('address', {
    header: 'Address',
  }),
];

function App() {
  const partitionKey = 'address';
  const [data] = React.useState<ItemSummary[]>(() => makeData(10));

  const partitions = data.map((row) => String(row[partitionKey])).sort();

  const [globalFilter, setGlobalFilter] = React.useState();

  const [sorting, setSorting] = React.useState<SortingState>([{ id: partitionKey, desc: false }]);

  const rerender = React.useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility: { [partitionKey]: false },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableGlobalFilter: true,
    globalFilterFn: 'equals',
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
  });

  const partitionHeader = (row: Row<ItemSummary>, idx: number) => {
    const isMatchingFilter = globalFilter && globalFilter === partitions[idx];
    const isNewPartition = !globalFilter && (idx === 0 || partitions[idx - 1] !== partitions[idx]);
    return (
      (isMatchingFilter || isNewPartition) && (
        <tr key={partitions[idx]}>
          <td colspan={row.getVisibleCells().length}>{partitions[idx]}</td>
        </tr>
      )
    );
  };

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, idx) => (
            <>
              {partitionHeader(row, idx)}
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            </>
          ))}
        </tbody>
      </table>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
