// Enhanced debug utility to log API responses
export const debugAPIResponse = (endpoint, response) => {
  console.log(`\n=== ${endpoint.toUpperCase()} API RESPONSE ===`);
  console.log('Full response:', response);
  console.log('Type of response:', typeof response);
  
  if (response && typeof response === 'object') {
    console.log('Response keys:', Object.keys(response));
    
    // Deep log nested objects
    const deepLog = (obj, prefix = '') => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          console.log(`${prefix}${key}:`, value);
          
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            deepLog(value, `${prefix}${key}.`);
          }
        }
      }
    };
    
    deepLog(response);
  }
  
  console.log('=== END DEBUG ===\n');
};

// Check localStorage data
export const debugLocalStorage = () => {
  console.log('\n=== LOCALSTORAGE DEBUG ===');
  const token = localStorage.getItem('access_token');
  const userData = localStorage.getItem('user_data');
  
  console.log('Access Token exists:', !!token);
  if (token) {
    console.log('Token length:', token.length);
    console.log('Token sample:', token.substring(0, 20) + '...');
  }
  
  console.log('User Data exists:', !!userData);
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      console.log('Parsed user data:', parsed);
      console.log('Parsed type:', typeof parsed);
      console.log('Parsed keys:', Object.keys(parsed));
      
      // Check for role in different possible locations
      console.log('\nRole search:');
      console.log('1. parsed.role:', parsed.role);
      console.log('2. parsed.profile?.role:', parsed.profile?.role);
      console.log('3. parsed.user?.profile?.role:', parsed.user?.profile?.role);
      console.log('4. parsed.user?.role:', parsed.user?.role);
      
    } catch (e) {
      console.error('Failed to parse user_data:', e);
    }
  }
  console.log('=== END DEBUG ===\n');
};
