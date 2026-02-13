import axios from 'axios';
import { User, FIR, Station, Notification } from '../types';

// Mock Data
export const mockUser: User = {
  _id: 'mock-user-123',
  username: 'citizen_demo',
  full_name: 'Demo Citizen',
  email: 'demo@example.com',
  phone: '9876543210',
  role: 'citizen',
  aadhar: '1234-5678-9012'
};

const mockStations: Station[] = [
  { station_id: 'PS001', station_name: 'Central Police Station', location: 'City Center', phone: '100' },
  { station_id: 'PS002', station_name: 'North Division', location: 'North Avenue', phone: '101' },
];

const mockFIRs: FIR[] = [
  {
    _id: 'fir-001',
    user_id: 'mock-user-123',
    original_text: 'My bicycle was stolen from the market.',
    incident_date: '2023-10-25',
    incident_time: '14:30',
    location: 'Main Market',
    station_id: 'PS001',
    status: 'pending',
    submission_date: new Date().toISOString(),
    is_emergency: false,
    ai_suggestions: { sections: [], category: 'Theft' }
  },
  {
    _id: 'fir-002',
    user_id: 'mock-user-123',
    original_text: 'Lost my wallet near the park.',
    incident_date: '2023-10-20',
    incident_time: '10:00',
    location: 'City Park',
    station_id: 'PS002',
    status: 'accepted',
    submission_date: new Date(Date.now() - 86400000 * 5).toISOString(),
    is_emergency: false,
    ai_suggestions: { sections: [], category: 'Lost Property' }
  }
];

const mockNotifications: Notification[] = [
  {
    _id: 'notif-001',
    user_id: 'mock-user-123',
    message: 'Your FIR #fir-001 has been received.',
    is_read: false,
    created_at: new Date().toISOString()
  }
];

// Setup Interceptor
export const setupMockApi = () => {
    console.warn('⚠️ MOCK API ENABLED: Backend calls are being intercepted.');

    // We can't easily replace the adapter globally on the default instance if it's already used differently,
    // but interceptors are standard. Actually, for mocking, replacing the adapter is cleaner than an interceptor
    // because it avoids the actual network call entirely. Interceptors still make the call unless they throw/return.
    
    // However, axios-mock-adapter uses a specific approach. 
    // Here we will use a request interceptor that throws a specific object that the response interceptor catches,
    // OR we just override the adapter on the default instance.
    
    const defaultAdapter = axios.defaults.adapter;

    axios.defaults.adapter = async (config) => {
        const { url, method, data } = config;
        
        // Helper to delay
        await new Promise(resolve => setTimeout(resolve, 600));

        console.log(`[MockApi] ${method?.toUpperCase()} ${url}`, data ? JSON.parse(data) : '');

        function success(data: any, status = 200) {
            return {
                data,
                status,
                statusText: 'OK',
                headers: {},
                config,
                request: {}
            };
        }

        function error(msg: string, status = 400) {
             // Axios expects a rejected promise for errors usually, or a response with status code
             // But if we return a response structure with 4xx, axios might resolve it depending on validateStatus.
             // By default axios rejects for >= 400.
             // We'll throw an error object that looks like an axios error.
             const err: any = new Error('Request failed with status code ' + status);
             err.response = {
                 data: { error: msg },
                 status: status,
                 statusText: 'Error',
                 headers: {},
                 config
             };
             err.isAxiosError = true;
             throw err;
        }

        try {
             // Auth Routes
            if (url === '/api/auth/login' && method === 'post') {
                 // Accept any login
                return success({
                    token: 'mock-jwt-token',
                    role: 'citizen',
                    ...mockUser
                });
            }

            if (url === '/api/auth/register' && method === 'post') {
                return success({ message: 'Registration successful' }, 201);
            }

            if (url === '/api/auth/me' && method === 'get') {
                return success(mockUser);
            }

             if (url === '/api/auth/stations' && method === 'get') {
                return success(mockStations);
            }

            // FIR Routes
            if (url === '/api/fir/' && method === 'post') {
                return success({ message: 'FIR Submitted Successfully', firId: 'new-mock-id-' + Date.now() }, 201);
            }

            if (url === '/api/fir/' && method === 'get') {
                return success(mockFIRs);
            }
            
            if (url === '/api/fir' && method === 'get') {
                return success(mockFIRs);
            }

            // Notifications
            if (url === '/api/fir/notifications' && method === 'get') {
                return success(mockNotifications);
            }
             if (url?.includes('/read') && method === 'put') {
                return success({ message: 'Marked as read' });
            }
            
            // If not mocked, try to pass through? No, completely standalone.
            return error('Route not mocked: ' + url, 404);

        } catch (e) {
            throw e;
        }
    };
};
