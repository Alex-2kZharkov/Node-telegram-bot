import { Global, HttpModule, Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogRepository, OrderRepository, RoleRepository, StuffRepository, UserRepository } from "../repositories";
import { HttpConfigService } from "./services/http-config.service";
import { MailService } from "./services/mail.service";
import { AuthService } from "./services/auth.service";

const REPOSITORIES = [
  CatalogRepository,
  OrderRepository,
  RoleRepository,
  StuffRepository,
  UserRepository,
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature(REPOSITORIES),
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
    HttpModule,
  ],
  providers: [Logger, MailService, AuthService],
  exports: [TypeOrmModule, HttpModule, Logger],
  controllers: [],
})
export class SharedModule {}
