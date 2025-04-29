import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';

// Styled components
interface StatusBadgeProps {
  status: 'On' | 'Off';
}

interface ToggleButtonProps {
  isOn: boolean;
}

interface Device {
  id: string;
  name: string;
  lastUsed: string;
  status: 'On' | 'Off';
  isOn: boolean;
  registeredAt: string;
  username: string;
}

const Container = styled.div`
  width: 100%;
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

const StatusBadge = styled.span<StatusBadgeProps>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ status }) => (status === 'On' ? '#c6f6d5' : '#fed7d7')};
  color: ${({ status }) => (status === 'On' ? '#22543d' : '#822727')};
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
  width: 100%;
  max-width: 500px;
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

const DeviceAdmin = () => {
  const [devices, setDevices] = useState<Device[]>([
    { 
      id: '1',
      name: 'Led 1', 
      lastUsed: '2025-03-01 12:15', 
      status: 'On', 
      isOn: true,
      registeredAt: '2025-02-15 09:30',
      username: 'user1'
    },
    { 
      id: '2',
      name: 'Led 2', 
      lastUsed: '2025-03-01 12:18', 
      status: 'On', 
      isOn: true,
      registeredAt: '2025-02-16 10:15',
      username: 'user2'
    },
    { 
      id: '3',
      name: 'Irrigation system', 
      lastUsed: '2025-02-24 14:42', 
      status: 'Off', 
      isOn: false,
      registeredAt: '2025-02-10 08:20',
      username: 'user3'
    },
    { 
      id: '4',
      name: 'Sprinkler system', 
      lastUsed: '2025-02-24 14:55', 
      status: 'Off', 
      isOn: false,
      registeredAt: '2025-02-12 11:45',
      username: 'user1'
    },
    { 
      id: '5',
      name: 'Irrigation system', 
      lastUsed: '2025-02-24 14:42', 
      status: 'Off', 
      isOn: false,
      registeredAt: '2025-02-10 08:20',
      username: 'user6'
    },
    { 
      id: '6',
      name: 'Sprinkler system', 
      lastUsed: '2025-02-24 14:55', 
      status: 'Off', 
      isOn: false,
      registeredAt: '2025-02-12 11:45',
      username: 'user8'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [newDevice, setNewDevice] = useState({
    name: '',
    status: 'On',
    isOn: true,
    username: '',
    registeredAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
  });

  const toggleDevice = (id: string) => {
    setDevices(devices.map(device => 
      device.id === id 
        ? { 
            ...device, 
            isOn: !device.isOn,
            status: device.isOn ? 'Off' : 'On',
            lastUsed: new Date().toISOString().slice(0, 16).replace('T', ' ')
          } 
        : device
    ));
  };

  const deleteDevice = (id: string) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  const handleAddDevice = () => {
    const newDeviceEntry: Device = {
      id: Date.now().toString(),
      name: newDevice.name,
      status: newDevice.status,
      isOn: newDevice.status === 'On',
      lastUsed: new Date().toISOString().slice(0, 16).replace('T', ' '),
      registeredAt: newDevice.registeredAt,
      username: newDevice.username
    };
    
    setDevices([...devices, newDeviceEntry]);
    setIsModalOpen(false);
    setNewDevice({
      name: '',
      status: 'On',
      isOn: true,
      username: '',
      registeredAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    });
  };

  const handleEditDevice = () => {
    if (!currentDevice) return;
    
    setDevices(devices.map(device => 
      device.id === currentDevice.id 
        ? { 
            ...currentDevice,
            status: currentDevice.isOn ? 'On' : 'Off'
          } 
        : device
    ));
    
    setIsEditModalOpen(false);
    setCurrentDevice(null);
  };

  const openEditModal = (device: Device) => {
    setCurrentDevice(device);
    setIsEditModalOpen(true);
  };

  const formatDateTime = (dateTime: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateTime).toLocaleDateString('en-US', options);
  };

  return (
    <Container>
      <Header>
        <Title>Device Management</Title>
        <AddButton onClick={() => setIsModalOpen(true)}>
          <FaPlus />
          Add New Device
        </AddButton>
      </Header>
      
      <Table>
        <thead>
          <TableRow>
            <TableHeader>Device</TableHeader>
            <TableHeader>Last Used</TableHeader>
            <TableHeader>Registered At</TableHeader>
            <TableHeader>Username</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Toggle</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell>{device.name}</TableCell>
              <TableCell>{formatDateTime(device.lastUsed)}</TableCell>
              <TableCell>{formatDateTime(device.registeredAt)}</TableCell>
              <TableCell>{device.username}</TableCell>
              <TableCell>
                <StatusBadge status={device.status}>
                  {device.status}
                </StatusBadge>
              </TableCell>
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

      {/* Add New Device Modal */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Add New Device</ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>&times;</CloseButton>
            </ModalHeader>
            <FormGroup>
              <Label>Device Name</Label>
              <Input 
                type="text" 
                value={newDevice.name}
                onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                placeholder="Enter device name"
              />
            </FormGroup>
            <FormGroup>
              <Label>Username</Label>
              <Input 
                type="text" 
                value={newDevice.username}
                onChange={(e) => setNewDevice({...newDevice, username: e.target.value})}
                placeholder="Enter username"
              />
            </FormGroup>
            <FormGroup>
              <Label>Registration Date</Label>
              <Input 
                type="datetime-local" 
                value={newDevice.registeredAt}
                onChange={(e) => setNewDevice({...newDevice, registeredAt: e.target.value})}
              />
            </FormGroup>
            <FormGroup>
              <Label>Initial Status</Label>
              <Select
                value={newDevice.status}
                onChange={(e) => setNewDevice({
                  ...newDevice, 
                  status: e.target.value as 'On' | 'Off',
                  isOn: e.target.value === 'On'
                })}
              >
                <option value="On">On</option>
                <option value="Off">Off</option>
              </Select>
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
              <Label>Registration Date</Label>
              <Input 
                type="datetime-local" 
                value={currentDevice.registeredAt}
                onChange={(e) => setCurrentDevice({...currentDevice, registeredAt: e.target.value})}
              />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select
                value={currentDevice.status}
                onChange={(e) => setCurrentDevice({
                  ...currentDevice, 
                  status: e.target.value as 'On' | 'Off',
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