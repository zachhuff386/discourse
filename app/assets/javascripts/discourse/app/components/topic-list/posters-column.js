import GlimmerComponent from "discourse/components/glimmer";
import { renderAvatar } from "discourse/helpers/user-avatar";
import { htmlSafe } from "@ember/template";
import { escapeExpression } from "discourse/lib/utilities";

export default class PostersColumn extends GlimmerComponent {
  get postersHtml() {
    let html = "";
    for (const poster of this.args.posters) {
      if (poster.moreCount) {
        html += `<a class="posters-more-count">${escapeExpression(
          poster.moreCount
        )}</a>`;
      } else {
        html += `<a href="${escapeExpression(
          poster.user.path
        )}" data-user-card="${escapeExpression(
          poster.user.username
        )}" class="${escapeExpression(poster.extraClasses)}">`;
        html += renderAvatar(poster.user, { imageSize: "small" });
        html += "</a>";
      }
    }
    return htmlSafe(html);
  }
}
