import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// MainMap Schema
const MainMapSchema = new mongoose.Schema(
    {
        mapUrl: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
    },
    {
        timestamps: true,
    }
);

const MainMapModel = mongoose.models.MainMap || mongoose.model('MainMap', MainMapSchema);

async function addMainMap() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected to MongoDB');

        // Convert the Google Maps sharing URL to embed URL
        const shareUrl = 'https://www.google.com/maps/d/u/1/edit?mid=1MZGoFdsY-bwtLBzHMv7n9Vpg3qCexcQ&usp=sharing';
        const mapId = '1MZGoFdsY-bwtLBzHMv7n9Vpg3qCexcQ';
        const embedUrl = `https://www.google.com/maps/d/embed?mid=${mapId}`;

        // Check if main map already exists
        const existingMap = await MainMapModel.findOne();

        if (existingMap) {
            // Update existing map
            await MainMapModel.findByIdAndUpdate(existingMap._id, {
                mapUrl: embedUrl,
                title: 'Rangpur Division Polling Locations',
                description: 'All polling centers across Rangpur Division for National Parliament Election 2026'
            });
            console.log('✅ Main map updated successfully!');
        } else {
            // Create new map
            await MainMapModel.create({
                mapUrl: embedUrl,
                title: 'Rangpur Division Polling Locations',
                description: 'All polling centers across Rangpur Division for National Parliament Election 2026'
            });
            console.log('✅ Main map added successfully!');
        }

        console.log('');
        console.log('Map Details:');
        console.log('============');
        console.log('Original URL:', shareUrl);
        console.log('Embed URL:', embedUrl);
        console.log('Title: Rangpur Division Polling Locations');
        console.log('');
        console.log('🗺️  Map is now visible on the home page!');
        console.log('📍 Visit: http://localhost:3000');

        process.exit(0);
    } catch (error) {
        console.error('Error adding main map:', error);
        process.exit(1);
    }
}

addMainMap();
