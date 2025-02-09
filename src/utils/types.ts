// Firebase Auth Token Decoded Data
export interface DecodedIdToken {
    uid: string;
    email: string;
    role?: string;
    [key: string]: any;
}

export interface User {
    id: number;
    firebaseUid: string;
    email: string;
    role: string;
    fcmToken?: string;
}

// Request with User Information
export interface AuthenticatedRequest extends Express.Request {
    user?: DecodedIdToken;
}
