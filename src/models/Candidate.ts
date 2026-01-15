
import mongoose, { Schema, Model, models } from 'mongoose';
import { Candidate } from '@/types';

const candidateSchema = new Schema<Candidate>(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        party: { type: String, required: true },
        contactNumber: { type: String, required: true },
        districtId: { type: String, required: true },
        upazilaId: { type: String, required: true },
        driveFileId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export const CandidateModel: Model<Candidate> = models.Candidate || mongoose.model<Candidate>('Candidate', candidateSchema);
