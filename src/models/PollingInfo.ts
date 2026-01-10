
import mongoose, { Schema, Model, models } from 'mongoose';
import { PollingInfo } from '@/types';

const pollingInfoSchema = new Schema<PollingInfo>(
    {
        serial: { type: String, required: true },
        name: { type: String, required: true },
        constituency: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        location: { type: String, required: true },
        districtId: { type: String, required: true },
        upazilaId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export const PollingInfoModel: Model<PollingInfo> = models.PollingInfo || mongoose.model<PollingInfo>('PollingInfo', pollingInfoSchema);
