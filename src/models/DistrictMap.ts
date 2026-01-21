
import mongoose, { Schema, Model, models } from 'mongoose';

export interface IDistrictMap {
    _id?: string;
    id?: string;
    districtId: string;
    mapUrl: string;
    title: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const districtMapSchema = new Schema<IDistrictMap>(
    {
        districtId: { type: String, required: true, unique: true },
        mapUrl: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
    },
    {
        timestamps: true,
    }
);

export const DistrictMapModel: Model<IDistrictMap> = models.DistrictMap || mongoose.model<IDistrictMap>('DistrictMap', districtMapSchema);
