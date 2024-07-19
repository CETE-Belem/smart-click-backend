import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ConcessionaireService } from './concessionaire.service';
import { CreateConcessionaireDto } from './dto/create-concessionaire.dto';
import { UpdateConcessionaireDto } from './dto/update-concessionaire.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JWTType } from 'src/types/jwt.types';
import { ConcessionaireEntity } from './entities/concessionaire.entity';

@ApiTags('concessionaires')
@Controller('concessionaire')
export class ConcessionaireController {
  constructor(private readonly concessionaireService: ConcessionaireService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiCreatedResponse({
    type: ConcessionaireEntity,
  })
  @ApiBody({
    type: CreateConcessionaireDto,
  })
  @ApiConflictResponse({
    description: 'Concessionária já cadastrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autorizado',
  })
  @ApiBearerAuth('token')
  create(
    @Request() req: JWTType,
    @Body() createConcessionaireDto: CreateConcessionaireDto,
  ) {
    return this.concessionaireService.create(req, createConcessionaireDto);
  }

  @Get()
  findAll() {
    return this.concessionaireService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.concessionaireService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiUnauthorizedResponse({
    description: 'Usuário não autorizado',
  })
  @ApiNotFoundResponse({
    description: 'Concessionária não encontrada',
  })
  @ApiOkResponse({
    type: ConcessionaireEntity,
  })
  @ApiBearerAuth('token')
  @ApiBody({
    type: UpdateConcessionaireDto,
  })
  update(
    @Request() req: JWTType,
    @Param('id') id: string,
    @Body() updateConcessionaireDto: UpdateConcessionaireDto,
  ) {
    return this.concessionaireService.update(id, updateConcessionaireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.concessionaireService.remove(+id);
  }
}
