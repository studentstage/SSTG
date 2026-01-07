// Debug script to check API response format
export const debugAuthResponse = (response) => {
  console.log('=== AUTH API RESPONSE DEBUG ===');
  console.log('Full response:', response);
  console.log('Response keys:', Object.keys(response));
  
  if (response.user) {
    console.log('User object:', response.user);
    console.log('User keys:', Object.keys(response.user));
    
    if (response.user.profile) {
      console.log('Profile object:', response.user.profile);
      console.log('Profile role:', response.user.profile.role);
    }
  }
  
  if (response['Access Token']) {
    console.log('Access Token exists:', response['Access Token'].substring(0, 20) + '...');
  }
  
  console.log('=== END DEBUG ===');
};
