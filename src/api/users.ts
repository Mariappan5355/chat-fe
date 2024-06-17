import api from "./axios";


export interface UserListResponse {
    id: number;
    name: string;
    email: string;
    request_status: string;
}


export const getAllUsers = async (page: number, pageSize: number): Promise<{ data: UserListResponse[], pagination: any }> => {
    try {
        const response = await api.get<{ data: UserListResponse[], pagination: any }>(`/user/allUsers?page=${page}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch all users');
    }
};

export const getFriends = async (page: number, pageSize: number): Promise<{ data: UserListResponse[], pagination: any }> => {
    try {
        const response = await api.get<{ data: UserListResponse[], pagination: any }>(`/user/friends?page=${page}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch all users');
    }
};
export const sendMessage = async (recipientId: string, content: string) => {
    await api.post(`/send-message`, { recipientId, content });
};

export const getMessages = async (recipientId: string): Promise<any[]> => {
    try {
        const response = await api.get(`/messages/${recipientId}`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw new Error('Failed to fetch messages');
    }
};

export const getInboxMessages = async (): Promise<any[]> => {
    try {
        const response = await api.get(`/inbox`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw new Error('Failed to fetch messages');
    }
};
export const sendFriendRequest = async (receiverId: number) => {
    await api.post(`/user/friend-request/${receiverId}`, {}, {
    });
};

export const updateFriendRequest = async (requesterId: number, status: string): Promise<void> => {
    try {
        await api.put(`/user/friend-request`, { requesterId, status });
    } catch (error) {
        throw new Error('Failed to update friend request status');
    }
};