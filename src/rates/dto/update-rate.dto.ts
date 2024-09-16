import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRateIntervalDto } from './create-rate-interval.dto';
import { UpdateRateIntervalDto } from './update-rate-interval.dto';
import { CreateRateDto } from './create-rate.dto';

export class UpdateRateDto extends CreateRateDto {
  @ApiProperty({
    isArray: true,
    type: CreateRateIntervalDto || UpdateRateIntervalDto,
    nullable: false,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateRateIntervalDto || UpdateRateIntervalDto)
  @IsOptional()
  intervalos_tarifas?: CreateRateIntervalDto[] | UpdateRateIntervalDto[];
}
