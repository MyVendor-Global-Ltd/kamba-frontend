import React from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { Bell } from '../utils/phosphorIcons';
import { colors } from '../theme/tokens';

export const NotificationsScreen = () => (
  <ScreenShell scrollable={false} padded bg={colors.light.background}>
    <ScreenState
      type="empty"
      icon={Bell}
      title="Notifications are not connected"
      description="Push notifications and account alerts are not configured in this preview. No notification preferences are being saved."
    />
  </ScreenShell>
);

export default NotificationsScreen;
