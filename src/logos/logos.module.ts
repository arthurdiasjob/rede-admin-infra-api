import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogosService } from './logos.service';
import { LogosController } from './logos.controller';
import {
  Logo as LogoSchema,
  LogoSchema as LogoSchemaDefinition,
} from './schemas/logo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LogoSchema.name, schema: LogoSchemaDefinition },
    ]),
  ],
  controllers: [LogosController],
  providers: [LogosService],
  exports: [LogosService],
})
export class LogosModule {}
