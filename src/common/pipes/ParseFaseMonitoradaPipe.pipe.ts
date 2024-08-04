import { Fases } from '@prisma/client';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseFaseMonitoradaPipe implements PipeTransform {
  transform(value: any) {
    if (!Fases[value]) {
      throw new BadRequestException(`A fase ${value} não é válida`);
    }
    return value;
  }
}
