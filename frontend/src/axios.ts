// api.js or at the top of your main file
import axios from 'axios';

const apiClient = axios.create({
 baseURL: 'http://localhost:3000/api',
});

export default apiClient;
