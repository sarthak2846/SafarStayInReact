import * as brevo from '@getbrevo/brevo';
import 'dotenv/config';

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

export default apiInstance;
