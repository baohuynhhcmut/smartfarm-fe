# Hướng dẫn sử dụng Socket trong ứng dụng

## Giới thiệu

Tài liệu này mô tả cách sử dụng kết nối socket trong toàn bộ ứng dụng. Chúng ta đã chuyển từ Redux sang Context API để quản lý trạng thái và kết nối socket.

## Kiến trúc

Hệ thống socket gồm các thành phần chính:

1. **AppContext.tsx**: Context cung cấp trạng thái toàn cục bao gồm trạng thái kết nối và dữ liệu cảm biến
2. **socket.tsx**: Dịch vụ socket cơ bản với các hàm tiện ích
3. **useSocketConnection.tsx**: Hook tùy chỉnh để quản lý kết nối socket
4. **useDeviceControl.tsx**: Hook để điều khiển thiết bị thông qua socket

## Cách sử dụng

### 1. Kết nối socket trong component

```tsx
import useSocketConnection from '../hooks/useSocketConnection';

function MyComponent() {
  const { isConnected, connect, disconnect } = useSocketConnection();
  
  // Socket sẽ tự động kết nối khi component được mount
  
  return (
    <div>
      <p>Trạng thái kết nối: {isConnected ? 'Đã kết nối' : 'Mất kết nối'}</p>
      <button onClick={connect}>Kết nối</button>
      <button onClick={disconnect}>Ngắt kết nối</button>
    </div>
  );
}
```

### 2. Gửi sự kiện qua socket

```tsx
import useSocketConnection from '../hooks/useSocketConnection';

function SendEventExample() {
  const { emit } = useSocketConnection();
  
  const sendData = () => {
    emit('event_name', { key: 'value' });
  };
  
  return <button onClick={sendData}>Gửi dữ liệu</button>;
}
```

### 3. Lắng nghe sự kiện từ socket

```tsx
import { useEffect } from 'react';
import useSocketConnection from '../hooks/useSocketConnection';

function ListenEventExample() {
  const { addListener } = useSocketConnection();
  
  useEffect(() => {
    // Thiết lập listener
    const cleanup = addListener('event_name', (data) => {
      console.log('Nhận dữ liệu:', data);
      // Xử lý dữ liệu...
    });
    
    // Cleanup khi component unmount
    return () => {
      cleanup();
    };
  }, [addListener]);
  
  return <div>Đang lắng nghe sự kiện 'event_name'</div>;
}
```

### 4. Điều khiển thiết bị

```tsx
import { useDeviceControl } from '../hooks/useDeviceControl';

function DeviceExample() {
  const { togglePump, toggleLed, pumpState, ledState } = useDeviceControl();
  
  return (
    <div>
      <p>Trạng thái bơm: {pumpState === 1 ? 'BẬT' : 'TẮT'}</p>
      <button onClick={togglePump}>
        {pumpState === 1 ? 'Tắt bơm' : 'Bật bơm'}
      </button>
      
      <p>Trạng thái đèn: {ledState === 1 ? 'BẬT' : 'TẮT'}</p>
      <button onClick={toggleLed}>
        {ledState === 1 ? 'Tắt đèn' : 'Bật đèn'}
      </button>
    </div>
  );
}
```

## Các sự kiện cảm biến hỗ trợ

Ứng dụng đang lắng nghe các sự kiện cảm biến sau:

- `temperature sensor` / `temp`: Dữ liệu nhiệt độ
- `soil moisture sensor`: Dữ liệu độ ẩm đất
- `light sensor` / `light`: Dữ liệu ánh sáng
- `humidity`: Dữ liệu độ ẩm không khí

## Các lệnh điều khiển thiết bị

Để điều khiển thiết bị, sử dụng hàm `emit` với sự kiện `control`:

```tsx
// Điều khiển máy bơm (bật)
emit('control', { feed: 'V10', value: '1' });

// Điều khiển đèn LED (tắt)
emit('control', { feed: 'V11', value: '0' });
```

## Xử lý lỗi kết nối

Socket được cấu hình để tự động kết nối lại khi mất kết nối. Bạn có thể kiểm tra trạng thái kết nối thông qua biến `isConnected` từ hook `useSocketConnection`.

## Hiển thị trạng thái kết nối

Component `SocketStatus` có thể được sử dụng để hiển thị trạng thái kết nối và các nút điều khiển tùy chọn:

```tsx
import SocketStatus from '../components/SocketStatus';

function MyPage() {
  return (
    <div>
      <h1>Trang của tôi</h1>
      <SocketStatus showControls={true} />
      {/* Nội dung khác... */}
    </div>
  );
}
```

## Cấu hình URL Socket

URL kết nối socket được cấu hình trong file `services/socket.tsx`. Mặc định là `http://localhost:8081`. Có thể thay đổi giá trị này nếu cần thiết. 