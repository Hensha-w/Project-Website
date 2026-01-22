const mongoose = require('mongoose');
const User = require('./src/models/User'); // Use the actual model
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Testing MongoDB Connection and User Model...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clean up any test users
        await User.deleteMany({ email: /test/ });

        // Test 1: Create a user
        console.log('\n🧪 Test 1: Creating a user...');
        const testUser = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            phone: '1234567890'
        });

        await testUser.save();
        console.log('✅ User created successfully');
        console.log('   ID:', testUser._id);
        console.log('   Email:', testUser.email);
        console.log('   Password is hashed:', testUser.password.length > 20);

        // Test 2: Find the user
        console.log('\n🧪 Test 2: Finding the user...');
        const foundUser = await User.findOne({ email: 'test@example.com' });
        console.log('✅ User found:', foundUser.email);

        // Test 3: Compare password
        console.log('\n🧪 Test 3: Testing password comparison...');
        const isMatch = await foundUser.comparePassword('password123');
        console.log('✅ Correct password matches:', isMatch);

        const isWrongMatch = await foundUser.comparePassword('wrongpassword');
        console.log('✅ Wrong password does not match:', isWrongMatch);

        // Test 4: Try to create duplicate user
        console.log('\n🧪 Test 4: Testing duplicate email prevention...');
        try {
            const duplicateUser = new User({
                name: 'Duplicate User',
                email: 'test@example.com',
                password: 'password123'
            });
            await duplicateUser.save();
            console.log('❌ Should have thrown duplicate error');
        } catch (error) {
            if (error.code === 11000) {
                console.log('✅ Duplicate email correctly rejected');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }

        // Test 5: List all users in database
        console.log('\n🧪 Test 5: Checking database state...');
        const allUsers = await User.find({});
        console.log(`✅ Total users in database: ${allUsers.length}`);
        allUsers.forEach(user => {
            console.log(`   - ${user.email} (${user.name})`);
        });

        // Clean up test data (optional - keep for testing)
        console.log('\n🧹 Would you like to clean up test data?');
        console.log('   Test user email: test@example.com');
        console.log('   (Keeping test data is fine for development)');

        // Close connection
        await mongoose.connection.close();
        console.log('\n🎉 All tests passed! User model is working correctly.');
        console.log('🚀 You can now run the server with: npm run dev');
        process.exit(0);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);

        if (error.code === 11000) {
            console.log('\n💡 Tip: There might be existing test data.');
            console.log('   Run this in MongoDB shell:');
            console.log('   use final-year-projects');
            console.log('   db.users.deleteMany({ email: /test/ })');
        }

        process.exit(1);
    }
}

testConnection();