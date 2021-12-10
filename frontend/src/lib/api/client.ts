import axios from 'axios';
import { API_URL } from 'react-native-dotenv';
const client = axios.create();

console.log(API_URL);
export const clientBaseURL = API_URL;

client.defaults.baseURL = clientBaseURL;

export default client;
