import { Prisma } from '@prisma/client';
import { IGenericErrorResponse } from '../interfaces/common';

export default function handlePrismaClientKnownRequestError(
  error: Prisma.PrismaClientKnownRequestError
): IGenericErrorResponse {
  const statusCode = 400;
  let message = '';
  let errorMessages: {
    path: string | number;
    message: string;
  }[] = [];

  if (error.code === 'P2025') {
    message = (error.meta?.cause as string) || 'RecordNotFound';
    errorMessages = [
      {
        path: '',
        message
      }
    ];
  } else if (error.code === 'P2003') {
    if (error.message.includes('delete()` invocation:')) {
      message = 'DeleteFailed';
      errorMessages = [
        {
          path: '',
          message
        }
      ];
    }
  } else if (error.code === 'P2002') {
    if (error.message.includes('Unique constraint failed on the fields:')) {
      message = 'DuplicateRecord';
      errorMessages = [
        {
          path: '',
          message
        }
      ];
    }
  }

  console.error();

  return {
    statusCode,
    message,
    errorMessages
  };
}
