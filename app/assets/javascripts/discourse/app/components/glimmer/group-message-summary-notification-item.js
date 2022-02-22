import DefaultNotificationItem from "discourse/components/glimmer/default-notification-item";
import { formatUsername } from "discourse/lib/utilities";
import I18n from "I18n";

export default class GroupMessageSummaryNotificationItem extends DefaultNotificationItem {
  get text() {
    const notification = this.args.item;
    const data = notification.data;
    const count = data.inbox_count;
    const group_name = data.group_name;

    return I18n.t("notifications.group_message_summary", {
      count,
      group_name,
    });
  }
}
