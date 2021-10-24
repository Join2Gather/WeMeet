import axios from 'axios';

const client = axios.create();
//export const clientBaseURL = 'http://localhost:8000/';
export const clientBaseURL = 'http://api.dps0340.xyz/';
//client.defaults.baseURL = 'http://api.dps0340.xyz/';
client.defaults.baseURL = clientBaseURL;

// client.defaults.baseURL = '';
// client.defaults.withCredentials = true;

export default client;
