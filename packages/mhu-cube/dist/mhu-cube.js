//#region packages/mhu-cube/src/mhu-cube.css?inline
var e = ":host{--_surface:var(--mhu-cube-surface,var(--mat-sys-surface,#fcfcfc));--_surface-container:var(--mhu-cube-surface-container,var(--mat-sys-surface-container,#eceff1));--_on-surface:var(--mhu-cube-on-surface,var(--mat-sys-on-surface,#1d2429));--_on-surface-variant:var(--mhu-cube-on-surface-variant,var(--mat-sys-on-surface-variant,#354b57));--_primary:var(--mhu-cube-primary,var(--mat-sys-primary,#8b1510));--_on-primary:var(--mhu-cube-on-primary,var(--mat-sys-on-primary,#fff));--_primary-container:var(--mhu-cube-primary-container,var(--mat-sys-primary-container,#ffdad5));--_on-primary-container:var(--mhu-cube-on-primary-container,var(--mat-sys-on-primary-container,#6b0f0a));--_outline:var(--mhu-cube-outline,var(--mat-sys-outline,#6c7f8a));--_outline-variant:var(--mhu-cube-outline-variant,var(--mat-sys-outline-variant,#c0cbd1));--_focus:var(--mhu-cube-focus,var(--mat-sys-primary,#8b1510));box-sizing:border-box;width:100%;min-width:0;max-width:100%;color:var(--_on-surface);font-family:var(--mat-sys-body-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-large-size,1rem);font-weight:var(--mat-sys-body-large-weight,400);line-height:var(--mat-sys-body-large-line-height,1.5rem);letter-spacing:var(--mat-sys-body-large-tracking,.03125rem);display:block;container:mhu-cube-host/inline-size}*{box-sizing:border-box}.mhu-cube{background:var(--_surface);grid-template:\"content stage\"minmax(0,1fr)/minmax(22rem,28rem) minmax(0,1fr);gap:clamp(1.5rem,3vw,4rem);width:100%;height:100%;min-height:36rem;padding:clamp(1.5rem,3vw,3rem);display:grid;overflow:visible}.mhu-cube__content{flex-direction:column;grid-area:content;align-self:stretch;gap:clamp(1.5rem,3vh,2.5rem);width:100%;height:100%;min-height:0;padding:0 0 1rem;display:flex}.mhu-cube__stage{grid-area:stage;grid-template-rows:minmax(0,1fr) auto;place-items:center;gap:.75rem;min-width:0;min-height:0;display:grid;container-type:size}.mhu-cube__plot{aspect-ratio:1000/868;width:min(100cqw,115.207cqh);position:relative}.mhu-cube__frame{z-index:0;pointer-events:none;shape-rendering:geometricprecision;width:100%;height:100%;position:absolute;inset:0;overflow:visible}.mhu-cube__frame-line{fill:none;stroke:color-mix(in srgb, var(--_outline) 68%, transparent);stroke-width:1.1px;vector-effect:non-scaling-stroke}.mhu-cube__frame-guide{fill:none;stroke:color-mix(in srgb, var(--_outline) 30%, transparent);stroke-width:1px;vector-effect:non-scaling-stroke}.mhu-cube__axes{z-index:1;-webkit-user-select:text;user-select:text;position:absolute;inset:0}.mhu-cube__axis-title,.mhu-cube__axis-value{white-space:nowrap;position:absolute;transform:translate(-50%,-50%)}.mhu-cube__axis-title{color:var(--_primary);font-family:var(--mat-sys-label-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-large-size,.875rem);font-weight:600;line-height:var(--mat-sys-label-large-line-height,1.25rem);letter-spacing:var(--mat-sys-label-large-tracking,.00625rem)}.mhu-cube__axis-title--time{transform:translateY(-50%)}.mhu-cube__axis-value{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);font-weight:var(--mat-sys-body-small-weight,400);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem)}.mhu-cube__axis-value--time{transform:translate(-100%,-50%)}.mhu-cube__axis-value--organ{transform:translateY(-50%)}.mhu-cube__axis-title--space,.mhu-cube__axis-title--organ,.mhu-cube__axis-value--space,.mhu-cube__axis-value--organ{text-shadow:-2px -2px 0 var(--_surface), 2px -2px 0 var(--_surface), -2px 2px 0 var(--_surface), 2px 2px 0 var(--_surface)}.mhu-cube__list{z-index:2;pointer-events:none;margin:0;padding:0;list-style:none;position:absolute;inset:0}.mhu-cube__item{top:var(--cube-top);left:var(--cube-left);width:var(--cube-width);height:var(--cube-height);pointer-events:none;position:absolute}.mhu-cube__item--unpositioned{display:none}.mhu-cube__select{width:100%;height:100%;color:inherit;font:inherit;text-align:left;cursor:pointer;pointer-events:none;background:0 0;border:0;margin:0;padding:0;display:block;position:relative}.mhu-cube__select:focus-visible{z-index:999;outline:3px solid var(--_focus);outline-offset:5px}.mhu-cube__cube{z-index:var(--cube-layer,1);shape-rendering:geometricprecision;width:100%;height:100%;display:block;position:relative;overflow:visible}.mhu-cube__top,.mhu-cube__left,.mhu-cube__right{stroke:color-mix(in srgb, var(--_outline) 75%, transparent);stroke-width:.85px;stroke-linejoin:bevel;pointer-events:fill;transition:fill-opacity .17s,stroke .17s,stroke-width .17s}.mhu-cube__top{fill:var(--_primary);fill-opacity:.4}.mhu-cube__left{fill:var(--_primary);fill-opacity:.5}.mhu-cube__right{fill:var(--_primary);fill-opacity:.64}.mhu-cube__edge{fill:none;stroke:color-mix(in srgb, var(--_on-surface) 38%, transparent);stroke-width:.75px;pointer-events:none;transition:stroke .17s,stroke-width .17s}.mhu-cube__select:hover .mhu-cube__top,.mhu-cube__select:hover .mhu-cube__left,.mhu-cube__select:hover .mhu-cube__right,.mhu-cube__select:focus-visible .mhu-cube__top,.mhu-cube__select:focus-visible .mhu-cube__left,.mhu-cube__select:focus-visible .mhu-cube__right{stroke:var(--_on-surface);stroke-width:2.3px}.mhu-cube__select:hover .mhu-cube__edge,.mhu-cube__select:focus-visible .mhu-cube__edge{stroke:var(--_on-surface);stroke-width:2px}.mhu-cube__select:hover .mhu-cube__top,.mhu-cube__select:focus-visible .mhu-cube__top{fill-opacity:.46}.mhu-cube__select:hover .mhu-cube__left,.mhu-cube__select:focus-visible .mhu-cube__left{fill-opacity:.56}.mhu-cube__select:hover .mhu-cube__right,.mhu-cube__select:focus-visible .mhu-cube__right{fill-opacity:.68}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__top,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__left,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__right,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__edge{stroke:var(--_primary);stroke-width:1.2px}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__top{fill-opacity:.9}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__left{fill-opacity:.96}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__right{fill-opacity:1}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__top{fill-opacity:.08}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__left{fill-opacity:.1}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__right{fill-opacity:.12}.mhu-cube__card{z-index:1000;top:var(--card-top,50%);border:1px solid color-mix(in srgb, var(--_outline) 75%, transparent);opacity:0;background:var(--_surface-container);width:15rem;box-shadow:0 .5rem 1.2rem color-mix(in srgb, var(--_on-surface) 22%, transparent);pointer-events:none;padding:.75rem .85rem;transition:opacity .12s;position:absolute;left:calc(100% + .75rem);transform:translateY(-50%)}.mhu-cube__item--card-left .mhu-cube__card{left:auto;right:calc(100% + .75rem)}.mhu-cube__select:hover .mhu-cube__card,.mhu-cube__select:focus-visible .mhu-cube__card{opacity:1}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__card{opacity:0}.mhu-cube__label{color:var(--_on-surface);font-family:var(--mat-sys-title-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-title-small-size,.875rem);font-weight:var(--mat-sys-title-small-weight,500);line-height:var(--mat-sys-title-small-line-height,1.25rem);letter-spacing:var(--mat-sys-title-small-tracking,.00625rem);display:block}.mhu-cube__metadata{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);font-weight:var(--mat-sys-body-small-weight,400);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem);grid-template-columns:auto 1fr;gap:.2rem .5rem;margin:.5rem 0 0;display:grid}.mhu-cube__metadata-key{font-family:var(--mat-sys-label-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-small-size,.6875rem);font-weight:var(--mat-sys-label-small-weight,500);line-height:var(--mat-sys-label-small-line-height,1rem);letter-spacing:var(--mat-sys-label-small-tracking,.03125rem)}.mhu-cube__metadata-value{overflow-wrap:anywhere;min-width:0}.mhu-cube__status{color:var(--_on-primary-container);font-family:var(--mat-sys-label-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-small-size,.6875rem);font-weight:var(--mat-sys-label-small-weight,500);line-height:var(--mat-sys-label-small-line-height,1rem);letter-spacing:var(--mat-sys-label-small-tracking,.03125rem);text-transform:uppercase;margin-top:.4rem;display:inline-block}.mhu-cube__item--current .mhu-cube__top,.mhu-cube__item--current .mhu-cube__left,.mhu-cube__item--current .mhu-cube__right{stroke:var(--_primary);stroke-width:2.5px}.mhu-cube__item--unavailable .mhu-cube__cube{opacity:.62;filter:grayscale()}.mhu-cube__item--unavailable .mhu-cube__top,.mhu-cube__item--unavailable .mhu-cube__left,.mhu-cube__item--unavailable .mhu-cube__right,.mhu-cube__item--unavailable .mhu-cube__edge{stroke-dasharray:3 2}.mhu-cube__compact-card{display:none}.mhu-cube__unpositioned{border-left:3px solid var(--_outline);background:var(--_surface-container);align-self:end;width:min(100%,38rem);padding:.75rem 1rem}.mhu-cube__unpositioned-heading{font-family:var(--mat-sys-title-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-title-small-size,.875rem);font-weight:var(--mat-sys-title-small-weight,500);line-height:var(--mat-sys-title-small-line-height,1.25rem);letter-spacing:var(--mat-sys-title-small-tracking,.00625rem);margin:0}.mhu-cube__unpositioned-guidance{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);font-weight:var(--mat-sys-body-small-weight,400);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem);margin:.25rem 0 0}.mhu-cube__unpositioned-list{flex-wrap:wrap;gap:.5rem;margin:.625rem 0 0;padding:0;list-style:none;display:flex}.mhu-cube__unpositioned-button{border:1px solid var(--_outline);background:var(--_surface);min-height:2.75rem;color:var(--_on-surface);font-family:var(--mat-sys-label-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-large-size,.875rem);font-weight:var(--mat-sys-label-large-weight,500);line-height:var(--mat-sys-label-large-line-height,1.25rem);letter-spacing:var(--mat-sys-label-large-tracking,.00625rem);cursor:pointer;padding:.625rem .75rem}.mhu-cube__unpositioned-button:hover{background:var(--_primary-container);color:var(--_on-primary-container)}.mhu-cube__unpositioned-button:focus-visible{outline:3px solid var(--_focus);outline-offset:3px}.mhu-cube__unpositioned-item.mhu-cube__item--selected .mhu-cube__unpositioned-button{border-color:var(--_primary);background:var(--_primary-container);color:var(--_on-primary-container);border-width:2px}.mhu-cube__intro{flex-direction:column;height:100%;min-height:0;display:flex}.mhu-cube__intro-eyebrow,.mhu-cube__details-eyebrow{color:var(--_primary);font-family:var(--mat-sys-label-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-small-size,.6875rem);font-weight:600;line-height:var(--mat-sys-label-small-line-height,1rem);letter-spacing:var(--mat-sys-label-small-tracking,.03125rem);text-transform:uppercase;margin:0 0 .5rem}.mhu-cube__intro-heading{font-family:var(--mat-sys-headline-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-headline-large-size,2rem);font-weight:var(--mat-sys-headline-large-weight,600);line-height:var(--mat-sys-headline-large-line-height,2.5rem);letter-spacing:var(--mat-sys-headline-large-tracking,0);white-space:nowrap;margin:0}.mhu-cube__details-heading,.mhu-cube__compact-heading{font-family:var(--mat-sys-title-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-title-large-size,1.375rem);font-weight:500;line-height:var(--mat-sys-title-large-line-height,1.75rem);letter-spacing:var(--mat-sys-title-large-tracking,0);margin:0}.mhu-cube__intro-compact,.mhu-cube__details-unavailable{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-large-size,1rem);font-weight:var(--mat-sys-body-large-weight,400);line-height:var(--mat-sys-body-large-line-height,1.5rem);letter-spacing:var(--mat-sys-body-large-tracking,.03125rem);margin:1rem 0 0}.mhu-cube__intro-visualization{min-height:0;color:var(--_on-surface-variant);font-family:var(--mat-sys-body-medium-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-medium-size,.875rem);font-weight:var(--mat-sys-body-medium-weight,400);line-height:var(--mat-sys-body-medium-line-height,1.25rem);letter-spacing:var(--mat-sys-body-medium-tracking,.015625rem);flex-direction:column;flex:1;margin:.75rem 0 0;display:flex}.mhu-cube__intro-summary,.mhu-cube__intro-attribution{margin:0}.mhu-cube__intro-compact,.mhu-cube__details:empty{display:none}.mhu-cube__details-card,.mhu-cube__compact-card{border:1px solid var(--_outline-variant);background:var(--_surface-container);box-shadow:0 1rem 2.5rem color-mix(in srgb, var(--_on-surface) 10%, transparent)}.mhu-cube__details-card{width:100%;padding:1.25rem}.mhu-cube__details-action,.mhu-cube__compact-action{background:var(--_primary);min-height:2.75rem;color:var(--_on-primary);font-family:var(--mat-sys-label-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-large-size,.875rem);font-weight:var(--mat-sys-label-large-weight,500);line-height:var(--mat-sys-label-large-line-height,1.25rem);letter-spacing:var(--mat-sys-label-large-tracking,.00625rem);white-space:nowrap;justify-content:center;align-items:center;margin-top:1.75rem;padding:.75rem 1rem;text-decoration:none;display:inline-flex}.mhu-cube__details-action:hover,.mhu-cube__compact-action:hover{filter:brightness(.92)}.mhu-cube__details-action:focus-visible,.mhu-cube__compact-action:focus-visible{outline:3px solid var(--_focus);outline-offset:3px}.mhu-cube__empty,.mhu-cube__plot-unavailable{color:var(--_on-surface-variant);text-align:center;place-items:center;margin:0;padding:2rem;display:grid;position:absolute;inset:0}.mhu-cube__sr-only{clip:rect(0, 0, 0, 0);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}@container mhu-cube-host (width<=64rem){.mhu-cube{flex-direction:column;height:auto;min-height:0;padding:clamp(1.5rem,4vw,2.5rem) 0 0;display:flex;overflow:visible}.mhu-cube__content{max-width:45rem;padding:0;display:block}.mhu-cube__intro{height:auto;min-height:0;margin-bottom:2rem;display:block}.mhu-cube__intro-eyebrow{margin:0 0 .875rem}.mhu-cube__intro-heading{font-family:var(--mat-sys-headline-medium-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-headline-medium-size,1.75rem);font-weight:var(--mat-sys-headline-medium-weight,600);line-height:var(--mat-sys-headline-medium-line-height,2.25rem);letter-spacing:var(--mat-sys-headline-medium-tracking,0);white-space:normal}.mhu-cube__intro-visualization{display:none}.mhu-cube__intro-compact{margin-top:.875rem;display:block}.mhu-cube__stage{display:block;container-type:normal}.mhu-cube__plot{aspect-ratio:auto;width:100%;max-height:none}.mhu-cube__frame,.mhu-cube__axes{display:none}.mhu-cube__list{grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;display:grid;position:static}.mhu-cube__item{pointer-events:auto;width:auto;min-width:0;height:auto;display:grid;position:static}.mhu-cube__select{display:none}.mhu-cube__compact-card{flex-direction:column;gap:1.5rem;width:100%;min-width:0;height:100%;padding:1.25rem;display:flex}.mhu-cube__compact-heading{overflow-wrap:anywhere}.mhu-cube__compact-action{align-self:flex-start;margin-top:auto}.mhu-cube__compact-card .mhu-cube__details-unavailable{margin-top:auto}.mhu-cube__details,.mhu-cube__unpositioned{display:none}.mhu-cube__empty,.mhu-cube__plot-unavailable{position:static}}@container mhu-cube-host (width<=40rem){.mhu-cube__list{grid-template-columns:minmax(0,1fr)}}@media (prefers-reduced-motion:reduce){.mhu-cube__top,.mhu-cube__left,.mhu-cube__right,.mhu-cube__edge,.mhu-cube__card{transition:none}}@media (forced-colors:active){.mhu-cube__frame-line,.mhu-cube__top,.mhu-cube__left,.mhu-cube__right,.mhu-cube__edge{stroke:canvastext}.mhu-cube__frame-guide{stroke:graytext}.mhu-cube__top,.mhu-cube__left,.mhu-cube__right{fill:canvas;fill-opacity:1}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__top,.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__left,.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__right{fill-opacity:1}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__top,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__left,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__right,.mhu-cube__select:hover .mhu-cube__top,.mhu-cube__select:hover .mhu-cube__left,.mhu-cube__select:hover .mhu-cube__right{fill:highlight;stroke:highlighttext}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__edge,.mhu-cube__select:hover .mhu-cube__edge{stroke:highlighttext}.mhu-cube__item--unavailable .mhu-cube__cube{opacity:1;filter:none}.mhu-cube__card,.mhu-cube__details-card,.mhu-cube__compact-card,.mhu-cube__unpositioned{box-shadow:none;border-color:canvastext}.mhu-cube__details-action,.mhu-cube__compact-action,.mhu-cube__unpositioned-button{border:1px solid buttontext}.mhu-cube__select:focus-visible,.mhu-cube__details-action:focus-visible,.mhu-cube__compact-action:focus-visible,.mhu-cube__unpositioned-button:focus-visible{outline-color:highlight}}", t = ".mhu-cube__intro-attribution{font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem);margin-top:auto;padding-top:1rem}.mhu-cube__intro-attribution a{color:var(--_primary)}.mhu-cube__intro-attribution a:focus-visible{outline:3px solid var(--_focus);outline-offset:3px}.mhu-cube__intro-dimensions{margin:0}.mhu-cube__intro-dimensions-header,.mhu-cube__intro-dimensions-row{grid-template-columns:minmax(7rem,32%) minmax(0,1fr);gap:.75rem;display:grid}.mhu-cube__intro-dimensions-header{border-bottom:1px solid var(--_outline-variant);color:var(--_on-surface);margin-top:1.5rem;padding-bottom:.5rem;font-weight:600}.mhu-cube__intro-dimensions-row{border-bottom:1px solid var(--_outline-variant);padding:.5rem 0}.mhu-cube__intro-dimensions-row:last-child{border-bottom:0}.mhu-cube__intro-dimensions dt,.mhu-cube__intro-dimensions dd{overflow-wrap:anywhere;min-width:0;margin:0}.mhu-cube__intro-dimensions dt{color:var(--_on-surface);white-space:nowrap;font-weight:500}.mhu-cube__intro-dimensions dd{color:var(--_on-surface-variant)}.mhu-cube--has-selection .mhu-cube__intro-dimensions-header,.mhu-cube--has-selection .mhu-cube__intro-dimensions{display:none}.mhu-cube__details{margin:1.5rem 0 0}.mhu-cube__details-header{grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:.75rem;display:grid}.mhu-cube__details-close{width:2.75rem;height:2.75rem;min-height:2.75rem;color:var(--_on-surface);cursor:pointer;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:grid}.mhu-cube__details-close:hover{background:color-mix(in srgb, var(--_on-surface) 8%, transparent)}.mhu-cube__details-close:focus-visible{outline:3px solid var(--_focus);outline-offset:2px;background:color-mix(in srgb, var(--_on-surface) 10%, transparent)}.mhu-cube__details-close:active{background:color-mix(in srgb, var(--_on-surface) 10%, transparent)}.mhu-cube__details-close-icon{fill:currentColor;width:1.5rem;height:1.5rem;display:block}.mhu-cube__details-metadata{font-family:var(--mat-sys-body-medium-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-medium-size,.875rem);font-weight:var(--mat-sys-body-medium-weight,400);line-height:var(--mat-sys-body-medium-line-height,1.25rem);letter-spacing:var(--mat-sys-body-medium-tracking,.015625rem);margin:1.5rem 0 0}.mhu-cube__details-metadata-row{border-bottom:1px solid var(--_outline-variant);grid-template-columns:minmax(5.5rem,38%) minmax(0,1fr);gap:.75rem;padding:.5rem 0;display:grid}.mhu-cube__details-metadata-row:last-child{border-bottom:0}.mhu-cube__details-metadata dt,.mhu-cube__details-metadata dd{overflow-wrap:anywhere;min-width:0;margin:0}.mhu-cube__details-metadata dt{color:var(--_on-surface);font-weight:500}.mhu-cube__details-metadata dd{color:var(--_on-surface-variant)}.mhu-cube__details-card>.mhu-cube__details-metadata,.mhu-cube__details-card>.mhu-cube__details-action{margin-top:1rem}@container mhu-cube-host (width<=64rem){.mhu-cube__compact-card .mhu-cube__details-metadata{margin-top:0}}@media (forced-colors:active){.mhu-cube__intro-dimensions-header,.mhu-cube__intro-dimensions-row,.mhu-cube__details-metadata-row{border-color:canvastext}.mhu-cube__details-close{color:buttontext;border:1px solid buttontext}}", n = {
	eyebrow: "Organ imaging datasets",
	heading: "Explore multiscale human data",
	visualization: {
		description: "This visualization compares datasets across time, space, and organ. Select a block to view its details.",
		dimensionHeadings: ["Dimension", "What it represents"],
		dimensions: [
			{
				term: "Time",
				description: "Donor age in years; taller blocks span an age range"
			},
			{
				term: "Space",
				description: "Physical scale the dataset captures"
			},
			{
				term: "Organ",
				description: "Tissue source, listed alphabetically"
			}
		],
		attribution: {
			beforeLink: "Inspired by ",
			linkText: "Metacube",
			afterLink: " from the Chair for Clinical Bioinformatics.",
			href: "https://github.com/Chair-for-Clinical-Bioinformatics/metacube"
		}
	},
	compactDescription: "Browse organ-imaging datasets and compare their time (donor age), space (spatial scale), organ, and other available details. Use each card to open its metadata."
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
}, m = .7, h = .02, g = .02, _ = 12, v = 88;
function y(e, t) {
	return t > 0 ? (e + .5) / t : .5;
}
function b(e, t, n) {
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
function x(e, t, n) {
	let r = b(p.top, e, n), i = b(p.bottom, e, n);
	return {
		x: i.x + (r.x - i.x) * t,
		y: i.y + (r.y - i.y) * t
	};
}
function S(e, t) {
	return (e - t.min) / (t.max - t.min);
}
function C(e, t) {
	return .5 / Math.max(e, t, 1) * m;
}
function ee(e, t, n) {
	let r = S(e.start, t), i = S(e.end, t);
	if (i - r >= n) return {
		y0: r,
		y1: i
	};
	let a = Math.min(n, 1), o = Math.min(Math.max((r + i) / 2 - a / 2, 0), 1 - a);
	return {
		y0: o,
		y1: o + a
	};
}
function te(e) {
	let t = {
		topFront: x(e.x0, e.y1, e.z0),
		topLeft: x(e.x1, e.y1, e.z0),
		topBack: x(e.x1, e.y1, e.z1),
		topRight: x(e.x0, e.y1, e.z1),
		bottomFront: x(e.x0, e.y0, e.z0),
		bottomLeft: x(e.x1, e.y0, e.z0),
		bottomRight: x(e.x0, e.y0, e.z1)
	}, n = Object.values(t), r = .3, i = Math.min(...n.map((e) => e.x)) - r, a = Math.min(...n.map((e) => e.y)) - r, o = Math.max(...n.map((e) => e.x)) + r, s = Math.max(...n.map((e) => e.y)) + r;
	return {
		corners: t,
		bounds: {
			left: i,
			top: a,
			width: o - i,
			height: s - a
		}
	};
}
function w(e, t) {
	return e < t ? -1 : e > t ? 1 : 0;
}
function T(e, t) {
	return e.map((e, t) => ({
		item: e,
		index: t
	})).sort((e, n) => {
		let r = e.item.position, i = n.item.position;
		return !r || !i ? r ? -1 : i ? 1 : e.index - n.index : t.organ.values.indexOf(r.organ) - t.organ.values.indexOf(i.organ) || t.space.values.indexOf(r.space) - t.space.values.indexOf(i.space) || r.time.start - i.time.start || r.time.end - i.time.end || w(e.item.id, n.item.id);
	}).map(({ item: e }) => e);
}
function E(e, t) {
	let n = [];
	e.forEach((e) => {
		let t = n.find((t) => e.y0 >= t.end + g);
		t || (t = {
			end: -Infinity,
			tallest: 0,
			members: []
		}, n.push(t)), t.end = e.y1, t.tallest = Math.max(t.tallest, e.y1 - e.y0), t.members.push(e);
	}), n.map((e, t) => ({
		lane: e,
		index: t
	})).sort((e, t) => t.lane.tallest - e.lane.tallest || e.index - t.index).forEach(({ lane: e }, r) => {
		e.members.forEach((e) => t.set(e.id, {
			lane: r,
			laneCount: n.length
		}));
	});
}
function D(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
	return e.forEach((e) => {
		let t = `${e.spaceIndex}:${e.organIndex}`;
		n.set(t, [...n.get(t) ?? [], e]);
	}), n.forEach((e) => {
		e.sort((e, t) => e.y0 - t.y0 || e.y1 - t.y1 || w(e.id, t.id));
		let n = [], r = -Infinity;
		e.forEach((e) => {
			n.length > 0 && e.y0 >= r + g && (E(n, t), n = []), r = n.length === 0 ? e.y1 : Math.max(r, e.y1), n.push(e);
		}), n.length > 0 && E(n, t);
	}), t;
}
function O(e, t, n, r) {
	if (r.laneCount === 1) return [e - t, e + t];
	let i = Math.min(2 * t * (1 + .5 * (r.laneCount - 1)), n * .8), a = (i - h * (r.laneCount - 1)) / r.laneCount, o = e + i / 2 - r.lane * (a + h);
	return [o - a, o];
}
function ne(e, t) {
	let n = t.space.values.length, r = t.organ.values.length, i = C(n, r), a = [];
	e.forEach((e) => {
		if (!e.position) return;
		let n = t.space.values.indexOf(e.position.space), r = t.organ.values.indexOf(e.position.organ);
		n < 0 || r < 0 || a.push({
			id: e.id,
			spaceIndex: n,
			organIndex: r,
			...ee(e.position.time, t.time, i * 2)
		});
	});
	let o = D(a), s = a.map((e) => {
		let t = 1 - y(e.spaceIndex, n), a = y(e.organIndex, r), [s, c] = O(t, i, 1 / n, o.get(e.id) ?? {
			lane: 0,
			laneCount: 1
		}), l = {
			x0: s,
			x1: c,
			y0: e.y0,
			y1: e.y1,
			z0: a - i,
			z1: a + i
		};
		return {
			id: e.id,
			box: l,
			cellDepth: t + a
		};
	});
	s.sort((e, t) => t.cellDepth - e.cellDepth || t.box.x0 + t.box.x1 - (e.box.x0 + e.box.x1) || e.box.y0 - t.box.y0 || w(e.id, t.id));
	let c = /* @__PURE__ */ new Map();
	return s.forEach(({ id: e, box: t }, n) => {
		let r = te(t), { bounds: i } = r, a = x((t.x0 + t.x1) / 2, t.y1, (t.z0 + t.z1) / 2), o = Math.min(Math.max(a.y, _), v);
		c.set(e, {
			box: t,
			geometry: r,
			layer: n + 1,
			cardSide: i.left + i.width / 2 > 66 ? "left" : "right",
			cardTop: (o - i.top) / i.height * 100
		});
	}), c;
}
//#endregion
//#region packages/mhu-cube/src/mhu-cube-visualization.ts
var k = "http://www.w3.org/2000/svg", A = 1e3, j = 868, M = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });
function N(e, t) {
	let n = document.createElementNS(k, e);
	return Object.entries(t).forEach(([e, t]) => n.setAttribute(e, t)), n;
}
function re(e, t) {
	if (e.label) return e.label;
	let n = e.start === e.end ? M.format(e.start) : `${M.format(e.start)}–${M.format(e.end)}`;
	return t.unit ? `${n} ${t.unit}` : n;
}
function ie(e) {
	let t = (e) => `${e.x * A / 100} ${e.y * j / 100}`;
	return N("path", {
		class: "mhu-cube__frame-guide",
		d: (e.ticks ?? []).filter((t) => t > e.min && t < e.max).map((n) => {
			let r = S(n, e);
			return `M${t(x(1, r, 0))}L${t(x(1, r, 1))}L${t(x(0, r, 1))}`;
		}).join("")
	});
}
function ae(e) {
	let t = N("svg", {
		class: "mhu-cube__frame",
		viewBox: `0 0 ${A} ${j}`,
		preserveAspectRatio: "xMidYMid meet",
		"aria-hidden": "true"
	});
	return t.append(ie(e.time), N("path", {
		class: "mhu-cube__frame-line",
		d: "M573 5 152 103 573 276 995 103 573 5M152 103 224 586 573 861 925 586 995 103M573 276 573 861M573 5 573 405M224 586 573 405 925 586"
	})), t;
}
function oe(e) {
	let t = document.createElement("div");
	t.className = "mhu-cube__axes", t.setAttribute("aria-hidden", "true");
	let n = (e, n, r) => {
		let i = document.createElement("span");
		i.className = n, i.textContent = e, i.style.left = `${r.x}%`, i.style.top = `${r.y}%`, t.append(i);
	};
	return n(e.time.unit ? `${e.time.label} (${e.time.unit})` : e.time.label, "mhu-cube__axis-title mhu-cube__axis-title--time", {
		x: 4.5,
		y: 5
	}), n(e.space.label, "mhu-cube__axis-title mhu-cube__axis-title--space", {
		x: 30,
		y: 89
	}), n(e.organ.label, "mhu-cube__axis-title mhu-cube__axis-title--organ", {
		x: 84.5,
		y: 91.5
	}), (e.time.ticks ?? []).forEach((t) => {
		let r = x(1, S(t, e.time), 0);
		n(M.format(t), "mhu-cube__axis-value mhu-cube__axis-value--time", {
			x: r.x - 5,
			y: r.y
		});
	}), e.space.values.forEach((t, r) => {
		let i = x(1 - y(r, e.space.values.length), 0, 0);
		n(t, "mhu-cube__axis-value mhu-cube__axis-value--space", {
			x: i.x - 4.5,
			y: i.y + 1.8
		});
	}), e.organ.values.forEach((t, r) => {
		let i = x(0, 0, y(r, e.organ.values.length));
		n(t, "mhu-cube__axis-value mhu-cube__axis-value--organ", {
			x: i.x + 2.5,
			y: i.y + 1.7
		});
	}), t;
}
function se({ corners: e, bounds: t }) {
	let n = (...e) => e.map((e) => `${e.x},${e.y}`).join(" "), r = (...e) => e.map((e, t) => `${t === 0 ? "M" : "L"}${e.x} ${e.y}`).join(""), i = N("svg", {
		class: "mhu-cube__cube",
		viewBox: `${t.left} ${t.top} ${t.width} ${t.height}`,
		preserveAspectRatio: "none",
		"aria-hidden": "true"
	}), a = [
		e.topFront,
		e.topLeft,
		e.topBack,
		e.topRight
	], o = [
		e.topFront,
		e.topLeft,
		e.bottomLeft,
		e.bottomFront
	], s = [
		e.topFront,
		e.topRight,
		e.bottomRight,
		e.bottomFront
	];
	return i.append(N("polygon", {
		class: "mhu-cube__top",
		points: n(...a),
		"vector-effect": "non-scaling-stroke"
	}), N("polygon", {
		class: "mhu-cube__left",
		points: n(...o),
		"vector-effect": "non-scaling-stroke"
	}), N("polygon", {
		class: "mhu-cube__right",
		points: n(...s),
		"vector-effect": "non-scaling-stroke"
	}), N("path", {
		class: "mhu-cube__edge",
		d: [
			r(e.topFront, e.topBack),
			r(e.topLeft, e.topRight),
			r(e.topFront, e.bottomLeft),
			r(e.topLeft, e.bottomFront),
			r(e.topFront, e.bottomRight),
			r(e.topRight, e.bottomFront)
		].join(""),
		"vector-effect": "non-scaling-stroke"
	})), i;
}
function ce(e) {
	let t = document.createElement("p");
	t.className = "mhu-cube__sr-only";
	let n = e.time.unit ? ` ${e.time.unit}` : "";
	return t.textContent = [
		`${e.time.label}: ${M.format(e.time.min)} to ${M.format(e.time.max)}${n}`,
		`${e.space.label}: ${e.space.values.join(", ")}`,
		`${e.organ.label}: ${e.organ.values.join(", ")}`
	].join(". "), t;
}
function P(e, t) {
	let n = Object.entries(e.metadata ?? {}).filter((e) => e[1] !== null && e[1] !== void 0).map(([e, t]) => `${e}: ${t}`), r = e.position, i = r ? [
		`${t.time.label}: ${re(r.time, t.time)}`,
		`${t.space.label}: ${r.space}`,
		`${t.organ.label}: ${r.organ}`
	] : [], a = e.status ?? "available", o = a === "current" ? "Current page" : a === "unavailable" ? "Metadata unavailable" : "Metadata available";
	return `${[
		n.length > 0 ? n.join(", ") : "No dataset details provided",
		i.length > 0 ? `Visualization position: ${i.join(", ")}` : "Visualization position not provided",
		o
	].join(". ")}.`;
}
//#endregion
//#region packages/mhu-cube/src/details-transition.ts
var le = 90, F = 140, I = class {
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
			duration: le,
			easing: "ease-out",
			fill: "forwards"
		});
		this.#e = r, r.finished.then(() => {
			if (n !== this.#t) return;
			t();
			let i = e.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: F,
				easing: "ease-in",
				fill: "forwards"
			});
			r.cancel(), this.#e = i, i.finished.then(() => {
				n === this.#t && (i.cancel(), this.#e = null);
			}).catch(() => void 0);
		}).catch(() => void 0);
	}
}, L = {
	time: {
		label: "Time",
		min: 0,
		max: 0,
		ticks: []
	},
	space: {
		label: "Space",
		values: []
	},
	organ: {
		label: "Organ",
		values: []
	}
}, R = new Set([
	"available",
	"current",
	"unavailable"
]), z = 5, B = new Intl.Collator("en", {
	sensitivity: "base",
	numeric: !0
});
function V(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function H(e) {
	return typeof e == "number" && Number.isFinite(e);
}
function U(e) {
	return !("time" in e || "space" in e || "organ" in e) && ("x" in e || "y" in e || "z" in e);
}
function W(e, t, n, r, i) {
	return {
		code: e,
		message: t,
		path: n,
		severity: r,
		...i ? { itemId: i } : {}
	};
}
function ue(e, t) {
	return B.compare(e, t) || (e < t ? -1 : e > t ? 1 : 0);
}
function de(e) {
	return e.time.max > e.time.min && e.space.values.length > 0 && e.organ.values.length > 0;
}
function G(e) {
	let t = e.trim();
	if (!t) return !1;
	try {
		let e = new URL(t, "https://mhu-cube.invalid/");
		return e.protocol === "http:" || e.protocol === "https:";
	} catch {
		return !1;
	}
}
function K(e, t, n, r) {
	let i = typeof e.label == "string" ? e.label.trim() : "";
	return i || r.push(W("axis.label.invalid", `${t} axis is using a fallback label.`, `${n}.label`, "warning")), i || t;
}
function q(e, t, n, r) {
	let i = `axes.${t}`;
	if (!V(e)) return r.push(W("axis.invalid", `${n} axis must provide a label and values.`, i, "error")), {
		label: n,
		values: []
	};
	let a = K(e, n, i, r), o = e.values;
	if (!Array.isArray(o) || o.length === 0) return r.push(W("axis.values.invalid", `${a} must provide at least one value.`, `${i}.values`, "error")), {
		label: a,
		values: []
	};
	if (!o.every((e) => typeof e == "string" && e.trim().length > 0)) return r.push(W("axis.value.invalid", `${a} contains an empty or non-text value.`, `${i}.values`, "error")), {
		label: a,
		values: []
	};
	let s = o.map((e) => e.trim());
	return s.some((e, t) => s.findIndex((t) => B.compare(e, t) === 0) !== t) ? (r.push(W("axis.values.duplicate", `${a} contains duplicate values and cannot be plotted safely.`, `${i}.values`, "error")), {
		label: a,
		values: []
	}) : {
		label: a,
		values: t === "organ" ? s.sort(ue) : s
	};
}
function fe(e, t) {
	let n = "axes.time";
	if (!V(e)) return t.push(W("axis.invalid", "Time axis must provide a label, min, and max.", n, "error")), {
		...L.time,
		ticks: []
	};
	let r = K(e, "Time", n, t), i;
	e.unit !== void 0 && (typeof e.unit == "string" && e.unit.trim() ? i = e.unit.trim() : t.push(W("axis.time.unit.invalid", "Time unit must be nonempty text and was omitted.", `${n}.unit`, "warning")));
	let a = i ? { unit: i } : {}, { min: o, max: s } = e;
	if (!H(o) || !H(s) || o >= s) return t.push(W("axis.time.range.invalid", `${r} needs finite min and max values with min less than max.`, n, "error")), {
		label: r,
		...a,
		min: 0,
		max: 0,
		ticks: []
	};
	let c = Array.from({ length: z + 1 }, (e, t) => o + (s - o) * t / z);
	if (e.ticks !== void 0) {
		let i = e.ticks;
		Array.isArray(i) && i.length > 0 && i.every((e) => H(e) && e >= o && e <= s) ? c = [...new Set(i)].sort((e, t) => e - t) : t.push(W("axis.time.ticks.invalid", `${r} ticks must be numbers between min and max; default ticks are used.`, `${n}.ticks`, "warning"));
	}
	return {
		label: r,
		...a,
		min: o,
		max: s,
		ticks: c
	};
}
function J(e) {
	if (!V(e)) return {
		value: L,
		issues: [W("axes.invalid", "Axes must be an object with time, space, and organ definitions.", "axes", "error")]
	};
	if (U(e)) return {
		value: L,
		issues: [W("axes.invalid", "Axes use the retired x, y, and z format; provide time, space, and organ definitions.", "axes", "error")]
	};
	let t = [];
	return {
		value: {
			time: fe(e.time, t),
			space: q(e.space, "space", "Space", t),
			organ: q(e.organ, "organ", "Organ", t)
		},
		issues: t
	};
}
function pe(e, t, n, r) {
	if (e === void 0) return;
	if (!V(e)) {
		r.push(W("item.metadata.invalid", "Metadata must be an object.", t, "warning", n));
		return;
	}
	let i = {};
	return Object.entries(e).forEach(([e, a]) => {
		if (!e.trim()) {
			r.push(W("item.metadata.key.invalid", "Metadata field with an empty name was omitted.", t, "warning", n));
			return;
		}
		typeof a == "string" || typeof a == "number" && Number.isFinite(a) || a == null ? i[e] = a : r.push(W("item.metadata.value.invalid", `Metadata field “${e}” was omitted because its value is unsupported.`, `${t}.${e}`, "warning", n));
	}), i;
}
function me(e, t, n, r, i) {
	if (!V(e) || !H(e.start) || !H(e.end) || e.start > e.end) {
		i.push(W("item.position.time.invalid", "Time must provide finite start and end values with start no later than end; the dataset will not be plotted.", n, "warning", r));
		return;
	}
	let a;
	if (e.label !== void 0 && (typeof e.label == "string" && e.label.trim() ? a = e.label.trim() : i.push(W("item.position.time.label.invalid", "Time label must be nonempty text; formatted values are shown instead.", `${n}.label`, "warning", r))), !(t.max > t.min) || e.start < t.min || e.end > t.max) {
		i.push(W("item.position.time.out-of-range", "Time falls outside the configured time axis; the dataset will not be plotted.", n, "warning", r));
		return;
	}
	return {
		start: e.start,
		end: e.end,
		...a ? { label: a } : {}
	};
}
function Y(e, t, n, r, i, a) {
	let o = typeof e == "string" ? e.trim() : "";
	if (t.values.includes(o)) return o;
	let s = o ? `${t.label} “${o}” does not match a configured value; the dataset will not be plotted.` : `Position is missing a ${t.label.toLowerCase()} value; the dataset will not be plotted.`;
	a.push(W(`item.position.${n}.unknown`, s, r, "warning", i));
}
function he(e, t, n, r, i) {
	if (e == null) {
		i.push(W("item.position.missing", "Dataset is available but will not be plotted because it has no position.", n, "warning", r));
		return;
	}
	if (!V(e)) {
		i.push(W("item.position.invalid", "Position must provide time, space, and organ.", n, "warning", r));
		return;
	}
	if (U(e)) {
		i.push(W("item.position.invalid", "Position uses the retired x, y, and z index format; provide time, space, and organ instead.", n, "warning", r));
		return;
	}
	let a = me(e.time, t.time, `${n}.time`, r, i), o = Y(e.space, t.space, "space", `${n}.space`, r, i), s = Y(e.organ, t.organ, "organ", `${n}.organ`, r, i);
	return a && o && s ? {
		time: a,
		space: o,
		organ: s
	} : void 0;
}
function X(e, t) {
	let n = [];
	if (!Array.isArray(e)) return {
		value: [],
		issues: [W("items.invalid", "Items must be an array.", "items", "error")]
	};
	let r = /* @__PURE__ */ new Set(), i = [];
	return e.forEach((e, a) => {
		let o = `items[${a}]`;
		if (!V(e)) {
			n.push(W("item.invalid", "Dataset must be an object and was excluded.", o, "error"));
			return;
		}
		let s = typeof e.id == "string" ? e.id.trim() : "";
		if (!s) {
			n.push(W("item.id.invalid", "Dataset requires a nonempty text ID and was excluded.", `${o}.id`, "error"));
			return;
		}
		if (r.has(s)) {
			n.push(W("item.id.duplicate", `Duplicate dataset ID “${s}” was excluded.`, `${o}.id`, "error", s));
			return;
		}
		r.add(s);
		let c = typeof e.label == "string" ? e.label.trim() : "", l = c || s;
		c || n.push(W("item.label.invalid", "Dataset label is missing; its ID is shown instead.", `${o}.label`, "warning", s));
		let u;
		e.href !== void 0 && (typeof e.href == "string" && G(e.href) ? u = e.href.trim() : n.push(W("item.href.unsafe", "Metadata destination was removed because it is invalid or uses an unsafe protocol.", `${o}.href`, "error", s)));
		let d = "available";
		e.status !== void 0 && (typeof e.status == "string" && R.has(e.status) ? d = e.status : n.push(W("item.status.invalid", "Unknown status was replaced with “available”.", `${o}.status`, "warning", s))), !u && d === "available" && (d = "unavailable", n.push(W("item.href.missing", "Dataset has no metadata destination and is treated as unavailable.", `${o}.href`, "warning", s)));
		let f = pe(e.metadata, `${o}.metadata`, s, n), p = he(e.position, t, `${o}.position`, s, n);
		i.push({
			id: s,
			label: l,
			...u ? { href: u } : {},
			...f ? { metadata: f } : {},
			...p ? { position: p } : {},
			status: d
		});
	}), {
		value: i,
		issues: n
	};
}
//#endregion
//#region packages/mhu-cube/src/mhu-cube.ts
var Z = "mhu-cube-selection-change", Q = "mhu-cube-validation", ge = typeof HTMLElement > "u" ? class {} : HTMLElement, _e = 0, $ = class extends ge {
	static observedAttributes = [
		"items",
		"axes",
		"label"
	];
	#e = [];
	#t = [];
	#n = L;
	#r = [];
	#i = [];
	#a = [];
	#o = null;
	#s = this.attachShadow({ mode: "open" });
	#c = `mhu-cube-${++_e}`;
	#l = null;
	#u = null;
	#d = null;
	#f = null;
	#p = `${this.#c}-details`;
	#m = `${this.#c}-details-heading`;
	#h = !1;
	#g = !1;
	#_ = new I();
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
		let e = X(this.#e, this.#n);
		this.#t = e.value, this.#i = e.issues, this.#t.some((e) => e.id === this.#o) || (this.#o = null);
	}
	#b(e) {
		let t = J(e);
		this.#n = t.value, this.#r = t.issues, this.#y();
	}
	#x(e, t) {
		this.#a = this.#a.filter((t) => t.path !== e);
		let n = this.getAttribute(e);
		if (n === null) {
			t && (e === "axes" ? this.#b(L) : (this.#e = [], this.#y()));
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
		this.isConnected && this.dispatchEvent(new CustomEvent(Q, {
			bubbles: !0,
			composed: !0,
			detail: { issues: this.validationIssues }
		}));
	}
	#C(e, t) {
		let n = this.#o !== e.id;
		this.#o = e.id, this.#E(), n && this.#u ? this.#_.run(this.#u, () => {
			this.#u && (d(this.#u, e, this.#m, () => this.#w()), t && this.#u.querySelector(".mhu-cube__details-action")?.focus());
		}) : t && this.#u?.querySelector(".mhu-cube__details-action")?.focus(), this.dispatchEvent(new CustomEvent(Z, {
			bubbles: !0,
			composed: !0,
			detail: { item: e }
		}));
	}
	#w() {
		let e = this.#o;
		if (!e || !this.#u) return;
		let t = [...this.#s.querySelectorAll("[data-item-id]")].find((t) => t.dataset.itemId === e);
		this.#_.cancel(), this.#o = null, this.#E(), d(this.#u, null, this.#m, () => this.#w()), t?.focus(), this.dispatchEvent(new CustomEvent(Z, {
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
			i.className = "mhu-cube__sr-only", i.id = `${this.#c}-unpositioned-${n}-description`, i.textContent = P(e, this.#n);
			let o = document.createElement("button");
			o.className = "mhu-cube__unpositioned-button", o.textContent = e.label, this.#D(o, e, i.id), r.append(i, o), a.append(r);
		}), n.append(r, i, a), n;
	}
	#k() {
		if ((!this.#l || !this.#u || !this.#d || !this.#f) && this.#T(), !this.#l || !this.#u || !this.#d || !this.#f) return;
		this.#l.setAttribute("aria-label", this.getAttribute("label") ?? "Metadata datasets"), this.#d.querySelector(".mhu-cube__unpositioned")?.remove();
		let e = de(this.#n);
		if (e) this.#f.replaceChildren(ae(this.#n), oe(this.#n), ce(this.#n));
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
		let r = new Map(this.#t.map((e, t) => [e.id, t])), i = e ? ne(this.#t, this.#n) : /* @__PURE__ */ new Map();
		T(this.#t, this.#n).forEach((e) => {
			let t = r.get(e.id) ?? 0, a = e.status ?? "available", o = e.id === this.#o, s = document.createElement("li");
			s.className = `mhu-cube__item mhu-cube__item--${a}`, o && s.classList.add("mhu-cube__item--selected");
			let c = i.get(e.id);
			if (!c) {
				s.classList.add("mhu-cube__item--unpositioned"), s.append(f(e)), n.append(s);
				return;
			}
			let { bounds: u } = c.geometry;
			s.classList.add(`mhu-cube__item--card-${c.cardSide}`), s.style.setProperty("--cube-left", `${u.left}%`), s.style.setProperty("--cube-top", `${u.top}%`), s.style.setProperty("--cube-width", `${u.width}%`), s.style.setProperty("--cube-height", `${u.height}%`), s.style.setProperty("--cube-layer", String(c.layer)), s.style.setProperty("--card-top", `${c.cardTop}%`);
			let d = document.createElement("button");
			d.className = "mhu-cube__select";
			let p = document.createElement("span");
			p.className = "mhu-cube__sr-only", p.id = `${this.#c}-item-${t}-description`, p.textContent = P(e, this.#n), this.#D(d, e, p.id), d.append(se(c.geometry), l(e)), s.append(p, d, f(e)), n.append(s);
		}), this.#f.append(n);
		let a = this.#t.filter((e) => !i.has(e.id));
		a.length > 0 && this.#d.append(this.#O(a, r));
	}
};
function ve() {
	typeof customElements > "u" || customElements.get("mhu-cube") || customElements.define("mhu-cube", $);
}
//#endregion
export { Z as MHU_CUBE_SELECTION_EVENT, Q as MHU_CUBE_VALIDATION_EVENT, $ as MhuCube, ve as defineMhuCube, G as isSafeMetadataHref, J as validateAxes, X as validateItems };

//# sourceMappingURL=mhu-cube.js.map