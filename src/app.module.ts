import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ApiService } from "./common/api.service";
import { CommonModule } from "./common/common.module";
import { GoogleModule } from "./google/google.module";
import { TrackModule } from "./track/track.module";
import { ZohoModule } from "./zoho/zoho.module";
import { ZohoService } from "./zoho/zoho.service";
import { ScheduleModule } from "@nestjs/schedule";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ZohoModule,
    TrackModule,
    CommonModule,
    GoogleModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [ZohoService, ApiService],
})
export class AppModule {}
