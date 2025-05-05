import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { connect } from '../store/SocketSlice';

interface ReduxTestProps {
  title?: string;
}

/**
 * Component kiểm tra kết nối Redux
 */
export function ReduxTest({ title = 'Redux Test' }: ReduxTestProps) {
  // Sử dụng try-catch để bắt lỗi khi Redux Provider không tồn tại
  let isConnected = false;
  let dispatch: any = null;

  try {
    // Thử sử dụng useSelector
    const socketState = useSelector((state: RootState) => state.socket);
    isConnected = true;

    // Thử sử dụng useDispatch
    dispatch = useDispatch();
  } catch (error) {
    console.error('Lỗi Redux:', error);
    isConnected = false;
  }

  // Xử lý khi click vào nút
  const handleConnect = () => {
    if (dispatch) {
      try {
        dispatch(connect());
        console.log('Đã kết nối socket thông qua Redux');
      } catch (error) {
        console.error('Lỗi khi dispatch action connect:', error);
      }
    } else {
      console.error('Không thể dispatch vì useDispatch không hoạt động');
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50 max-w-md mx-auto my-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      
      <div className="mb-4">
        <p className="font-medium">
          Trạng thái Redux: {' '}
          <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
            {isConnected ? 'Đã kết nối' : 'Chưa kết nối'}
          </span>
        </p>
      </div>
      
      <button
        onClick={handleConnect}
        disabled={!isConnected}
        className={`px-4 py-2 rounded text-white ${
          isConnected 
            ? 'bg-blue-500 hover:bg-blue-600' 
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Kết nối Socket
      </button>
    </div>
  );
} 