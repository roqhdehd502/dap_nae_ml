import { Request } from 'express';

interface RequestWithApiKey extends Request {
  apiKey: string;
}

export default RequestWithApiKey;
