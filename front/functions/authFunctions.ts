import axios from "axios";

export async function login({ email, password }: { email: string; password: string }) {
    try {
        const response = await axios.post('http://localhost:8080/auth/login', { email, password });
        if (response.status === 200 && response.data.token) {
            return response.data.token; 
        }
    } catch (error) {
        console.error('Login failed', error);
        throw new Error('Login failed'); 
    }
}
