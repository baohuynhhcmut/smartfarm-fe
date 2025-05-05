import React from 'react';
import { ReduxTest } from '../app/ReduxTest';
import { Link } from 'react-router-dom';

export default function ReduxTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Kiểm tra Redux Provider</h1>
      
      <div className="mb-8">
        <p className="mb-4">
          Trang này được sử dụng để kiểm tra xem Redux Provider đã được thiết lập đúng chưa.
          Nếu mọi thứ đúng đắn, bạn sẽ thấy thông báo "Đã kết nối" và có thể nhấn nút để kết nối socket.
        </p>
        
        <div className="bg-yellow-50 p-4 rounded-lg mb-4 text-yellow-800 border border-yellow-300">
          <h3 className="font-semibold mb-2">Lưu ý:</h3>
          <p>
            Nếu bạn thấy lỗi "could not find react-redux context value; please ensure the component is wrapped in a &lt;Provider&gt;", 
            điều đó có nghĩa là React Redux Provider không được thiết lập đúng cách.
          </p>
        </div>
      </div>
      
      <ReduxTest title="Kiểm tra Redux Provider" />
      
      <div className="mt-8">
        <Link 
          to="/" 
          className="inline-block px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Quay lại trang chính
        </Link>
      </div>
    </div>
  );
} 