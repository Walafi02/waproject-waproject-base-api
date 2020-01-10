import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommonModule } from 'modules/common/module';
import { DatabaseModule } from 'modules/database/module';

import { RequestController } from './controllers/request';
import { AuthController } from './controllers/auth';
import { TestController } from './controllers/test';
import { UserController } from './controllers/user';
import { RenewTokenMiddleware } from './middlewares/renewToken';
import { UserRepository } from './repositories/user';
import { RequestRepository } from './repositories/request';
import { AuthService } from './services/auth';
import { UserService } from './services/user';
import { RequestService } from './services/request';

@Module({
  imports: [HttpModule, CommonModule, DatabaseModule],
  controllers: [RequestController, AuthController, UserController, TestController],
  providers: [AuthService, UserRepository, UserService, RequestService, RequestRepository]
})
export class AdminModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(RenewTokenMiddleware).forRoutes('*');
  }
}
