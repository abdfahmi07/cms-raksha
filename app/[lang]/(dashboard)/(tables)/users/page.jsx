"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "./users-table";

const UsersPage = () => {
  return (
    <div className="space-y-5">
      <div className="text-2xl font-medium text-default-800">Users</div>
      <Card>
        {/* <CardHeader>
          <CardTitle>Itineraries</CardTitle>
        </CardHeader> */}
        <CardContent className="p-0">
          <UsersTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
