import GlimmerComponent from "discourse/components/glimmer";
import { Promise } from "rsvp";
import { tracked } from "@glimmer/tracking";

export default class QuickAccessPanel extends GlimmerComponent {
  @tracked items = [];
  @tracked isLoading = true;

  constructor() {
    super(...arguments);
    this.refreshItems();
  }

  get hideBottomItems() {
    return false;
  }

  get hasUnread() {
    return false;
  }

  get viewAllButton() {
    return null;
  }

  findNewItems() {
    return Promise.resolve([]);
  }

  refreshItems() {
    this.isLoading = true;
    this.findNewItems()
      .then((newItems) => {
        this.items = newItems;
      })
      .catch(() => (this.items = []))
      .finally(() => {
        this.isLoading = false;
      });
  }
}
