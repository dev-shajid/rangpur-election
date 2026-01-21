
import mongoose, { Schema, Model, models } from 'mongoose';

export interface IUpazilaMap {
    _id?: string;
    id?: string;
    districtId: string;
    upazilaId: string;
    mapUrl: string;
    title: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const upazilaMapSchema = new Schema<IUpazilaMap>(
    {
        districtId: { type: String, required: true },
        upazilaId: { type: String, required: true },
        mapUrl: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
    },
    {
        timestamps: true,
    }
);

// Composite unique index on districtId and upazilaId
upazilaMapSchema.index({ districtId: 1, upazilaId: 1 }, { unique: true });

export const UpazilaMapModel: Model<IUpazilaMap> = models.UpazilaMap || mongoose.model<IUpazilaMap>('UpazilaMap', upazilaMapSchema);
