import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

interface ReduxProviderProps {
  children: ReactNode;
}

/**
 * Cung cấp Redux store cho toàn bộ ứng dụng
 * Component này được thiết kế để bọc toàn bộ ứng dụng và cung cấp Redux store
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
  // Đảm bảo store đã được khởi tạo trước khi sử dụng
  if (!store) {
    console.error('Redux store chưa được khởi tạo!');
    return <>{children}</>;
  }

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
} 