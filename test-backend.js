// Test script to verify backend connection
// Run this with: node test-backend.js

const testBackendConnection = async () => {
  const backendUrl = 'https://bingov-backend.onrender.com'; // Replace with your actual URL
  
  try {
    console.log('Testing backend connection...');
    console.log(`Backend URL: ${backendUrl}`);
    
    // Test health endpoint
    const healthResponse = await fetch(`${backendUrl}/api/health`);
    const healthData = await healthResponse.json();
    
    console.log('✅ Health check successful:', healthData);
    
    // Test if backend is accessible
    if (healthResponse.ok) {
      console.log('✅ Backend is accessible and responding');
    } else {
      console.log('❌ Backend health check failed');
    }
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Backend URL is incorrect');
    console.log('2. Backend service is down');
    console.log('3. CORS configuration issue');
    console.log('4. Network connectivity problem');
  }
};

// Run the test
testBackendConnection(); 