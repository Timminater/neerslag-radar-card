const H = globalThis, j = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, B = /* @__PURE__ */ Symbol(), K = /* @__PURE__ */ new WeakMap();
let ot = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== B) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (j && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = K.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && K.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const mt = (r) => new ot(typeof r == "string" ? r : r + "", void 0, B), nt = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((i, s, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + r[o + 1], r[0]);
  return new ot(e, r, B);
}, $t = (r, t) => {
  if (j) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = H.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, r.appendChild(i);
  }
}, V = j ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return mt(e);
})(r) : r;
const { is: gt, defineProperty: vt, getOwnPropertyDescriptor: _t, getOwnPropertyNames: yt, getOwnPropertySymbols: bt, getPrototypeOf: At } = Object, R = globalThis, Z = R.trustedTypes, xt = Z ? Z.emptyScript : "", wt = R.reactiveElementPolyfillSupport, C = (r, t) => r, D = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? xt : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, at = (r, t) => !gt(r, t), X = { attribute: !0, type: String, converter: D, reflect: !1, useDefault: !1, hasChanged: at };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), R.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let A = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = X) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && vt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: o } = _t(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: s, set(n) {
      const l = s?.call(this);
      o?.call(this, n), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? X;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = At(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, i = [...yt(e), ...bt(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(V(s));
    } else t !== void 0 && e.push(V(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return $t(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : D).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const o = i.getPropertyOptions(s), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : D;
      this._$Em = s;
      const l = n.fromAttribute(e, o.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (s === !1 && (o = this[t]), i ??= n.getPropertyOptions(t), !((i.hasChanged ?? at)(o, e) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: o }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, o] of i) {
        const { wrapped: n } = o, l = this[s];
        n !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[C("elementProperties")] = /* @__PURE__ */ new Map(), A[C("finalized")] = /* @__PURE__ */ new Map(), wt?.({ ReactiveElement: A }), (R.reactiveElementVersions ??= []).push("2.1.2");
const F = globalThis, Y = (r) => r, T = F.trustedTypes, G = T ? T.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, lt = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, ct = "?" + v, Et = `<${ct}>`, b = document, P = () => b.createComment(""), k = (r) => r === null || typeof r != "object" && typeof r != "function", W = Array.isArray, St = (r) => W(r) || typeof r?.[Symbol.iterator] == "function", I = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, J = /-->/g, Q = />/g, _ = RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), tt = /'/g, et = /"/g, ht = /^(?:script|style|textarea|title)$/i, dt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), m = dt(1), O = dt(2), w = /* @__PURE__ */ Symbol.for("lit-noChange"), u = /* @__PURE__ */ Symbol.for("lit-nothing"), it = /* @__PURE__ */ new WeakMap(), y = b.createTreeWalker(b, 129);
function pt(r, t) {
  if (!W(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return G !== void 0 ? G.createHTML(t) : t;
}
const Ct = (r, t) => {
  const e = r.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = S;
  for (let l = 0; l < e; l++) {
    const c = r[l];
    let a, p, d = -1, $ = 0;
    for (; $ < c.length && (n.lastIndex = $, p = n.exec(c), p !== null); ) $ = n.lastIndex, n === S ? p[1] === "!--" ? n = J : p[1] !== void 0 ? n = Q : p[2] !== void 0 ? (ht.test(p[2]) && (s = RegExp("</" + p[2], "g")), n = _) : p[3] !== void 0 && (n = _) : n === _ ? p[0] === ">" ? (n = s ?? S, d = -1) : p[1] === void 0 ? d = -2 : (d = n.lastIndex - p[2].length, a = p[1], n = p[3] === void 0 ? _ : p[3] === '"' ? et : tt) : n === et || n === tt ? n = _ : n === J || n === Q ? n = S : (n = _, s = void 0);
    const g = n === _ && r[l + 1].startsWith("/>") ? " " : "";
    o += n === S ? c + Et : d >= 0 ? (i.push(a), c.slice(0, d) + lt + c.slice(d) + v + g) : c + v + (d === -2 ? l : g);
  }
  return [pt(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class N {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let o = 0, n = 0;
    const l = t.length - 1, c = this.parts, [a, p] = Ct(t, e);
    if (this.el = N.createElement(a, i), y.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = y.nextNode()) !== null && c.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(lt)) {
          const $ = p[n++], g = s.getAttribute(d).split(v), U = /([.?@])?(.*)/.exec($);
          c.push({ type: 1, index: o, name: U[2], strings: g, ctor: U[1] === "." ? kt : U[1] === "?" ? Nt : U[1] === "@" ? Mt : L }), s.removeAttribute(d);
        } else d.startsWith(v) && (c.push({ type: 6, index: o }), s.removeAttribute(d));
        if (ht.test(s.tagName)) {
          const d = s.textContent.split(v), $ = d.length - 1;
          if ($ > 0) {
            s.textContent = T ? T.emptyScript : "";
            for (let g = 0; g < $; g++) s.append(d[g], P()), y.nextNode(), c.push({ type: 2, index: ++o });
            s.append(d[$], P());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ct) c.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(v, d + 1)) !== -1; ) c.push({ type: 7, index: o }), d += v.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = b.createElement("template");
    return i.innerHTML = t, i;
  }
}
function E(r, t, e = r, i) {
  if (t === w) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const o = k(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== o && (s?._$AO?.(!1), o === void 0 ? s = void 0 : (s = new o(r), s._$AT(r, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = s : e._$Cl = s), s !== void 0 && (t = E(r, s._$AS(r, t.values), s, i)), t;
}
class Pt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? b).importNode(e, !0);
    y.currentNode = s;
    let o = y.nextNode(), n = 0, l = 0, c = i[0];
    for (; c !== void 0; ) {
      if (n === c.index) {
        let a;
        c.type === 2 ? a = new M(o, o.nextSibling, this, t) : c.type === 1 ? a = new c.ctor(o, c.name, c.strings, this, t) : c.type === 6 && (a = new Ut(o, this, t)), this._$AV.push(a), c = i[++l];
      }
      n !== c?.index && (o = y.nextNode(), n++);
    }
    return y.currentNode = b, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class M {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = E(this, t, e), k(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== w && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : St(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && k(this._$AH) ? this._$AA.nextSibling.data = t : this.T(b.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = N.createElement(pt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const o = new Pt(s, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = it.get(t.strings);
    return e === void 0 && it.set(t.strings, e = new N(t)), e;
  }
  k(t) {
    W(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const o of t) s === e.length ? e.push(i = new M(this.O(P()), this.O(P()), this, this.options)) : i = e[s], i._$AI(o), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = Y(t).nextSibling;
      Y(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class L {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, o) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  _$AI(t, e = this, i, s) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = E(this, t, e, 0), n = !k(t) || t !== this._$AH && t !== w, n && (this._$AH = t);
    else {
      const l = t;
      let c, a;
      for (t = o[0], c = 0; c < o.length - 1; c++) a = E(this, l[i + c], e, c), a === w && (a = this._$AH[c]), n ||= !k(a) || a !== this._$AH[c], a === u ? t = u : t !== u && (t += (a ?? "") + o[c + 1]), this._$AH[c] = a;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class kt extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Nt extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class Mt extends L {
  constructor(t, e, i, s, o) {
    super(t, e, i, s, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? u) === w) return;
    const i = this._$AH, s = t === u && i !== u || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== u && (i === u || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ut {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const Ot = F.litHtmlPolyfillSupport;
Ot?.(N, M), (F.litHtmlVersions ??= []).push("3.3.3");
const Ht = (r, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = e?.renderBefore ?? null;
    i._$litPart$ = s = new M(t.insertBefore(P(), o), o, void 0, e ?? {});
  }
  return s._$AI(r), s;
};
const q = globalThis;
class x extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ht(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return w;
  }
}
x._$litElement$ = !0, x.finalized = !0, q.litElementHydrateSupport?.({ LitElement: x });
const Tt = q.litElementPolyfillSupport;
Tt?.({ LitElement: x });
(q.litElementVersions ??= []).push("4.2.2");
function Rt(r) {
  if (r.length === 0) return "";
  if (r.length === 1) return `M ${r[0].x} ${r[0].y}`;
  const t = r.slice(1).map((s, o) => (s.y - r[o].y) / (s.x - r[o].x)), e = r.map((s, o) => {
    if (o === 0) return t[0];
    if (o === r.length - 1) return t[t.length - 1];
    if (t[o - 1] * t[o] <= 0) return 0;
    const n = r[o].x - r[o - 1].x, l = r[o + 1].x - r[o].x;
    return 3 * (n + l) / ((2 * l + n) / t[o - 1] + (l + 2 * n) / t[o]);
  });
  let i = `M ${r[0].x.toFixed(2)} ${r[0].y.toFixed(2)}`;
  for (let s = 0; s < r.length - 1; s += 1) {
    const o = r[s], n = r[s + 1], l = (n.x - o.x) / 3;
    i += ` C ${(o.x + l).toFixed(2)} ${(o.y + l * e[s]).toFixed(2)}`, i += ` ${(n.x - l).toFixed(2)} ${(n.y - l * e[s + 1]).toFixed(2)}`, i += ` ${n.x.toFixed(2)} ${n.y.toFixed(2)}`;
  }
  return i;
}
const h = { width: 600, height: 220, left: 46, right: 12, top: 18, bottom: 34 };
function Lt(r, t) {
  const e = h.width - h.left - h.right, i = h.height - h.top - h.bottom, o = r.points.filter((n) => n.middle >= t.start && n.middle <= t.end).map((n) => ({
    x: h.left + (n.middle - t.start) / (t.end - t.start) * e,
    y: h.top + i - Math.max(0, Math.min(t.maxY, n.precipitation_intensity)) / t.maxY * i
  }));
  return Rt(o);
}
const It = 10800 * 1e3;
function ut(r) {
  return typeof r == "object" && r !== null;
}
function Dt(r) {
  if (!ut(r)) return;
  const t = r.datetime, e = r.interval_minutes, i = r.precipitation, s = r.precipitation_intensity, o = typeof t == "string" ? Date.parse(t) : Number.NaN;
  if (!Number.isFinite(o) || typeof e != "number" || e <= 0 || typeof i != "number" || !Number.isFinite(i) || typeof s != "number" || !Number.isFinite(s)) return;
  const n = (a) => r[a], l = { datetime: t, interval_minutes: e, precipitation: i, precipitation_intensity: s };
  typeof n("probability") == "number" && (l.probability = n("probability")), typeof n("uncertainty") == "number" && (l.uncertainty = n("uncertainty")), typeof n("source") == "string" && (l.source = n("source"));
  const c = o + e * 6e4;
  return { ...l, start: o, end: c, middle: o + (c - o) / 2 };
}
function zt(r) {
  if (!r.entity_id.startsWith("sensor.")) return;
  const t = r.attributes;
  if (t.forecast_schema_version !== 1 || typeof t.location_id != "string" || typeof t.location_name != "string" || typeof t.provider != "string" || t.provider.toLowerCase() === "global" || !Array.isArray(t.forecast)) return;
  const e = t.forecast.map(Dt).filter((i) => i !== void 0).sort((i, s) => i.start - s.start);
  if (e.length !== 0)
    return {
      entityId: r.entity_id,
      provider: t.provider,
      locationId: t.location_id,
      locationName: t.location_name,
      points: e,
      unavailable: r.state === "unavailable" || r.state === "unknown"
    };
}
function z(r) {
  const t = /* @__PURE__ */ new Map();
  return Object.values(r.states).forEach((e) => {
    const i = zt(e);
    if (!i) return;
    const s = t.get(i.locationId) ?? {
      id: i.locationId,
      name: i.locationName,
      providers: []
    };
    s.providers.push(i), t.set(s.id, s);
  }), [...t.values()].sort((e, i) => e.name.localeCompare(i.name));
}
function jt(r, t = Date.now()) {
  return r.providers.map((e) => ({
    ...e,
    points: e.points.filter((i) => i.end > t)
  })).filter((e) => e.points.length > 0);
}
function Bt(r, t = Date.now()) {
  const e = r.flatMap((l) => l.points.filter((c) => c.end > t));
  if (!e.length) return;
  const i = Math.min(...e.map((l) => l.start)), s = Math.max(...e.map((l) => l.end)), o = Math.min(s, i + It), n = Math.max(0, ...e.filter((l) => l.middle <= o).map((l) => l.precipitation_intensity));
  return { start: i, end: o, maxY: Ft(n) };
}
function Ft(r) {
  if (!Number.isFinite(r) || r <= 0) return 1;
  const t = 10 ** Math.floor(Math.log10(r)), e = r / t;
  return (e <= 1 ? 1 : e <= 2 ? 2 : e <= 5 ? 5 : 10) * t;
}
function Wt(r, t) {
  return r.flatMap((e) => {
    const i = e.points.find((s) => s.start <= t && t < s.end);
    return i ? [{ provider: e.provider, point: i, unavailable: e.unavailable }] : [];
  });
}
function qt(r) {
  if (!ut(r) || r.type !== "custom:neerslag-radar-card" || r.location_id !== void 0 && typeof r.location_id != "string" || r.title !== void 0 && typeof r.title != "string")
    throw new Error("Invalid configuration for custom:neerslag-radar-card");
}
const Kt = {
  nl: {
    unavailable: "Een of meer bronnen zijn niet beschikbaar; de verwachting kan verouderd zijn.",
    noData: "Geen actuele neerslagverwachting beschikbaar.",
    chooseLocation: "Kies een locatie",
    location: "Locatie",
    title: "Titel",
    titlePlaceholder: "Neerslagverwachting",
    intensity: "Neerslagintensiteit (mm/u)",
    amount: "Neerslag",
    interval: "Interval",
    configuration: "Kaartconfiguratie",
    intensityUnit: "mm/u",
    staleProvider: "Deze provider is tijdelijk niet beschikbaar; laatst bekende verwachting"
  },
  en: {
    unavailable: "One or more sources are unavailable; this forecast may be stale.",
    noData: "No current precipitation forecast available.",
    chooseLocation: "Choose a location",
    location: "Location",
    title: "Title",
    titlePlaceholder: "Precipitation forecast",
    intensity: "Precipitation intensity (mm/h)",
    amount: "Precipitation",
    interval: "Interval",
    configuration: "Card configuration",
    intensityUnit: "mm/h",
    staleProvider: "This provider is temporarily unavailable; last known forecast"
  }
};
function Vt(r) {
  return r?.toLowerCase().startsWith("nl") ? "nl" : "en";
}
function f(r, t) {
  return Kt[Vt(r)][t];
}
class Zt extends x {
  static properties = { hass: { attribute: !1 }, _config: { state: !0 } };
  hass;
  _config;
  static styles = nt`
    :host { display: block; padding: 16px; }
    .field { display: grid; gap: 6px; margin: 0 0 16px; }
    label { font-weight: 500; }
    select, input { font: inherit; border: 1px solid var(--divider-color); border-radius: 4px; padding: 9px; color: var(--primary-text-color); background: var(--card-background-color); }
  `;
  setConfig(t) {
    this._config = { ...t };
  }
  changed(t, e) {
    const i = { type: "custom:neerslag-radar-card", ...this._config, [t]: e };
    this._config = i, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: i }, bubbles: !0, composed: !0 }));
  }
  render() {
    const t = this.hass?.locale?.language ?? this.hass?.config.language, e = this.hass ? z(this.hass) : [], i = this._config?.location_id ?? (e.length === 1 ? e[0].id : "");
    return m`
      <div class="field">
        <label for="location">${f(t, "location")}</label>
        <select id="location" .value=${i} @change=${(s) => this.changed("location_id", s.target.value)}>
          ${e.length !== 1 ? m`<option value="" disabled>${f(t, "chooseLocation")}</option>` : null}
          ${e.map((s) => m`<option value=${s.id}>${s.name}</option>`)}
        </select>
      </div>
      <div class="field">
        <label for="title">${f(t, "title")}</label>
        <input id="title" .value=${this._config?.title ?? ""} placeholder=${f(t, "titlePlaceholder")}
          @input=${(s) => this.changed("title", s.target.value)}>
      </div>`;
  }
}
customElements.get("neerslag-radar-card-editor") || customElements.define("neerslag-radar-card-editor", Zt);
const ft = ["#0d47a1", "#1565c0", "#1976d2", "#1e88e5", "#42a5f5", "#64b5f6"];
function Xt(r) {
  return [...r].reduce((t, e) => t * 31 + e.charCodeAt(0) >>> 0, 0) % ft.length;
}
function st(r) {
  const t = r.toLowerCase(), e = {
    buienradar: "var(--neerslag-radar-buienradar, #0d47a1)",
    buienalarm: "var(--neerslag-radar-buienalarm, #1565c0)",
    knmi: "var(--neerslag-radar-knmi, #1e88e5)",
    open_meteo: "var(--neerslag-radar-open-meteo, #42a5f5)"
  }, i = Xt(t);
  return e[t] ?? `var(--neerslag-radar-provider-${i + 1}, ${ft[i]})`;
}
function rt(r) {
  return {
    buienradar: "Buienradar",
    buienalarm: "Buienalarm",
    knmi: "KNMI",
    open_meteo: "Open-Meteo"
  }[r.toLowerCase()] ?? r.replaceAll("_", " ");
}
class Yt extends x {
  static properties = { hass: { attribute: !1 } };
  hass;
  config;
  hiddenProviders = /* @__PURE__ */ new Set();
  hover;
  static styles = nt`
    :host { display: block; }
    ha-card { overflow: hidden; }
    .content { padding: 14px 16px 12px; }
    h2 { font-size: 1rem; margin: 0 0 10px; font-weight: 500; color: var(--primary-text-color); }
    .legend { display: flex; flex-wrap: wrap; gap: 5px 12px; margin-bottom: 6px; }
    .legend button { display: inline-flex; align-items: center; gap: 5px; color: var(--primary-text-color); border: 0; background: transparent; padding: 2px; cursor: pointer; font: inherit; font-size: .8rem; }
    .legend button[aria-pressed="false"] { opacity: .45; text-decoration: line-through; }
    .swatch { width: 13px; height: 3px; background: var(--series-color); border-radius: 3px; }
    .chart { width: 100%; display: block; outline: none; touch-action: pan-y; }
    .grid { stroke: var(--divider-color, #d0d0d0); stroke-opacity: .65; stroke-width: 1; }
    .axis, .tick { fill: var(--secondary-text-color); font-size: 10px; }
    .axis { font-size: 9px; }
    path.series { fill: none; stroke: var(--series-color); stroke-width: 2.5; vector-effect: non-scaling-stroke; stroke-linecap: round; stroke-linejoin: round; }
    path.unavailable { stroke-dasharray: 5 4; opacity: .56; }
    .cursor { stroke: var(--secondary-text-color); stroke-width: 1; stroke-dasharray: 3 3; }
    .tooltip { position: relative; margin: 2px 0 0 46px; padding: 7px 9px; border-radius: 6px; background: var(--secondary-background-color, rgba(127,127,127,.14)); color: var(--primary-text-color); font-size: .78rem; }
    .tooltip div + div { margin-top: 3px; }
    .warning { color: var(--warning-color, #f57c00); font-size: .78rem; margin: 4px 0 0; }
    .empty { color: var(--secondary-text-color); padding: 16px 0; }
    @media (max-width: 400px) { .content { padding-inline: 10px; } .tooltip { margin-left: 38px; } }
  `;
  setConfig(t) {
    qt(t), this.config = { ...t };
  }
  getCardSize() {
    return 4;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, max_columns: 12, min_rows: 3 };
  }
  static getConfigElement() {
    return document.createElement("neerslag-radar-card-editor");
  }
  static getStubConfig(t) {
    return { type: "custom:neerslag-radar-card", location_id: (t ? z(t)[0] : void 0)?.id ?? "" };
  }
  static getEntitySuggestion() {
  }
  locale() {
    return this.hass?.locale?.language ?? this.hass?.config.language ?? "en";
  }
  timeZone() {
    return this.hass?.config.time_zone;
  }
  formatTime(t) {
    return new Intl.DateTimeFormat(this.locale(), { hour: "2-digit", minute: "2-digit", timeZone: this.timeZone() }).format(t);
  }
  formatNumber(t) {
    return new Intl.NumberFormat(this.locale(), { maximumFractionDigits: 2 }).format(t);
  }
  providerKey(t) {
    return `${t.provider}|${t.entityId}`;
  }
  toggle(t) {
    const e = this.providerKey(t);
    this.hiddenProviders.has(e) ? this.hiddenProviders.delete(e) : this.hiddenProviders.add(e), this.hiddenProviders = new Set(this.hiddenProviders), this.requestUpdate();
  }
  setHover(t, e, i) {
    let s;
    if (t instanceof PointerEvent) {
      const n = t.currentTarget.getBoundingClientRect(), l = (t.clientX - n.left) / n.width * h.width;
      s = Math.max(0, Math.min(1, (l - h.left) / (h.width - h.left - h.right)));
    } else {
      const n = this.hover?.timestamp ?? e.start, l = t.key === "ArrowLeft" ? -1 : t.key === "ArrowRight" ? 1 : 0, c = t.key === "Home" ? e.start : t.key === "End" ? e.end : n + l * 6e4;
      s = Math.max(0, Math.min(1, (c - e.start) / (e.end - e.start)));
    }
    const o = e.start + s * (e.end - e.start);
    this.hover = { timestamp: o, items: Wt(i, o) }, this.requestUpdate();
  }
  renderChart(t, e) {
    const i = this.locale(), s = h.height - h.top - h.bottom, o = h.width - h.left - h.right, n = [0, 0.5, 1], l = t.filter((a) => !this.hiddenProviders.has(this.providerKey(a))), c = this.hover ? h.left + (this.hover.timestamp - e.start) / (e.end - e.start) * o : void 0;
    return m`
      <div class="legend" aria-label=${f(i, "intensity")}>
        ${t.map((a) => {
      const p = !this.hiddenProviders.has(this.providerKey(a));
      return m`<button aria-pressed=${String(p)} @click=${() => this.toggle(a)} style=${`--series-color:${st(a.provider)}`}>
            <span class="swatch"></span>${rt(a.provider)}
            ${a.unavailable ? m`<span class="warning-icon" title=${f(i, "staleProvider")} aria-label=${f(i, "staleProvider")}>⚠</span>` : null}
          </button>`;
    })}
      </div>
      <svg class="chart" viewBox="0 0 ${h.width} ${h.height}" role="img" tabindex="0"
        aria-label=${f(i, "intensity")}
        @pointermove=${(a) => this.setHover(a, e, l)}
        @pointerleave=${() => {
      this.hover = void 0, this.requestUpdate();
    }}
        @keydown=${(a) => {
      ["ArrowLeft", "ArrowRight", "Home", "End"].includes(a.key) && (a.preventDefault(), this.setHover(a, e, l));
    }}>
        ${n.map((a) => O`<g><line class="grid" x1=${h.left} x2=${h.width - h.right} y1=${h.top + s * (1 - a)} y2=${h.top + s * (1 - a)} />
          <text class="tick" x=${h.left - 5} y=${h.top + s * (1 - a) + 3} text-anchor="end">${this.formatNumber(e.maxY * a)}</text></g>`)}
        <text class="axis" x="5" y="12">mm/u</text>
        ${[0, 0.5, 1].map((a) => O`<text class="tick" x=${h.left + o * a} y=${h.height - 10} text-anchor=${a === 0 ? "start" : a === 1 ? "end" : "middle"}>${this.formatTime(e.start + (e.end - e.start) * a)}</text>`)}
        ${l.map((a) => O`<path class="series ${a.unavailable ? "unavailable" : ""}" style=${`--series-color:${st(a.provider)}`} d=${Lt(a, e)} />`)}
        ${c !== void 0 ? O`<line class="cursor" x1=${c} x2=${c} y1=${h.top} y2=${h.top + s} />` : null}
      </svg>
      ${this.hover?.items.length ? m`<div class="tooltip" role="status">
        ${this.hover.items.map((a) => m`<div><strong>${rt(a.provider)}</strong>: ${this.formatTime(a.point.start)}–${this.formatTime(a.point.end)} · ${this.formatNumber(a.point.precipitation_intensity)} ${f(i, "intensityUnit")} · ${this.formatNumber(a.point.precipitation)} mm</div>`)}</div>` : null}`;
  }
  render() {
    const t = this.locale(), e = this.hass ? z(this.hass) : [], i = this.config?.location_id || (e.length === 1 ? e[0].id : void 0), s = e.find((c) => c.id === i), o = s ? jt(s) : [], n = Bt(o), l = this.config?.title || f(t, "titlePlaceholder");
    return m`<ha-card><div class="content"><h2>${l}</h2>
      ${n ? this.renderChart(o, n) : m`<div class="empty">${f(t, "noData")}</div>`}
      ${o.some((c) => c.unavailable) ? m`<p class="warning" role="alert">${f(t, "unavailable")}</p>` : null}
    </div></ha-card>`;
  }
}
customElements.get("neerslag-radar-card") || customElements.define("neerslag-radar-card", Yt);
window.customCards ??= [];
window.customCards.some((r) => r.type === "neerslag-radar-card") || window.customCards.push({
  type: "neerslag-radar-card",
  name: "Neerslag Radar Card",
  description: "Compare local precipitation forecasts from multiple providers.",
  documentationURL: "https://github.com/timminaters/neerslag-radar-card",
  preview: !0
});
export {
  Yt as NeerslagRadarCard
};
