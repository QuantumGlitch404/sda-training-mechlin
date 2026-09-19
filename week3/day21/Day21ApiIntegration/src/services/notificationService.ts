import { NotificationData } from '../types';

class NotificationService {
  async requestPermissions(): Promise<boolean> {
    console.log('Notification permission request prepared.');
    return true;
  }

  sendLocalNotification(notification: NotificationData): void {
    console.log('Local notification:', notification);
  }

  scheduleNotification(
    notification: NotificationData,
    date: Date,
  ): void {
    console.log('Scheduled notification:', notification, date);
  }

  cancelAllNotifications(): void {
    console.log('All notifications cancelled.');
  }
}

export const notificationService = new NotificationService();
