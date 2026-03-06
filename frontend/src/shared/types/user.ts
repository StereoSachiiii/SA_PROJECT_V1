import { User, AuthResponse, UserRequest as ApiUserRequest } from './api';

export type { User, AuthResponse };

export interface UserRequest extends ApiUserRequest {
    contactNumber: string;
    address?: string;
}
