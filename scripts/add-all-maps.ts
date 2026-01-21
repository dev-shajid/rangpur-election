import mongoose from 'mongoose';
import { districts } from '../src/lib/districts';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rangpur-election';
const MAP_URL = 'https://www.google.com/maps/d/embed?mid=1MZGoFdsY-bwtLBzHMv7n9Vpg3qCexcQ';

// Define schemas (same as models but for script context)
const DistrictMapSchema = new mongoose.Schema({
    districtId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    mapUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const UpazilaMapSchema = new mongoose.Schema({
    districtId: { type: String, required: true },
    upazilaId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    mapUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

UpazilaMapSchema.index({ districtId: 1, upazilaId: 1 }, { unique: true });

const DistrictMapModel = mongoose.models.DistrictMap || mongoose.model('DistrictMap', DistrictMapSchema);
const UpazilaMapModel = mongoose.models.UpazilaMap || mongoose.model('UpazilaMap', UpazilaMapSchema);

async function addAllMaps() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully!');

        let districtCount = 0;
        let upazilaCount = 0;

        // Add district maps
        console.log('\n--- Adding District Maps ---');
        for (const district of districts) {
            try {
                const existingMap = await DistrictMapModel.findOne({ districtId: district.id });
                
                if (existingMap) {
                    console.log(`✓ District map already exists: ${district.name}`);
                } else {
                    await DistrictMapModel.create({
                        districtId: district.id,
                        title: `${district.name} District Map`,
                        description: `Interactive map showing polling locations and key areas in ${district.name} district`,
                        mapUrl: MAP_URL,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                    districtCount++;
                    console.log(`✓ Added district map: ${district.name}`);
                }
            } catch (error: any) {
                console.error(`✗ Failed to add district map for ${district.name}:`, error.message);
            }
        }

        // Add upazila maps
        console.log('\n--- Adding Upazila Maps ---');
        for (const district of districts) {
            console.log(`\nProcessing ${district.name} district...`);
            
            for (const upazila of district.upazilas) {
                try {
                    const existingMap = await UpazilaMapModel.findOne({
                        districtId: district.id,
                        upazilaId: upazila.id
                    });
                    
                    if (existingMap) {
                        console.log(`  ✓ Upazila map already exists: ${upazila.nameEn}`);
                    } else {
                        await UpazilaMapModel.create({
                            districtId: district.id,
                            upazilaId: upazila.id,
                            title: `${upazila.nameBn} Map`,
                            description: `Interactive map showing polling centers and locations in ${upazila.nameEn} upazila`,
                            mapUrl: MAP_URL,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        });
                        upazilaCount++;
                        console.log(`  ✓ Added upazila map: ${upazila.nameEn}`);
                    }
                } catch (error: any) {
                    console.error(`  ✗ Failed to add upazila map for ${upazila.nameEn}:`, error.message);
                }
            }
        }

        console.log('\n=== Summary ===');
        console.log(`Districts: ${districtCount} new maps added (${districts.length} total districts)`);
        console.log(`Upazilas: ${upazilaCount} new maps added (${districts.reduce((sum, d) => sum + d.upazilas.length, 0)} total upazilas)`);
        console.log('\nAll maps have been populated successfully!');

    } catch (error) {
        console.error('Error populating maps:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\nMongoDB connection closed');
    }
}

addAllMaps();
