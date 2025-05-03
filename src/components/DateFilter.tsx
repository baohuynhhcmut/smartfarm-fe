const DateFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
    return (
        <div className="date-filter" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontFamily: 'inherit'
                }}
            />
            <span style={{ color: '#666' }}>to</span>
            <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontFamily: 'inherit'
                }}
            />
        </div>
    );
};

export default DateFilter;