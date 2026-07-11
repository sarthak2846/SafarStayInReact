import { BrevoClient } from '@getbrevo/brevo';
import 'dotenv/config';

// Directly initialize the modern client with the single API key string
const apiInstance = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY, 
});

export default apiInstance;
