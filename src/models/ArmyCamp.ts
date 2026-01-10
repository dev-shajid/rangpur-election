
import mongoose, { Schema, Model, models } from 'mongoose';
import { ArmyCamp } from '@/types';

const armyCampSchema = new Schema<ArmyCamp>(
    {
        unit: { type: String, required: true },
        location: { type: String, required: true },
        map: { type: String, required: true },
        manpower: { type: Number, required: true },
        contactNumber: { type: String, required: true },
        districtId: { type: String, required: true },
        upazilaId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export const ArmyCampModel: Model<ArmyCamp> = models.ArmyCamp || mongoose.model<ArmyCamp>('ArmyCamp', armyCampSchema);
