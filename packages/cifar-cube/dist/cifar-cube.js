//#region packages/cifar-cube/src/cifar-cube.css?inline
var e = ":host{--_surface:var(--cifar-cube-surface,var(--mat-sys-surface,#fcfcfc));--_surface-container:var(--cifar-cube-surface-container,var(--mat-sys-surface-container,#eceff1));--_on-surface:var(--cifar-cube-on-surface,var(--mat-sys-on-surface,#1d2429));--_on-surface-variant:var(--cifar-cube-on-surface-variant,var(--mat-sys-on-surface-variant,#354b57));--_primary:var(--cifar-cube-primary,var(--mat-sys-primary,#8b1510));--_on-primary:var(--cifar-cube-on-primary,var(--mat-sys-on-primary,#fff));--_primary-container:var(--cifar-cube-primary-container,var(--mat-sys-primary-container,#ffdad5));--_on-primary-container:var(--cifar-cube-on-primary-container,var(--mat-sys-on-primary-container,#6b0f0a));--_outline:var(--cifar-cube-outline,var(--mat-sys-outline,#6c7f8a));--_outline-variant:var(--cifar-cube-outline-variant,var(--mat-sys-outline-variant,#c0cbd1));--_focus:var(--cifar-cube-focus,var(--mat-sys-primary,#8b1510));box-sizing:border-box;width:100%;min-width:0;max-width:100%;color:var(--_on-surface);font-family:Roboto,Arial,sans-serif;display:block;container:cifar-cube-host/inline-size}*{box-sizing:border-box}.cifar-cube__compact-intro{display:none}.cifar-cube{background:var(--_surface);grid-template-columns:minmax(0,1fr) minmax(18rem,23rem);grid-template-areas:\"stage details\";gap:clamp(1.5rem,3vw,4rem);width:100%;height:100%;min-height:36rem;padding:clamp(1.5rem,3vw,3rem);display:grid;overflow:visible}.cifar-cube__stage{grid-area:stage;grid-template-rows:minmax(0,1fr) auto;place-items:center;gap:.75rem;min-width:0;min-height:0;display:grid;container-type:size}.cifar-cube__plot{aspect-ratio:1000/868;width:min(100cqw,115.207cqh);position:relative}.cifar-cube__frame{z-index:0;pointer-events:none;shape-rendering:geometricprecision;width:100%;height:100%;position:absolute;inset:0;overflow:visible}.cifar-cube__frame-line{fill:none;stroke:color-mix(in srgb, var(--_outline) 68%, transparent);stroke-width:1.1px;vector-effect:non-scaling-stroke}.cifar-cube__axes{z-index:1;-webkit-user-select:text;user-select:text;position:absolute;inset:0}.cifar-cube__axis-title,.cifar-cube__axis-value{white-space:nowrap;position:absolute;transform:translate(-50%,-50%)}.cifar-cube__axis-title{color:var(--_primary);font-size:clamp(.9rem,1.5vw,1.2rem);font-weight:700}.cifar-cube__axis-title--y{transform:translateY(-50%)}.cifar-cube__axis-value{color:var(--_on-surface-variant);font-size:clamp(.75rem,1vw,.85rem);font-weight:400}.cifar-cube__axis-value--y{transform:translate(-100%,-50%)}.cifar-cube__axis-value--z{transform:translateY(-50%)}.cifar-cube__axis-title--x,.cifar-cube__axis-title--z,.cifar-cube__axis-value--x,.cifar-cube__axis-value--z{text-shadow:-2px -2px 0 var(--_surface), 2px -2px 0 var(--_surface), -2px 2px 0 var(--_surface), 2px 2px 0 var(--_surface)}.cifar-cube__axis-title--x,.cifar-cube__axis-title--z{font-size:clamp(1rem,1.65vw,1.3rem)}.cifar-cube__axis-value--x,.cifar-cube__axis-value--z{font-size:clamp(.75rem,1.1vw,.9rem)}.cifar-cube__list{z-index:2;pointer-events:none;margin:0;padding:0;list-style:none;position:absolute;inset:0}.cifar-cube__item{z-index:var(--cube-layer,1);top:var(--cube-top);left:var(--cube-left);width:var(--cube-width);height:var(--cube-height);pointer-events:auto;position:absolute}.cifar-cube__item--unpositioned{display:none}.cifar-cube__item:hover,.cifar-cube__item:focus-within{z-index:20000}.cifar-cube__select{width:100%;height:100%;color:inherit;font:inherit;text-align:left;cursor:pointer;background:0 0;border:0;margin:0;padding:0;display:block;position:relative}.cifar-cube__select:focus-visible{outline:3px solid var(--_focus);outline-offset:5px}.cifar-cube__cube{shape-rendering:geometricprecision;width:100%;height:100%;display:block;overflow:visible}.cifar-cube__top,.cifar-cube__left,.cifar-cube__right{stroke:color-mix(in srgb, var(--_outline) 75%, transparent);stroke-width:.85px;transition:fill-opacity .17s,stroke .17s,stroke-width .17s}.cifar-cube__top{fill:var(--_primary);fill-opacity:.4}.cifar-cube__left{fill:var(--_primary);fill-opacity:.5}.cifar-cube__right{fill:var(--_primary);fill-opacity:.64}.cifar-cube__edge{fill:none;stroke:color-mix(in srgb, var(--_on-surface) 38%, transparent);stroke-width:.75px;transition:stroke .17s,stroke-width .17s}.cifar-cube__select:hover .cifar-cube__top,.cifar-cube__select:hover .cifar-cube__left,.cifar-cube__select:hover .cifar-cube__right,.cifar-cube__select:focus-visible .cifar-cube__top,.cifar-cube__select:focus-visible .cifar-cube__left,.cifar-cube__select:focus-visible .cifar-cube__right{stroke:var(--_on-surface);stroke-width:2.3px}.cifar-cube__select:hover .cifar-cube__edge,.cifar-cube__select:focus-visible .cifar-cube__edge{stroke:var(--_on-surface);stroke-width:2px}.cifar-cube__select:hover .cifar-cube__top,.cifar-cube__select:focus-visible .cifar-cube__top{fill-opacity:.46}.cifar-cube__select:hover .cifar-cube__left,.cifar-cube__select:focus-visible .cifar-cube__left{fill-opacity:.56}.cifar-cube__select:hover .cifar-cube__right,.cifar-cube__select:focus-visible .cifar-cube__right{fill-opacity:.68}.cifar-cube__item--selected .cifar-cube__select .cifar-cube__top,.cifar-cube__item--selected .cifar-cube__select .cifar-cube__left,.cifar-cube__item--selected .cifar-cube__select .cifar-cube__right,.cifar-cube__item--selected .cifar-cube__select .cifar-cube__edge{stroke:var(--_primary);stroke-width:1.2px}.cifar-cube__item--selected .cifar-cube__select .cifar-cube__top{fill-opacity:.9}.cifar-cube__item--selected .cifar-cube__select .cifar-cube__left{fill-opacity:.96}.cifar-cube__item--selected .cifar-cube__select .cifar-cube__right{fill-opacity:1}.cifar-cube--has-selection .cifar-cube__item:not(.cifar-cube__item--selected) .cifar-cube__top{fill-opacity:.08}.cifar-cube--has-selection .cifar-cube__item:not(.cifar-cube__item--selected) .cifar-cube__left{fill-opacity:.1}.cifar-cube--has-selection .cifar-cube__item:not(.cifar-cube__item--selected) .cifar-cube__right{fill-opacity:.12}.cifar-cube__card{z-index:1000;border:1px solid color-mix(in srgb, var(--_outline) 75%, transparent);opacity:0;background:var(--_surface-container);width:15rem;box-shadow:0 .5rem 1.2rem color-mix(in srgb, var(--_on-surface) 22%, transparent);pointer-events:none;padding:.75rem .85rem;transition:opacity .12s;position:absolute;top:50%;left:calc(100% + .75rem);transform:translateY(-50%)}.cifar-cube__item--card-left .cifar-cube__card{left:auto;right:calc(100% + .75rem)}.cifar-cube__select:hover .cifar-cube__card,.cifar-cube__select:focus-visible .cifar-cube__card{opacity:1}.cifar-cube__item--selected .cifar-cube__card{opacity:0}.cifar-cube__label{color:var(--_on-surface);font-size:.875rem;font-weight:700;line-height:1.25;display:block}.cifar-cube__metadata{color:var(--_on-surface-variant);grid-template-columns:auto 1fr;gap:.2rem .5rem;margin:.5rem 0 0;font-size:.75rem;line-height:1.35;display:grid}.cifar-cube__metadata-key{font-weight:700}.cifar-cube__metadata-value{overflow-wrap:anywhere;min-width:0}.cifar-cube__status{color:var(--_on-primary-container);letter-spacing:.04em;text-transform:uppercase;margin-top:.4rem;font-size:.7rem;font-weight:700;display:inline-block}.cifar-cube__item--current .cifar-cube__cube{outline:2px solid var(--_primary);outline-offset:2px}.cifar-cube__item--unavailable .cifar-cube__cube{opacity:.62;filter:grayscale()}.cifar-cube__item--unavailable .cifar-cube__top,.cifar-cube__item--unavailable .cifar-cube__left,.cifar-cube__item--unavailable .cifar-cube__right,.cifar-cube__item--unavailable .cifar-cube__edge{stroke-dasharray:3 2}.cifar-cube__compact-card{display:none}.cifar-cube__unpositioned{border-left:3px solid var(--_outline);background:var(--_surface-container);align-self:end;width:min(100%,38rem);padding:.75rem 1rem}.cifar-cube__unpositioned-heading{margin:0;font-size:.875rem;line-height:1.3}.cifar-cube__unpositioned-guidance{color:var(--_on-surface-variant);margin:.25rem 0 0;font-size:.75rem;line-height:1.4}.cifar-cube__unpositioned-list{flex-wrap:wrap;gap:.5rem;margin:.625rem 0 0;padding:0;list-style:none;display:flex}.cifar-cube__unpositioned-button{border:1px solid var(--_outline);background:var(--_surface);min-height:2.75rem;color:var(--_on-surface);font:inherit;cursor:pointer;padding:.625rem .75rem;font-size:.8125rem;font-weight:700}.cifar-cube__unpositioned-button:hover{background:var(--_primary-container);color:var(--_on-primary-container)}.cifar-cube__unpositioned-button:focus-visible{outline:3px solid var(--_focus);outline-offset:3px}.cifar-cube__unpositioned-item.cifar-cube__item--selected .cifar-cube__unpositioned-button{border-color:var(--_primary);background:var(--_primary-container);color:var(--_on-primary-container);border-width:2px}.cifar-cube__details{border:1px solid var(--_outline-variant);background:var(--_surface-container);max-height:100%;box-shadow:0 1rem 2.5rem color-mix(in srgb, var(--_on-surface) 10%, transparent);grid-area:details;align-self:center;padding:clamp(1.5rem,2.5vw,2.25rem);overflow:auto}.cifar-cube__details-eyebrow{color:var(--_primary);letter-spacing:.08em;text-transform:uppercase;margin:0 0 .5rem;font-size:.75rem;font-weight:700}.cifar-cube__details-heading,.cifar-cube__compact-heading{margin:0;font-size:clamp(1.25rem,2vw,1.75rem);line-height:1.15}.cifar-cube__details-guidance,.cifar-cube__details-unavailable{color:var(--_on-surface-variant);margin:1rem 0 0;line-height:1.5}.cifar-cube__details-metadata{grid-template-columns:minmax(5rem,auto) 1fr;gap:.625rem 1rem;margin:1.5rem 0 0;font-size:.875rem;line-height:1.4;display:grid}.cifar-cube__details-metadata dt,.cifar-cube__details-metadata dd{margin:0}.cifar-cube__details-metadata dt{color:var(--_on-surface-variant);font-weight:700}.cifar-cube__details-metadata dd{overflow-wrap:anywhere;min-width:0}.cifar-cube__details-action,.cifar-cube__compact-action{background:var(--_primary);min-height:2.75rem;color:var(--_on-primary);white-space:nowrap;justify-content:center;align-items:center;margin-top:1.75rem;padding:.75rem 1rem;font-size:.875rem;font-weight:700;line-height:1.2;text-decoration:none;display:inline-flex}.cifar-cube__details-action:hover,.cifar-cube__compact-action:hover{filter:brightness(.92)}.cifar-cube__details-action:focus-visible,.cifar-cube__compact-action:focus-visible{outline:3px solid var(--_focus);outline-offset:3px}.cifar-cube__empty,.cifar-cube__plot-unavailable{color:var(--_on-surface-variant);text-align:center;place-items:center;margin:0;padding:2rem;display:grid;position:absolute;inset:0}.cifar-cube__sr-only{clip:rect(0, 0, 0, 0);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}@container cifar-cube-host (width<=64rem){.cifar-cube{flex-direction:column;height:auto;min-height:0;padding:clamp(1.5rem,4vw,2.5rem) 0 0;display:flex;overflow:visible}.cifar-cube__compact-intro{max-width:45rem;margin-bottom:2rem;display:block}.cifar-cube__compact-eyebrow{color:var(--_primary);letter-spacing:.08em;text-transform:uppercase;margin:0 0 .875rem;font-size:.75rem;font-weight:700}.cifar-cube__compact-section-heading{margin:0;font-size:clamp(1.5rem,4vw,2rem);line-height:1.15}.cifar-cube__compact-description{color:var(--_on-surface-variant);margin:.875rem 0 0;line-height:1.5}.cifar-cube__stage{display:block;container-type:normal}.cifar-cube__plot{aspect-ratio:auto;width:100%;max-height:none}.cifar-cube__frame,.cifar-cube__axes{display:none}.cifar-cube__list{grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;display:grid;position:static}.cifar-cube__item{width:auto;min-width:0;height:auto;display:grid;position:static}.cifar-cube__select{display:none}.cifar-cube__compact-card{border:1px solid var(--_outline-variant);background:var(--_surface-container);width:100%;min-width:0;height:100%;box-shadow:0 1rem 2.5rem color-mix(in srgb, var(--_on-surface) 10%, transparent);flex-direction:column;gap:1.5rem;padding:1.25rem;display:flex}.cifar-cube__compact-heading{overflow-wrap:anywhere}.cifar-cube__compact-card .cifar-cube__details-metadata{margin-top:0}.cifar-cube__compact-action{align-self:flex-start;margin-top:auto}.cifar-cube__compact-card .cifar-cube__details-unavailable{margin-top:auto}.cifar-cube__details,.cifar-cube__unpositioned{display:none}.cifar-cube__empty,.cifar-cube__plot-unavailable{position:static}}@container cifar-cube-host (width<=40rem){.cifar-cube__list{grid-template-columns:minmax(0,1fr)}}@media (prefers-reduced-motion:reduce){.cifar-cube__cube,.cifar-cube__top,.cifar-cube__left,.cifar-cube__right,.cifar-cube__edge,.cifar-cube__card{transition:none}.cifar-cube__select:hover .cifar-cube__cube,.cifar-cube__select:focus-visible .cifar-cube__cube,.cifar-cube__item--selected .cifar-cube__cube{transform:none}}@media (forced-colors:active){.cifar-cube__frame-line,.cifar-cube__top,.cifar-cube__left,.cifar-cube__right,.cifar-cube__edge{stroke:canvastext}.cifar-cube__top,.cifar-cube__left,.cifar-cube__right{fill:canvas;fill-opacity:1}.cifar-cube--has-selection .cifar-cube__item:not(.cifar-cube__item--selected) .cifar-cube__top,.cifar-cube--has-selection .cifar-cube__item:not(.cifar-cube__item--selected) .cifar-cube__left,.cifar-cube--has-selection .cifar-cube__item:not(.cifar-cube__item--selected) .cifar-cube__right{fill-opacity:1}.cifar-cube__item--selected .cifar-cube__select .cifar-cube__top,.cifar-cube__item--selected .cifar-cube__select .cifar-cube__left,.cifar-cube__item--selected .cifar-cube__select .cifar-cube__right,.cifar-cube__select:hover .cifar-cube__top,.cifar-cube__select:hover .cifar-cube__left,.cifar-cube__select:hover .cifar-cube__right{fill:highlight;stroke:highlighttext}.cifar-cube__item--selected .cifar-cube__select .cifar-cube__edge,.cifar-cube__select:hover .cifar-cube__edge{stroke:highlighttext}.cifar-cube__item--unavailable .cifar-cube__cube{opacity:1;filter:none}.cifar-cube__card,.cifar-cube__details,.cifar-cube__compact-card,.cifar-cube__unpositioned{box-shadow:none;border-color:canvastext}.cifar-cube__details-action,.cifar-cube__compact-action,.cifar-cube__unpositioned-button{border:1px solid buttontext}.cifar-cube__select:focus-visible,.cifar-cube__details-action:focus-visible,.cifar-cube__compact-action:focus-visible,.cifar-cube__unpositioned-button:focus-visible{outline-color:highlight}}";
//#endregion
//#region packages/cifar-cube/src/cifar-cube-cards.ts
function t(e) {
	return Object.entries(e.metadata ?? {}).filter((e) => e[1] !== null && e[1] !== void 0);
}
function n(e) {
	let n = t(e);
	if (n.length === 0) return null;
	let r = document.createElement("dl");
	return r.className = "cifar-cube__details-metadata", n.forEach(([e, t]) => {
		let n = document.createElement("dt"), i = document.createElement("dd");
		n.textContent = e, i.textContent = String(t), r.append(n, i);
	}), r;
}
function r(e, t) {
	let n = e.status ?? "available";
	if (n === "unavailable" || !e.href) {
		let e = document.createElement("p");
		return e.className = "cifar-cube__details-unavailable", e.textContent = "Metadata is not currently available for this dataset.", e;
	}
	let r = document.createElement("a");
	return r.className = t, r.href = e.href, r.setAttribute("aria-label", `View metadata for ${e.label}${n === "current" ? ", current page" : ""}`), r.textContent = "View metadata", r;
}
function i(e) {
	let n = document.createElement("span");
	n.className = "cifar-cube__card", n.setAttribute("aria-hidden", "true");
	let r = document.createElement("span");
	r.className = "cifar-cube__label", r.textContent = e.label, n.append(r);
	let i = t(e);
	if (i.length > 0) {
		let e = document.createElement("span");
		e.className = "cifar-cube__metadata", i.forEach(([t, n]) => {
			let r = document.createElement("span"), i = document.createElement("span");
			r.className = "cifar-cube__metadata-key", i.className = "cifar-cube__metadata-value", r.textContent = t, i.textContent = String(n), e.append(r, i);
		}), n.append(e);
	}
	if (e.status === "current" || e.status === "unavailable") {
		let t = document.createElement("span");
		t.className = "cifar-cube__status", t.textContent = e.status === "current" ? "Current page" : "Unavailable", n.append(t);
	}
	return n;
}
function a(e, t) {
	let n = document.createElement("aside");
	return n.className = "cifar-cube__details", n.id = e, n.setAttribute("aria-live", "polite"), n.setAttribute("aria-atomic", "true"), n.setAttribute("aria-labelledby", t), o(n, null, t), n;
}
function o(e, t, i) {
	e.replaceChildren();
	let a = document.createElement("p");
	a.className = "cifar-cube__details-eyebrow", a.textContent = t ? "Selected dataset" : "Organ imaging datasets";
	let o = document.createElement("h2");
	if (o.className = "cifar-cube__details-heading", o.id = i, o.textContent = t?.label ?? "Explore organ imaging datasets", e.append(a, o), !t) {
		let t = document.createElement("p");
		return t.className = "cifar-cube__details-guidance", t.textContent = "Select a dataset to inspect its details.", e.append(t), e;
	}
	let s = n(t);
	return s && e.append(s), e.append(r(t, "cifar-cube__details-action")), e;
}
function s(e) {
	let t = document.createElement("article");
	t.className = "cifar-cube__compact-card";
	let i = document.createElement("h3");
	i.className = "cifar-cube__compact-heading", i.textContent = e.label, t.append(i);
	let a = n(e);
	return a && t.append(a), t.append(r(e, "cifar-cube__compact-action")), t;
}
//#endregion
//#region packages/cifar-cube/src/projection.ts
var c = {
	top: {
		front: {
			x: 57.31,
			y: 31.81
		},
		left: {
			x: 15.15,
			y: 11.92
		},
		back: {
			x: 57.31,
			y: .53
		},
		right: {
			x: 99.47,
			y: 11.92
		}
	},
	bottom: {
		front: {
			x: 57.31,
			y: 99.16
		},
		left: {
			x: 22.4,
			y: 67.43
		},
		back: {
			x: 57.31,
			y: 46.7
		},
		right: {
			x: 92.49,
			y: 67.43
		}
	}
};
function l(e, t) {
	return t > 0 ? (e + .5) / t : .5;
}
function u(e, t, n) {
	let r = {
		front: (1 - t) * (1 - n),
		left: t * (1 - n),
		back: t * n,
		right: (1 - t) * n
	};
	return {
		x: e.front.x * r.front + e.left.x * r.left + e.back.x * r.back + e.right.x * r.right,
		y: e.front.y * r.front + e.left.y * r.left + e.back.y * r.back + e.right.y * r.right
	};
}
function d(e, t, n) {
	let r = u(c.top, e, n), i = u(c.bottom, e, n);
	return {
		x: i.x + (r.x - i.x) * t,
		y: i.y + (r.y - i.y) * t
	};
}
function f(e, t) {
	return {
		x: 1 - l(e.x, t.x.values.length),
		y: l(e.y, t.y.values.length),
		z: l(e.z, t.z.values.length)
	};
}
function p(e, t) {
	let n = f(e, t), r = d(n.x, n.y, n.z);
	return {
		left: `${r.x}%`,
		top: `${r.y}%`,
		layer: `${Math.round(r.y * 10)}`,
		cardSide: r.x > 66 ? "left" : "right"
	};
}
function m(e, t) {
	let n = f(e, t), r = .5 / Math.max(t.x.values.length, t.y.values.length, t.z.values.length, 1), i = (e) => Math.max(0, e - r), a = (e) => Math.min(1, e + r), o = i(n.x), s = a(n.x), c = i(n.y), l = a(n.y), u = i(n.z), p = a(n.z), m = {
		topFront: d(o, l, u),
		topLeft: d(s, l, u),
		topBack: d(s, l, p),
		topRight: d(o, l, p),
		bottomFront: d(o, c, u),
		bottomLeft: d(s, c, u),
		bottomRight: d(o, c, p)
	}, h = Object.values(m), g = .3, _ = Math.min(...h.map((e) => e.x)) - g, v = Math.min(...h.map((e) => e.y)) - g, y = Math.max(...h.map((e) => e.x)) + g, b = Math.max(...h.map((e) => e.y)) + g;
	return {
		corners: m,
		bounds: {
			left: _,
			top: v,
			width: y - _,
			height: b - v
		}
	};
}
//#endregion
//#region packages/cifar-cube/src/validation.ts
var h = {
	x: {
		label: "X axis",
		values: []
	},
	y: {
		label: "Y axis",
		values: []
	},
	z: {
		label: "Z axis",
		values: []
	}
}, g = new Set([
	"available",
	"current",
	"unavailable"
]), _ = [
	"x",
	"y",
	"z"
];
function v(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function y(e, t, n, r, i) {
	return {
		code: e,
		message: t,
		path: n,
		severity: r,
		...i ? { itemId: i } : {}
	};
}
function b(e) {
	let t = e.trim();
	if (!t) return !1;
	try {
		let e = new URL(t, "https://cifar-cube.invalid/");
		return e.protocol === "http:" || e.protocol === "https:";
	} catch {
		return !1;
	}
}
function x(e) {
	let t = [];
	if (!v(e)) return {
		value: h,
		issues: [y("axes.invalid", "Axes must be an object with x, y, and z definitions.", "axes", "error")]
	};
	let n = {};
	return _.forEach((r) => {
		let i = e[r], a = `${r.toUpperCase()} axis`;
		if (!v(i)) {
			n[r] = {
				label: a,
				values: []
			}, t.push(y("axis.invalid", `${a} must provide a label and values.`, `axes.${r}`, "error"));
			return;
		}
		let o = typeof i.label == "string" && i.label.trim() ? i.label.trim() : a;
		o === a && i.label !== a && t.push(y("axis.label.invalid", `${a} is using a fallback label.`, `axes.${r}.label`, "warning"));
		let s = i.values;
		if (!Array.isArray(s) || s.length === 0) {
			n[r] = {
				label: o,
				values: []
			}, t.push(y("axis.values.invalid", `${o} must provide at least one value.`, `axes.${r}.values`, "error"));
			return;
		}
		let c = s.every((e) => typeof e == "string" && e.trim().length > 0), l = c ? s.map((e) => e.trim()) : [];
		c ? new Set(l).size !== l.length && (l.length = 0, t.push(y("axis.values.duplicate", `${o} contains duplicate values and cannot be plotted safely.`, `axes.${r}.values`, "error"))) : t.push(y("axis.value.invalid", `${o} contains an empty or non-text value.`, `axes.${r}.values`, "error")), n[r] = {
			label: o,
			values: l
		};
	}), {
		value: n,
		issues: t
	};
}
function S(e, t, n, r) {
	if (e === void 0) return;
	if (!v(e)) {
		r.push(y("item.metadata.invalid", "Metadata must be an object.", t, "warning", n));
		return;
	}
	let i = {};
	return Object.entries(e).forEach(([e, a]) => {
		if (!e.trim()) {
			r.push(y("item.metadata.key.invalid", "Metadata field with an empty name was omitted.", t, "warning", n));
			return;
		}
		typeof a == "string" || typeof a == "number" && Number.isFinite(a) || a == null ? i[e] = a : r.push(y("item.metadata.value.invalid", `Metadata field “${e}” was omitted because its value is unsupported.`, `${t}.${e}`, "warning", n));
	}), i;
}
function C(e, t, n, r, i) {
	if (e == null) {
		i.push(y("item.position.missing", "Dataset is available but will not be plotted because it has no position.", n, "warning", r));
		return;
	}
	if (!v(e)) {
		i.push(y("item.position.invalid", "Position must provide integer x, y, and z indexes.", n, "warning", r));
		return;
	}
	let a = {
		x: e.x,
		y: e.y,
		z: e.z
	};
	if (![
		a.x,
		a.y,
		a.z
	].every((e) => typeof e == "number" && Number.isInteger(e) && e >= 0)) {
		i.push(y("item.position.invalid", "Position must provide non-negative integer x, y, and z indexes.", n, "warning", r));
		return;
	}
	let o = a;
	if (!(o.x < t.x.values.length && o.y < t.y.values.length && o.z < t.z.values.length)) {
		i.push(y("item.position.out-of-range", "Position falls outside the configured axes and will not be plotted.", n, "warning", r));
		return;
	}
	return o;
}
function w(e, t) {
	let n = [];
	if (!Array.isArray(e)) return {
		value: [],
		issues: [y("items.invalid", "Items must be an array.", "items", "error")]
	};
	let r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e, o) => {
		let s = `items[${o}]`;
		if (!v(e)) {
			n.push(y("item.invalid", "Dataset must be an object and was excluded.", s, "error"));
			return;
		}
		let c = typeof e.id == "string" ? e.id.trim() : "";
		if (!c) {
			n.push(y("item.id.invalid", "Dataset requires a nonempty text ID and was excluded.", `${s}.id`, "error"));
			return;
		}
		if (r.has(c)) {
			n.push(y("item.id.duplicate", `Duplicate dataset ID “${c}” was excluded.`, `${s}.id`, "error", c));
			return;
		}
		r.add(c);
		let l = typeof e.label == "string" ? e.label.trim() : "", u = l || c;
		l || n.push(y("item.label.invalid", "Dataset label is missing; its ID is shown instead.", `${s}.label`, "warning", c));
		let d;
		e.href !== void 0 && (typeof e.href == "string" && b(e.href) ? d = e.href.trim() : n.push(y("item.href.unsafe", "Metadata destination was removed because it is invalid or uses an unsafe protocol.", `${s}.href`, "error", c)));
		let f = "available";
		e.status !== void 0 && (typeof e.status == "string" && g.has(e.status) ? f = e.status : n.push(y("item.status.invalid", "Unknown status was replaced with “available”.", `${s}.status`, "warning", c))), !d && f === "available" && (f = "unavailable", n.push(y("item.href.missing", "Dataset has no metadata destination and is treated as unavailable.", `${s}.href`, "warning", c)));
		let p = S(e.metadata, `${s}.metadata`, c, n), m = C(e.position, t, `${s}.position`, c, n);
		if (m) {
			let e = `${m.x}:${m.y}:${m.z}`;
			i.has(e) ? (n.push(y("item.position.duplicate", "Position is already occupied; this dataset remains available but is not plotted.", `${s}.position`, "warning", c)), m = void 0) : i.add(e);
		}
		a.push({
			id: c,
			label: u,
			...d ? { href: d } : {},
			...p ? { metadata: p } : {},
			...m ? { position: m } : {},
			status: f
		});
	}), {
		value: a,
		issues: n
	};
}
//#endregion
//#region packages/cifar-cube/src/cifar-cube.ts
var T = "cifar-cube-selection-change", E = "cifar-cube-validation", D = "http://www.w3.org/2000/svg", O = typeof HTMLElement > "u" ? class {} : HTMLElement, k = 0;
function A(e, t) {
	let n = document.createElementNS(D, e);
	return Object.entries(t).forEach(([e, t]) => n.setAttribute(e, t)), n;
}
function j() {
	let e = A("svg", {
		class: "cifar-cube__frame",
		viewBox: "0 0 1000 868",
		preserveAspectRatio: "xMidYMid meet",
		"aria-hidden": "true"
	});
	return e.append(A("path", {
		class: "cifar-cube__frame-line",
		d: "M573 5 152 103 573 276 995 103 573 5M152 103 224 586 573 861 925 586 995 103M573 276 573 861M573 5 573 405M224 586 573 405 925 586"
	})), e;
}
function M(e) {
	let t = document.createElement("div");
	t.className = "cifar-cube__axes", t.setAttribute("aria-hidden", "true");
	let n = (e, n, r) => {
		let i = document.createElement("span");
		i.className = n, i.textContent = e, i.style.left = `${r.x}%`, i.style.top = `${r.y}%`, t.append(i);
	};
	return n(e.y.label, "cifar-cube__axis-title cifar-cube__axis-title--y", {
		x: 4.5,
		y: 7.5
	}), n(e.x.label, "cifar-cube__axis-title cifar-cube__axis-title--x", {
		x: 30,
		y: 89
	}), n(e.z.label, "cifar-cube__axis-title cifar-cube__axis-title--z", {
		x: 84.5,
		y: 91.5
	}), e.y.values.forEach((t, r) => {
		let i = d(1, l(r, e.y.values.length), 0);
		n(t, "cifar-cube__axis-value cifar-cube__axis-value--y", {
			x: i.x - 5,
			y: i.y
		});
	}), e.x.values.forEach((t, r) => {
		let i = d(1 - l(r, e.x.values.length), 0, 0);
		n(t, "cifar-cube__axis-value cifar-cube__axis-value--x", {
			x: i.x - 4.5,
			y: i.y + 1.8
		});
	}), e.z.values.forEach((t, r) => {
		let i = d(0, 0, l(r, e.z.values.length));
		n(t, "cifar-cube__axis-value cifar-cube__axis-value--z", {
			x: i.x + 2.5,
			y: i.y + 1.7
		});
	}), t;
}
function N(e, t) {
	let { corners: n, bounds: r } = m(e, t), i = (...e) => e.map((e) => `${e.x},${e.y}`).join(" "), a = (...e) => e.map((e, t) => `${t === 0 ? "M" : "L"}${e.x} ${e.y}`).join(""), o = A("svg", {
		class: "cifar-cube__cube",
		viewBox: `${r.left} ${r.top} ${r.width} ${r.height}`,
		preserveAspectRatio: "none",
		"aria-hidden": "true"
	}), s = [
		n.topFront,
		n.topLeft,
		n.topBack,
		n.topRight
	], c = [
		n.topFront,
		n.topLeft,
		n.bottomLeft,
		n.bottomFront
	], l = [
		n.topFront,
		n.topRight,
		n.bottomRight,
		n.bottomFront
	];
	return o.append(A("polygon", {
		class: "cifar-cube__top",
		points: i(...s),
		"vector-effect": "non-scaling-stroke"
	}), A("polygon", {
		class: "cifar-cube__left",
		points: i(...c),
		"vector-effect": "non-scaling-stroke"
	}), A("polygon", {
		class: "cifar-cube__right",
		points: i(...l),
		"vector-effect": "non-scaling-stroke"
	}), A("path", {
		class: "cifar-cube__edge",
		d: [
			a(n.topFront, n.topBack),
			a(n.topLeft, n.topRight),
			a(n.topFront, n.bottomLeft),
			a(n.topLeft, n.bottomFront),
			a(n.topFront, n.bottomRight),
			a(n.topRight, n.bottomFront)
		].join(""),
		"vector-effect": "non-scaling-stroke"
	})), {
		svg: o,
		bounds: r
	};
}
function P(e) {
	let t = document.createElement("p");
	return t.className = "cifar-cube__sr-only", t.textContent = [
		e.x,
		e.y,
		e.z
	].map((e) => `${e.label}: ${e.values.join(", ")}`).join(". "), t;
}
function F(e, t) {
	let n = Object.entries(e.metadata ?? {}).filter((e) => e[1] !== null && e[1] !== void 0).map(([e, t]) => `${e}: ${t}`), r = e.position, i = (r ? [
		[t.x, r.x],
		[t.y, r.y],
		[t.z, r.z]
	] : []).map(([e, t]) => `${e.label}: ${e.values[t] ?? "unknown"}`), a = e.status ?? "available", o = a === "current" ? "Current page" : a === "unavailable" ? "Metadata unavailable" : "Metadata available";
	return `${[
		n.length > 0 ? n.join(", ") : "No dataset details provided",
		i.length > 0 ? `Visualization position: ${i.join(", ")}` : "Visualization position not provided",
		o
	].join(". ")}.`;
}
var I = class extends O {
	static observedAttributes = [
		"items",
		"axes",
		"label"
	];
	#e = [];
	#t = [];
	#n = h;
	#r = [];
	#i = [];
	#a = [];
	#o = null;
	#s = this.attachShadow({ mode: "open" });
	#c = `cifar-cube-${++k}`;
	#l = null;
	#u = null;
	#d = null;
	#f = null;
	#p = `${this.#c}-details`;
	#m = `${this.#c}-details-heading`;
	#h = !1;
	#g = !1;
	get items() {
		return this.#t;
	}
	set items(e) {
		this.#e = e, this.#v(), this.#_(!0);
	}
	get axes() {
		return this.#n;
	}
	set axes(e) {
		this.#y(e), this.#_(!0);
	}
	get validationIssues() {
		return [
			...this.#a,
			...this.#r,
			...this.#i
		];
	}
	get selectedId() {
		return this.#o;
	}
	set selectedId(e) {
		this.#o = this.#t.some((t) => t.id === e) ? e : null, this.#_(!1);
	}
	connectedCallback() {
		this.#b("axes", !1), this.#b("items", !1), this.#_(!0);
	}
	attributeChangedCallback(e) {
		e !== "label" && this.#b(e, !0), this.#_(e !== "label");
	}
	#_(e) {
		this.#g ||= e, !this.#h && (this.#h = !0, queueMicrotask(() => {
			this.#h = !1, this.isConnected && (this.#D(), this.#g && this.#x(), this.#g = !1);
		}));
	}
	#v() {
		let e = w(this.#e, this.#n);
		this.#t = e.value, this.#i = e.issues, this.#t.some((e) => e.id === this.#o) || (this.#o = null);
	}
	#y(e) {
		let t = x(e);
		this.#n = t.value, this.#r = t.issues, this.#v();
	}
	#b(e, t) {
		this.#a = this.#a.filter((t) => t.path !== e);
		let n = this.getAttribute(e);
		if (n === null) {
			t && (e === "axes" ? this.#y(h) : (this.#e = [], this.#v()));
			return;
		}
		let r;
		try {
			r = JSON.parse(n);
		} catch {
			this.#a.push({
				code: `${e}.json.invalid`,
				message: `${e} contains invalid JSON.`,
				path: e,
				severity: "error"
			});
		}
		e === "axes" ? this.#y(r) : (this.#e = r, this.#v());
	}
	#x() {
		this.isConnected && this.dispatchEvent(new CustomEvent(E, {
			bubbles: !0,
			composed: !0,
			detail: { issues: this.validationIssues }
		}));
	}
	#S(e, t) {
		this.#o = e.id, this.#w(), this.#u && o(this.#u, e, this.#m), t && this.#u?.querySelector(".cifar-cube__details-action")?.focus(), this.dispatchEvent(new CustomEvent(T, {
			bubbles: !0,
			composed: !0,
			detail: { item: e }
		}));
	}
	#C() {
		let t = document.createElement("style");
		t.textContent = e;
		let n = document.createElement("section");
		n.className = "cifar-cube";
		let r = document.createElement("header");
		r.className = "cifar-cube__compact-intro";
		let i = document.createElement("p");
		i.className = "cifar-cube__compact-eyebrow", i.textContent = "Organ imaging datasets";
		let o = document.createElement("h2");
		o.className = "cifar-cube__compact-section-heading", o.textContent = "Browse human organ imaging datasets";
		let s = document.createElement("p");
		s.className = "cifar-cube__compact-description", s.textContent = "Review key details, then open the full metadata.", r.append(i, o, s);
		let c = document.createElement("div");
		c.className = "cifar-cube__stage";
		let l = document.createElement("div");
		l.className = "cifar-cube__plot", c.append(l);
		let u = a(this.#p, this.#m);
		n.append(r, c, u), this.#s.replaceChildren(t, n), this.#l = n, this.#u = u, this.#d = c, this.#f = l;
	}
	#w() {
		let e = this.#t.find((e) => e.id === this.#o) ?? null;
		this.#l?.classList.toggle("cifar-cube--has-selection", !!e), this.#s.querySelectorAll("[data-item-id]").forEach((t) => {
			let n = t.dataset.itemId === e?.id;
			t.closest("li")?.classList.toggle("cifar-cube__item--selected", n), t.setAttribute("aria-pressed", String(n));
		});
	}
	#T(e, t, n) {
		e.type = "button", e.dataset.itemId = t.id, e.setAttribute("aria-label", `Select ${t.label}`), e.setAttribute("aria-describedby", n), e.setAttribute("aria-controls", this.#p), e.setAttribute("aria-pressed", String(t.id === this.#o)), e.addEventListener("click", (e) => this.#S(t, e.detail === 0));
	}
	#E(e, t) {
		let n = document.createElement("section");
		n.className = "cifar-cube__unpositioned";
		let r = document.createElement("h2");
		r.className = "cifar-cube__unpositioned-heading", r.textContent = "Not plotted";
		let i = document.createElement("p");
		i.className = "cifar-cube__unpositioned-guidance", i.textContent = "These datasets do not include usable visualization coordinates.";
		let a = document.createElement("ul");
		return a.className = "cifar-cube__unpositioned-list", e.forEach((e) => {
			let n = t.get(e.id) ?? 0, r = document.createElement("li");
			r.className = "cifar-cube__unpositioned-item", e.id === this.#o && r.classList.add("cifar-cube__item--selected");
			let i = document.createElement("span");
			i.className = "cifar-cube__sr-only", i.id = `${this.#c}-unpositioned-${n}-description`, i.textContent = F(e, this.#n);
			let o = document.createElement("button");
			o.className = "cifar-cube__unpositioned-button", o.textContent = e.label, this.#T(o, e, i.id), r.append(i, o), a.append(r);
		}), n.append(r, i, a), n;
	}
	#D() {
		if ((!this.#l || !this.#u || !this.#d || !this.#f) && this.#C(), !this.#l || !this.#u || !this.#d || !this.#f) return;
		this.#l.setAttribute("aria-label", this.getAttribute("label") ?? "Metadata datasets"), this.#d.querySelector(".cifar-cube__unpositioned")?.remove();
		let e = this.#n.x.values.length > 0 && this.#n.y.values.length > 0 && this.#n.z.values.length > 0;
		if (e) this.#f.replaceChildren(j(), M(this.#n), P(this.#n));
		else {
			let e = document.createElement("p");
			e.className = "cifar-cube__plot-unavailable", e.textContent = "Visualization unavailable because the axis data is incomplete.", this.#f.replaceChildren(e);
		}
		let t = this.#t.find((e) => e.id === this.#o) ?? null;
		if (this.#l.classList.toggle("cifar-cube--has-selection", !!t), o(this.#u, t, this.#m), this.#t.length === 0) {
			if (e) {
				let e = document.createElement("p");
				e.className = "cifar-cube__empty", e.textContent = "No datasets are available.", this.#f.append(e);
			}
			return;
		}
		let n = document.createElement("ul");
		n.className = "cifar-cube__list";
		let r = new Map(this.#t.map((e, t) => [e.id, t]));
		this.#t.forEach((e, t) => {
			let r = e.status ?? "available", a = e.id === this.#o, o = document.createElement("li");
			if (o.className = `cifar-cube__item cifar-cube__item--${r}`, a && o.classList.add("cifar-cube__item--selected"), !e.position) {
				o.classList.add("cifar-cube__item--unpositioned"), o.append(s(e)), n.append(o);
				return;
			}
			let c = p(e.position, this.#n), l = N(e.position, this.#n);
			o.classList.add(`cifar-cube__item--card-${c.cardSide}`), o.style.setProperty("--cube-left", `${l.bounds.left}%`), o.style.setProperty("--cube-top", `${l.bounds.top}%`), o.style.setProperty("--cube-width", `${l.bounds.width}%`), o.style.setProperty("--cube-height", `${l.bounds.height}%`), o.style.setProperty("--cube-layer", c.layer);
			let u = document.createElement("button");
			u.className = "cifar-cube__select";
			let d = document.createElement("span");
			d.className = "cifar-cube__sr-only", d.id = `${this.#c}-item-${t}-description`, d.textContent = F(e, this.#n), this.#T(u, e, d.id), u.append(l.svg, i(e)), o.append(d, u, s(e)), n.append(o);
		}), this.#f.append(n);
		let a = this.#t.filter((e) => !e.position);
		a.length > 0 && this.#d.append(this.#E(a, r));
	}
};
function L() {
	typeof customElements > "u" || customElements.get("cifar-cube") || customElements.define("cifar-cube", I);
}
//#endregion
export { T as CIFAR_CUBE_SELECTION_EVENT, E as CIFAR_CUBE_VALIDATION_EVENT, I as CifarCube, L as defineCifarCube, b as isSafeMetadataHref, x as validateAxes, w as validateItems };

//# sourceMappingURL=cifar-cube.js.map