import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { NewsModule } from './news/news.module';
import { AuthModule } from './auth/auth.module';
import { ModulesModule } from './modules/modules.module';
import { LogosModule } from './logos/logos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://departamentoti:uXPbEsmVPwNthKwZ@rede.wsc7ezr.mongodb.net/?retryWrites=true&w=majority&appName=rede',
    ),
    UsersModule,
    NewsModule,
    AuthModule,
    ModulesModule,
    LogosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
