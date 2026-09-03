const EventEmitter = require("events");

class NotificationService extends EventEmitter {
  constructor() {
    super();

    this.notifications = [];
  }

  async initialize() {
    console.log(
      "NotificationService initialized"
    );

    this.on(
      "notification:create",
      (notification) => {
        this.notifications.push({
          ...notification,
          createdAt: new Date()
        });

        console.log(
          "Notification created:",
          notification.message
        );
      }
    );
  }

  createNotification(data) {
    this.emit(
      "notification:create",
      data
    );

    return {
      success: true,
      message: "Notification created"
    };
  }

  getNotifications() {
    return this.notifications;
  }
}

module.exports = new NotificationService();