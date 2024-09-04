import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.blurd',
  appName: 'blurd',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
