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
  // constructor(@Inject('winston') private logger: Logger) {}
  constructor(){}
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
    console.log("LOGGER: ", JSON.stringify({
      timestamp: new Date().toISOString(),
      method: req.method,
      route: req.url,
      data: {
        body: body,
        query: req.query,
        params: req.params,
      },
      from: req.ip,
      madeBy: userEmail,
    }),)

    // Removido para a vercel
    // this.logger.info(
    //   JSON.stringify({
    //     timestamp: new Date().toISOString(),
    //     method: req.method,
    //     route: req.url,
    //     data: {
    //       body: body,
    //       query: req.query,
    //       params: req.params,
    //     },
    //     from: req.ip,
    //     madeBy: userEmail,
    //   }),
    // );
  }

  private logRes(res: Response) {
    // Removido para a vercel
    // this.logger.info(
    //   JSON.stringify({
    //     route: res.req.url,
    //     timestamp: new Date().toISOString(),
    //     status: res.statusCode,
    //     message: res.statusMessage,
    //   }),
    // );
    console.log("LOGGER: ", JSON.stringify({
      route: res.req.url,
      timestamp: new Date().toISOString(),
      status: res.statusCode,
      message: res.statusMessage,
    }),)
  }
}
