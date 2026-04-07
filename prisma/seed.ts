import prisma from '../src/lib/prisma';
import bcryptjs from 'bcryptjs';

async function main() {
  // Create admin user
  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin123!';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    // Update existing user to admin role
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'admin' },
    });
    console.log('✅ Admin user already exists - updated role to admin');
  } else {
    const hashedPassword = await bcryptjs.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('✅ Admin user created successfully');
  }

  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
