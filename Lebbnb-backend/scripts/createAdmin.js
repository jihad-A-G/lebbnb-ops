#!/usr/bin/env node

/**
 * Script to create the first admin user
 * Run this once after setting up the database and environment variables
 * 
 * Usage: node scripts/createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lebbnb';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully!\n');

    // Import Admin model
    const Admin = require('../dist/models/Admin.model').default;

    // Check if any admin already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      console.log('⚠️  Admin users already exist in the database.');
      const proceed = await question('Do you want to create another admin? (yes/no): ');
      if (proceed.toLowerCase() !== 'yes' && proceed.toLowerCase() !== 'y') {
        console.log('Exiting...');
        process.exit(0);
      }
    }

    console.log('=== Create Admin Account ===\n');

    // Get admin details
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 8 chars, must contain uppercase, lowercase, number, special char): ');
    const role = await question('Enter admin role (admin/superadmin) [default: superadmin]: ');

    // Validate inputs
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error('Invalid email address');
    }

    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    const adminRole = role.trim() || 'superadmin';
    if (!['admin', 'superadmin'].includes(adminRole)) {
      throw new Error('Role must be either "admin" or "superadmin"');
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      throw new Error('An admin with this email already exists');
    }

    // Create admin
    console.log('\nCreating admin...');
    const admin = new Admin({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: adminRole,
      isActive: true
    });

    await admin.save();

    console.log('\n✅ Admin created successfully!');
    console.log('\nAdmin Details:');
    console.log('==============');
    console.log('ID:', admin._id);
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('\nYou can now login with these credentials.');
    console.log('\n⚠️  IMPORTANT: After creating your first admin, remember to protect the registration endpoint by uncommenting the authentication middleware in src/routes/auth.routes.ts\n');

  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

createAdmin();
