import QuickAccessPanel from "discourse/components/glimmer/quick-access-panel";
import NOTIFICATIONS_JSON from "discourse/lib/notifications-json";
import { Promise } from "rsvp";
import { action } from "@ember/object";

const NotificationComponent = {
  liked: "glimmer/liked-notification-item",
  group_message_summary: "glimmer/group-message-summary-notification-item",
};

export default class QuickAccessNotification extends QuickAccessPanel {
  get viewAllButton() {
    return {
      href: `${this.currentUser.path}/notifications`,
      title: I18n.t("view_all_v2.notifications"),
    };
  }

  get hasUnread() {
    return !this.items.isEvery("read");
  }

  findNewItems() {
    return Promise.resolve(NOTIFICATIONS_JSON.notifications).then(
      (notifications) => {
        return notifications.map((notification) => {
          const name = this.site.notificationLookup[
            notification.notification_type
          ];
          const component =
            NotificationComponent[name] || "glimmer/default-notification-item";
          return { ...notification, component };
        });
      }
    );
  }

  @action
  dismissUnread() {}
}
