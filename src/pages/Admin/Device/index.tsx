import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrash, FaPlus, FaEdit, FaFilter, FaTimes } from 'react-icons/fa';

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
  username: string;
  type: string;
  category: string;
  is_active: boolean;
  garden_name: string;
  time_on: string | null;
  time_off: string | null;
}

const Container = styled.div`
  width: 970px;
  padding: 2rem;
  display: flex;
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
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3182ce;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  background-color: #edf2f7;
  color: #4a5568;
  font-weight: 600;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f7fafc;
  }
  &:hover {
    background-color: #ebf8ff;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const ToggleButton = styled.button<ToggleButtonProps>`
  background-color: ${({ isOn }) => (isOn ? '#48bb78' : '#e53e3e')};
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
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fff5f5;
  }
`;

const DeleteButton = styled(ActionButton)`
  color: #e53e3e;
`;

const EditButton = styled(ActionButton)`
  color: #4299e1;
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
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  color: #2d3748;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: #3182ce;
  }
`;

const FilterButton = styled(AddButton)`
  background-color: ${({ isActive }: { isActive: boolean }) => 
    isActive ? '#3182ce' : '#4299e1'};
`;

const BASE_URL = 'http://localhost:8081/api/v1';

const DeviceAdmin = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [newDevice, setNewDevice] = useState({
    device_id: 'dev012',
    device_name: 'Soil moisture Sensor',
    type: 'soil moisture sensor',
    user: 'user3',
    garden_name: 'Garden1_User3',
  });

  const [filters, setFilters] = useState({
    id: '',
    category: '',
    username: '',
    gardenName: '',
    type: '',
    isActive: ''
  });

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
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const fetchFilteredDevices = async () => {
    try {
      let url = `${BASE_URL}/device/getAllDevice`;
      let filterApplied = false;

      // Check which filters are active and construct the appropriate endpoint
      if (filters.id) {
        url = `${BASE_URL}/device/getDeviceById?device_id=${filters.id}`;
        filterApplied = true;
      } else if (filters.category) {
        url = `${BASE_URL}/device/getDeviceByCategory?category=${filters.category}`;
        filterApplied = true;
      } else if (filters.username) {
        url = `${BASE_URL}/device/getDeviceByUser?email=${filters.username}`;
        filterApplied = true;
      } else if (filters.gardenName) {
        url = `${BASE_URL}/device/getDeviceByGardenName?garden_name=${filters.gardenName}`;
        filterApplied = true;
      } else if (filters.type) {
        url = `${BASE_URL}/device/getDeviceByType?type=${filters.type}`;
        filterApplied = true;
      } else if (filters.isActive) {
        url = `${BASE_URL}/device/getDeviceByIsActive?is_active=${filters.isActive}`;
        filterApplied = true;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch filtered devices');
      }
      const data = await response.json();
      
      let devicesData = data.data || data; // Handle different response structures
      if (!Array.isArray(devicesData)) {
        devicesData = [devicesData]; // Convert single device to array
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
      setError(err instanceof Error ? err.message : 'Failed to fetch filtered devices');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.values(filters).some(filter => filter !== '')) {
      fetchFilteredDevices();
    } else {
      fetchDevices();
    }
  }, [filters]);

  const toggleDevice = async (id: string) => {
    try {
      const deviceToToggle = devices.find(device => device.id === id);
      if (!deviceToToggle) return;

      const response = await fetch(`${BASE_URL}/device/updateStatus/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !deviceToToggle.isOn
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update device status');
      }

      setDevices(devices.map(device => 
        device.id === id 
          ? { 
              ...device, 
              isOn: !device.isOn,
              lastUsed: new Date().toISOString()
            } 
          : device
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update device status');
    }
  };

  const deleteDevice = async (id: string) => {
    try {
      const deviceToDelete = devices.find(device => device.id === id);
      if (!deviceToDelete) return;

      const response = await fetch(`${BASE_URL}/device/deleteDeviceByUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: deviceToDelete.username
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete device');
      }
  
      setDevices(devices.filter(device => device.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete device');
    }
  };

  const handleAddDevice = async () => {
    try {
      const payload = {
        device_id: newDevice.device_id,
        device_name: newDevice.device_name,
        type: newDevice.type,
        user: newDevice.user,
        location: {
          garden_name: newDevice.garden_name,
        }
      };
  
      const response = await fetch(`${BASE_URL}/device/createDevice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        throw new Error('Failed to add device');
      }
  
      const data = await response.json();
  
      const newDeviceEntry: Device = {
        id: data._id,
        device_id: data.device_id,
        name: data.device_name,
        isOn: data.is_active ?? true,
        lastUsed: new Date().toISOString(),
        registeredAt: data.createdAt ?? new Date().toISOString(),
        username: data.user,
        type: data.type,
        category: data.category ?? '',
        is_active: data.is_active ?? true,
        garden_name: data.location?.garden_name,
        time_on: null,
        time_off: null
      };
  
      setDevices([...devices, newDeviceEntry]);
      setIsModalOpen(false);
      setNewDevice({
        device_id: 'dev012',
        device_name: 'Soil moisture Sensor',
        type: 'soil moisture sensor',
        user: 'user3',
        garden_name: 'Garden1_User3',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add device');
    }
  };

  const handleEditDevice = async () => {
    if (!currentDevice) return;
    
    try {
      const response = await fetch(`${BASE_URL}/device/update/${currentDevice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_name: currentDevice.name,
          user: currentDevice.username,
          is_active: currentDevice.isOn,
          location: {
            garden_name: currentDevice.garden_name,
          },
          time_on: currentDevice.time_on,
          time_off: currentDevice.time_off
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update device');
      }

      setDevices(devices.map(device => 
        device.id === currentDevice.id 
          ? currentDevice 
          : device
      ));
      
      setIsEditModalOpen(false);
      setCurrentDevice(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update device');
    }
  };

  const openEditModal = (device: Device) => {
    setCurrentDevice(device);
    setIsEditModalOpen(true);
  };

  const applyFilters = () => {
    fetchFilteredDevices();
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      id: '',
      category: '',
      username: '',
      gardenName: '',
      type: '',
      isActive: ''
    });
    fetchDevices();
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

  if (loading) {
    return <Container>Loading devices...</Container>;
  }

  if (error) {
    return <Container>Error: {error}</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>Device Management</Title>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <AddButton onClick={() => setIsModalOpen(true)}>
            <FaPlus />
            Add New Device
          </AddButton>
          <FilterButton 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            isActive={isFilterOpen}
          >
            <FaFilter />
            Filter Devices
          </FilterButton>
        </div>
      </Header>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#edf2f7', 
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <FormGroup>
              <Label>Device ID</Label>
              <Input 
                type="text" 
                value={filters.id}
                onChange={(e) => setFilters({...filters, id: e.target.value})}
                placeholder="Filter by ID"
              />
            </FormGroup>
            <FormGroup>
              <Label>Category</Label>
              <Input 
                type="text" 
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                placeholder="Filter by category"
              />
            </FormGroup>
            <FormGroup>
              <Label>Username</Label>
              <Input 
                type="text" 
                value={filters.username}
                onChange={(e) => setFilters({...filters, username: e.target.value})}
                placeholder="Filter by username"
              />
            </FormGroup>
            <FormGroup>
              <Label>Garden Name</Label>
              <Input 
                type="text" 
                value={filters.gardenName}
                onChange={(e) => setFilters({...filters, gardenName: e.target.value})}
                placeholder="Filter by garden"
              />
            </FormGroup>
            <FormGroup>
              <Label>Type</Label>
              <Input 
                type="text" 
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                placeholder="Filter by type"
              />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select
                value={filters.isActive}
                onChange={(e) => setFilters({...filters, isActive: e.target.value})}
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </FormGroup>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <SubmitButton onClick={applyFilters}>
              Apply Filters
            </SubmitButton>
            <SubmitButton 
              onClick={clearFilters}
              style={{ backgroundColor: '#e53e3e' }}
            >
               Clear Filters
            </SubmitButton>
          </div>
        </div>
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
                <TableCell>{device.garden_name}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.category}</TableCell>
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
                      onClick={() => {
                        const confirmed = window.confirm(`Are you sure to remove "${device.name}"?`);
                        if (confirmed) {
                          deleteDevice(device.id);
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
              <CloseButton onClick={() => setIsModalOpen(false)}>&times;</CloseButton>
            </ModalHeader>
            <FormGroup>
              <Label>Device ID</Label>
              <Input 
                type="text" 
                value={newDevice.device_id}
                onChange={(e) => setNewDevice({...newDevice, device_id: e.target.value})}
                placeholder="Enter device ID (e.g., dev012)"
              />
            </FormGroup>
            <FormGroup>
              <Label>Device Name</Label>
              <Input 
                type="text" 
                value={newDevice.device_name}
                onChange={(e) => setNewDevice({...newDevice, device_name: e.target.value})}
                placeholder="Enter device name"
              />
            </FormGroup>
            <FormGroup>
              <Label>Type</Label>
              <Input 
                type="text" 
                value={newDevice.type}
                onChange={(e) => setNewDevice({...newDevice, type: e.target.value})}
                placeholder="Enter device type"
              />
            </FormGroup>
            <FormGroup>
              <Label>Username</Label>
              <Input 
                type="text" 
                value={newDevice.user}
                onChange={(e) => setNewDevice({...newDevice, user: e.target.value})}
                placeholder="Enter username"
              />
            </FormGroup>
            <FormGroup>
              <Label>Garden Name</Label>
              <Input 
                type="text" 
                value={newDevice.garden_name}
                onChange={(e) => setNewDevice({...newDevice, garden_name: e.target.value})}
                placeholder="Enter garden name"
              />
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
              <CloseButton onClick={() => setIsEditModalOpen(false)}>&times;</CloseButton>
            </ModalHeader>
            <FormGroup>
              <Label>Device Name</Label>
              <Input 
                type="text" 
                value={currentDevice.name}
                onChange={(e) => setCurrentDevice({...currentDevice, name: e.target.value})}
                placeholder="Enter device name"
              />
            </FormGroup>
            <FormGroup>
              <Label>Username</Label>
              <Input 
                type="text" 
                value={currentDevice.username}
                onChange={(e) => setCurrentDevice({...currentDevice, username: e.target.value})}
                placeholder="Enter username"
              />
            </FormGroup>
            <FormGroup>
              <Label>Garden Name</Label>
              <Input 
                type="text" 
                value={currentDevice.garden_name}
                onChange={(e) => setCurrentDevice({...currentDevice, garden_name: e.target.value})}
                placeholder="Enter garden name"
              />
            </FormGroup>
            <FormGroup>
              <Label>Time On</Label>
              <Input 
                type="datetime-local" 
                value={currentDevice.time_on || ''}
                onChange={(e) => setCurrentDevice({...currentDevice, time_on: e.target.value})}
              />
            </FormGroup>
            <FormGroup>
              <Label>Time Off</Label>
              <Input 
                type="datetime-local" 
                value={currentDevice.time_off || ''}
                onChange={(e) => setCurrentDevice({...currentDevice, time_off: e.target.value})}
              />
            </FormGroup>
            <FormGroup>
              <Label>Registration Date</Label>
              <Input 
                type="datetime-local" 
                value={currentDevice.registeredAt}
                onChange={(e) => setCurrentDevice({...currentDevice, registeredAt: e.target.value})}
              />
            </FormGroup>
            <FormGroup>
              <Label>State</Label>
              <Select
                value={currentDevice.isOn ? 'On' : 'Off'}
                onChange={(e) => setCurrentDevice({
                  ...currentDevice, 
                  isOn: e.target.value === 'On'
                })}
              >
                <option value="On">On</option>
                <option value="Off">Off</option>
              </Select>
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