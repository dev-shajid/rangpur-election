import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// User Schema
const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false },
        role: {
            type: String,
            default: undefined,
            required: false,
        },
    },
    { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

async function createSuperAdmin() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected to MongoDB');

        const email = 'admin@rangpur.com';
        const password = 'Admin@123456';
        const name = 'Super Administrator';

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            console.log('Superadmin user already exists!');
            console.log('Email:', email);
            console.log('Use existing password to login');
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await hash(password, 10);

        // Create superadmin user
        await UserModel.create({
            name,
            email,
            password: hashedPassword,
            role: 'superadmin',
        });

        console.log('✅ Superadmin user created successfully!');
        console.log('');
        console.log('Login Credentials:');
        console.log('==================');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('');
        console.log('⚠️  IMPORTANT: Change this password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error creating superadmin:', error);
        process.exit(1);
    }
}

createSuperAdmin();
