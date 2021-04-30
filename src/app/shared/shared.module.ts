import { Global, HttpModule, Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogRepository, OrderRepository, RoleRepository, StuffRepository, UserfRepository } from "../repositories";
import { HttpConfigService } from "./services/http-config.service";


const REPOSITORIES = [
  CatalogRepository,
  OrderRepository,
  RoleRepository,
  StuffRepository,
  UserfRepository
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
  providers: [Logger],
  exports: [
    TypeOrmModule,
    HttpModule,
    Logger,
  ],
  controllers: [],
})
export class SharedModule {}
