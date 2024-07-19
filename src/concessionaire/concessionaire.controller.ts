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
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
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
  ApiParam,
  ApiQuery,
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
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: [ConcessionaireEntity],
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'uf',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'city',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
  })
  findAll(
    @Request() req: JWTType,
    @Query('name') name: string,
    @Query('uf') uf: string,
    @Query('city') city: string,
    @Query('page', new ParseIntPipe()) page: number,
    @Query('limit', new ParseIntPipe()) limit: number,
  ) {
    return this.concessionaireService.findAll(req, {
      name,
      uf,
      city,
      page,
      limit,
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('token')
  @ApiOkResponse({
    type: ConcessionaireEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autorizado',
  })
  @ApiNotFoundResponse({
    description: 'Concessionária não encontrada',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(
    @Request() req: JWTType,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.concessionaireService.findOne(req, id);
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateConcessionaireDto: UpdateConcessionaireDto,
  ) {
    return this.concessionaireService.update(id, updateConcessionaireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.concessionaireService.remove(+id);
  }
}
