import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
import { action } from "@ember/object";
import { later } from "@ember/runloop";

export default Component.extend({
  target: null,

  @discourseComputed("target")
  useGlimmer(target) {
    return target === "glimmer";
  },

  @discourseComputed("target")
  useWidgets(target) {
    return target === "widgets";
  },

  setupObserver() {
    return;
    if (this._performanceObserver) {
    }
    let start = null;
    let end = null;
    let count = 0;
    const po = new PerformanceObserver((list) => {
      list.getEntries().forEach((e) => {
        if (e.entryType === "mark" && e.name.startsWith("app-menu|")) {
          count++;
          if (e.name.endsWith("start")) {
            start = e.startTime;
          }
          if (e.name.endsWith("end") && count === 3) {
            end = e.startTime;
          }
          if (end && start) {
            console.log(end - start);
          }
        }
      });
    });
    po.observe({
      buffered: true,
      type: "mark",
    });
    this._performanceObserver = po;
  },

  didRender() {
    this._super(...arguments);
    const target = this.target;
    if (target === "glimmer") {
      performance.mark(`app-menu|end`);
    }
    if (!this._once) {
      this._once = true;
      later(() => {
        document.getElementById(this.button).click();
      }, 200);
    }
  },

  @action
  showGlimmer() {
    this.setupObserver();
    performance.mark("app-menu|start");
    this.set("target", "glimmer");
  },

  @action
  showWidgets() {
    this.setupObserver();
    performance.mark("app-menu|start");
    this.set("target", "widgets");
  },
});
