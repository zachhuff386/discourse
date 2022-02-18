import { later } from "@ember/runloop";
import { createWidget, createWidgetFrom } from "discourse/widgets/widget";
import { h } from "virtual-dom";
import showModal from "discourse/lib/show-modal";
import ButtonWidget from "discourse/widgets/button";

const UserMenuAction = {
  QUICK_ACCESS: "quickAccess",
};

const QuickAccess = {
  BOOKMARKS: "bookmarks",
  MESSAGES: "messages",
  NOTIFICATIONS: "notifications",
  PROFILE: "profile",
};

const Titles = {
  bookmarks: "user.bookmarks",
  messages: "user.private_messages",
  notifications: "user.notifications",
  profile: "user.preferences",
};

let extraGlyphs;
const DEFAULT_TAB_ID = "notifications";

export function addUserMenuGlyph(glyph) {
  extraGlyphs = extraGlyphs || [];
  extraGlyphs.push(glyph);
}

// createWidget("user-menu-links", {
//   tagName: "div.menu-links-header",
//
//   _tabAttrs(quickAccessType) {
//     return {
//       "aria-controls": `quick-access-${quickAccessType}`,
//       "aria-selected": "false",
//       tabindex: "-1",
//     };
//   },
//
//   // TODO: Remove when 2.7 gets released.
//   _structureAsTab(extraGlyph) {
//     const glyph = extraGlyph;
//     // Assume glyph is a button if it has a data-url field.
//     if (!glyph.data || !glyph.data.url) {
//       glyph.title = glyph.label;
//       glyph.data = { url: glyph.href };
//
//       glyph.label = null;
//       glyph.href = null;
//     }
//
//     if (glyph.className) {
//       glyph.className += " menu-link";
//     } else {
//       glyph.className = "menu-link";
//     }
//
//     glyph.role = "tab";
//     glyph.tabAttrs = this._tabAttrs(glyph.actionParam);
//
//     return glyph;
//   },
//
//   profileGlyph() {
//     return {
//       title: Titles["profile"],
//       className: "user-preferences-link menu-link",
//       id: QuickAccess.PROFILE,
//       icon: "user",
//       action: UserMenuAction.QUICK_ACCESS,
//       actionParam: QuickAccess.PROFILE,
//       data: { url: `${this.attrs.path}/summary` },
//       role: "tab",
//       tabAttrs: this._tabAttrs(QuickAccess.PROFILE),
//     };
//   },
//
//   notificationsGlyph() {
//     return {
//       title: Titles["notifications"],
//       className: "user-notifications-link menu-link",
//       id: QuickAccess.NOTIFICATIONS,
//       icon: "bell",
//       action: UserMenuAction.QUICK_ACCESS,
//       actionParam: QuickAccess.NOTIFICATIONS,
//       data: { url: `${this.attrs.path}/notifications` },
//       role: "tab",
//       tabAttrs: this._tabAttrs(QuickAccess.NOTIFICATIONS),
//     };
//   },
//
//   bookmarksGlyph() {
//     return {
//       title: Titles["bookmarks"],
//       action: UserMenuAction.QUICK_ACCESS,
//       actionParam: QuickAccess.BOOKMARKS,
//       className: "user-bookmarks-link menu-link",
//       id: QuickAccess.BOOKMARKS,
//       icon: "bookmark",
//       data: { url: `${this.attrs.path}/activity/bookmarks` },
//       "aria-label": "user.bookmarks",
//       role: "tab",
//       tabAttrs: this._tabAttrs(QuickAccess.BOOKMARKS),
//     };
//   },
//
//   messagesGlyph() {
//     return {
//       title: Titles["messages"],
//       action: UserMenuAction.QUICK_ACCESS,
//       actionParam: QuickAccess.MESSAGES,
//       className: "user-pms-link menu-link",
//       id: QuickAccess.MESSAGES,
//       icon: "envelope",
//       data: { url: `${this.attrs.path}/messages` },
//       role: "tab",
//       tabAttrs: this._tabAttrs(QuickAccess.MESSAGES),
//     };
//   },
//
//   linkHtml(link) {
//     if (this.isActive(link)) {
//       link = this.markAsActive(link);
//     }
//     return this.attach("link", link);
//   },
//
//   glyphHtml(glyph, idx) {
//     if (this.isActive(glyph)) {
//       glyph = this.markAsActive(glyph);
//     }
//     glyph.data["tab-number"] = `${idx}`;
//
//     return this.attach("flat-button", glyph);
//   },
//
//   html() {
//     const glyphs = [this.notificationsGlyph()];
//
//     if (extraGlyphs) {
//       extraGlyphs.forEach((g) => {
//         if (typeof g === "function") {
//           g = g(this);
//         }
//         if (g) {
//           const structuredGlyph = this._structureAsTab(g);
//           Titles[structuredGlyph.actionParam] =
//             structuredGlyph.title || structuredGlyph.label;
//           glyphs.push(structuredGlyph);
//         }
//       });
//     }
//
//     glyphs.push(this.bookmarksGlyph());
//
//     if (this.siteSettings.enable_personal_messages || this.currentUser.staff) {
//       glyphs.push(this.messagesGlyph());
//     }
//
//     glyphs.push(this.profileGlyph());
//
//     return h("div.menu-links-row", [
//       h(
//         "div.glyphs",
//         { attributes: { "aria-label": "Menu links", role: "tablist" } },
//         glyphs.map((l, index) => this.glyphHtml(l, index))
//       ),
//     ]);
//   },
//
//   markAsActive(definition) {
//     // Clicking on an active quick access tab icon should redirect the user to
//     // the full page.
//     definition.action = null;
//     definition.actionParam = null;
//     definition.url = definition.data.url;
//
//     if (definition.className) {
//       definition.className += " active";
//     } else {
//       definition.className = "active";
//     }
//
//     definition.tabAttrs["tabindex"] = "0";
//     definition.tabAttrs["aria-selected"] = "true";
//
//     return definition;
//   },
//
//   isActive({ action, actionParam }) {
//     return (
//       action === UserMenuAction.QUICK_ACCESS &&
//       actionParam === this.attrs.currentQuickAccess
//     );
//   },
// });

createWidgetFrom(ButtonWidget, "avatar-menu-tab", {
  tagName: "button.btn-flat.avatar-menu-tab",

  additionalContent() {
    if (this.attrs.count) {
      return [h("span.badge-notification", this.attrs.count.toString())];
    }
  },
});

createWidget("user-menu-side-tabs-container", {
  tagName: "div.side-tabs-container",

  _coreTabs() {
    return [
      {
        id: DEFAULT_TAB_ID,
        icon: "bell",
        classes: ["all-notifications-tab"],
      },
      {
        id: "replied",
        icon: "reply",
        notificationType: this.site.notification_types.replied,
        classes: ["replied-notifications-tab"],
      },
      {
        id: "mentioned",
        icon: "at",
        notificationType: this.site.notification_types.mentioned,
        classes: ["mentioned-notifications-tab"],
      },
      {
        id: "liked",
        icon: "heart",
        notificationType: this.site.notification_types.liked,
        classes: ["liked-notifications-tab"],
      },
      {
        id: "pms",
        icon: "far-envelope",
        notificationType: this.site.notification_types.private_message,
        showCountBubble: true,
        classes: ["pms-notifications-tab"],
      },
      {
        id: "preferences",
        icon: "user-cog",
        classes: ["pms-notifications-tab"],
        bottom: true,
        url: `${this.attrs.path}/preferences`,
      },
    ];
  },

  _createTab(id, config) {
    const tab = { role: "tab" };
    tab.icon = config.icon;
    const classes = config.classes || [];
    classes.push("menu-link");
    if (config.url) {
      tab.url = config.url;
    } else {
      tab.action = "switchTab";
      // TODO: fix titleKey
      const actionParam = {
        id,
        titleKey: "<todo>",
        notificationType: config.notificationType,
      };
      tab.actionParam = actionParam;
    }
    tab.tabAttrs = {
      "aria-controls": `quick-access-${id}`,
      "aria-selected": "false",
      tabindex: "-1",
    };
    tab.data = config.data || {};
    if (this.attrs.currentQuickAccess === id) {
      classes.push("active");
      tab.tabAttrs["tabindex"] = "0";
      tab.tabAttrs["aria-selected"] = "true";
    }
    tab.className = classes.join(" ");
    return tab;
  },

  html() {
    let topTabs = [];
    let bottomTabs = [];
    this._coreTabs().forEach((config) => {
      const id = config.id;
      delete config.id;
      const tab = this._createTab(id, config);
      if (config.bottom) {
        bottomTabs.push(tab);
      } else {
        topTabs.push(tab);
      }
    });

    topTabs = topTabs.map((tab, index) => {
      tab.data["tab-number"] = `${index}`;
      return this.attach("avatar-menu-tab", tab);
    });
    bottomTabs = bottomTabs.map((tab, index) => {
      tab.data["tab-number"] = `${index + topTabs.length}`;
      return this.attach("avatar-menu-tab", tab);
    });

    return [
      h(
        "div.top-list",
        { attributes: { "aria-label": "Menu tabs", role: "tablist" } },
        topTabs
      ),
      h(
        "div.bottom-list",
        { attributes: { "aria-label": "Menu tabs", role: "tablist" } },
        bottomTabs
      ),
    ];
  },
});

export default createWidget("user-menu", {
  tagName: "div.user-menu",
  buildKey: () => "user-menu",

  settings: {
    maxWidth: 320,
    showLogoutButton: true,
  },

  userMenuNavigation(nav) {
    const maxTabNumber = document.querySelectorAll(".glyphs button").length - 1;
    const isLeft = nav.key === "ArrowLeft";

    let nextTab = isLeft ? nav.tabNumber - 1 : nav.tabNumber + 1;

    if (isLeft && nextTab < 0) {
      nextTab = maxTabNumber;
    }

    if (!isLeft && nextTab > maxTabNumber) {
      nextTab = 0;
    }

    document
      .querySelector(`.menu-link[role='tab'][data-tab-number='${nextTab}']`)
      .focus();
  },

  defaultState() {
    return {
      currentQuickAccess: QuickAccess.NOTIFICATIONS,
      titleKey: Titles["notifications"],
      hasUnread: false,
      markRead: null,
    };
  },

  panelContents() {
    const path = this.currentUser.path;
    const { currentQuickAccess, titleKey, notificationType } = this.state;

    let result = [];
    if (this.siteSettings.enable_revamped_notifications_menu) {
      result.push(
        this.quickAccessPanelRevamped(
          path,
          titleKey,
          currentQuickAccess,
          notificationType
        ),
        this.attach("user-menu-side-tabs-container", {
          path,
          currentQuickAccess,
        })
      );
    } else {
      result.push(
        this.attach("user-menu-links", {
          path,
          currentQuickAccess,
        }),
        this.quickAccessPanel(path, titleKey, currentQuickAccess)
      );
    }

    return result;
  },

  dismissNotifications() {
    const unreadHighPriorityNotifications = this.currentUser.get(
      "unread_high_priority_notifications"
    );

    if (unreadHighPriorityNotifications > 0) {
      return showModal("dismiss-notification-confirmation").setProperties({
        count: unreadHighPriorityNotifications,
        dismissNotifications: () => this.state.markRead(),
      });
    } else {
      return this.state.markRead();
    }
  },

  itemsLoaded({ hasUnread, markRead }) {
    this.state.hasUnread = hasUnread;
    this.state.markRead = markRead;
  },

  html() {
    return this.attach("menu-panel", {
      maxWidth: this.settings.maxWidth,
      contents: () => this.panelContents(),
      type: "avatar-menu",
    });
  },

  clickOutsideMobile(e) {
    const centeredElement = document.elementFromPoint(e.clientX, e.clientY);
    const parents = document
      .elementsFromPoint(e.clientX, e.clientY)
      .some((ele) => ele.classList.contains("panel"));
    if (!centeredElement.classList.contains("header-cloak") && parents) {
      this.sendWidgetAction("toggleUserMenu");
    } else {
      const windowWidth = document.body.offsetWidth;
      const panel = document.querySelector(".menu-panel");
      panel.classList.add("animate");
      let offsetDirection =
        document.querySelector("html").classList["direction"] === "rtl"
          ? -1
          : 1;
      panel.style.setProperty("--offset", `${offsetDirection * windowWidth}px`);
      const headerCloak = document.querySelector(".header-cloak");
      headerCloak.classList.add("animate");
      headerCloak.style.setProperty("--opacity", 0);
      later(() => this.sendWidgetAction("toggleUserMenu"), 200);
    }
  },

  clickOutside(e) {
    if (this.site.mobileView) {
      this.clickOutsideMobile(e);
    } else {
      this.sendWidgetAction("toggleUserMenu");
    }
  },

  quickAccess(type) {
    if (this.state.currentQuickAccess !== type) {
      this.state.currentQuickAccess = type;
      this.state.titleKey = Titles[type];
    }
  },

  switchTab({ id, titleKey, notificationType }) {
    if (this.state.currentQuickAccess !== id) {
      this.state.currentQuickAccess = id;
      this.state.notificationType = notificationType;
      this.state.titleKey = titleKey;
    }
  },

  quickAccessPanel(path, titleKey, currentQuickAccess) {
    const { showLogoutButton } = this.settings;
    // This deliberately does NOT fallback to a default quick access panel.
    return this.attach(`quick-access-${this.state.currentQuickAccess}`, {
      path,
      showLogoutButton,
      titleKey,
      currentQuickAccess,
    });
  },

  quickAccessPanelRevamped(
    path,
    titleKey,
    currentQuickAccess,
    notificationType
  ) {
    return this.attach("quick-access-notifications", {
      path,
      titleKey,
      currentQuickAccess,
      notificationType,
      revamped: true,
    });
  },
});
