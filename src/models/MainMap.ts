
import mongoose, { Schema, Model, models } from 'mongoose';

export interface IMainMap {
    _id?: string;
    id?: string;
    mapUrl: string;
    title: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const mainMapSchema = new Schema<IMainMap>(
    {
        mapUrl: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
    },
    {
        timestamps: true,
    }
);

export const MainMapModel: Model<IMainMap> = models.MainMap || mongoose.model<IMainMap>('MainMap', mainMapSchema);
