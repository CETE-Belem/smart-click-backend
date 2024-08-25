import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { ConflictError } from '../types/ConflictError';

@Injectable()
export class ConflictInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof ConflictError) {
          throw new ConflictException(err.message);
        } else {
          throw err;
        }
      }),
    );
  }
}
