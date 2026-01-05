
import { Role } from "@/types";
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: Role | undefined;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false },
        role: {
            type: String,
            default: undefined,
            required: false,
        },
    },
    { timestamps: true }
);

export const UserModel =
    (mongoose.models.User as mongoose.Model<IUser>) ||
    mongoose.model<IUser>("User", UserSchema);
