// Test Configuration Script
// This script tests both development and production configurations

const testConfiguration = async () => {
  console.log('🧪 Testing BingoV Configuration...\n');

  // Test 1: Environment Detection
  console.log('1️⃣ Environment Detection:');
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isProduction = window.location.hostname === 'bingov.vercel.app';
  
  console.log(`   Current hostname: ${window.location.hostname}`);
  console.log(`   Is localhost: ${isLocalhost}`);
  console.log(`   Is production: ${isProduction}`);
  console.log(`   Environment: ${isLocalhost ? 'Development' : 'Production'}\n`);

  // Test 2: API Base URL
  console.log('2️⃣ API Base URL:');
  const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }
    
    if (isLocalhost) {
      return '/api';
    }
    
    return 'https://bingov-backend.onrender.com/api';
  };
  
  const apiBaseUrl = getApiBaseUrl();
  console.log(`   API Base URL: ${apiBaseUrl}\n`);

  // Test 3: Backend Health Check
  console.log('3️⃣ Backend Health Check:');
  try {
    const healthUrl = isLocalhost 
      ? 'http://localhost:5000/api/health'
      : 'https://bingov-backend.onrender.com/api/health';
    
    console.log(`   Testing: ${healthUrl}`);
    
    const response = await fetch(healthUrl);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`   ✅ Backend is healthy: ${data.message}`);
    } else {
      console.log(`   ❌ Backend health check failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Backend connection failed: ${error.message}`);
  }
  console.log('');

  // Test 4: Google OAuth URL
  console.log('4️⃣ Google OAuth Configuration:');
  const googleAuthUrl = `${apiBaseUrl}/auth/google`;
  console.log(`   Google Auth URL: ${googleAuthUrl}`);
  console.log(`   Callback URL: ${apiBaseUrl}/auth/google/callback`);
  console.log('');

  // Test 5: CORS Test
  console.log('5️⃣ CORS Test:');
  try {
    const testUrl = `${apiBaseUrl}/health`;
    console.log(`   Testing CORS with: ${testUrl}`);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('   ✅ CORS is working properly');
    } else {
      console.log(`   ⚠️  CORS test returned: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ CORS test failed: ${error.message}`);
  }
  console.log('');

  // Summary
  console.log('📋 Configuration Summary:');
  console.log(`   Environment: ${isLocalhost ? 'Development' : 'Production'}`);
  console.log(`   API Base: ${apiBaseUrl}`);
  console.log(`   Frontend: ${window.location.origin}`);
  console.log(`   Backend: ${isLocalhost ? 'http://localhost:5000' : 'https://bingov-backend.onrender.com'}`);
  
  if (isLocalhost) {
    console.log('\n💡 Development Mode: API calls will use relative paths');
  } else {
    console.log('\n🚀 Production Mode: API calls will use Render backend');
  }
};

// Run the test
testConfiguration(); 