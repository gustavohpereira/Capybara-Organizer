
import axios from "axios";
import Cookies from "js-cookie";

export async function login({ email, password }: { email: string; password: string }) {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
        if (response.status === 200 && response.data.token) {
            console.log('Login successful', response.data.token);
            console.log(response.data.token)
            Cookies.set('token', response.data.token); 
            return response.data.token; 
        }
    } catch (error) {
        console.error('Login failed', error);
        throw new Error('Login failed'); 
    }
}


export async function getUserInfo(token: string) {
    try {
        if (token) {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getUser`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response)
            return response.data;
        }

       
    } catch (error) {
        console.error('Error fetching user info', error);
        throw new Error('Error fetching user info');
    }

}