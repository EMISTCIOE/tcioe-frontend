/**
 * Environment configuration helper
 * Centralizes environment variable access and validation
 */

export const env = {
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-staging.tcioe.edu.np',
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
  API_DEBUG: process.env.NEXT_PUBLIC_API_DEBUG === 'true',
  // Mocking flag for department UI development
  USE_MOCK_DEPARTMENT: process.env.NEXT_PUBLIC_USE_MOCK_DEPARTMENT === 'true',
  
  // App Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Feature Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  
  // Validation
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Helper functions
  getApiUrl: (endpoint: string) => {
    const baseUrl = env.API_BASE_URL.endsWith('/') 
      ? env.API_BASE_URL.slice(0, -1) 
      : env.API_BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  },
  
  // Validate required environment variables
  validate: () => {
    const requiredVars = ['NEXT_PUBLIC_API_BASE_URL'];
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      console.warn(`Missing environment variables: ${missing.join(', ')}`);
      console.warn('Using default values. Please check your .env.local file.');
    }
    
    return missing.length === 0;
  }
} as const;

// Validate environment on module load
if (typeof window === 'undefined') {
  env.validate();
}

export default env;
