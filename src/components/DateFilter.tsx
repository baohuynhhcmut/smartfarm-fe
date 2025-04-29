const DateFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
    return (
        <div className="date-filter">
            <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
            />
            <span>to</span>
            <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
            />
        </div>
    );
};

export default DateFilter;