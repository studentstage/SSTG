import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Copy, RefreshCw, Database, Key, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const RoleDebug = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [debugData, setDebugData] = useState({});
  const { user, userRole, refreshUserData } = useAuth();

  useEffect(() => {
    const loadDebugData = () => {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user_data');
      
      let parsedUser = null;
      if (userStr) {
        try {
          parsedUser = JSON.parse(userStr);
        } catch (e) {
          console.error('Parse error:', e);
        }
      }
      
      setDebugData({
        token: token ? `${token.substring(0, 20)}...` : 'No token',
        tokenLength: token ? token.length : 0,
        localStorageUser: parsedUser,
        authContextUser: user,
        authContextRole: userRole,
      });
      
      // Log to console
      console.log('=== DEBUG DATA ===');
      console.log('1. Auth Context User:', user);
      console.log('2. Auth Context Role:', userRole);
      console.log('3. LocalStorage User:', parsedUser);
      console.log('4. Token exists:', !!token);
      console.log('=== END DEBUG ===');
    };

    loadDebugData();
  }, [user, userRole]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleRefresh = () => {
    if (refreshUserData) {
      refreshUserData().then(() => {
        alert('User data refreshed! Check console for updates.');
      });
    } else {
      window.location.reload();
    }
  };

  const analyzeUserObject = (userObj) => {
    if (!userObj) return { hasRole: false, roleLocation: null, roleValue: null };
    
    const paths = [
      { path: 'user.role', value: userObj.role },
      { path: 'user.profile.role', value: userObj.profile?.role },
      { path: 'user.user.profile.role', value: userObj.user?.profile?.role },
      { path: 'user.user.role', value: userObj.user?.role },
    ];
    
    for (const path of paths) {
      if (path.value && typeof path.value === 'string') {
        return { hasRole: true, roleLocation: path.path, roleValue: path.value };
      }
    }
    
    return { hasRole: false, roleLocation: null, roleValue: null };
  };

  const localStorageAnalysis = analyzeUserObject(debugData.localStorageUser);
  const contextAnalysis = analyzeUserObject(debugData.authContextUser);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
        title="Debug Role Detection"
      >
        {showDetails ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      
      {showDetails && (
        <div className="absolute bottom-12 right-0 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white">Role Debug Panel</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Refresh User Data"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={() => copyToClipboard(JSON.stringify(debugData, null, 2))}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Copy all debug data"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Authentication Status */}
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <Key size={16} className="text-gray-500" />
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Authentication</div>
              </div>
              <div className={`px-2 py-1 rounded text-sm ${debugData.token ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'}`}>
                {debugData.token ? `✅ Token: ${debugData.tokenLength} chars` : '❌ No token'}
              </div>
            </div>
            
            {/* Role Detection */}
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <User size={16} className="text-gray-500" />
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Role Detection</div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Auth Context Role</div>
                  <div className={`px-2 py-1 rounded text-sm font-bold ${
                    debugData.authContextRole === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' :
                    debugData.authContextRole === 'TUTOR' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    debugData.authContextRole === 'STUDENT' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                  }`}>
                    {debugData.authContextRole || 'NO ROLE DETECTED'}
                  </div>
                </div>
                
                {contextAnalysis.hasRole ? (
                  <div className="text-xs text-green-600 dark:text-green-400">
                    ✅ Found in context: {contextAnalysis.roleLocation} = "{contextAnalysis.roleValue}"
                  </div>
                ) : (
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">
                    ⚠️ No role found in auth context user object
                  </div>
                )}
              </div>
            </div>
            
            {/* Data Sources */}
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <Database size={16} className="text-gray-500" />
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Sources</div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">LocalStorage User Data</div>
                  <div className="text-xs font-mono bg-black/10 dark:bg-white/10 p-2 rounded overflow-auto max-h-24">
                    {debugData.localStorageUser ? 
                      JSON.stringify(debugData.localStorageUser, null, 2) : 
                      'No user data in localStorage'}
                  </div>
                  {localStorageAnalysis.hasRole && (
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ✅ LocalStorage role: {localStorageAnalysis.roleValue}
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Auth Context User Data</div>
                  <div className="text-xs font-mono bg-black/10 dark:bg-white/10 p-2 rounded overflow-auto max-h-24">
                    {debugData.authContextUser ? 
                      JSON.stringify(debugData.authContextUser, null, 2) : 
                      'No user data in auth context'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p className="font-medium mb-1">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Check browser console (F12 → Console)</li>
                  <li>Look for "API RESPONSE" logs</li>
                  <li>See what `/me` endpoint returns</li>
                  <li>Click Refresh button to refetch data</li>
                </ol>
                <p className="mt-2 text-red-500 dark:text-red-400">
                  Issue: Login API doesn't return role! Need to fetch from `/me`
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleDebug;
