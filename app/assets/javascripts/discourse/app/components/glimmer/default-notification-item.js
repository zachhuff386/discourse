import GlimmerComponent from "discourse/components/glimmer";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import getURL from "discourse-common/lib/get-url";
import {
  escapeExpression,
  formatUsername,
  postUrl,
} from "discourse/lib/utilities";
import DiscourseURL, { userPath } from "discourse/lib/url";
import { isEmpty } from "@ember/utils";
import I18n from "I18n";

export default class DefaultNotificationItem extends GlimmerComponent {
  get className() {
    const notification = this.args.item;
    const classes = [];
    if (notification.read) {
      classes.push("read");
    }
    if (notification.is_warning) {
      classes.push("is-warning");
    }
    const name = this.site.notificationLookup[notification.notification_type];
    if (name) {
      classes.push(name.replace(/_/g, "-"));
    }
    return classes.join(" ");
  }

  get url() {
    const notification = this.args.item;
    const data = notification.data;
    const badgeId = data.badge_id;
    if (badgeId) {
      let slug = data.badge_slug;
      if (!slug) {
        const name = data.badge_name;
        slug = name.replace(/[^A-Za-z0-9_]+/g, "-").toLowerCase();
      }

      const username = data.username
        ? `?username=${data.username.toLowerCase()}`
        : "";
      return getURL(`/badges/${badgeId}/${slug}${username}`);
    }
    const topicId = notification.topic_id;
    if (topicId) {
      return postUrl(notification.slug, topicId, notification.post_number);
    }
    if (data.group_id) {
      return userPath(`${data.username}/messages/group/${data.group_name}`);
    }
  }

  get notificationName() {
    return this.site.notificationLookup[
      this.args.item.notification_type
    ];
  }

  get icon() {
    return `notification.${this.notificationName}`;
  }

  get notificationTitle() {
    if (this.notificationName) {
      return I18n.t(`notifications.titles.${this.notificationName}`);
    }
  }

  get description() {
    const notification = this.args.item;
    const data = notification.data;

    const badgeName = data.badge_name;
    if (badgeName) {
      return escapeExpression(badgeName);
    }

    const groupName = data.group_name;

    if (groupName) {
      if (notification.fancy_title) {
        if (notification.topic_id) {
          return `<span class="mention-group notify">@${groupName}</span><span data-topic-id="${notification.topic_id}"> ${notification.fancy_title}</span>`;
        }
        return `<span class="mention-group notify">@${groupName}</span> ${notification.fancy_title}`;
      }
    }

    if (notification.fancy_title) {
      if (notification.topic_id) {
        return `<span data-topic-id="${notification.topic_id}">${notification.fancy_title}</span>`;
      }
      return notification.fancy_title;
    }

    const description = data.topic_title;

    return isEmpty(description) ? "" : escapeExpression(description);
  }

  get text() {
    const username = formatUsername(
      this.args.item.data.display_username
    );

    return I18n.t(`notifications.${this.notificationName}`, {
      username,
      description: this.description,
    });
  }
}
