import { useState } from 'react';
import DateFilter from '../components/DateFilter'; // Import component DateFilter

const History = () => {
    const data = [
        { id: '0001', device: 'Led 1', brand: 'Phillips', time: '2025-03-01 12:15', action: 'Turn on', by: 'You', byClass: 'by-you' },
        { id: '0005', device: 'Led 2', brand: 'Xiaomi', time: '2025-03-01 12:18', action: 'Turn on', by: 'Admin', byClass: 'by-admin' },
        { id: '0006', device: 'Irrigation system', brand: 'Xiaomi', time: '2025-02-24 14:42', action: 'Turn off', by: 'Automatic', byClass: 'by-automatic' },
        { id: '0007', device: 'Spinker system', brand: 'Rain Bird', time: '2025-02-24 14:55', action: 'Turn off', by: 'You', byClass: 'by-you' },
        { id: '0005', device: 'Led 2', brand: 'Xiaomi', time: '2025-02-23 11:58', action: 'Turn off', by: 'Automatic', byClass: 'by-automatic' },
    ];

    // State để lưu giá trị lọc
    const [filterId, setFilterId] = useState('');
    const [filterDevice, setFilterDevice] = useState('');
    const [filterBy, setFilterBy] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Hàm lọc dữ liệu
    const filteredData = data.filter((item) => {
        const itemDate = new Date(item.time).getTime(); // Chuyển đổi thời gian của item thành timestamp
        const startTimestamp = startDate ? new Date(startDate).getTime() : null;
        const endTimestamp = endDate ? new Date(endDate).getTime() + 86400000 : null; // Thêm 1 ngày (86400000 ms) để bao gồm cả ngày kết thúc

        return (
            (filterId === '' || item.id === filterId) &&
            (filterDevice === '' || item.device.toLowerCase().includes(filterDevice.toLowerCase())) &&
            (filterBy === '' || item.by === filterBy) &&
            (!startTimestamp || itemDate >= startTimestamp) &&
            (!endTimestamp || itemDate <= endTimestamp)
        );
    });

    return (
        <div className="container">
            {/* CSS được viết trực tiếp trong thẻ <style> */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

                    .container {
                        width: 100%;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        font-family: 'Inter', sans-serif;
                    }

                    .filters {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px; /* Khoảng cách giữa các phần tử */
                        align-items: center; /* Căn giữa các phần tử theo chiều dọc */
                        margin-bottom: 20px;
                    }

                    .dropdown {
                        position: relative;
                        flex: 1;
                        
                    }

                    .dropdown-select {
                        width: 100%;
                        padding: 10px 14px;
                        font-size: 16px;
                        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
                        border-radius: 9px;
                        background-color: white;
                        appearance: none;
                        cursor: pointer;
                        font-family: 'Inter', sans-serif;
                        gap: 5px;
                        margin-bottom: 13px;
                    }

                    .dropdown-select:hover {
                        border-color: #999;
                    }

                    .dropdown-icon {
                        position: absolute;
                        top: 50%;
                        right: 10px;
                        transform: translateY(-50%);
                        pointer-events: none;
                        color: #666;
                    }

                    .date-filter {
                        display: flex;
                       
                        align-items: center;
                        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
                        border-radius: 9px;
                    }

                    .date-filter input {
                        padding: 10px 14px;
                        font-size: 16px;
                        border-radius: 9px;
                        background-color: white;
                        font-family: 'Inter', sans-serif;
                    }

                    .title {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 20px;
                        font-family: 'Inter', sans-serif;
                    }

                    .table-container {
                        background-color: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                        font-family: 'Inter', sans-serif;
                    }

                    .table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    .table-header {
                        background-color: #f5f5f5;
                    }

                    .table-header th {
                        padding: 12px 16px;
                        text-align: left;
                        font-weight: bold;
                        color: #333;
                    }

                    .table-row {
                        border-top: 1px solid #eee;
                    }

                    .table-row td {
                        padding: 12px 16px;
                    }

                    .device-brand {
                        font-size: 14px;
                        color: #666;
                    }

                    .by-label {
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 14px;
                    }

                    .by-you {
                        color: #ec4899;
                        background-color: #fce7f3;
                    }

                    .by-admin {
                        color: #3b82f6;
                        background-color: #dbeafe;
                    }

                    .by-automatic {
                        color: #f97316;
                        background-color: #ffedd5;
                    }
                `}
            </style>

            {/* Phần JSX */}
            <div className="dropdown-container">
                <div className="dropdown">
                    <select className="dropdown-select">
                        <option>Choose the garden</option>
                        <option>Trường Đại học Bách Khoa, ĐHQGHCM</option>
                        <option>Trường Đại học Quốc tế, ĐHQGHCM</option>
                        <option>Bcons Suối Tiên</option>
                        <option>Bcons Miền Đông</option>
                    </select>
                    <div className="dropdown-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Bộ lọc */}
            <div className="filters">
                <div className="dropdown">
                    <select
                        className="dropdown-select"
                        value={filterId}
                        onChange={(e) => setFilterId(e.target.value)}
                    >
                        <option value="">Filter by ID</option>
                        {[...new Set(data.map((item) => item.id))].map((id) => (
                            <option key={id} value={id}>
                                {id}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="dropdown">
                    <select
                        className="dropdown-select"
                        value={filterDevice}
                        onChange={(e) => setFilterDevice(e.target.value)}
                    >
                        <option value="">Choose the device</option>
                        <option value="Led">Led</option>
                        <option value="Irrigation">Irrigation</option>
                        <option value="Spinker">Spinker</option>
                    </select>
                </div>

                <div className="dropdown">
                    <select
                        className="dropdown-select"
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value)}
                    >
                        <option value="">Filter by</option>
                        <option value="You">You</option>
                        <option value="Admin">Admin</option>
                        <option value="Automatic">Automatic</option>
                    </select>
                </div>

                {/* Sử dụng component DateFilter */}
                <DateFilter
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                />
            </div>

            <h1 className="title">DEVICE ACTIVITY HISTORY</h1>
            <div className="table-container">
                <table className="table">
                    <thead className="table-header">
                        <tr>
                            <th>ID</th>
                            <th>Device</th>
                            <th>Time</th>
                            <th>Action</th>
                            <th>By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index} className="table-row">
                                <td>{item.id}</td>
                                <td>
                                    <div>{item.device}</div>
                                    <div className="device-brand">{item.brand}</div>
                                </td>
                                <td>{item.time}</td>
                                <td>{item.action}</td>
                                <td>
                                    <span className={`by-label ${item.byClass}`}>{item.by}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;
