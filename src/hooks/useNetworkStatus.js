// hooks/useNetworkStatus.js — Network detection for USSD fallback banner
// Detects online/offline state for "Offline? Dial *901#" banner

import { useEffect, useState } from 'react';
import { NetInfo } from '@react-native-community/netinfo';

/**
 * Hook to monitor network connectivity status
 * Returns { isConnected, isInternetReachable, type, details }
 */
export const useNetworkStatus = () => {
  const [networkState, setNetworkState] = useState({
    isConnected: true,
    isInternetReachable: true,
    type: 'unknown',
    details: null,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
        details: state.details,
      });
    });

    // Initial check
    NetInfo.fetch().then((state) => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
        details: state.details,
      });
    });

    return () => unsubscribe();
  }, []);

  // Derived states
  const isOnline = networkState.isConnected && networkState.isInternetReachable;
  const isOffline = !isOnline;
  const isSlowConnection = networkState.type === 'cellular' && 
    networkState.details?.cellularGeneration && 
    ['2g', '3g'].includes(networkState.details.cellularGeneration.toLowerCase());

  return {
    ...networkState,
    isOnline,
    isOffline,
    isSlowConnection,
    // Convenience for USSD banner
    shouldShowUssdBanner: isOffline,
  };
};

/**
 * Hook for specific action-based USSD banner visibility
 * Shows banner only when offline AND user attempts specific action
 */
export const useUssdBanner = (action) => {
  const { isOffline } = useNetworkStatus();
  const [showBanner, setShowBanner] = useState(false);

  const triggerBanner = () => {
    if (isOffline) {
      setShowBanner(true);
      // Auto-hide after 8 seconds
      setTimeout(() => setShowBanner(false), 8000);
    }
  };

  const dismissBanner = () => setShowBanner(false);

  return {
    isOffline,
    showBanner,
    triggerBanner,
    dismissBanner,
  };
};

export default useNetworkStatus;