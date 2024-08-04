import { Subgrupo } from '@prisma/client';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseSubgrupoPipe implements PipeTransform {
  transform(value: any) {
    if (!Subgrupo[value]) {
      throw new BadRequestException(`O subgrupo ${value} não é válido`);
    }
    return value;
  }
}
