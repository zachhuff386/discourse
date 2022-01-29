import GlimmerComponent from "discourse/components/glimmer";
import I18n from "I18n";
import { cached } from "@glimmer/tracking";

export default class PostCountOrBadges extends GlimmerComponent {
  @cached
  get showBadges() {
    return this.args.postBadgesEnabled && this.args.topic.unread_posts;
  }

  @cached
  get newDotText() {
    return this.currentUser && this.currentUser.trust_level > 0
      ? ""
      : I18n.t("filters.new.lower_title");
  }
}
