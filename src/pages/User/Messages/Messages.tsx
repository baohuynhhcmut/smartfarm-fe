import { useState } from "react";
import ReactPaginate from "react-paginate";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Messages.css";

interface Message {
  id: number;
  title: string;
  detail: string;
  sentBy: string;
  date: string;
  garden: string;
  device: string;
  isRead: boolean;
}

const Messages = () => {
  const [messages] = useState<Message[]>([
    {
      id: 1,
      title: "Message 1",
      detail: "Details about message 1",
      sentBy: "Admin",
      date: "2022-03-28",
      garden: "Trường Đại Học Bách Khoa",
      device: "Sensor 1",
      isRead: false,
    },
    {
      id: 2,
      title: "Message 2",
      detail: "Details about message 2",
      sentBy: "Admin",
      date: "2022-03-29",
      garden: "Trường Đại Học Quốc Tế",
      device: "Sensor 2",
      isRead: false,
    },
  ]);

  const [filter, setFilter] = useState("");
  const [selectedGarden, setSelectedGarden] = useState("All");
  const [selectedDevice, setSelectedDevice] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [pageNumber, setPageNumber] = useState(0);
  const messagesPerPage = 5;

  const filteredMessages = messages.filter(
    (message) =>
      (message.title.toLowerCase().includes(filter.toLowerCase()) ||
        message.detail.toLowerCase().includes(filter.toLowerCase())) &&
      (selectedGarden === "All" || message.garden === selectedGarden) &&
      (selectedDevice === "All" || message.device === selectedDevice) &&
      (selectedState === "All" ||
        (selectedState === "Read" ? message.isRead : !message.isRead)) &&
      (selectedDateRange[0] === null ||
        selectedDateRange[1] === null ||
        (new Date(message.date) >= selectedDateRange[0]! &&
          new Date(message.date) <= selectedDateRange[1]!))
  );

  const pageCount = Math.ceil(filteredMessages.length / messagesPerPage);
  const currentMessages = filteredMessages.slice(
    pageNumber * messagesPerPage,
    (pageNumber + 1) * messagesPerPage
  );

  const handlePageClick = (event: { selected: number }) => {
    setPageNumber(event.selected);
  };

  return (
    <div className="messages-container">
      <div className="filters">
        <input
          type="text"
          placeholder="Search Messages"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />

        <div className="filter-select">
          <label>Choose the garden:</label>
          <select
            value={selectedGarden}
            onChange={(e) => setSelectedGarden(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Trường Đại Học Bách Khoa">
              Trường Đại Học Bách Khoa
            </option>
            <option value="Trường Đại Học Quốc Tế">
              Trường Đại Học Quốc Tế
            </option>
            {/* Add more gardens as needed */}
          </select>
        </div>

        <div className="filter-select">
          <label>Select devices:</label>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Sensor 1">Sensor 1</option>
            <option value="Sensor 2">Sensor 2</option>
            {/* Add more devices as needed */}
          </select>
        </div>

        <div className="filter-select">
          <label>Message State:</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Read">Read</option>
            <option value="Unread">Unread</option>
          </select>
        </div>

        <div className="filter-select">
          <label>Select Date Range:</label>
          <ReactDatePicker
            selected={selectedDateRange[0]}
            onChange={(date: [Date | null, Date | null]) =>
              setSelectedDateRange(date)
            }
            startDate={selectedDateRange[0]}
            endDate={selectedDateRange[1]}
            selectsRange
            dateFormat="yyyy/MM/dd"
            showMonthYearPicker
            showYearPicker
            className="date-picker"
            placeholderText="Select a date range"
          />
        </div>
      </div>

      <div className="messages-list">
        {currentMessages.map((message) => (
          <div
            key={message.id}
            className={`message-item ${message.isRead ? "read" : ""}`}
          >
            <h4>{message.title}</h4>
            <p>{message.detail}</p>
            <p>Sent by: {message.sentBy}</p>
            <p>Date: {message.date}</p>
            <p>At Garden: {message.garden}</p>
            <p>Device: {message.device}</p>
          </div>
        ))}
      </div>

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default Messages;
