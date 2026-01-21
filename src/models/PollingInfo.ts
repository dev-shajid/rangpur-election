
import mongoose, { Schema, Model, models } from 'mongoose';
import { PollingInfo } from '@/types';

const pollingInfoSchema = new Schema<PollingInfo>(
    {
        serial: { type: String, required: true },
        name: { type: String, required: true },
        union: { type: String, required: true },
        location: { type: String, required: true },
        map: { type: String, required: true },
        maleVoters: { type: Number, required: true, default: 0 },
        femaleVoters: { type: Number, required: true, default: 0 },
        minority: { type: Number, required: true, default: 0 },
        presidingOfficer: { type: String, required: true },
        contactDetails: { type: String, required: true },
        category: { 
            type: String, 
            required: true, 
            enum: ['dangerous', 'less-dangerous', 'normal'],
            default: 'normal'
        },
        districtId: { type: String, required: true },
        upazilaId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export const PollingInfoModel: Model<PollingInfo> = models.PollingInfo || mongoose.model<PollingInfo>('PollingInfo', pollingInfoSchema);
