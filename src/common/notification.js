import React from 'react';
import { notification } from 'antd';

const NotificationContext = React.createContext();

export const NotificationProvider = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    return (
        <NotificationContext.Provider value={api}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const api = React.useContext(NotificationContext);
    if (!api) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return api;
};
