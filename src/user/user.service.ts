import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "../dto/create-user.dto";
import { User, UserDocument, UserConfiguration } from "../schema/user.schema";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel(dto);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async saveGoogleTokens(id: string, refreshToken: string): Promise<User> {
    return this.updateConfig(id, {
      validatedGoogle: true,
      googleRefreshToken: refreshToken,
    });
  }

  async saveZohoTokens(id: string, refreshToken: string): Promise<User> {
    return this.updateConfig(id, {
      validatedZoho: true,
      zohoRefreshToken: refreshToken,
    });
  }

  async updateCron(id: string, cronOption: string): Promise<User> {
    return this.updateConfig(id, { cronOption });
  }

  async updateConfig(
    id: string,
    config: Partial<UserConfiguration>,
  ): Promise<User> {
    const setFields = Object.fromEntries(
      Object.entries(config).map(([k, v]) => [`configuration.${k}`, v]),
    );
    const updated = await this.userModel
      .findByIdAndUpdate(id, { $set: setFields }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException("User not found");
    return updated;
  }

  async upsertUser(user: CreateUserDto): Promise<User> {
    this.logger.debug(`User Data payload ${JSON.stringify(user)}`);
    let userRes = await this.userModel.findOne({ email: user?.email }).exec();
    this.logger.debug(`Fetched user ${JSON.stringify(userRes)}`);
    if (!userRes?.email) {
      userRes = await this.userModel.create({ ...user });
      this.logger.debug(`created user ${JSON.stringify(userRes)}`);
    }
    return userRes;
  }
  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
}
