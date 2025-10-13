import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);
  
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Une erreur interne est survenue';
      let error = 'Internal Server Error';
      let details: any = null;
  
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
  
        if (typeof exceptionResponse === 'object') {
          message = (exceptionResponse as any).message || message;
          error = (exceptionResponse as any).error || error;
          details = (exceptionResponse as any).details || null;
        } else {
          message = exceptionResponse as string;
        }
      } else if (exception instanceof Error) {
        message = exception.message;
        error = exception.name;
      }
  
      // Log l'erreur
      this.logger.error(
        `${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
        exception instanceof Error ? exception.stack : '',
      );
  
      // Réponse formatée
      const errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        error,
        message,
        ...(details && { details }),
      };
  
      response.status(status).json(errorResponse);
    }
  }
  