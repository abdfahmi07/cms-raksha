"use client";
import * as React from "react";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
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
import Player from "next-video/player";
import { toast } from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { data } from "../list-reporting/data";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import card1 from "@/public/images/card/dummy-photo.jpeg";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MessageHeader from "../list-reporting/advanced/components/message-header";
import SearchMessages from "../list-reporting/advanced/components/contact-info/search-messages";
// import MyProfileHeader from "./my-profile-header";
import EmptyMessage from "../list-reporting/advanced/components/empty-message";
import Messages from "../list-reporting/advanced/components/messages";
import Loader from "../list-reporting/advanced/components/loader";
import { isObjectNotEmpty } from "@/lib/utils";
import PinnedMessages from "../list-reporting/advanced/components/pin-messages";
// import ForwardMessage from "./forward-message";
import ContactInfo from "../list-reporting/advanced/components/contact-info";
import { useMediaQuery } from "@/hooks/use-media-query";
// import { cn } from "@/lib/utils";
import {
  getContacts,
  getMessages,
  getProfile,
  sendMessage,
  deleteMessage,
} from "../list-reporting/advanced/components/chat-config";
import MessageFooter from "../list-reporting/advanced/components/message-footer";
import NewsSheet from "./news-sheet";

const columns = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4 font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          {/* <Avatar className=" rounded-full">
            <AvatarImage src={row?.original?.user.avatar} />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar> */}
          <span className="text-sm text-card-foreground whitespace-nowrap">
            {row?.original?.sender?.name}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.getValue("location")}</div>
    ),
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{`${row.getValue("time")} WIB`}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="text-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuSeparator /> */}
              {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}
              <DropdownMenuItem>Confirm Accident</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export function NewsList() {
  const [sorting, setSorting] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [socket, setSocket] = React.useState(null);
  const [confirmSOSData, setConfirmSOSData] = React.useState({});
  const [detailNews, setDetailNews] = React.useState({});
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [isOpenSheet, setIsOpenSheet] = React.useState(false);

  const getListNews = async () => {
    try {
      const { data } = await axios.get(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/news`
      );

      setRows(data.data);
    } catch (err) {
      toast.error(err.response.message || "Something Went Wrong");
    }
  };

  React.useEffect(() => {
    getListNews();
  }, []);

  const getDetailNews = async (newsId) => {
    try {
      const { data } = await axios.get(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/news/${newsId}`
      );

      setDetailNews(data.data);
    } catch (err) {
      toast.error(err.response.message || "Something Went Wrong");
    }
  };

  const handleDialogTriggerClick = (event, newsId) => {
    getDetailNews(newsId);
    // setIsDialogOpen(true);
  };

  const addNewsModal = () => {
    // setSelectedProject(null);
    // setSelectedProjectId(null);
    setDetailNews({});
    setIsOpenSheet(true);
    // wait().then(() => (document.body.style.pointerEvents = "auto"));
  };

  const updateNewsModal = async (newsId) => {
    // setSelectedProject(null);
    // setSelectedProjectId(null);
    await getDetailNews(newsId);
    setIsOpenSheet(true);
    // wait().then(() => (document.body.style.pointerEvents = "auto"));
  };

  const closeModal = () => {
    // setSelectedProject(null);
    // setSelectedProjectId(null);
    setIsOpenSheet(false);
    // wait().then(() => (document.body.style.pointerEvents = "auto"));
  };

  const deleteNews = async (newsId) => {
    try {
      await axios.delete(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/news/${newsId}`
      );

      getListNews();
    } catch (err) {
      toast.error(err.response.message || "Something Went Wrong");
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="text-2xl font-medium text-default-800">News</div>
        <Button onClick={addNewsModal} className="whitespace-nowrap">
          <Plus className="w-4 h-4  ltr:mr-2 rtl:ml-2 " />
          Add News
        </Button>
      </div>
      <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        {rows.length !== 0 ? (
          rows.map((row) => {
            return (
              <Dialog key={row.id}>
                <Card className="">
                  <CardContent className="p-0">
                    <div className="w-full h-[191px] bg-muted-foreground overflow-hidden rounded-t-md">
                      <DialogTrigger
                        asChild
                        onClick={(event) =>
                          handleDialogTriggerClick(event, row.id)
                        }
                      >
                        <Image
                          className="w-full h-full object-cover cursor-pointer"
                          src={row.img}
                          alt="image"
                          width={500}
                          height={500}
                        />
                      </DialogTrigger>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-col gap-y-3">
                        <div className="flex flex-col gap-y-2">
                          <p className="text-muted-foreground text-sm">Title</p>
                          <p className="text-sm capitalize">{row.title}</p>
                        </div>
                        <div className="flex flex-col gap-y-2">
                          <p className="text-muted-foreground text-sm">
                            Description
                          </p>
                          <p className="text-sm capitalize">{row.desc}</p>
                        </div>

                        <div className="flex gap-x-3 mt-2">
                          {/* <Link
                            className="flex-1 block"
                            href={`https://www.google.com/maps/search/?api=1&query=${row.lat}%2C${row.lng}`}
                            target="_blank"
                          > */}
                          <Button
                            className="w-full exclude-element"
                            variant="outline"
                            onClick={() => updateNewsModal(row.id)}
                          >
                            Update
                          </Button>
                          {/* </Link> */}
                          <Button
                            className="flex-1 exclude-element"
                            onClick={() => deleteNews(row.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <DialogContent size="4xl">
                  <DialogHeader>
                    <DialogTitle className="text-base font-medium ">
                      Detail News
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex gap-x-12 mt-2 text-sm text-default-500 space-y-4">
                    <Image
                      className="w-56 object-cover"
                      src={detailNews.img}
                      alt="image"
                      width={500}
                      height={500}
                    />
                    <div className="flex flex-col gap-y-3">
                      <div className="flex flex-col gap-y-2">
                        <p className="text-muted-foreground text-sm">Title</p>
                        <p className="text-sm text-default-900 capitalize">
                          {detailNews.title}
                        </p>
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <p className="text-muted-foreground text-sm">
                          Description
                        </p>
                        <p className="text-sm text-blue-700 capitalize">
                          {detailNews.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="mt-8 gap-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline" color="warning">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            );
          })
        ) : (
          <div className=" font-medium text-default-500">
            I'm Sorry, News Not Found
          </div>
        )}
      </div>

      <NewsSheet
        open={isOpenSheet}
        onClose={closeModal}
        getListNews={getListNews}
        detailNews={detailNews}
        // project={selectedNews}
        // selectedId={selectedProjectId}
      />
    </>
  );
}

export default NewsList;
