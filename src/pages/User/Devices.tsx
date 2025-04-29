import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import socket from '@/services/socket';

// Styled components
const Container = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DropdownContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const SelectContainer = styled.div`
  position: relative;
  flex: 1;
`;

const Select = styled.select`
  display: block;
  appearance: none;
  width: 100%;
  background-color: white;
  border: 1px solid #cbd5e0;
  padding: 0.5rem 1rem;
  padding-right: 2rem;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #a0aec0;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
`;

const SelectIcon = styled.div`
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  color: #4a5568;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Description = styled.p`
  margin-top: 0.5rem;
  color: #4a5568;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f7fafc;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
`;

const ToggleButton = styled.button`
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #63b3ed;
    box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TimerButton = styled.button`
  background-color: ${({ isSet }) => (isSet ? '#e53e3e' : '#48bb78')};
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ isSet }) => (isSet ? '#c53030' : '#38a169')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Component
const Devices = () => {
  const locations = [
    "Trường Đại học Bách Khoa, ĐHQGHCM",
    "Trường Đại học Quốc tế, ĐHQGHCM",
    "Bcons Suối Tiên",
    "Bcons Miền Đông",
  ];

  const deviceTypes = ["All", "Led", "Watering"];


  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
  },[])




  const [devices, setDevices] = useState([
    { name: 'Led 1', lastUsed: 'Right now', status: 'On', timer: 'Not set', brand: 'Phillips', type: 'Led', isOn: true, value: 0, timerSet: false, turnOffTime: null, automatic: false },
    { name: 'Led 2', lastUsed: 'Right now', status: 'On', timer: 'Not set', brand: 'Xiaomi', type: 'Led', isOn: true, value: 0, timerSet: false, turnOffTime: null, automatic: false },
    { name: 'Irrigation system', lastUsed: '14:42 February 24, 2025', status: 'Off', timer: 'Not set', brand: 'Xiaomi', type: 'Watering', isOn: false, value: 0, timerSet: false, turnOffTime: null, automatic: false },
    { name: 'Sprinkler system', lastUsed: '14:55 February 24, 2025', status: 'Off', timer: 'Not set', brand: 'Rain Bird', type: 'Watering', isOn: false, value: 0, timerSet: false, turnOffTime: null, automatic: false },
  ]);


  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const toggleDevice = (index) => {
    const updatedDevices = [...devices];
    updatedDevices[index].isOn = !updatedDevices[index].isOn;
    updatedDevices[index].status = updatedDevices[index].isOn ? 'On' : 'Off';
    setDevices(updatedDevices);
  };

  const handleValueChange = (index, value) => {
    const updatedDevices = [...devices];
    updatedDevices[index].value = value;
    setDevices(updatedDevices);
  };

  const handleTimer = (index) => {
    const updatedDevices = [...devices];
    updatedDevices[index].timerSet = !updatedDevices[index].timerSet;
    updatedDevices[index].timer = updatedDevices[index].timerSet ? 'Set' : 'Not set';
    setDevices(updatedDevices);
  };

  const handleTurnOffTimeChange = (index, value) => {
    const updatedDevices = [...devices];
    updatedDevices[index].turnOffTime = value;
    
    setDevices(updatedDevices);
  };

  const toggleAutomatic = (index) => {
    const updatedDevices = [...devices];
    updatedDevices[index].automatic = !updatedDevices[index].automatic;
    setDevices(updatedDevices);
  };

  const filteredDevices = devices.filter(device => {
    return (selectedType === 'All' || device.type === selectedType);
  });

  return (
    <Container>
      <DropdownContainer>
        <SelectContainer>
          <Select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="">Choose the garden</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </Select>
          <SelectIcon>
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </SelectIcon>
        </SelectContainer>
        <SelectContainer>
          <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {deviceTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </Select>
          <SelectIcon>
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </SelectIcon>
        </SelectContainer>
      </DropdownContainer>
      <div>
        <Title>LIST OF DEVICES</Title>
        <Description>
          Click on the device name to view its operating parameters for the past
          24 hours.
        </Description>
      </div>
      <Table>
        <thead>
          <TableRow>
            <TableHeader>Device</TableHeader>
            <TableHeader>Last Used time</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Timer</TableHeader>
            <TableHeader>Turn Off Time</TableHeader>
            <TableHeader>Value</TableHeader>
            <TableHeader>Toggle</TableHeader>
            <TableHeader>Automatic</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {filteredDevices.map((device, index) => (
            <TableRow key={index}>
              <TableCell>{device.name}</TableCell>
              <TableCell>{device.lastUsed}</TableCell>
              <TableCell>{device.status}</TableCell>
              <TableCell>
                <TimerButton
                  isSet={device.timerSet}
                  onClick={() => handleTimer(index)}
                  disabled={device.automatic}
                >
                  {device.timer}
                </TimerButton>
              </TableCell>
              <TableCell>
                {device.timerSet && (
                  <Input
                    type="datetime-local"
                    value={device.turnOffTime || ''}
                    onChange={(e) => handleTurnOffTimeChange(index, e.target.value)}
                    disabled={device.automatic}
                  />
                )}
              </TableCell>
              <TableCell>
                {device.isOn && (
                  <Input
                    type="number"
                    value={device.value}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    placeholder={device.type === 'Led' ? 'Lux' : 'Bump'}
                    disabled={device.automatic}
                  />
                )}
              </TableCell>
              <TableCell>
                <ToggleButton
                  isOn={device.isOn}
                  onClick={() => toggleDevice(index)}
                  disabled={device.automatic}
                />
              </TableCell>
              <TableCell>
                <ToggleButton
                  isOn={device.automatic}
                  onClick={() => toggleAutomatic(index)}
                />
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Devices;
