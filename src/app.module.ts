import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { NewsModule } from './news/news.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://guilhermenivia:pL8QeKCKiN6s468w@rede-cms.kbzess1.mongodb.net/rede?retryWrites=true&w=majority&appName=rede-cms',
    ),
    UsersModule,
    NewsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
