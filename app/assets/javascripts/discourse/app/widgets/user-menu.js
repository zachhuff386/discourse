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

  _tabAttrs(quickAccessType) {
    return {
      "aria-controls": `quick-access-${quickAccessType}`,
      "aria-selected": "false",
      tabindex: "-1",
    };
  },

  linkHtml(link) {
    if (this.isActive(link)) {
      link = this.markAsActive(link);
    }
    return this.attach("link", link);
  },

  tabHtml(tab, idx) {
    if (this.isActive(tab)) {
      tab = this.markAsActive(tab);
    }
    if (!tab.data) {
      tab.data = {};
    }
    tab.data["tab-number"] = `${idx}`;
    if (tab.notificationType && this.attrs.unreadCountsByType) {
      tab.count = this.attrs.unreadCountsByType[tab.notificationType] || 0;
      delete tab.notificationType;
    }

    return this.attach("avatar-menu-tab", tab);
  },

  _coreTabs() {
    return [
      {
        id: "notifications",
        icon: "bell",
        className: "all-notifications-tab",
      },
      {
        id: "replied",
        icon: "reply",
        notificationTypeName: "replied",
        className: "replied-notifications-tab",
      },
      {
        id: "mentioned",
        icon: "at",
        notificationTypeName: "mentioned",
        className: "mentioned-notifications-tab",
      },
      {
        id: "liked",
        icon: "heart",
        notificationTypeName: "liked",
        className: "liked-notifications-tab",
      },
      {
        id: "pms",
        icon: "far-envelope",
        notificationTypeName: "private_message",
        className: "pms-notifications-tab",
      },
      {
        id: "preferences",
        icon: "user-cog",
        className: "pms-notifications-tab",
        bottom: true,
        url: `${this.attrs.path}/preferences`,
      },
    ];
  },

  _createTab(id, config, index) {
    const tab = { role: "tab" };
    tab.icon = config.icon;
    tab.className = "menu-link";
    if (config.className) {
      tab.className += ` ${config.className}`;
    }
    if (config.notificationTypeName) {
      tab.notificationType = this.site.notification_types[
        config.notificationTypeName
      ];
    }
    if (config.url) {
      tab.url = config.url;
    } else {
      tab.action = "switchTab";
      tab.actionParam = { type: id, titleKey: "tbd" };
    }
    tab.tabAttrs = {
      "aria-controls": `quick-access-${id}`,
      "aria-selected": "false",
      tabindex: "-1",
    };
    tab.data = config.data || {};
    tab.data["tab-number"] = `${index}`;
    if (this.attrs.currentQuickAccess === id) {
      tab.className += " active";
      tab.tabAttrs["tabindex"] = "0";
      tab.tabAttrs["aria-selected"] = "true";
    }
    return this.attach("avatar-menu-tab", tab);
  },

  html() {
    const topTabs = [];
    const bottomTabs = [];
    this._coreTabs().forEach((config) => {
      const id = config.id;
      delete config.id;
      const index = config.bottom ? bottomTabs.size : topTabs.size;
      const tab = this._createTab(id, config, index);
      if (config.bottom) {
        bottomTabs.push(tab);
      } else {
        topTabs.push(tab);
      }
    });
    // const topTabs = [
    //   this.allNotificationsTab(),
    //   this.repliedTab(),
    //   this.mentionedTab(),
    //   this.likedTab(),
    //   this.pmsTabs(),
    // ];

    return [
      h(
        "div.top-list",
        { attributes: { "aria-label": "Menu links", role: "tablist" } },
        // topTabs.map((l, index) => this.tabHtml(l, index))
        topTabs
      ),
      h(
        "div.bottom-list",
        { attributes: { "aria-label": "Menu links", role: "tablist" } },
        bottomTabs
      ),
    ];
  },

  markAsActive(definition) {
    // definition.action = null;
    // definition.actionParam = null;
    // definition.url = definition.data.url;

    if (definition.className) {
      definition.className += " active";
    } else {
      definition.className = "active";
    }

    definition.tabAttrs["tabindex"] = "0";
    definition.tabAttrs["aria-selected"] = "true";

    return definition;
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
      markUnread: null,
    };
  },

  panelContents() {
    const path = this.currentUser.get("path");
    const { currentQuickAccess, titleKey } = this.state;

    let result = [];
    if (this.siteSettings.enable_revamped_notifications_menu) {
      result.push(
        this.quickAccessPanelRevamped(path, titleKey, currentQuickAccess),
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

  switchTab({ type, titleKey }) {
    if (this.state.currentQuickAccess !== type) {
      this.state.currentQuickAccess = type;
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

  quickAccessPanelRevamped(path, titleKey, currentQuickAccess) {
    const { showLogoutButton } = this.settings;
    // This deliberately does NOT fallback to a default quick access panel.
    return this.attach(`quick-access-${this.state.currentQuickAccess}`, {
      path,
      showLogoutButton,
      titleKey,
      currentQuickAccess,
    });
  },
});
