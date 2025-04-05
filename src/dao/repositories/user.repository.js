import UserModel from "../models/user.model.js";

export class UserRepository {
    async getByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async getById(id) {
        return await UserModel.findById(id);
    }

    async create(userData) {
        return await UserModel.create(userData);
    }
}
