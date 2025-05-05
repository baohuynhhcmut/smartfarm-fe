import React, { useEffect, useState } from 'react';
import useSocketConnection from '../hooks/useSocketConnection';

/**
 * Component ví dụ để minh họa cách sử dụng socket connection ở bất kỳ đâu trong ứng dụng
 */
const ExampleSocketComponent: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { isConnected, connect, disconnect, emit, addListener, socket } = useSocketConnection();

  // Thiết lập listener cho các tin nhắn mới
  useEffect(() => {
    const cleanup = addListener('new_message', (data: any) => {
      console.log('New message received:', data);
      setMessages(prev => [...prev, `${data.from}: ${data.text}`]);
    });

    // Cleanup function sẽ loại bỏ listener khi component unmount
    return () => {
      cleanup();
    };
  }, [addListener]);

  // Gửi tin nhắn đến server
  const sendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    emit('send_message', { text: inputMessage });
    setMessages(prev => [...prev, `Bạn: ${inputMessage}`]);
    setInputMessage('');
  };

  return (
    <div className="socket-example p-4 border rounded-lg mt-4">
      <h3 className="text-lg font-bold mb-2">Ví dụ sử dụng Socket</h3>
      
      <div className="connection-status mb-2">
        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
        <span>{isConnected ? 'Đã kết nối' : 'Mất kết nối'}</span>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={connect}
          disabled={isConnected}
          className={`px-3 py-1 bg-blue-500 text-white rounded ${isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Kết nối
        </button>
        
        <button 
          onClick={disconnect}
          disabled={!isConnected}
          className={`px-3 py-1 bg-red-500 text-white rounded ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Ngắt kết nối
        </button>
      </div>
      
      <div className="messages-container bg-gray-100 p-2 rounded min-h-[100px] max-h-[200px] overflow-y-auto mb-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="message py-1">
              {msg}
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic">Chưa có tin nhắn nào</div>
        )}
      </div>
      
      <div className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border rounded-l px-2 py-1"
          disabled={!isConnected}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || inputMessage.trim() === ''}
          className={`px-3 py-1 bg-blue-500 text-white rounded-r ${(!isConnected || inputMessage.trim() === '') ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ExampleSocketComponent; 