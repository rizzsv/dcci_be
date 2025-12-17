import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma.config';

// Load environment variables
config();

async function main() {
    console.log('🌱 Starting seed...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'NOT FOUND');
    
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL tidak ditemukan di file .env');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123456', 10);

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@dcci.com' },
        update: {},
        create: {
            name: 'Admin DCCI',
            email: 'admin@dcci.com',
            password: hashedPassword,
            role: 'ADMIN',
            phone: '+6281234567890'
        }
    });

    console.log('✅ Admin user created:', admin.email);

    // Create volunteer user
    const volunteerPassword = await bcrypt.hash('volunteer123', 10);
    const volunteer = await prisma.user.upsert({
        where: { email: 'volunteer@dcci.com' },
        update: {},
        create: {
            name: 'Volunteer DCCI',
            email: 'volunteer@dcci.com',
            password: volunteerPassword,
            role: 'VOLUNTEER',
            phone: '+6281234567891'
        }
    });

    console.log('✅ Volunteer user created:', volunteer.email);

    console.log('\n📋 Login Credentials:');
    console.log('================================');
    console.log('ADMIN:');
    console.log('  Email: admin@dcci.com');
    console.log('  Password: admin123456');
    console.log('');
    console.log('VOLUNTEER:');
    console.log('  Email: volunteer@dcci.com');
    console.log('  Password: volunteer123');
    console.log('================================\n');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
