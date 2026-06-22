/**
 * column-cards
 * A Lovelace card that lays its child cards out in balanced CSS columns,
 * filling top-to-bottom down each column, then across — instead of the
 * default left-to-right row order.
 *
 * https://github.com/petergCA/column-cards
 */

const VERSION = "1.0.0";

class ColumnCards extends HTMLElement {
  static getStubConfig() {
    return { columns: 3, cards: [] };
  }

  setConfig(config) {
    if (!config || !Array.isArray(config.cards)) {
      throw new Error("column-cards: 'cards' must be a list of cards");
    }
    this._config = config;
    this._built = false;
    if (this._hass) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) {
      this._render();
    } else if (this._cards) {
      this._cards.forEach((el) => {
        el.hass = hass;
      });
    }
  }

  async _render() {
    if (this._building) return;
    this._building = true;
    try {
      const helpers = await window.loadCardHelpers();
      const cfg = this._config;
      const gap = cfg.column_gap || "8px";

      this.innerHTML = "";
      const wrap = document.createElement("div");
      // column_width takes precedence (responsive); otherwise a fixed column count.
      if (cfg.column_width) {
        wrap.style.columnWidth = cfg.column_width;
      } else {
        wrap.style.columnCount = String(cfg.columns || 3);
      }
      wrap.style.columnGap = gap;

      const cards = [];
      (cfg.cards || []).forEach((cardCfg) => {
        let el;
        try {
          el = helpers.createCardElement(cardCfg);
        } catch (err) {
          el = document.createElement("hui-error-card");
          el.setConfig({ type: "error", error: String(err), origConfig: cardCfg });
        }
        if (this._hass) el.hass = this._hass;

        const holder = document.createElement("div");
        holder.style.breakInside = "avoid";
        holder.style.webkitColumnBreakInside = "avoid";
        holder.style.marginBottom = gap;
        holder.appendChild(el);

        wrap.appendChild(holder);
        cards.push(el);
      });

      this.appendChild(wrap);
      this._cards = cards;
      this._built = true;
    } finally {
      this._building = false;
    }
  }

  getCardSize() {
    if (!this._config || !this._config.cards) return 1;
    const cols = this._config.columns || 3;
    return Math.max(1, Math.ceil(this._config.cards.length / cols));
  }
}

if (!customElements.get("column-cards")) {
  customElements.define("column-cards", ColumnCards);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "column-cards",
    name: "Column Cards",
    preview: false,
    description:
      "Lay child cards out in balanced CSS columns — filling top-to-bottom, then across.",
    documentationURL: "https://github.com/petergCA/column-cards",
  });
  // eslint-disable-next-line no-console
  console.info(
    `%c COLUMN-CARDS %c v${VERSION} `,
    "color:#fff;background:#00b4d8;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px;",
    "color:#00b4d8;background:#222;border-radius:0 4px 4px 0;padding:2px 6px;"
  );
}
