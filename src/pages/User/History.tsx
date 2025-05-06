import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

// Import Shadcn UI components
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { 
  Card,
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

// Define the interface for a session
interface Session {
  _id: string;
  device_id: string;
  action: string;
  by: string;
  timestamp: string;
}

const BASE_URL = 'http://localhost:8081/api/v1';
const ITEMS_PER_PAGE = 10;

const History = () => {
  // State for sessions data
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [filterId, setFilterId] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterBy, setFilterBy] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(`${BASE_URL}/session/getAllSessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Sessions data:", response.data);
        setSessions(response.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching sessions:", err);
        setError(err.message || "Failed to load session data");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Get unique device IDs for filtering
  const uniqueDeviceIds = [...new Set(sessions.map(session => session.device_id))];
  
  // Filtered sessions based on filter criteria
  const filteredSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.timestamp).getTime();
    const startTimestamp = startDate ? new Date(startDate).getTime() : null;
    const endTimestamp = endDate ? new Date(endDate).getTime() + 86400000 : null; // Adding 1 day to include end date

    return (
      (filterId === "all" || session.device_id === filterId) &&
      (filterAction === "all" || session.action === filterAction) &&
      (filterBy === "all" || session.by === filterBy) &&
      (!startTimestamp || sessionDate >= startTimestamp) &&
      (!endTimestamp || sessionDate <= endTimestamp)
    );
  });
  
  // Calculate pagination values
  const totalItems = filteredSessions.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  // Paginated data - get current page items
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd HH:mm:ss");
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterId("all");
    setFilterAction("all");
    setFilterBy("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 5;
    
    if (totalPages <= maxPageButtons) {
      // Show all pages if there are fewer than maxPageButtons
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust range to show maxPageButtons - 2 pages (excluding first and last)
      while (end - start + 1 < maxPageButtons - 2) {
        if (start > 2) start--;
        else if (end < totalPages - 1) end++;
        else break;
      }
      
      // Add ellipsis for gaps
      if (start > 2) pages.push(-1); // -1 represents ellipsis
      
      // Add pages in range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis for gaps
      if (end < totalPages - 1) pages.push(-2); // -2 represents ellipsis
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">DEVICE ACTIVITY HISTORY</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter session history by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Device ID Filter */}
            <div className="space-y-2">
              <Label htmlFor="device-id">Device ID</Label>
              <Select 
                value={filterId} 
                onValueChange={setFilterId}
              >
                <SelectTrigger id="device-id">
                  <SelectValue placeholder="Select Device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  {uniqueDeviceIds.map((deviceId) => (
                    <SelectItem key={deviceId} value={deviceId}>
                      {deviceId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Filter */}
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select 
                value={filterAction} 
                onValueChange={setFilterAction}
              >
                <SelectTrigger id="action">
                  <SelectValue placeholder="Select Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="Turn on">Turn On</SelectItem>
                  <SelectItem value="Turn off">Turn Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* By Filter */}
            <div className="space-y-2">
              <Label htmlFor="by">Initiated By</Label>
              <Select 
                value={filterBy} 
                onValueChange={setFilterBy}
              >
                <SelectTrigger id="by">
                  <SelectValue placeholder="Select Initiator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filters */}
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>
            {loading ? 'Loading...' : 
             `Showing ${Math.min(paginatedSessions.length, ITEMS_PER_PAGE)} of ${filteredSessions.length} entries (Page ${currentPage} of ${totalPages || 1})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading session data...</div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No session data found matching your filters.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left font-medium text-muted-foreground">ID</th>
                      <th className="p-3 text-left font-medium text-muted-foreground">Device ID</th>
                      <th className="p-3 text-left font-medium text-muted-foreground">Action</th>
                      <th className="p-3 text-left font-medium text-muted-foreground">Timestamp</th>
                      <th className="p-3 text-left font-medium text-muted-foreground">By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSessions.map((session) => (
                      <tr key={session._id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-3 text-sm">{session._id.substring(0, 8)}...</td>
                        <td className="p-3 text-sm">{session.device_id}</td>
                        <td className="p-3 text-sm">{session.action}</td>
                        <td className="p-3 text-sm">{formatDate(session.timestamp)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            session.by === 'user' 
                              ? 'bg-pink-100 text-pink-800' 
                              : session.by === 'admin' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {session.by}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === -1 || page === -2 ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              isActive={page === currentPage}
                              onClick={() => handlePageChange(page)}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;