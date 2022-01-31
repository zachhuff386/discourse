import GlimmerComponent from "discourse/components/glimmer";
import DiscourseURL from "discourse/lib/url";
import I18n from "I18n";
// import { alias } from "@ember/object/computed";
// import { on } from "@ember/object/evented";
// import { schedule } from "@ember/runloop";
// import { topicTitleDecorators } from "discourse/components/topic-title";
import { wantsNewWindow } from "discourse/lib/intercept-click";
import { action } from "@ember/object";
import { cached } from "@glimmer/tracking";

export function showEntrance(e) {
  let target = $(e.target);

  if (target.hasClass("posts-map") || target.parents(".posts-map").length > 0) {
    if (target.prop("tagName") !== "A") {
      target = target.find("a");
      if (target.length === 0) {
        target = target.end();
      }
    }

    this.appEvents.trigger("topic-entrance:show", {
      topic: this.topic,
      position: target.offset(),
    });
    return false;
  }
}

export function navigateToTopic(topic, href) {
  this.appEvents.trigger("header:update-topic", topic);
  DiscourseURL.routeTo(href || topic.url);
  return false;
}

export default class TopicListItem extends GlimmerComponent {
  constructor() {
    super(...arguments);

    if (this.includeUnreadIndicator) {
      this.messageBus.subscribe(this.unreadIndicatorChannel, (data) => {
        const nodeClassList = document.querySelector(
          `.indicator-topic-${data.topic_id}`
        ).classList;

        if (data.show_indicator) {
          nodeClassList.remove("read");
        } else {
          nodeClassList.add("read");
        }
      });
    }

    // TODO: Make this a modifier
    // schedule("afterRender", () => {
    //   if (this.element && !this.isDestroying && !this.isDestroyed) {
    //     const rawTopicLink = this.element.querySelector(".raw-topic-link");

    //     rawTopicLink &&
    //       topicTitleDecorators &&
    //       topicTitleDecorators.forEach((cb) =>
    //         cb(this.topic, rawTopicLink, "topic-list-item-title")
    //       );
    //   }
    // });
  }

  willDestroy() {
    if (this.includeUnreadIndicator) {
      this.messageBus.unsubscribe(this.unreadIndicatorChannel);
    }
  }

  get unreadIndicatorChannel() {
    return `/private-messages/unread-indicator/${this.args.topic.id}`;
  }

  get unreadClass() {
    return this.args.topic.unreadByGroupMember ? "" : "read";
  }

  get includeUnreadIndicator() {
    return typeof this.args.topic.unreadByGroupMember !== "undefined";
  }

  get newDotText() {
    return this.currentUser && this.currentUser.trust_level > 0
      ? ""
      : I18n.t("filters.new.lower_title");
  }

  @cached
  get classNames() {
    const topic = this.args.topic;
    const lastVisitedTopic = this.args.lastVisitedTopic;
    let classes = [];

    if (topic.visited) {
      classes.push("visited");
    }

    if (topic.category) {
      classes.push("category-" + topic.category.fullSlug);
    }

    if (topic.tags) {
      topic.tags.forEach((tagName) => classes.push("tag-" + tagName));
    }

    if (topic.hasExcerpt) {
      classes.push("has-excerpt");
    }

    if (topic.unseen) {
      classes.push("unseen-topic");
    }

    if (topic.unread_posts) {
      classes.push("unread-posts");
    }

    ["liked", "archived", "bookmarked", "pinned", "closed"].forEach((name) => {
      if (topic[name]) {
        classes.push(name);
      }
    });

    if (topic === lastVisitedTopic) {
      classes.push("last-visit");
    }

    return classes.join(" ");
  }

  get hasLikes() {
    return this.args.topic.like_count > 0;
  }

  get hasOpLikes() {
    return this.args.topic.op_like_count > 0;
  }

  get expandPinned() {
    const pinned = this.args.topic.pinned;
    if (!pinned) {
      return false;
    }

    if (this.site.mobileView) {
      if (!this.siteSettings.show_pinned_excerpt_mobile) {
        return false;
      }
    } else {
      if (!this.siteSettings.show_pinned_excerpt_desktop) {
        return false;
      }
    }

    if (this.args.expandGloballyPinned && this.args.topic.pinned_globally) {
      return true;
    }

    if (this.args.expandAllPinned) {
      return true;
    }

    return false;
  }

  showEntrance = showEntrance;

  @action click(e) {
    const result = this.showEntrance(e);
    if (result === false) {
      e.preventDefault();
      return;
    }

    const topic = this.args.topic;
    const target = $(e.target);
    if (target.hasClass("bulk-select")) {
      const selected = this.selected;

      if (target.is(":checked")) {
        selected.addObject(topic);
      } else {
        selected.removeObject(topic);
      }
    }

    if (target.hasClass("raw-topic-link")) {
      if (wantsNewWindow(e)) {
        return;
      }
      if (this.navigateToTopic(topic, target.attr("href")) === false) {
        e.preventDefault();
      }
      return;
    }

    if (target.closest("a.topic-status").length === 1) {
      topic.togglePinnedForUser();
      e.preventDefault();
      return;
    }

    if (this.unhandledRowClick(e, topic) === false) {
      e.preventDefault();
    }
  }

  unhandledRowClick() {}

  navigateToTopic = navigateToTopic;

  // TODO: Reimplement as modifier... or maybe just with CSS
  //
  // highlight(opts = { isLastViewedTopic: false }) {
  //   schedule("afterRender", () => {
  //     if (!this.element || this.isDestroying || this.isDestroyed) {
  //       return;
  //     }

  //     const $topic = $(this.element);
  //     $topic
  //       .addClass("highlighted")
  //       .attr("data-islastviewedtopic", opts.isLastViewedTopic);

  //     $topic.on("animationend", () => $topic.removeClass("highlighted"));
  //   });
  // },

  // _highlightIfNeeded: on("didInsertElement", function () {
  //   // highlight the last topic viewed
  //   if (this.session.get("lastTopicIdViewed") === this.topic.id) {
  //     this.session.set("lastTopicIdViewed", null);
  //     this.highlight({ isLastViewedTopic: true });
  //   } else if (this.topic.highlight) {
  //     // highlight new topics that have been loaded from the server or the one we just created
  //     this.set("topic.highlight", false);
  //     this.highlight();
  //   }
  // }),
}
