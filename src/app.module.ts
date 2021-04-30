import { Module } from "@nestjs/common";
import { typeOrmConfig } from "./app/config/database/typeorm.config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
