import { Subgrupo } from '@prisma/client';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

type ParseSubgrupoPipeOptions = {
  optional?: boolean;
};

@Injectable()
export class ParseSubgrupoPipe implements PipeTransform<string> {
  protected readonly options?: ParseSubgrupoPipeOptions;
  constructor(options?: ParseSubgrupoPipeOptions) {
    this.options = options;
  }
  transform(value: string) {
    if (this.options.optional && !value) {
      return undefined;
    }
    if (!Subgrupo[value]) {
      throw new BadRequestException(`O subgrupo ${value} não é válido`);
    }
    return value;
  }
}
