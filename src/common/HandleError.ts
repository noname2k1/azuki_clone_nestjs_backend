import { HttpException, HttpStatus } from '@nestjs/common';
export class HandleError {
  constructor(status?: HttpStatus, errorMsg?: string) {
    // default: status: 500
    if (!status || !errorMsg) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    throw new HttpException(
      {
        status,
        success: false,
        error: errorMsg,
      },
      status
    );
  }
}
