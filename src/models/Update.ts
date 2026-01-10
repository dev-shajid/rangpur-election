
import mongoose, { Schema, Model, models } from 'mongoose';
import { Update } from '@/types';

const updateSchema = new Schema<Update>(
    {
        location: { type: String, required: true },
        incident: { type: String, required: true },
        category: {
            type: String,
            enum: ['normal', 'less-critical', 'critical'],
            required: true
        },
        requirements: { type: String, default: 'None' },
        action: { type: String, required: true },
        districtId: { type: String, required: true },
        upazilaId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export const UpdateModel: Model<Update> = models.Update || mongoose.model<Update>('Update', updateSchema);
