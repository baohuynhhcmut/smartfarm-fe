import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrash, FaPlus, FaEdit, FaFilter } from 'react-icons/fa';

// Styled components
interface ToggleButtonProps {
  isOn: boolean;
}

interface Device {
  id: string;
  device_id: string;
  name: string;
  lastUsed: string;
  isOn: boolean;
  registeredAt: string;
  username: string | null;
  type: string;
  category: string;
  is_active: boolean;
  garden_name: string | null;
  time_on: string | null;
  time_off: string | null;
  threshold?: {
    min: number;
    max: number;
  };
}

const Container = styled.div`
  width: 100%;
<<<<<<< HEAD
  padding: 2rem;
  display: flex;
=======
  padding: 1.5rem;
  display: grid;
>>>>>>> origin/panh04
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: black;
  margin-bottom: 0.5rem;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: black;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3E3A39;
  }
`;

const FilterButton = styled(AddButton)<{ isActive: boolean }>`
  background-color: ${({ isActive }) => isActive ? 'black' : 'black'};
  
  &:hover {
    background-color: ${({ isActive }) => isActive ? 'black' : '#3E3A39'};
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  background-color: #f1f5f9;
  color: #334155;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f8fafc;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: black;
`;

const ToggleButton = styled.button<ToggleButtonProps>`
  background-color: ${({ isOn }) => (isOn ? 'black' : '#ADABAA')};
  border: none;
  border-radius: 1rem;
  width: 3rem;
  height: 1.5rem;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;

  &::after {
    content: '';
    position: absolute;
    top: 0.125rem;
    left: ${({ isOn }) => (isOn ? '1.625rem' : '0.125rem')};
    width: 1.25rem;
    height: 1.25rem;
    background-color: white;
    border-radius: 50%;
    transition: left 0.2s;
  }
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: 1px solid #E8E8E8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const DeleteButton = styled(ActionButton)`
  color: #FFFFFF;
  background-color: #FF3737;

  &:hover {
    background-color: #FF4F4F;
  }
`;

const EditButton = styled(ActionButton)`
  color: black;
  border-color: #E2E2E2;

  &:hover {
    background-color: #E8E8E8;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.2s ease-out;
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(-20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const FilterModal = styled(ModalContent)`
  max-width: 600px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1e293b;
`;

const ModalDescription = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const FilterGroup = styled(FormGroup)`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #334155;
  font-weight: 500;
  font-size: 0.875rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #334155;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #334155;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: black;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: #41403F;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  background-color: ;
`;

const ErrorPopup = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 400px;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateX(100%);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const CloseErrorButton = styled.button`
  background: none;
  border: none;
  color: #b91c1c;
  font-size: 1.25rem;
  cursor: pointer;
  margin-left: 1rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  &:after {
    content: '';
    width: 2rem;
    height: 2rem;
    border: 3px solid #3b82f6;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const BASE_URL = 'http://localhost:8081/api/v1';

const DeviceAdmin = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [gardens, setGardens] = useState<any[]>([]);
  const [newDevice, setNewDevice] = useState({
    device_id: '',
    device_name: '',
    type: '',
    user: '',
    location: ''
  });

  const [appliedFilters, setAppliedFilters] = useState({
    id: '',
    category: '',
    username: '',
    gardenName: '',
    type: '',
    isActive: ''
  });

  const [pendingFilters, setPendingFilters] = useState({
    id: '',
    category: '',
    username: '',
    gardenName: '',
    type: '',
    isActive: ''
  });

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 5000);
  };

  const fetchDevices = async () => {
    try {
      let url = `${BASE_URL}/device/getAllDevice`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch devices');
      }
      const data = await response.json();
      
      const transformedDevices = data.data.map((device: any) => ({
        id: device._id,
        device_id: device.device_id,
        name: device.device_name,
        lastUsed: device.time_on || new Date().toISOString(),
        isOn: device.is_active,
        registeredAt: device.createdAt || new Date().toISOString(),
        username: device.user || null,
        type: device.type,
        category: device.category,
        is_active: device.is_active,
        garden_name: device.location?.garden_name || null,
        time_on: device.time_on,
        time_off: device.time_off,
        threshold: device.threshold || undefined
      }));
      
      setDevices(transformedDevices);
      setLoading(false);
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const fetchGardensByUser = async (email: string) => {
    try {
      const response = await fetch(`${BASE_URL}/user/getGarden?email=${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch gardens');
      }
      const data = await response.json();
      setGardens(data.data || []);
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to fetch gardens');
    }
  };

  const fetchFilteredDevices = async () => {
    try {
      let url = `${BASE_URL}/device/getAllDevice`;
      let filterApplied = false;

      if (appliedFilters.id) {
        url = `${BASE_URL}/device/getDeviceById?device_id=${appliedFilters.id}`;
        filterApplied = true;
      } else if (appliedFilters.category) {
        url = `${BASE_URL}/device/getDeviceByCategory?category=${appliedFilters.category}`;
        filterApplied = true;
      } else if (appliedFilters.username) {
        url = `${BASE_URL}/device/getDeviceByUser?email=${appliedFilters.username}`;
        filterApplied = true;
      } else if (appliedFilters.gardenName) {
        url = `${BASE_URL}/device/getDeviceByGardenName?garden_name=${appliedFilters.gardenName}`;
        filterApplied = true;
      } else if (appliedFilters.type) {
        url = `${BASE_URL}/device/getDeviceByType?type=${appliedFilters.type}`;
        filterApplied = true;
      } else if (appliedFilters.isActive) {
        url = `${BASE_URL}/device/getDeviceByIsActive?is_active=${appliedFilters.isActive}`;
        filterApplied = true;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Connection failed. Please check and re-enter the information in filters');
      }
      const data = await response.json();
      
      let devicesData = data.data || data;
      if (!Array.isArray(devicesData)) {
        devicesData = [devicesData];
      }

      const transformedDevices = devicesData.map((device: any) => ({
        id: device._id,
        device_id: device.device_id,
        name: device.device_name,
        lastUsed: device.time_on || new Date().toISOString(),
        isOn: device.is_active,
        registeredAt: device.createdAt || new Date().toISOString(),
        username: device.user,
        type: device.type,
        category: device.category,
        is_active: device.is_active,
        garden_name: device.location?.garden_name || 'N/A',
        time_on: device.time_on,
        time_off: device.time_off
      }));
      
      setDevices(transformedDevices);
      setLoading(false);
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to fetch filtered devices');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.values(appliedFilters).some(filter => filter !== '')) {
      fetchFilteredDevices();
    } else {
      fetchDevices();
    }
  }, [appliedFilters]);

  const toggleDevice = async (id: string) => {
    try {
      const deviceToToggle = devices.find(device => device.id === id);
      if (!deviceToToggle) return;
  
      const response = await fetch(`${BASE_URL}/device/updateDeviceByActive`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_id: deviceToToggle.device_id,
          is_active: !deviceToToggle.isOn
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update device status');
      }
  
      const data = await response.json();
      
      setDevices(devices.map(device => 
        device.id === id 
          ? { 
              ...device, 
              isOn: data.data.is_active,
              lastUsed: new Date().toISOString(),
              time_on: data.data.time_on,
              time_off: data.data.time_off,
              garden_name: data.data.location?.garden_name || device.garden_name
            } 
          : device
      ));
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to update device status');
    }
  };

  const deleteDevice = async (id: string) => {
    try {
      const deviceToDelete = devices.find(device => device.id === id);
      if (!deviceToDelete) {
        handleError('Device not found in local state');
        return false;
      }
  
      const response = await fetch(`${BASE_URL}/device/deleteDeviceById`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_id: deviceToDelete.device_id
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete device');
      }
  
      const responseData = await response.json();
      
      if (responseData.status === 200 && responseData.message === "Device deleted successfully") {
        setDevices(devices.filter(device => device.id !== id));
        return true;
      } else {
        throw new Error(responseData.message || 'Delete operation failed');
      }
    } catch (err) {
      console.error('Delete error:', err);
      handleError(err instanceof Error ? err.message : 'Delete failed');
      return false;
    }
  };

  const handleAddDevice = async () => {
    try {
      if (!newDevice.device_id || !newDevice.device_name || !newDevice.type) {
        throw new Error('Device ID, Name, and Type are required');
      }
  
      const payload = {
        device_id: newDevice.device_id,
        device_name: newDevice.device_name,
        type: newDevice.type,
        user: newDevice.user || undefined,
        location: newDevice.location || undefined
      };
  
      const response = await fetch(`${BASE_URL}/device/createDevice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add device');
      }
  
      const data = await response.json();
  
      if (data.status !== 201 || data.message !== "Create device successfully") {
        throw new Error('Unexpected response format');
      }
  
      const newDeviceEntry: Device = {
        id: data.data._id,
        device_id: data.data.device_id,
        name: data.data.device_name,
        isOn: data.data.is_active,
        lastUsed: data.data.time_on || new Date().toISOString(),
        registeredAt: data.data.createdAt,
        username: data.data.user,
        type: data.data.type,
        category: data.data.category || 'sensor',
        is_active: data.data.is_active,
        garden_name: data.data.location?.garden_name || 'N/A',
        time_on: data.data.time_on,
        time_off: data.data.time_off
      };
  
      setDevices([...devices, newDeviceEntry]);
      setIsModalOpen(false);
      setNewDevice({
        device_id: '',
        device_name: '',
        type: '',
        user: '',
        location: ''
      });
      setError(null);
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to add device');
    }
  };

  const [isFindingGarden, setIsFindingGarden] = useState(false);

  const handleFindGarden = async () => {
    if (!newDevice.user) {
      handleError('Please enter a user email first');
      return;
    }

    setIsFindingGarden(true);
    try {
      const response = await fetch(`${BASE_URL}/user/getGarden?email=${newDevice.user}`);
      if (!response.ok) {
        throw new Error('Failed to fetch gardens');
      }
      const data = await response.json();
      setGardens(data.data || []);
      
      if (data.data && data.data.length > 0) {
        setNewDevice({...newDevice, location: data.data[0].name});
      } else {
        setNewDevice({...newDevice, location: 'no garden'});
      }
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to fetch gardens');
      setNewDevice({...newDevice, location: 'no garden'});
    } finally {
      setIsFindingGarden(false);
    }
  };

  const handleEditDevice = async () => {
    if (!currentDevice) return;
    
    try {
      const payload = {
        device_id: currentDevice.device_id,
        user: currentDevice.username || null,
        location: currentDevice.garden_name || null
      };
  
      const response = await fetch(`${BASE_URL}/device/updateDeviceByUser`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update device');
      }
  
      const data = await response.json();
      
      setDevices(devices.map(device => 
        device.id === currentDevice.id 
          ? { 
              ...device,
              username: data.data.user || null,
              garden_name: data.data.location?.garden_name || null
            } 
          : device
      ));
      
      setIsEditModalOpen(false);
      setCurrentDevice(null);
      setError(null);
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to update device');
      console.error('Update error:', err);
    }
  };

  const openEditModal = (device: Device) => {
    setCurrentDevice(device);
    setIsEditModalOpen(true);
    if (device.username) {
      fetchGardensByUser(device.username);
    }
  };

  const applyFilters = () => {
    setAppliedFilters(pendingFilters);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setPendingFilters({
      id: '',
      category: '',
      username: '',
      gardenName: '',
      type: '',
      isActive: ''
    });
    setAppliedFilters({
      id: '',
      category: '',
      username: '',
      gardenName: '',
      type: '',
      isActive: ''
    });
    setIsFilterOpen(false);
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return 'N/A';
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateTime).toLocaleDateString('en-US', options);
  };

  const updateDeviceTimer = async (deviceId: string, timeOn: string | null, timeOff: string | null) => {
    try {
      const deviceToUpdate = devices.find(device => device.id === deviceId);
      if (!deviceToUpdate) return;

      const response = await fetch(`${BASE_URL}/device/updateDeviceByTimer?device_id=${deviceToUpdate.device_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_id: deviceToUpdate.device_id,
          time_on: timeOn,
          time_off: timeOff
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update device timer');
      }

      const data = await response.json();
      
      setDevices(devices.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              time_on: data.time_on,
              time_off: data.time_off
            } 
          : device
      ));
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to update device timer');
    }
  };

  if (loading) {
    return <Container>Loading devices...</Container>;
  }

  return (
    <Container>
      {/* Error Popup */}
      {showError && (
        <ErrorPopup>
          <div>{error}</div>
          <CloseErrorButton onClick={() => setShowError(false)}>
            &times;
          </CloseErrorButton>
        </ErrorPopup>
      )}

      <Header>
        <Title>Device Management</Title>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <AddButton onClick={() => setIsModalOpen(true)}>
            <FaPlus />
            Add New Device
          </AddButton>
          <FilterButton 
            onClick={() => setIsFilterOpen(true)}
            isActive={isFilterOpen}
          >
            <FaFilter />
            Filter Devices
          </FilterButton>
        </div>
      </Header>

      {/* Filter Modal */}
      {isFilterOpen && (
        <ModalOverlay onClick={() => setIsFilterOpen(false)}>
          <FilterModal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Filter Devices</ModalTitle>
              <CloseButton onClick={() => setIsFilterOpen(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <FilterGroup>
                <Label>Device ID</Label>
                <Input 
                  type="text" 
                  value={pendingFilters.id}
                  onChange={(e) => setPendingFilters({...pendingFilters, id: e.target.value})}
                  placeholder="Filter by ID"
                />
              </FilterGroup>
              <FilterGroup>
                <Label>Category</Label>
                <Input 
                  type="text" 
                  value={pendingFilters.category}
                  onChange={(e) => setPendingFilters({...pendingFilters, category: e.target.value})}
                  placeholder="Filter by category"
                />
              </FilterGroup>
              <FilterGroup>
                <Label>Username</Label>
                <Input 
                  type="text" 
                  value={pendingFilters.username}
                  onChange={(e) => setPendingFilters({...pendingFilters, username: e.target.value})}
                  placeholder="Filter by username"
                />
              </FilterGroup>
              <FilterGroup>
                <Label>Garden Name</Label>
                <Input 
                  type="text" 
                  value={pendingFilters.gardenName}
                  onChange={(e) => setPendingFilters({...pendingFilters, gardenName: e.target.value})}
                  placeholder="Filter by garden"
                />
              </FilterGroup>
              <FilterGroup>
                <Label>Type</Label>
                <Input 
                  type="text" 
                  value={pendingFilters.type}
                  onChange={(e) => setPendingFilters({...pendingFilters, type: e.target.value})}
                  placeholder="Filter by type"
                />
              </FilterGroup>
              <FilterGroup>
                <Label>Status</Label>
                <Select
                  value={pendingFilters.isActive}
                  onChange={(e) => setPendingFilters({...pendingFilters, isActive: e.target.value})}
                >
                  <option value="">All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Select>
              </FilterGroup>
            </div>
            
            <FilterButtons>
              <SubmitButton onClick={applyFilters}>
                Apply Filters
              </SubmitButton>
              <SubmitButton 
                onClick={clearFilters}
                style={{ backgroundColor: '#686868' }}
              >
                Clear Filters
              </SubmitButton>
            </FilterButtons>
          </FilterModal>
        </ModalOverlay>
      )}

      <TableWrapper>
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Device ID</TableHeader>
              <TableHeader>Device Name</TableHeader>
              <TableHeader>Garden Name</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Threshold</TableHeader>
              <TableHeader>Time On</TableHeader>
              <TableHeader>Time Off</TableHeader>
              <TableHeader>Registered At</TableHeader>
              <TableHeader>Username</TableHeader>
              <TableHeader>Active</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>{device.device_id}</TableCell>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.garden_name || 'N/A'}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.category}</TableCell>
                <TableCell>
                  {device.threshold ? `${device.threshold.min}-${device.threshold.max}` : 'N/A'}
                </TableCell>
                <TableCell>{formatDateTime(device.time_on)}</TableCell>
                <TableCell>{formatDateTime(device.time_off)}</TableCell>
                <TableCell>{formatDateTime(device.registeredAt)}</TableCell>
                <TableCell>{device.username}</TableCell>
                <TableCell>
                  <ToggleButton 
                    isOn={device.isOn} 
                    onClick={() => toggleDevice(device.id)}
                  />
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <EditButton onClick={() => openEditModal(device)}>
                      <FaEdit />
                    </EditButton>
                    <DeleteButton
                      onClick={async () => {
                        const confirmed = window.confirm(`Are you sure to remove "${device.name}"?`);
                        if (confirmed) {
                          const success = await deleteDevice(device.id);
                          if (!success) {
                            alert('Failed to delete device');
                          }
                        }
                      }}
                    >
                      <FaTrash />
                    </DeleteButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
                    
      {/* Add New Device Modal */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Add New Device</ModalTitle>
              <CloseButton onClick={() => {
                setIsModalOpen(false);
                setGardens([]);
                setNewDevice({
                  device_id: '',
                  device_name: '',
                  type: '',
                  user: '',
                  location: ''
                });
                setError(null);
              }}>&times;</CloseButton>
            </ModalHeader>
            <FormGroup>
              <Label>Device ID *</Label>
              <Input 
                type="text" 
                value={newDevice.device_id}
                onChange={(e) => setNewDevice({...newDevice, device_id: e.target.value})}
                placeholder="Enter device ID (e.g., dev500)"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Device Name *</Label>
              <Input 
                type="text" 
                value={newDevice.device_name}
                onChange={(e) => setNewDevice({...newDevice, device_name: e.target.value})}
                placeholder="Enter device name (e.g., Soil moisture Sensor)"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Type *</Label>
              <Input 
                type="text" 
                value={newDevice.type}
                onChange={(e) => setNewDevice({...newDevice, type: e.target.value})}
                placeholder="Enter device type (e.g., soil moisture sensor)"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Username (Email)</Label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Input 
                  type="email" 
                  value={newDevice.user}
                  onChange={(e) => setNewDevice({...newDevice, user: e.target.value})}
                  placeholder="Enter user email (e.g., user3)"
                  style={{ flex: 1 }}
                />
                <button 
                  onClick={handleFindGarden}
                  disabled={isFindingGarden || !newDevice.user}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'black',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'background-color 0.2s',
                    opacity: isFindingGarden || !newDevice.user ? 0.5 : 1
                  }}
                >
                  {isFindingGarden ? 'Finding...' : 'Find Garden'}
                </button>
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Location (Garden Name)</Label>
              {gardens.length > 0 ? (
                <Select
                  value={newDevice.location}
                  onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
                >
                  {gardens.map(garden => (
                    <option key={garden._id} value={garden.name}>
                      {garden.name}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input 
                  type="text" 
                  value={newDevice.location}
                  onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
                  placeholder="Enter garden name (e.g., Garden1_User3)"
                />
              )}
            </FormGroup>
            <SubmitButton onClick={handleAddDevice}>
              Add Device
            </SubmitButton>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* Edit Device Modal */}
      {isEditModalOpen && currentDevice && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Edit Device</ModalTitle>
              <CloseButton onClick={() => {
                setIsEditModalOpen(false);
                setCurrentDevice(null);
                setError(null);
              }}>&times;</CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label>Device ID</Label>
              <Input 
                type="text" 
                value={currentDevice.device_id}
                readOnly
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Username</Label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Input 
                  type="text" 
                  value={currentDevice.username || ''}
                  onChange={(e) => {
                    const newUsername = e.target.value;
                    setCurrentDevice({
                      ...currentDevice, 
                      username: newUsername || null,
                      garden_name: null
                    });
                    setGardens([]);
                  }}
                  placeholder="Enter user email"
                  style={{ flex: 1 }}
                />
                <button 
                  onClick={async () => {
                    if (!currentDevice.username) {
                      handleError('Please enter a user email first');
                      return;
                    }
                    setIsFindingGarden(true);
                    try {
                      await fetchGardensByUser(currentDevice.username);
                    } catch (err) {
                      handleError('Failed to fetch gardens');
                    } finally {
                      setIsFindingGarden(false);
                    }
                  }}
                  disabled={isFindingGarden || !currentDevice.username}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'black',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                    opacity: isFindingGarden || !currentDevice.username ? 0.5 : 1
                  }}
                >
                  {isFindingGarden ? 'Finding...' : 'Find Garden'}
                </button>
                {currentDevice.username && (
                  <button 
                    onClick={() => {
                      setCurrentDevice({
                        ...currentDevice, 
                        username: null,
                        garden_name: null
                      });
                      setGardens([]);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#FF3737',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    Clear User
                  </button>
                )}
              </div>
            </FormGroup>
            
            <FormGroup>
              <Label>Garden Name</Label>
              {currentDevice.username ? (
                <>
                  {gardens.length > 0 ? (
                    <Select
                      value={currentDevice.garden_name || ''}
                      onChange={(e) => setCurrentDevice({
                        ...currentDevice, 
                        garden_name: e.target.value || null
                      })}
                    >
                      <option value="">Select a garden</option>
                      {gardens.map(garden => (
                        <option key={garden._id} value={garden.name}>
                          {garden.name}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <Input 
                        type="text" 
                        value={currentDevice.garden_name || ''}
                        onChange={(e) => setCurrentDevice({
                          ...currentDevice, 
                          garden_name: e.target.value || null
                        })}
                        placeholder="No gardens found for this user"
                        style={{ flex: 1 }}
                      />
                      <button 
                        onClick={() => fetchGardensByUser(currentDevice.username || '')}
                        disabled={isFindingGarden}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: 'black',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontWeight: 500,
                          opacity: isFindingGarden ? 0.5 : 1
                        }}
                      >
                        {isFindingGarden ? 'Searching...' : 'Refresh'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ color: '#64748b', padding: '0.5rem 0' }}>
                  Please assign a user first to select a garden
                </div>
              )}
            </FormGroup>
            
            <SubmitButton onClick={handleEditDevice}>
              Save Changes
            </SubmitButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default DeviceAdmin;