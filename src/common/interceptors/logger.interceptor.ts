import {
  Injectable,
  Inject,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { Logger } from 'winston';
import { Observable } from 'rxjs';
import { Response, Request } from 'express';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(@Inject('winston') private logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logReq(context.switchToHttp().getRequest());
    this.logRes(context.switchToHttp().getResponse());
    return next.handle();
  }

  private logReq(req: Request) {
    const body = { ...req.body };
    delete body.password;

    const user = (req as any).user;
    const userEmail = user ? user.email : null;
    this.logger.info(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        route: req.route.path,
        data: {
          body: body,
          query: req.query,
          params: req.params,
        },
        from: req.ip,
        madeBy: userEmail,
      }),
    );
  }

  private logRes(res: Response) {
    this.logger.info(
      JSON.stringify({
        route: res.req.route.path,
        timestamp: new Date().toISOString(),
        status: res.statusCode,
        message: res.statusMessage,
      }),
    );
  }
}
