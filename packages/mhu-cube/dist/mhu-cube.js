//#region packages/mhu-cube/src/mhu-cube.css?inline
var e = ":host{--_surface:var(--mhu-cube-surface,var(--mat-sys-surface,#fcfcfc));--_surface-container:var(--mhu-cube-surface-container,var(--mat-sys-surface-container,#eceff1));--_on-surface:var(--mhu-cube-on-surface,var(--mat-sys-on-surface,#1d2429));--_on-surface-variant:var(--mhu-cube-on-surface-variant,var(--mat-sys-on-surface-variant,#354b57));--_primary:var(--mhu-cube-primary,var(--mat-sys-primary,#8b1510));--_on-primary:var(--mhu-cube-on-primary,var(--mat-sys-on-primary,#fff));--_primary-container:var(--mhu-cube-primary-container,var(--mat-sys-primary-container,#ffdad5));--_on-primary-container:var(--mhu-cube-on-primary-container,var(--mat-sys-on-primary-container,#6b0f0a));--_outline:var(--mhu-cube-outline,var(--mat-sys-outline,#6c7f8a));--_outline-variant:var(--mhu-cube-outline-variant,var(--mat-sys-outline-variant,#c0cbd1));--_focus:var(--mhu-cube-focus,var(--mat-sys-primary,#8b1510));box-sizing:border-box;width:100%;min-width:0;max-width:100%;color:var(--_on-surface);font-family:var(--mat-sys-body-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-large-size,1rem);font-weight:var(--mat-sys-body-large-weight,400);line-height:var(--mat-sys-body-large-line-height,1.5rem);letter-spacing:var(--mat-sys-body-large-tracking,.03125rem);display:block;container:mhu-cube-host/inline-size}*{box-sizing:border-box}.mhu-cube{background:var(--_surface);grid-template:\"content stage\"minmax(0,1fr)/minmax(22rem,28rem) minmax(0,1fr);gap:clamp(1.5rem,3vw,4rem);width:100%;height:100%;min-height:36rem;padding:clamp(1.5rem,3vw,3rem);display:grid;overflow:visible}.mhu-cube__content{flex-direction:column;grid-area:content;align-self:stretch;gap:clamp(1.5rem,3vh,2.5rem);width:100%;height:100%;min-height:0;padding:0 0 1rem;display:flex}.mhu-cube__stage{grid-area:stage;grid-template-rows:minmax(0,1fr) auto;place-items:center;gap:.75rem;min-width:0;min-height:0;display:grid;container-type:size}.mhu-cube__plot{aspect-ratio:1000/868;width:min(100cqw,115.207cqh);position:relative}.mhu-cube__frame{z-index:0;pointer-events:none;shape-rendering:geometricprecision;width:100%;height:100%;position:absolute;inset:0;overflow:visible}.mhu-cube__frame-line{fill:none;stroke:color-mix(in srgb, var(--_outline) 68%, transparent);stroke-width:1.1px;vector-effect:non-scaling-stroke}.mhu-cube__axes{z-index:1;-webkit-user-select:text;user-select:text;position:absolute;inset:0}.mhu-cube__axis-title,.mhu-cube__axis-value{white-space:nowrap;position:absolute;transform:translate(-50%,-50%)}.mhu-cube__axis-title{color:var(--_primary);font-family:var(--mat-sys-label-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-large-size,.875rem);font-weight:600;line-height:var(--mat-sys-label-large-line-height,1.25rem);letter-spacing:var(--mat-sys-label-large-tracking,.00625rem)}.mhu-cube__axis-title--y{transform:translateY(-50%)}.mhu-cube__axis-value{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);font-weight:var(--mat-sys-body-small-weight,400);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem)}.mhu-cube__axis-value--y{transform:translate(-100%,-50%)}.mhu-cube__axis-value--z{transform:translateY(-50%)}.mhu-cube__axis-title--x,.mhu-cube__axis-title--z,.mhu-cube__axis-value--x,.mhu-cube__axis-value--z{text-shadow:-2px -2px 0 var(--_surface), 2px -2px 0 var(--_surface), -2px 2px 0 var(--_surface), 2px 2px 0 var(--_surface)}.mhu-cube__list{z-index:2;pointer-events:none;margin:0;padding:0;list-style:none;position:absolute;inset:0}.mhu-cube__item{z-index:var(--cube-layer,1);top:var(--cube-top);left:var(--cube-left);width:var(--cube-width);height:var(--cube-height);pointer-events:auto;position:absolute}.mhu-cube__item--unpositioned{display:none}.mhu-cube__item:not(.mhu-cube__item--selected):hover,.mhu-cube__item:not(.mhu-cube__item--selected):focus-within{z-index:20000}.mhu-cube__select{width:100%;height:100%;color:inherit;font:inherit;text-align:left;cursor:pointer;background:0 0;border:0;margin:0;padding:0;display:block;position:relative}.mhu-cube__select:focus-visible{outline:3px solid var(--_focus);outline-offset:5px}.mhu-cube__cube{shape-rendering:geometricprecision;width:100%;height:100%;display:block;overflow:visible}.mhu-cube__top,.mhu-cube__left,.mhu-cube__right{stroke:color-mix(in srgb, var(--_outline) 75%, transparent);stroke-width:.85px;stroke-linejoin:bevel;transition:fill-opacity .17s,stroke .17s,stroke-width .17s}.mhu-cube__top{fill:var(--_primary);fill-opacity:.4}.mhu-cube__left{fill:var(--_primary);fill-opacity:.5}.mhu-cube__right{fill:var(--_primary);fill-opacity:.64}.mhu-cube__edge{fill:none;stroke:color-mix(in srgb, var(--_on-surface) 38%, transparent);stroke-width:.75px;transition:stroke .17s,stroke-width .17s}.mhu-cube__select:hover .mhu-cube__top,.mhu-cube__select:hover .mhu-cube__left,.mhu-cube__select:hover .mhu-cube__right,.mhu-cube__select:focus-visible .mhu-cube__top,.mhu-cube__select:focus-visible .mhu-cube__left,.mhu-cube__select:focus-visible .mhu-cube__right{stroke:var(--_on-surface);stroke-width:2.3px}.mhu-cube__select:hover .mhu-cube__edge,.mhu-cube__select:focus-visible .mhu-cube__edge{stroke:var(--_on-surface);stroke-width:2px}.mhu-cube__select:hover .mhu-cube__top,.mhu-cube__select:focus-visible .mhu-cube__top{fill-opacity:.46}.mhu-cube__select:hover .mhu-cube__left,.mhu-cube__select:focus-visible .mhu-cube__left{fill-opacity:.56}.mhu-cube__select:hover .mhu-cube__right,.mhu-cube__select:focus-visible .mhu-cube__right{fill-opacity:.68}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__top,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__left,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__right,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__edge{stroke:var(--_primary);stroke-width:1.2px}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__top{fill-opacity:.9}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__left{fill-opacity:.96}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__right{fill-opacity:1}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__top{fill-opacity:.08}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__left{fill-opacity:.1}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__right{fill-opacity:.12}.mhu-cube__card{z-index:1000;border:1px solid color-mix(in srgb, var(--_outline) 75%, transparent);opacity:0;background:var(--_surface-container);width:15rem;box-shadow:0 .5rem 1.2rem color-mix(in srgb, var(--_on-surface) 22%, transparent);pointer-events:none;padding:.75rem .85rem;transition:opacity .12s;position:absolute;top:50%;left:calc(100% + .75rem);transform:translateY(-50%)}.mhu-cube__item--card-left .mhu-cube__card{left:auto;right:calc(100% + .75rem)}.mhu-cube__select:hover .mhu-cube__card,.mhu-cube__select:focus-visible .mhu-cube__card{opacity:1}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__card{opacity:0}.mhu-cube__label{color:var(--_on-surface);font-family:var(--mat-sys-title-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-title-small-size,.875rem);font-weight:var(--mat-sys-title-small-weight,500);line-height:var(--mat-sys-title-small-line-height,1.25rem);letter-spacing:var(--mat-sys-title-small-tracking,.00625rem);display:block}.mhu-cube__metadata{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);font-weight:var(--mat-sys-body-small-weight,400);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem);grid-template-columns:auto 1fr;gap:.2rem .5rem;margin:.5rem 0 0;display:grid}.mhu-cube__metadata-key{font-family:var(--mat-sys-label-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-small-size,.6875rem);font-weight:var(--mat-sys-label-small-weight,500);line-height:var(--mat-sys-label-small-line-height,1rem);letter-spacing:var(--mat-sys-label-small-tracking,.03125rem)}.mhu-cube__metadata-value{overflow-wrap:anywhere;min-width:0}.mhu-cube__status{color:var(--_on-primary-container);font-family:var(--mat-sys-label-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-small-size,.6875rem);font-weight:var(--mat-sys-label-small-weight,500);line-height:var(--mat-sys-label-small-line-height,1rem);letter-spacing:var(--mat-sys-label-small-tracking,.03125rem);text-transform:uppercase;margin-top:.4rem;display:inline-block}.mhu-cube__item--current .mhu-cube__cube{outline:2px solid var(--_primary);outline-offset:2px}.mhu-cube__item--unavailable .mhu-cube__cube{opacity:.62;filter:grayscale()}.mhu-cube__item--unavailable .mhu-cube__top,.mhu-cube__item--unavailable .mhu-cube__left,.mhu-cube__item--unavailable .mhu-cube__right,.mhu-cube__item--unavailable .mhu-cube__edge{stroke-dasharray:3 2}.mhu-cube__compact-card{display:none}.mhu-cube__unpositioned{border-left:3px solid var(--_outline);background:var(--_surface-container);align-self:end;width:min(100%,38rem);padding:.75rem 1rem}.mhu-cube__unpositioned-heading{font-family:var(--mat-sys-title-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-title-small-size,.875rem);font-weight:var(--mat-sys-title-small-weight,500);line-height:var(--mat-sys-title-small-line-height,1.25rem);letter-spacing:var(--mat-sys-title-small-tracking,.00625rem);margin:0}.mhu-cube__unpositioned-guidance{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);font-weight:var(--mat-sys-body-small-weight,400);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem);margin:.25rem 0 0}.mhu-cube__unpositioned-list{flex-wrap:wrap;gap:.5rem;margin:.625rem 0 0;padding:0;list-style:none;display:flex}.mhu-cube__unpositioned-button{border:1px solid var(--_outline);background:var(--_surface);min-height:2.75rem;color:var(--_on-surface);font-family:var(--mat-sys-label-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-large-size,.875rem);font-weight:var(--mat-sys-label-large-weight,500);line-height:var(--mat-sys-label-large-line-height,1.25rem);letter-spacing:var(--mat-sys-label-large-tracking,.00625rem);cursor:pointer;padding:.625rem .75rem}.mhu-cube__unpositioned-button:hover{background:var(--_primary-container);color:var(--_on-primary-container)}.mhu-cube__unpositioned-button:focus-visible{outline:3px solid var(--_focus);outline-offset:3px}.mhu-cube__unpositioned-item.mhu-cube__item--selected .mhu-cube__unpositioned-button{border-color:var(--_primary);background:var(--_primary-container);color:var(--_on-primary-container);border-width:2px}.mhu-cube__intro{flex-direction:column;height:100%;min-height:0;display:flex}.mhu-cube__intro-eyebrow,.mhu-cube__details-eyebrow{color:var(--_primary);font-family:var(--mat-sys-label-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-small-size,.6875rem);font-weight:600;line-height:var(--mat-sys-label-small-line-height,1rem);letter-spacing:var(--mat-sys-label-small-tracking,.03125rem);text-transform:uppercase;margin:0 0 .5rem}.mhu-cube__intro-heading{font-family:var(--mat-sys-headline-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-headline-large-size,2rem);font-weight:var(--mat-sys-headline-large-weight,600);line-height:var(--mat-sys-headline-large-line-height,2.5rem);letter-spacing:var(--mat-sys-headline-large-tracking,0);white-space:nowrap;margin:0}.mhu-cube__details-heading,.mhu-cube__compact-heading{font-family:var(--mat-sys-title-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-title-large-size,1.375rem);font-weight:500;line-height:var(--mat-sys-title-large-line-height,1.75rem);letter-spacing:var(--mat-sys-title-large-tracking,0);margin:0}.mhu-cube__intro-compact,.mhu-cube__details-unavailable{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-large-size,1rem);font-weight:var(--mat-sys-body-large-weight,400);line-height:var(--mat-sys-body-large-line-height,1.5rem);letter-spacing:var(--mat-sys-body-large-tracking,.03125rem);margin:1rem 0 0}.mhu-cube__intro-visualization{min-height:0;color:var(--_on-surface-variant);font-family:var(--mat-sys-body-medium-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-medium-size,.875rem);font-weight:var(--mat-sys-body-medium-weight,400);line-height:var(--mat-sys-body-medium-line-height,1.25rem);letter-spacing:var(--mat-sys-body-medium-tracking,.015625rem);flex-direction:column;flex:1;margin:.75rem 0 0;display:flex}.mhu-cube__intro-summary,.mhu-cube__intro-attribution{margin:0}.mhu-cube__intro-compact,.mhu-cube__details:empty{display:none}.mhu-cube__details-card,.mhu-cube__compact-card{border:1px solid var(--_outline-variant);background:var(--_surface-container);box-shadow:0 1rem 2.5rem color-mix(in srgb, var(--_on-surface) 10%, transparent)}.mhu-cube__details-card{width:100%;padding:1.25rem}.mhu-cube__details-action,.mhu-cube__compact-action{background:var(--_primary);min-height:2.75rem;color:var(--_on-primary);font-family:var(--mat-sys-label-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-large-size,.875rem);font-weight:var(--mat-sys-label-large-weight,500);line-height:var(--mat-sys-label-large-line-height,1.25rem);letter-spacing:var(--mat-sys-label-large-tracking,.00625rem);white-space:nowrap;justify-content:center;align-items:center;margin-top:1.75rem;padding:.75rem 1rem;text-decoration:none;display:inline-flex}.mhu-cube__details-action:hover,.mhu-cube__compact-action:hover{filter:brightness(.92)}.mhu-cube__details-action:focus-visible,.mhu-cube__compact-action:focus-visible{outline:3px solid var(--_focus);outline-offset:3px}.mhu-cube__empty,.mhu-cube__plot-unavailable{color:var(--_on-surface-variant);text-align:center;place-items:center;margin:0;padding:2rem;display:grid;position:absolute;inset:0}.mhu-cube__sr-only{clip:rect(0, 0, 0, 0);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}@container mhu-cube-host (width<=64rem){.mhu-cube{flex-direction:column;height:auto;min-height:0;padding:clamp(1.5rem,4vw,2.5rem) 0 0;display:flex;overflow:visible}.mhu-cube__content{max-width:45rem;padding:0;display:block}.mhu-cube__intro{height:auto;min-height:0;margin-bottom:2rem;display:block}.mhu-cube__intro-eyebrow{margin:0 0 .875rem}.mhu-cube__intro-heading{font-family:var(--mat-sys-headline-medium-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-headline-medium-size,1.75rem);font-weight:var(--mat-sys-headline-medium-weight,600);line-height:var(--mat-sys-headline-medium-line-height,2.25rem);letter-spacing:var(--mat-sys-headline-medium-tracking,0);white-space:normal}.mhu-cube__intro-visualization{display:none}.mhu-cube__intro-compact{margin-top:.875rem;display:block}.mhu-cube__stage{display:block;container-type:normal}.mhu-cube__plot{aspect-ratio:auto;width:100%;max-height:none}.mhu-cube__frame,.mhu-cube__axes{display:none}.mhu-cube__list{grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;display:grid;position:static}.mhu-cube__item{width:auto;min-width:0;height:auto;display:grid;position:static}.mhu-cube__select{display:none}.mhu-cube__compact-card{flex-direction:column;gap:1.5rem;width:100%;min-width:0;height:100%;padding:1.25rem;display:flex}.mhu-cube__compact-heading{overflow-wrap:anywhere}.mhu-cube__compact-action{align-self:flex-start;margin-top:auto}.mhu-cube__compact-card .mhu-cube__details-unavailable{margin-top:auto}.mhu-cube__details,.mhu-cube__unpositioned{display:none}.mhu-cube__empty,.mhu-cube__plot-unavailable{position:static}}@container mhu-cube-host (width<=40rem){.mhu-cube__list{grid-template-columns:minmax(0,1fr)}}@media (prefers-reduced-motion:reduce){.mhu-cube__top,.mhu-cube__left,.mhu-cube__right,.mhu-cube__edge,.mhu-cube__card{transition:none}}@media (forced-colors:active){.mhu-cube__frame-line,.mhu-cube__top,.mhu-cube__left,.mhu-cube__right,.mhu-cube__edge{stroke:canvastext}.mhu-cube__top,.mhu-cube__left,.mhu-cube__right{fill:canvas;fill-opacity:1}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__top,.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__left,.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__right{fill-opacity:1}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__top,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__left,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__right,.mhu-cube__select:hover .mhu-cube__top,.mhu-cube__select:hover .mhu-cube__left,.mhu-cube__select:hover .mhu-cube__right{fill:highlight;stroke:highlighttext}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__edge,.mhu-cube__select:hover .mhu-cube__edge{stroke:highlighttext}.mhu-cube__item--unavailable .mhu-cube__cube{opacity:1;filter:none}.mhu-cube__card,.mhu-cube__details-card,.mhu-cube__compact-card,.mhu-cube__unpositioned{box-shadow:none;border-color:canvastext}.mhu-cube__details-action,.mhu-cube__compact-action,.mhu-cube__unpositioned-button{border:1px solid buttontext}.mhu-cube__select:focus-visible,.mhu-cube__details-action:focus-visible,.mhu-cube__compact-action:focus-visible,.mhu-cube__unpositioned-button:focus-visible{outline-color:highlight}}", t = ".mhu-cube__intro-attribution{font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem);margin-top:auto;padding-top:1rem}.mhu-cube__intro-attribution a{color:var(--_primary)}.mhu-cube__intro-attribution a:focus-visible{outline:3px solid var(--_focus);outline-offset:3px}.mhu-cube__intro-dimensions{margin:0}.mhu-cube__intro-dimensions-header,.mhu-cube__intro-dimensions-row{grid-template-columns:minmax(7rem,32%) minmax(0,1fr);gap:.75rem;display:grid}.mhu-cube__intro-dimensions-header{border-bottom:1px solid var(--_outline-variant);color:var(--_on-surface);margin-top:1.5rem;padding-bottom:.5rem;font-weight:600}.mhu-cube__intro-dimensions-row{border-bottom:1px solid var(--_outline-variant);padding:.5rem 0}.mhu-cube__intro-dimensions-row:last-child{border-bottom:0}.mhu-cube__intro-dimensions dt,.mhu-cube__intro-dimensions dd{overflow-wrap:anywhere;min-width:0;margin:0}.mhu-cube__intro-dimensions dt{color:var(--_on-surface);white-space:nowrap;font-weight:500}.mhu-cube__intro-dimensions dd{color:var(--_on-surface-variant)}.mhu-cube--has-selection .mhu-cube__intro-dimensions-header,.mhu-cube--has-selection .mhu-cube__intro-dimensions{display:none}.mhu-cube__details{margin:1.5rem 0 0}.mhu-cube__details-header{grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:.75rem;display:grid}.mhu-cube__details-close{width:2.75rem;height:2.75rem;min-height:2.75rem;color:var(--_on-surface);cursor:pointer;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:grid}.mhu-cube__details-close:hover{background:color-mix(in srgb, var(--_on-surface) 8%, transparent)}.mhu-cube__details-close:focus-visible{outline:3px solid var(--_focus);outline-offset:2px;background:color-mix(in srgb, var(--_on-surface) 10%, transparent)}.mhu-cube__details-close:active{background:color-mix(in srgb, var(--_on-surface) 10%, transparent)}.mhu-cube__details-close-icon{fill:currentColor;width:1.5rem;height:1.5rem;display:block}.mhu-cube__details-metadata{font-family:var(--mat-sys-body-medium-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-medium-size,.875rem);font-weight:var(--mat-sys-body-medium-weight,400);line-height:var(--mat-sys-body-medium-line-height,1.25rem);letter-spacing:var(--mat-sys-body-medium-tracking,.015625rem);margin:1.5rem 0 0}.mhu-cube__details-metadata-row{border-bottom:1px solid var(--_outline-variant);grid-template-columns:minmax(5.5rem,38%) minmax(0,1fr);gap:.75rem;padding:.5rem 0;display:grid}.mhu-cube__details-metadata-row:last-child{border-bottom:0}.mhu-cube__details-metadata dt,.mhu-cube__details-metadata dd{overflow-wrap:anywhere;min-width:0;margin:0}.mhu-cube__details-metadata dt{color:var(--_on-surface);font-weight:500}.mhu-cube__details-metadata dd{color:var(--_on-surface-variant)}.mhu-cube__details-card>.mhu-cube__details-metadata,.mhu-cube__details-card>.mhu-cube__details-action{margin-top:1rem}@container mhu-cube-host (width<=64rem){.mhu-cube__compact-card .mhu-cube__details-metadata{margin-top:0}}@media (forced-colors:active){.mhu-cube__intro-dimensions-header,.mhu-cube__intro-dimensions-row,.mhu-cube__details-metadata-row{border-color:canvastext}.mhu-cube__details-close{color:buttontext;border:1px solid buttontext}}", n = {
	eyebrow: "Organ imaging datasets",
	heading: "Explore multiscale human data",
	visualization: {
		description: "This visualization compares datasets across three dimensions. Select a cube to view its details.",
		dimensionHeadings: ["Dimension", "What it represents"],
		dimensions: [
			{
				term: "Spatial scale",
				description: "Physical size represented in the dataset (100 µm or 100 mm)"
			},
			{
				term: "Age (years)",
				description: "Age of the tissue donor"
			},
			{
				term: "Organ",
				description: "Tissue source"
			}
		],
		attribution: {
			beforeLink: "Inspired by ",
			linkText: "Metacube",
			afterLink: " from the Chair for Clinical Bioinformatics.",
			href: "https://github.com/Chair-for-Clinical-Bioinformatics/metacube"
		}
	},
	compactDescription: "Browse organ-imaging datasets and compare their spatial scale, donor age, organ, and other available details. Use each card to open its metadata."
};
//#endregion
//#region packages/mhu-cube/src/mhu-cube-cards.ts
function r() {
	let e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	e.classList.add("mhu-cube__details-close-icon"), e.setAttribute("width", "24"), e.setAttribute("height", "24"), e.setAttribute("viewBox", "0 -960 960 960"), e.setAttribute("fill", "currentColor"), e.setAttribute("aria-hidden", "true"), e.setAttribute("focusable", "false");
	let t = document.createElementNS("http://www.w3.org/2000/svg", "path");
	return t.setAttribute("d", "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"), e.append(t), e;
}
function i(e) {
	let t = document.createElement("header");
	if (t.className = "mhu-cube__intro", n.eyebrow) {
		let e = document.createElement("p");
		e.className = "mhu-cube__intro-eyebrow", e.textContent = n.eyebrow, t.append(e);
	}
	let r = document.createElement("h2");
	r.className = "mhu-cube__intro-heading", r.textContent = n.heading;
	let i = document.createElement("div");
	i.className = "mhu-cube__intro-visualization";
	let a = document.createElement("p");
	a.className = "mhu-cube__intro-summary", a.textContent = n.visualization.description;
	let o = document.createElement("div");
	o.className = "mhu-cube__intro-dimensions-header", o.setAttribute("aria-hidden", "true"), n.visualization.dimensionHeadings.forEach((e) => {
		let t = document.createElement("span");
		t.textContent = e, o.append(t);
	});
	let s = document.createElement("dl");
	s.className = "mhu-cube__intro-dimensions", n.visualization.dimensions.forEach((e) => {
		let t = document.createElement("div");
		t.className = "mhu-cube__intro-dimensions-row";
		let n = document.createElement("dt"), r = document.createElement("dd");
		n.textContent = e.term, r.textContent = e.description, t.append(n, r), s.append(t);
	});
	let c = document.createElement("p");
	c.className = "mhu-cube__intro-attribution";
	let l = document.createElement("a");
	l.href = n.visualization.attribution.href, l.textContent = n.visualization.attribution.linkText, c.append(n.visualization.attribution.beforeLink, l, n.visualization.attribution.afterLink), i.append(a, o, s, e, c);
	let u = document.createElement("p");
	return u.className = "mhu-cube__intro-compact", u.textContent = n.compactDescription, t.append(r, i, u), t;
}
function a(e) {
	return Object.entries(e.metadata ?? {}).filter((e) => e[1] !== null && e[1] !== void 0);
}
function o(e) {
	let t = a(e).map(([e, t]) => `${e}: ${t}`).join(", ");
	return t ? `${e.label}; ${t}` : e.label;
}
function s(e) {
	let t = a(e);
	if (t.length === 0) return null;
	let n = document.createElement("dl");
	return n.className = "mhu-cube__details-metadata", t.forEach(([e, t]) => {
		let r = document.createElement("div");
		r.className = "mhu-cube__details-metadata-row";
		let i = document.createElement("dt"), a = document.createElement("dd");
		i.textContent = e, a.textContent = String(t), r.append(i, a), n.append(r);
	}), n;
}
function c(e, t) {
	let n = e.status ?? "available";
	if (n === "unavailable" || !e.href) {
		let e = document.createElement("p");
		return e.className = "mhu-cube__details-unavailable", e.textContent = "Metadata is not currently available for this dataset.", e;
	}
	let r = document.createElement("a");
	return r.className = t, r.href = e.href, r.setAttribute("aria-label", `View metadata for ${o(e)}${n === "current" ? ", current page" : ""}`), r.textContent = "View metadata", r;
}
function l(e) {
	let t = document.createElement("span");
	t.className = "mhu-cube__card", t.setAttribute("aria-hidden", "true");
	let n = document.createElement("span");
	n.className = "mhu-cube__label", n.textContent = e.label, t.append(n);
	let r = a(e);
	if (r.length > 0) {
		let e = document.createElement("span");
		e.className = "mhu-cube__metadata", r.forEach(([t, n]) => {
			let r = document.createElement("span"), i = document.createElement("span");
			r.className = "mhu-cube__metadata-key", i.className = "mhu-cube__metadata-value", r.textContent = t, i.textContent = String(n), e.append(r, i);
		}), t.append(e);
	}
	if (e.status === "current" || e.status === "unavailable") {
		let n = document.createElement("span");
		n.className = "mhu-cube__status", n.textContent = e.status === "current" ? "Current page" : "Unavailable", t.append(n);
	}
	return t;
}
function u(e) {
	let t = document.createElement("div");
	return t.className = "mhu-cube__details", t.id = e, t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "true"), t;
}
function d(e, t, n, i) {
	if (e.replaceChildren(), !t) return e;
	let a = document.createElement("article");
	a.className = "mhu-cube__details-card", a.setAttribute("aria-labelledby", n);
	let o = document.createElement("div");
	o.className = "mhu-cube__details-header";
	let l = document.createElement("div"), u = document.createElement("p");
	u.className = "mhu-cube__details-eyebrow", u.textContent = "Selected dataset";
	let d = document.createElement("h3");
	d.className = "mhu-cube__details-heading", d.id = n, d.textContent = t.label;
	let f = document.createElement("button");
	f.className = "mhu-cube__details-close", f.type = "button", f.setAttribute("aria-label", "Close dataset details"), f.append(r()), f.addEventListener("click", i), l.append(u, d), o.append(l, f), a.append(o);
	let p = s(t);
	return p && a.append(p), a.append(c(t, "mhu-cube__details-action")), e.append(a), e;
}
function f(e) {
	let t = document.createElement("article");
	t.className = "mhu-cube__compact-card";
	let n = document.createElement("h3");
	n.className = "mhu-cube__compact-heading", n.textContent = e.label, t.append(n);
	let r = s(e);
	return r && t.append(r), t.append(c(e, "mhu-cube__compact-action")), t;
}
//#endregion
//#region packages/mhu-cube/src/projection.ts
var p = {
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
function m(e, t) {
	return t > 0 ? (e + .5) / t : .5;
}
function h(e, t, n) {
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
function g(e, t, n) {
	let r = h(p.top, e, n), i = h(p.bottom, e, n);
	return {
		x: i.x + (r.x - i.x) * t,
		y: i.y + (r.y - i.y) * t
	};
}
function _(e, t) {
	return {
		x: 1 - m(e.x, t.x.values.length),
		y: m(e.y, t.y.values.length),
		z: m(e.z, t.z.values.length)
	};
}
function v(e, t) {
	let n = _(e, t), r = g(n.x, n.y, n.z);
	return {
		left: `${r.x}%`,
		top: `${r.y}%`,
		layer: `${Math.round((2 - n.x - n.z) * 1e3)}`,
		cardSide: r.x > 66 ? "left" : "right"
	};
}
function y(e, t, n = 1) {
	let r = _(e, t), i = .5 / Math.max(t.x.values.length, t.y.values.length, t.z.values.length, 1) * n, a = (e) => Math.max(0, e - i), o = (e) => Math.min(1, e + i), s = a(r.x), c = o(r.x), l = a(r.y), u = o(r.y), d = a(r.z), f = o(r.z), p = {
		topFront: g(s, u, d),
		topLeft: g(c, u, d),
		topBack: g(c, u, f),
		topRight: g(s, u, f),
		bottomFront: g(s, l, d),
		bottomLeft: g(c, l, d),
		bottomRight: g(s, l, f)
	}, m = Object.values(p), h = .3, v = Math.min(...m.map((e) => e.x)) - h, y = Math.min(...m.map((e) => e.y)) - h, b = Math.max(...m.map((e) => e.x)) + h, x = Math.max(...m.map((e) => e.y)) + h;
	return {
		corners: p,
		bounds: {
			left: v,
			top: y,
			width: b - v,
			height: x - y
		}
	};
}
//#endregion
//#region packages/mhu-cube/src/mhu-cube-visualization.ts
var b = "http://www.w3.org/2000/svg";
function x(e, t) {
	let n = document.createElementNS(b, e);
	return Object.entries(t).forEach(([e, t]) => n.setAttribute(e, t)), n;
}
function S() {
	let e = x("svg", {
		class: "mhu-cube__frame",
		viewBox: "0 0 1000 868",
		preserveAspectRatio: "xMidYMid meet",
		"aria-hidden": "true"
	});
	return e.append(x("path", {
		class: "mhu-cube__frame-line",
		d: "M573 5 152 103 573 276 995 103 573 5M152 103 224 586 573 861 925 586 995 103M573 276 573 861M573 5 573 405M224 586 573 405 925 586"
	})), e;
}
function C(e) {
	let t = document.createElement("div");
	t.className = "mhu-cube__axes", t.setAttribute("aria-hidden", "true");
	let n = (e, n, r) => {
		let i = document.createElement("span");
		i.className = n, i.textContent = e, i.style.left = `${r.x}%`, i.style.top = `${r.y}%`, t.append(i);
	};
	return n(e.y.label, "mhu-cube__axis-title mhu-cube__axis-title--y", {
		x: 4.5,
		y: 7.5
	}), n(e.x.label, "mhu-cube__axis-title mhu-cube__axis-title--x", {
		x: 30,
		y: 89
	}), n(e.z.label, "mhu-cube__axis-title mhu-cube__axis-title--z", {
		x: 84.5,
		y: 91.5
	}), e.y.values.forEach((t, r) => {
		let i = g(1, m(r, e.y.values.length), 0);
		n(t, "mhu-cube__axis-value mhu-cube__axis-value--y", {
			x: i.x - 5,
			y: i.y
		});
	}), e.x.values.forEach((t, r) => {
		let i = g(1 - m(r, e.x.values.length), 0, 0);
		n(t, "mhu-cube__axis-value mhu-cube__axis-value--x", {
			x: i.x - 4.5,
			y: i.y + 1.8
		});
	}), e.z.values.forEach((t, r) => {
		let i = g(0, 0, m(r, e.z.values.length));
		n(t, "mhu-cube__axis-value mhu-cube__axis-value--z", {
			x: i.x + 2.5,
			y: i.y + 1.7
		});
	}), t;
}
function w(e, t, n = 1) {
	let { corners: r, bounds: i } = y(e, t, n), a = (...e) => e.map((e) => `${e.x},${e.y}`).join(" "), o = (...e) => e.map((e, t) => `${t === 0 ? "M" : "L"}${e.x} ${e.y}`).join(""), s = x("svg", {
		class: "mhu-cube__cube",
		viewBox: `${i.left} ${i.top} ${i.width} ${i.height}`,
		preserveAspectRatio: "none",
		"aria-hidden": "true"
	}), c = [
		r.topFront,
		r.topLeft,
		r.topBack,
		r.topRight
	], l = [
		r.topFront,
		r.topLeft,
		r.bottomLeft,
		r.bottomFront
	], u = [
		r.topFront,
		r.topRight,
		r.bottomRight,
		r.bottomFront
	];
	return s.append(x("polygon", {
		class: "mhu-cube__top",
		points: a(...c),
		"vector-effect": "non-scaling-stroke"
	}), x("polygon", {
		class: "mhu-cube__left",
		points: a(...l),
		"vector-effect": "non-scaling-stroke"
	}), x("polygon", {
		class: "mhu-cube__right",
		points: a(...u),
		"vector-effect": "non-scaling-stroke"
	}), x("path", {
		class: "mhu-cube__edge",
		d: [
			o(r.topFront, r.topBack),
			o(r.topLeft, r.topRight),
			o(r.topFront, r.bottomLeft),
			o(r.topLeft, r.bottomFront),
			o(r.topFront, r.bottomRight),
			o(r.topRight, r.bottomFront)
		].join(""),
		"vector-effect": "non-scaling-stroke"
	})), {
		svg: s,
		bounds: i
	};
}
function T(e) {
	let t = document.createElement("p");
	return t.className = "mhu-cube__sr-only", t.textContent = [
		e.x,
		e.y,
		e.z
	].map((e) => `${e.label}: ${e.values.join(", ")}`).join(". "), t;
}
function E(e, t) {
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
//#endregion
//#region packages/mhu-cube/src/details-transition.ts
var D = 90, O = 140, k = class {
	#e = null;
	#t = 0;
	cancel() {
		this.#t += 1, this.#e?.cancel(), this.#e = null;
	}
	run(e, t) {
		this.cancel();
		let n = this.#t;
		if (typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches || typeof e.animate != "function") {
			t();
			return;
		}
		let r = e.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: D,
			easing: "ease-out",
			fill: "forwards"
		});
		this.#e = r, r.finished.then(() => {
			if (n !== this.#t) return;
			t();
			let i = e.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: O,
				easing: "ease-in",
				fill: "forwards"
			});
			r.cancel(), this.#e = i, i.finished.then(() => {
				n === this.#t && (i.cancel(), this.#e = null);
			}).catch(() => void 0);
		}).catch(() => void 0);
	}
}, A = {
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
}, j = new Set([
	"available",
	"current",
	"unavailable"
]), M = [
	"x",
	"y",
	"z"
];
function N(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function P(e, t, n, r, i) {
	return {
		code: e,
		message: t,
		path: n,
		severity: r,
		...i ? { itemId: i } : {}
	};
}
function F(e) {
	let t = e.trim();
	if (!t) return !1;
	try {
		let e = new URL(t, "https://mhu-cube.invalid/");
		return e.protocol === "http:" || e.protocol === "https:";
	} catch {
		return !1;
	}
}
function I(e) {
	let t = [];
	if (!N(e)) return {
		value: A,
		issues: [P("axes.invalid", "Axes must be an object with x, y, and z definitions.", "axes", "error")]
	};
	let n = {};
	return M.forEach((r) => {
		let i = e[r], a = `${r.toUpperCase()} axis`;
		if (!N(i)) {
			n[r] = {
				label: a,
				values: []
			}, t.push(P("axis.invalid", `${a} must provide a label and values.`, `axes.${r}`, "error"));
			return;
		}
		let o = typeof i.label == "string" && i.label.trim() ? i.label.trim() : a;
		o === a && i.label !== a && t.push(P("axis.label.invalid", `${a} is using a fallback label.`, `axes.${r}.label`, "warning"));
		let s = i.values;
		if (!Array.isArray(s) || s.length === 0) {
			n[r] = {
				label: o,
				values: []
			}, t.push(P("axis.values.invalid", `${o} must provide at least one value.`, `axes.${r}.values`, "error"));
			return;
		}
		let c = s.every((e) => typeof e == "string" && e.trim().length > 0), l = c ? s.map((e) => e.trim()) : [];
		c ? new Set(l).size !== l.length && (l.length = 0, t.push(P("axis.values.duplicate", `${o} contains duplicate values and cannot be plotted safely.`, `axes.${r}.values`, "error"))) : t.push(P("axis.value.invalid", `${o} contains an empty or non-text value.`, `axes.${r}.values`, "error")), n[r] = {
			label: o,
			values: l
		};
	}), {
		value: n,
		issues: t
	};
}
function L(e, t, n, r) {
	if (e === void 0) return;
	if (!N(e)) {
		r.push(P("item.metadata.invalid", "Metadata must be an object.", t, "warning", n));
		return;
	}
	let i = {};
	return Object.entries(e).forEach(([e, a]) => {
		if (!e.trim()) {
			r.push(P("item.metadata.key.invalid", "Metadata field with an empty name was omitted.", t, "warning", n));
			return;
		}
		typeof a == "string" || typeof a == "number" && Number.isFinite(a) || a == null ? i[e] = a : r.push(P("item.metadata.value.invalid", `Metadata field “${e}” was omitted because its value is unsupported.`, `${t}.${e}`, "warning", n));
	}), i;
}
function R(e, t, n, r, i) {
	if (e == null) {
		i.push(P("item.position.missing", "Dataset is available but will not be plotted because it has no position.", n, "warning", r));
		return;
	}
	if (!N(e)) {
		i.push(P("item.position.invalid", "Position must provide integer x, y, and z indexes.", n, "warning", r));
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
		i.push(P("item.position.invalid", "Position must provide non-negative integer x, y, and z indexes.", n, "warning", r));
		return;
	}
	let o = a;
	if (!(o.x < t.x.values.length && o.y < t.y.values.length && o.z < t.z.values.length)) {
		i.push(P("item.position.out-of-range", "Position falls outside the configured axes and will not be plotted.", n, "warning", r));
		return;
	}
	return o;
}
function z(e, t) {
	let n = [];
	if (!Array.isArray(e)) return {
		value: [],
		issues: [P("items.invalid", "Items must be an array.", "items", "error")]
	};
	let r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e, o) => {
		let s = `items[${o}]`;
		if (!N(e)) {
			n.push(P("item.invalid", "Dataset must be an object and was excluded.", s, "error"));
			return;
		}
		let c = typeof e.id == "string" ? e.id.trim() : "";
		if (!c) {
			n.push(P("item.id.invalid", "Dataset requires a nonempty text ID and was excluded.", `${s}.id`, "error"));
			return;
		}
		if (r.has(c)) {
			n.push(P("item.id.duplicate", `Duplicate dataset ID “${c}” was excluded.`, `${s}.id`, "error", c));
			return;
		}
		r.add(c);
		let l = typeof e.label == "string" ? e.label.trim() : "", u = l || c;
		l || n.push(P("item.label.invalid", "Dataset label is missing; its ID is shown instead.", `${s}.label`, "warning", c));
		let d;
		e.href !== void 0 && (typeof e.href == "string" && F(e.href) ? d = e.href.trim() : n.push(P("item.href.unsafe", "Metadata destination was removed because it is invalid or uses an unsafe protocol.", `${s}.href`, "error", c)));
		let f = "available";
		e.status !== void 0 && (typeof e.status == "string" && j.has(e.status) ? f = e.status : n.push(P("item.status.invalid", "Unknown status was replaced with “available”.", `${s}.status`, "warning", c))), !d && f === "available" && (f = "unavailable", n.push(P("item.href.missing", "Dataset has no metadata destination and is treated as unavailable.", `${s}.href`, "warning", c)));
		let p = L(e.metadata, `${s}.metadata`, c, n), m;
		e.cubeScale !== void 0 && (typeof e.cubeScale == "number" && Number.isFinite(e.cubeScale) && e.cubeScale > 0 && e.cubeScale <= 1 ? m = e.cubeScale : n.push(P("item.cube-scale.invalid", "Cube scale must be greater than zero and no larger than one; the default size is used.", `${s}.cubeScale`, "warning", c)));
		let h = R(e.position, t, `${s}.position`, c, n);
		if (h) {
			let e = `${h.x}:${h.y}:${h.z}`;
			i.has(e) ? (n.push(P("item.position.duplicate", "Position is already occupied; this dataset remains available but is not plotted.", `${s}.position`, "warning", c)), h = void 0) : i.add(e);
		}
		a.push({
			id: c,
			label: u,
			...d ? { href: d } : {},
			...p ? { metadata: p } : {},
			...h ? { position: h } : {},
			...m === void 0 ? {} : { cubeScale: m },
			status: f
		});
	}), {
		value: a,
		issues: n
	};
}
//#endregion
//#region packages/mhu-cube/src/mhu-cube.ts
var B = "mhu-cube-selection-change", V = "mhu-cube-validation", H = typeof HTMLElement > "u" ? class {} : HTMLElement, U = 0, W = class extends H {
	static observedAttributes = [
		"items",
		"axes",
		"label"
	];
	#e = [];
	#t = [];
	#n = A;
	#r = [];
	#i = [];
	#a = [];
	#o = null;
	#s = this.attachShadow({ mode: "open" });
	#c = `mhu-cube-${++U}`;
	#l = null;
	#u = null;
	#d = null;
	#f = null;
	#p = `${this.#c}-details`;
	#m = `${this.#c}-details-heading`;
	#h = !1;
	#g = !1;
	#_ = new k();
	get items() {
		return this.#t;
	}
	set items(e) {
		this.#e = e, this.#y(), this.#v(!0);
	}
	get axes() {
		return this.#n;
	}
	set axes(e) {
		this.#b(e), this.#v(!0);
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
		this.#o = this.#t.some((t) => t.id === e) ? e : null, this.#v(!1);
	}
	connectedCallback() {
		this.#x("axes", !1), this.#x("items", !1), this.#v(!0);
	}
	disconnectedCallback() {
		this.#_.cancel();
	}
	attributeChangedCallback(e) {
		e !== "label" && this.#x(e, !0), this.#v(e !== "label");
	}
	#v(e) {
		this.#g ||= e, !this.#h && (this.#h = !0, queueMicrotask(() => {
			this.#h = !1, this.isConnected && (this.#k(), this.#g && this.#S(), this.#g = !1);
		}));
	}
	#y() {
		let e = z(this.#e, this.#n);
		this.#t = e.value, this.#i = e.issues, this.#t.some((e) => e.id === this.#o) || (this.#o = null);
	}
	#b(e) {
		let t = I(e);
		this.#n = t.value, this.#r = t.issues, this.#y();
	}
	#x(e, t) {
		this.#a = this.#a.filter((t) => t.path !== e);
		let n = this.getAttribute(e);
		if (n === null) {
			t && (e === "axes" ? this.#b(A) : (this.#e = [], this.#y()));
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
		e === "axes" ? this.#b(r) : (this.#e = r, this.#y());
	}
	#S() {
		this.isConnected && this.dispatchEvent(new CustomEvent(V, {
			bubbles: !0,
			composed: !0,
			detail: { issues: this.validationIssues }
		}));
	}
	#C(e, t) {
		let n = this.#o !== e.id;
		this.#o = e.id, this.#E(), n && this.#u ? this.#_.run(this.#u, () => {
			this.#u && (d(this.#u, e, this.#m, () => this.#w()), t && this.#u.querySelector(".mhu-cube__details-action")?.focus());
		}) : t && this.#u?.querySelector(".mhu-cube__details-action")?.focus(), this.dispatchEvent(new CustomEvent(B, {
			bubbles: !0,
			composed: !0,
			detail: { item: e }
		}));
	}
	#w() {
		let e = this.#o;
		if (!e || !this.#u) return;
		let t = [...this.#s.querySelectorAll("[data-item-id]")].find((t) => t.dataset.itemId === e);
		this.#_.cancel(), this.#o = null, this.#E(), d(this.#u, null, this.#m, () => this.#w()), t?.focus(), this.dispatchEvent(new CustomEvent(B, {
			bubbles: !0,
			composed: !0,
			detail: { item: null }
		}));
	}
	#T() {
		let n = document.createElement("style");
		n.textContent = `${e}\n${t}`;
		let r = document.createElement("section");
		r.className = "mhu-cube";
		let a = document.createElement("div");
		a.className = "mhu-cube__content";
		let o = u(this.#p);
		a.append(i(o));
		let s = document.createElement("div");
		s.className = "mhu-cube__stage";
		let c = document.createElement("div");
		c.className = "mhu-cube__plot", s.append(c), r.append(a, s), this.#s.replaceChildren(n, r), this.#l = r, this.#u = o, this.#d = s, this.#f = c;
	}
	#E() {
		let e = this.#t.find((e) => e.id === this.#o) ?? null;
		this.#l?.classList.toggle("mhu-cube--has-selection", !!e), this.#s.querySelectorAll("[data-item-id]").forEach((t) => {
			let n = t.dataset.itemId === e?.id;
			t.closest("li")?.classList.toggle("mhu-cube__item--selected", n), t.setAttribute("aria-pressed", String(n));
		});
	}
	#D(e, t, n) {
		e.type = "button", e.dataset.itemId = t.id, e.setAttribute("aria-label", `Select ${o(t)}`), e.setAttribute("aria-describedby", n), e.setAttribute("aria-controls", this.#p), e.setAttribute("aria-pressed", String(t.id === this.#o)), e.addEventListener("click", (e) => this.#C(t, e.detail === 0));
	}
	#O(e, t) {
		let n = document.createElement("section");
		n.className = "mhu-cube__unpositioned";
		let r = document.createElement("h3");
		r.className = "mhu-cube__unpositioned-heading", r.textContent = "Not plotted";
		let i = document.createElement("p");
		i.className = "mhu-cube__unpositioned-guidance", i.textContent = "These datasets do not include usable visualization coordinates.";
		let a = document.createElement("ul");
		return a.className = "mhu-cube__unpositioned-list", e.forEach((e) => {
			let n = t.get(e.id) ?? 0, r = document.createElement("li");
			r.className = "mhu-cube__unpositioned-item", e.id === this.#o && r.classList.add("mhu-cube__item--selected");
			let i = document.createElement("span");
			i.className = "mhu-cube__sr-only", i.id = `${this.#c}-unpositioned-${n}-description`, i.textContent = E(e, this.#n);
			let o = document.createElement("button");
			o.className = "mhu-cube__unpositioned-button", o.textContent = e.label, this.#D(o, e, i.id), r.append(i, o), a.append(r);
		}), n.append(r, i, a), n;
	}
	#k() {
		if ((!this.#l || !this.#u || !this.#d || !this.#f) && this.#T(), !this.#l || !this.#u || !this.#d || !this.#f) return;
		this.#l.setAttribute("aria-label", this.getAttribute("label") ?? "Metadata datasets"), this.#d.querySelector(".mhu-cube__unpositioned")?.remove();
		let e = this.#n.x.values.length > 0 && this.#n.y.values.length > 0 && this.#n.z.values.length > 0;
		if (e) this.#f.replaceChildren(S(), C(this.#n), T(this.#n));
		else {
			let e = document.createElement("p");
			e.className = "mhu-cube__plot-unavailable", e.textContent = "Visualization unavailable because the axis data is incomplete.", this.#f.replaceChildren(e);
		}
		let t = this.#t.find((e) => e.id === this.#o) ?? null;
		if (this.#l.classList.toggle("mhu-cube--has-selection", !!t), this.#_.cancel(), d(this.#u, t, this.#m, () => this.#w()), this.#t.length === 0) {
			if (e) {
				let e = document.createElement("p");
				e.className = "mhu-cube__empty", e.textContent = "No datasets are available.", this.#f.append(e);
			}
			return;
		}
		let n = document.createElement("ul");
		n.className = "mhu-cube__list";
		let r = new Map(this.#t.map((e, t) => [e.id, t]));
		this.#t.forEach((e, t) => {
			let r = e.status ?? "available", i = e.id === this.#o, a = document.createElement("li");
			if (a.className = `mhu-cube__item mhu-cube__item--${r}`, i && a.classList.add("mhu-cube__item--selected"), !e.position) {
				a.classList.add("mhu-cube__item--unpositioned"), a.append(f(e)), n.append(a);
				return;
			}
			let o = v(e.position, this.#n), s = w(e.position, this.#n, e.cubeScale);
			a.classList.add(`mhu-cube__item--card-${o.cardSide}`), a.style.setProperty("--cube-left", `${s.bounds.left}%`), a.style.setProperty("--cube-top", `${s.bounds.top}%`), a.style.setProperty("--cube-width", `${s.bounds.width}%`), a.style.setProperty("--cube-height", `${s.bounds.height}%`), a.style.setProperty("--cube-layer", o.layer);
			let c = document.createElement("button");
			c.className = "mhu-cube__select";
			let u = document.createElement("span");
			u.className = "mhu-cube__sr-only", u.id = `${this.#c}-item-${t}-description`, u.textContent = E(e, this.#n), this.#D(c, e, u.id), c.append(s.svg, l(e)), a.append(u, c, f(e)), n.append(a);
		}), this.#f.append(n);
		let i = this.#t.filter((e) => !e.position);
		i.length > 0 && this.#d.append(this.#O(i, r));
	}
};
function G() {
	typeof customElements > "u" || customElements.get("mhu-cube") || customElements.define("mhu-cube", W);
}
//#endregion
export { B as MHU_CUBE_SELECTION_EVENT, V as MHU_CUBE_VALIDATION_EVENT, W as MhuCube, G as defineMhuCube, F as isSafeMetadataHref, I as validateAxes, z as validateItems };

//# sourceMappingURL=mhu-cube.js.map