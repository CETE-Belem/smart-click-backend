import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { ConflictError } from '../types/ConflictError';
import { Logger } from 'winston';

@Injectable()
export class ConflictInterceptor implements NestInterceptor {
  constructor(@Inject('winston') private logger: Logger) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof ConflictError) {
          this.logger.error(err.message);
          throw new ConflictException(err.message);
        } else {
          throw err;
        }
      }),
    );
  }
}
