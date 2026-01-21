import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// PollingInfo Schema
const PollingInfoSchema = new mongoose.Schema(
    {
        serial: { type: String, required: true },
        name: { type: String, required: true },
        map: { type: String, required: true },
        constituency: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        address: { type: String, required: true },
        districtId: { type: String, required: true },
        pollingAgent: { type: String, required: true },
        responsiblePersonnel: { type: String, required: true },
        upazilaId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const PollingInfoModel = mongoose.models.PollingInfo || mongoose.model('PollingInfo', PollingInfoSchema);

async function addSamplePollingCenters() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected to MongoDB');

        // Convert the Google Maps sharing URL to embed URL
        const mapId = '1MZGoFdsY-bwtLBzHMv7n9Vpg3qCexcQ';
        const embedUrl = `https://www.google.com/maps/d/embed?mid=${mapId}`;

        // Sample polling centers for different districts/upazilas
        const sampleCenters = [
            {
                serial: '001',
                name: 'Rangpur Government College',
                map: embedUrl,
                constituency: 'Rangpur-1',
                phoneNumber: '+880 1712-345678',
                address: 'College Road, Rangpur Sadar',
                districtId: 'rangpur',
                pollingAgent: 'Abdul Karim',
                responsiblePersonnel: 'Mohammad Hassan',
                upazilaId: 'rangpur-sadar',
            },
            {
                serial: '002',
                name: 'Carmichael College',
                map: embedUrl,
                constituency: 'Rangpur-1',
                phoneNumber: '+880 1712-345679',
                address: 'Station Road, Rangpur Sadar',
                districtId: 'rangpur',
                pollingAgent: 'Fatema Begum',
                responsiblePersonnel: 'Rahima Khatun',
                upazilaId: 'rangpur-sadar',
            },
            {
                serial: '003',
                name: 'Dinajpur Zilla School',
                map: embedUrl,
                constituency: 'Dinajpur-1',
                phoneNumber: '+880 1712-345680',
                address: 'Main Road, Dinajpur Sadar',
                districtId: 'dinajpur',
                pollingAgent: 'Shafiqul Islam',
                responsiblePersonnel: 'Jahangir Alam',
                upazilaId: 'dinajpur-sadar',
            },
            {
                serial: '004',
                name: 'Kurigram Government High School',
                map: embedUrl,
                constituency: 'Kurigram-1',
                phoneNumber: '+880 1712-345681',
                address: 'Hospital Road, Kurigram Sadar',
                districtId: 'kurigram',
                pollingAgent: 'Rupa Akter',
                responsiblePersonnel: 'Nurul Haque',
                upazilaId: 'kurigram-sadar',
            },
            {
                serial: '005',
                name: 'Lalmonirhat Government School',
                map: embedUrl,
                constituency: 'Lalmonirhat-1',
                phoneNumber: '+880 1712-345682',
                address: 'Court Road, Lalmonirhat Sadar',
                districtId: 'lalmonirhat',
                pollingAgent: 'Salma Khatun',
                responsiblePersonnel: 'Alamgir Hossain',
                upazilaId: 'lalmonirhat-sadar',
            },
        ];

        console.log('Adding sample polling centers...\n');

        for (const center of sampleCenters) {
            const existing = await PollingInfoModel.findOne({
                districtId: center.districtId,
                upazilaId: center.upazilaId,
                serial: center.serial,
            });

            if (existing) {
                await PollingInfoModel.findByIdAndUpdate(existing._id, { map: embedUrl });
                console.log(`✅ Updated: ${center.name} (${center.districtId}/${center.upazilaId})`);
            } else {
                await PollingInfoModel.create(center);
                console.log(`✅ Added: ${center.name} (${center.districtId}/${center.upazilaId})`);
            }
        }

        console.log('\n🎉 Sample polling centers added successfully!');
        console.log('\n📍 Maps are now visible in these locations:');
        console.log('   • Home Page: http://localhost:3000');
        console.log('   • Rangpur Sadar Polling: http://localhost:3000/district/rangpur/rangpur-sadar/polling');
        console.log('   • Dinajpur Sadar Polling: http://localhost:3000/district/dinajpur/dinajpur-sadar/polling');
        console.log('   • Kurigram Sadar Polling: http://localhost:3000/district/kurigram/kurigram-sadar/polling');
        console.log('   • Lalmonirhat Sadar Polling: http://localhost:3000/district/lalmonirhat/lalmonirhat-sadar/polling');

        process.exit(0);
    } catch (error) {
        console.error('Error adding polling centers:', error);
        process.exit(1);
    }
}

addSamplePollingCenters();
