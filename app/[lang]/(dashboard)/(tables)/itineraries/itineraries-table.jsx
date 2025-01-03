"use client";
import * as React from "react";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { data } from "./data";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ItinerariesTable() {
  const [itineraries, setItineraries] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [detailItinerary, setDetailItinerary] = React.useState({});

  const getDetailItinerary = async (itineraryId) => {
    try {
      const { data } = await axios.get(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/event/${itineraryId}`
      );

      setDetailItinerary(data.data);
    } catch (err) {
      toast.error(err.response.message || "Something Went Wrong");
    }
  };

  console.log(detailItinerary);
  const handleDialogTriggerClick = (event, iteneraryId) => {
    getDetailItinerary(iteneraryId);
    // setIsDialogOpen(true);
  };

  const [columns, setColumns] = React.useState([
    {
      accessorKey: "user.name",
      header: () => {
        return <div className="ml-5">Name</div>;
      },
      cell: ({ row }) => (
        <div className="capitalize whitespace-nowrap ml-5">
          {row.original.user.name}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize whitespace-nowrap">
          {row.getValue("title")}
        </div>
      ),
    },
    // {
    //   accessorKey: "description",
    //   header: "Description",
    //   cell: ({ row }) => (
    //     <div className="capitalize whitespace-nowrap">
    //       {row.getValue("description")
    //         ? row.getValue("description").length > 40
    //           ? `${row.getValue("description").substring(0, 40)}...`
    //           : row.getValue("description")
    //         : "-"}
    //     </div>
    //   ),
    // },
    {
      accessorKey: "destination",
      header: "Destination",
      cell: ({ row }) => (
        <div className="capitalize whitespace-nowrap">
          {`${row.original.state}, ${row.original.continent}`}
        </div>
      ),
    },
    {
      accessorKey: "period",
      header: ({ column }) => {
        return <div className="text-left">Period</div>;
      },
      cell: ({ row }) => (
        <div className="text-left whitespace-nowrap">
          {row.original.start_date} - {row.original.end_date}
        </div>
      ),
    },
    {
      id: "actions",
      header: ({ column }) => {
        return <div className="text-left">Actions</div>;
      },
      cell: ({ row }) => {
        return (
          <div className="flex gap-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className=" h-7 w-7"
                  color="secondary"
                >
                  <Icon icon="heroicons:eye" className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent size="xl">
                <DialogHeader>
                  <DialogTitle className="text-base font-medium text-default-700 ">
                    Detail Itinerary
                  </DialogTitle>
                </DialogHeader>
                <div className="text-sm text-default-500 space-y-4">
                  <div className="flex flex-col gap-y-3">
                    <div className="flex flex-col gap-y-2">
                      <p className="text-muted-foreground text-sm">Name</p>
                      <p className="text-sm text-default-900">
                        {row.original.user.name}
                      </p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <p className="text-muted-foreground text-sm">Title</p>
                      <p className="text-sm text-default-900">
                        {row.original.title}
                      </p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <p className="text-muted-foreground text-sm">
                        Description
                      </p>
                      <p
                        style={{
                          whiteSpace: "pre-line",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                        className="text-sm text-default-900"
                        dangerouslySetInnerHTML={{
                          __html: row.original.description,
                        }}
                      ></p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <p className="text-muted-foreground text-sm">
                        Destination
                      </p>
                      <p className="text-sm text-default-900">{`${row.original.state}, ${row.original.continent}`}</p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <p className="text-muted-foreground text-sm">Period</p>
                      <p className="text-sm text-default-900">{`${row.original.start_date} - ${row.original.end_date}`}</p>
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-8">
                  <DialogClose asChild>
                    <Button variant="outline" color="warning">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ]);

  const getItineraries = async () => {
    try {
      const { data } = await axios.get(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/event`
      );

      setItineraries(data.data);
    } catch (err) {
      toast.error("Something Went Wrong");
    }
  };

  React.useEffect(() => {
    getItineraries();
  }, []);

  const table = useReactTable({
    data: itineraries,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="flex items-center flex-wrap gap-2 px-4">
        {/* <Input
          placeholder="Filter Name..."
          value={table.getColumn("user.name")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("user.name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm min-w-[200px] h-10"
        /> */}
        {/* <DropdownMenu className="self-end">
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center flex-wrap gap-4 px-8 py-4">
        <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex gap-2  items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8"
          >
            <Icon
              icon="heroicons:chevron-left"
              className="w-5 h-5 rtl:rotate-180"
            />
          </Button>

          {table.getPageOptions().map((page, pageIdx) => (
            <Button
              key={`basic-data-table-${pageIdx}`}
              onClick={() => table.setPageIndex(pageIdx)}
              variant={`${
                pageIdx === table.getState().pagination.pageIndex
                  ? ""
                  : "outline"
              }`}
              className={cn("w-8 h-8")}
            >
              {page + 1}
            </Button>
          ))}

          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <Icon
              icon="heroicons:chevron-right"
              className="w-5 h-5 rtl:rotate-180"
            />
          </Button>
        </div>
      </div>
    </>
  );
}

export default ItinerariesTable;
