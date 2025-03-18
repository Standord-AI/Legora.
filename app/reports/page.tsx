"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText, Search, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function ReportsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Sample reports data
  const reports = [
    {
      id: "1",
      name: "Employment_Contract_2023.pdf",
      date: "2023-11-15",
      score: 78,
      status: "Issues Found",
    },
    {
      id: "2",
      name: "Contractor_Agreement.pdf",
      date: "2023-11-10",
      score: 92,
      status: "Compliant",
    },
    {
      id: "3",
      name: "Executive_Employment_Agreement.pdf",
      date: "2023-11-05",
      score: 65,
      status: "Critical Issues",
    },
    {
      id: "4",
      name: "Internship_Contract.pdf",
      date: "2023-10-28",
      score: 88,
      status: "Issues Found",
    },
    {
      id: "5",
      name: "Remote_Work_Agreement.pdf",
      date: "2023-10-20",
      score: 95,
      status: "Compliant",
    },
  ];

  // Filter reports based on search term and status filter
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "compliant" && report.score >= 90) ||
      (filterStatus === "issues" && report.score < 90 && report.score >= 70) ||
      (filterStatus === "critical" && report.score < 70);

    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">All Reports</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Reports</CardTitle>
            <CardDescription>
              View and manage all your contract compliance reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="issues">Issues Found</SelectItem>
                    <SelectItem value="critical">Critical Issues</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Compliance Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            {report.name}
                          </div>
                        </TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              report.score >= 90
                                ? "default"
                                : report.score >= 70
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {report.score}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              report.status === "Compliant"
                                ? "default"
                                : report.status === "Issues Found"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(`/report?sessionId=${report.id}`)
                              }
                            >
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No reports found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
