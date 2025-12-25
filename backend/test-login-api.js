// Test login API directly
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testLogin() {
  console.log('\n🧪 Testing Login API...\n');

  try {
    console.log('Sending POST to:', `${API_URL}/auth/login`);
    console.log('Credentials:', { username: 'admin', password: 'admin123' });

    const response = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });

    console.log('\n✅ LOGIN BERHASIL!\n');
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.data.token) {
      console.log('\n🎫 Token received:', response.data.token.substring(0, 50) + '...');
      console.log('👤 User:', response.data.user);
    }

    return true;
  } catch (error) {
    console.log('\n❌ LOGIN GAGAL\n');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('No response received');
      console.log('Request:', error.request._header);
    } else {
      console.log('Error:', error.message);
    }
    console.log('\nFull error:', error.toString());
    return false;
  }
}

testLogin();
