import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8081"; // URL của backend

console.log(`Initializing socket connection to: ${SOCKET_URL}`);

// Khởi tạo socket với các tùy chọn
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, // Không tự động kết nối khi import
  reconnection: true, // Tự động kết nối lại khi mất kết nối
  reconnectionAttempts: 10, // Tăng số lần thử kết nối lại
  reconnectionDelay: 1000, // Thời gian delay giữa các lần kết nối (ms)
  timeout: 10000, // Thời gian timeout cho kết nối (ms)
});

// Biến để theo dõi trạng thái kết nối
let isReconnecting = false;

// Thêm các hàm tiện ích để tương tác với socket
export const connectSocket = () => {
  console.log('Manually connecting socket...');
  if (!socket.connected) {
    socket.connect();
  } else {
    console.log('Socket already connected');
  }
};

export const disconnectSocket = () => {
  console.log('Manually disconnecting socket...');
  socket.disconnect();
};

export const emitSocketEvent = (event: string, data: any, callback?: Function) => {
  console.log(`Emitting socket event: ${event}`, data);
  if (!socket.connected) {
    console.warn('Socket not connected. Connecting before emitting...');
    socket.connect();
    
    // Đợi kết nối được thiết lập trước khi gửi sự kiện
    socket.once('connect', () => {
      console.log(`Socket connected, now emitting delayed event: ${event}`);
      socket.emit(event, data, callback);
    });
  } else {
    socket.emit(event, data, callback);
  }
};

// Kiểm tra trạng thái kết nối
export const isSocketConnected = () => {
  return socket.connected;
};

// Thiết lập các sự kiện mặc định
socket.on('connect', () => {
  console.log('Socket connected from service');
  isReconnecting = false;
});

socket.on('disconnect', () => {
  console.log('Socket disconnected from service');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error from service:', error);
  if (!isReconnecting) {
    isReconnecting = true;
    console.log('Attempting to reconnect socket...');
    setTimeout(() => {
      socket.connect();
    }, 2000);
  }
});

socket.on('reconnect_attempt', (attemptNumber) => {
  console.log(`Socket reconnection attempt ${attemptNumber}`);
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`Socket reconnected after ${attemptNumber} attempts`);
  isReconnecting = false;
});

socket.on('reconnect_error', (error) => {
  console.error('Socket reconnection error:', error);
});

socket.on('reconnect_failed', () => {
  console.error('Socket reconnection failed after all attempts');
  isReconnecting = false;
});

export default socket;
