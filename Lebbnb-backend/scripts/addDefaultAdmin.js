#!/usr/bin/env node

/**
 * Simple script to add default admin user to database
 * Email: admin@lebbnb.com
 * Password: admin@bnb123
 * 
 * Usage: node scripts/addDefaultAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function addDefaultAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lebbnb';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!\n');

    // Import Admin model
    const Admin = require('../dist/models/Admin.model').default;

    // Admin credentials
    const adminData = {
      email: 'admin@lebbnb.com',
      password: 'admin@bnb123',
      name: 'Admin',
      role: 'superadmin',
      isActive: true
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      console.log('Role:', existingAdmin.role);
      console.log('\nIf you want to update the password, delete the existing admin first or use the change password endpoint.');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create admin
    console.log('Creating admin user...');
    const admin = new Admin(adminData);
    await admin.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('\nAdmin Credentials:');
    console.log('==================');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('Role:', admin.role);
    console.log('\n⚠️  Remember to change the password after first login!');
    console.log('\nYou can now login at: POST /api/auth/login');

  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  }
}

addDefaultAdmin();
