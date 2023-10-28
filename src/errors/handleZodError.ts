import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorResponse } from '../interfaces/common';

export default function handleZodError(error: ZodError): IGenericErrorResponse {
  const statusCode = 400;
  const message = 'Validation Error';
  const errorMessages = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message
    };
  });

  return {
    statusCode,
    message,
    errorMessages
  };
}
