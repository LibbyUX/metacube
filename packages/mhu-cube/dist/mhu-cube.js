//#region packages/mhu-cube/src/mhu-cube.css?inline
var e = ":host{--_surface:var(--mhu-cube-surface,var(--mat-sys-surface,#fcfcfc));--_surface-container:var(--mhu-cube-surface-container,var(--mat-sys-surface-container,#eceff1));--_on-surface:var(--mhu-cube-on-surface,var(--mat-sys-on-surface,#1d2429));--_on-surface-variant:var(--mhu-cube-on-surface-variant,var(--mat-sys-on-surface-variant,#354b57));--_primary:var(--mhu-cube-primary,var(--mat-sys-primary,#8b1510));--_on-primary:var(--mhu-cube-on-primary,var(--mat-sys-on-primary,#fff));--_primary-container:var(--mhu-cube-primary-container,var(--mat-sys-primary-container,#ffdad5));--_on-primary-container:var(--mhu-cube-on-primary-container,var(--mat-sys-on-primary-container,#6b0f0a));--_outline:var(--mhu-cube-outline,var(--mat-sys-outline,#6c7f8a));--_outline-variant:var(--mhu-cube-outline-variant,var(--mat-sys-outline-variant,#c0cbd1));--_focus:var(--mhu-cube-focus,var(--mat-sys-primary,#8b1510));box-sizing:border-box;width:100%;min-width:0;max-width:100%;color:var(--_on-surface);font-family:var(--mat-sys-body-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-large-size,1rem);font-weight:var(--mat-sys-body-large-weight,400);line-height:var(--mat-sys-body-large-line-height,1.5rem);letter-spacing:var(--mat-sys-body-large-tracking,.03125rem);display:block;container:mhu-cube-host/inline-size}*{box-sizing:border-box}.mhu-cube{background:var(--_surface);grid-template:\"content stage\"minmax(0,1fr)/minmax(22rem,28rem) minmax(0,1fr);gap:clamp(1.5rem,3vw,4rem);width:100%;height:100%;min-height:36rem;padding:clamp(1.5rem,3vw,3rem);display:grid;overflow:visible}.mhu-cube__content{flex-direction:column;grid-area:content;align-self:stretch;gap:clamp(1.5rem,3vh,2.5rem);width:100%;height:100%;min-height:0;padding:0 0 1rem;display:flex}.mhu-cube__stage{grid-area:stage;grid-template-rows:minmax(0,1fr) auto;place-items:center;gap:.75rem;min-width:0;min-height:0;display:grid;container-type:size}.mhu-cube__plot{aspect-ratio:1000/868;width:min(100cqw,115.207cqh);position:relative}.mhu-cube__frame{z-index:0;pointer-events:none;shape-rendering:geometricprecision;width:100%;height:100%;position:absolute;inset:0;overflow:visible}.mhu-cube__frame-line{fill:none;stroke:color-mix(in srgb, var(--_outline) 68%, transparent);stroke-width:1.1px;vector-effect:non-scaling-stroke}.mhu-cube__frame-guide,.mhu-cube__frame-floor-guide{fill:none;stroke:color-mix(in srgb, var(--_outline) 30%, transparent);stroke-width:1px;vector-effect:non-scaling-stroke}.mhu-cube__frame-floor-guide{stroke:color-mix(in srgb, var(--_outline) 45%, transparent)}.mhu-cube__axes{z-index:1;-webkit-user-select:text;user-select:text;position:absolute;inset:0}.mhu-cube__axis-title,.mhu-cube__axis-value{--_align-x:-50%;--_align-y:-50%;--_offset:.5rem;transform:translate(calc(var(--_align-x) + var(--axis-normal-x,0) * var(--_offset)), calc(var(--_align-y) + var(--axis-normal-y,0) * var(--_offset)));white-space:nowrap;position:absolute}.mhu-cube__axis-title{color:var(--_primary);font-family:var(--mat-sys-label-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-large-size,.875rem);font-weight:600;line-height:var(--mat-sys-label-large-line-height,1.25rem);letter-spacing:var(--mat-sys-label-large-tracking,.00625rem)}.mhu-cube__axis-title--time{--_align-x:-100%;--_align-y:calc(-100% - .75rem)}.mhu-cube__axis-value{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);font-weight:var(--mat-sys-body-small-weight,400);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem)}.mhu-cube__axis-title--space,.mhu-cube__axis-title--organ,.mhu-cube__axis-value--space,.mhu-cube__axis-value--organ{text-shadow:-2px -2px 0 var(--_surface), 2px -2px 0 var(--_surface), -2px 2px 0 var(--_surface), 2px 2px 0 var(--_surface)}.mhu-cube__list{z-index:2;pointer-events:none;margin:0;padding:0;list-style:none;position:absolute;inset:0}.mhu-cube__item{top:var(--cube-top);left:var(--cube-left);width:var(--cube-width);height:var(--cube-height);pointer-events:none;position:absolute}.mhu-cube__item--unpositioned{display:none}.mhu-cube__select{width:100%;height:100%;color:inherit;font:inherit;text-align:left;cursor:pointer;pointer-events:none;background:0 0;border:0;margin:0;padding:0;display:block;position:relative}.mhu-cube__select:focus-visible{z-index:999;outline:3px solid var(--_focus);outline-offset:5px}.mhu-cube__shadow{z-index:0;pointer-events:none;width:100%;height:100%;position:absolute;inset:0;overflow:visible}.mhu-cube__shadow-floor{fill:var(--_primary);fill-opacity:.12;stroke:color-mix(in srgb, var(--_primary) 45%, transparent);stroke-width:1px;transition:fill-opacity .17s}.mhu-cube__shadow-drop{fill:none;stroke:color-mix(in srgb, var(--_on-surface) 40%, transparent);stroke-width:1px;stroke-dasharray:3 3}.mhu-cube__time-marker{opacity:0;transition:opacity .12s}.mhu-cube__time-leader{fill:none;stroke:var(--_primary);stroke-width:1.25px;stroke-dasharray:5 3}.mhu-cube__time-bracket{fill:none;stroke:var(--_primary);stroke-width:6px;stroke-linecap:round}.mhu-cube__select:hover .mhu-cube__time-marker,.mhu-cube__select:focus-visible .mhu-cube__time-marker,.mhu-cube__item--selected .mhu-cube__time-marker{opacity:1}.mhu-cube__select:hover .mhu-cube__shadow-floor,.mhu-cube__select:focus-visible .mhu-cube__shadow-floor,.mhu-cube__item--selected .mhu-cube__shadow-floor{fill-opacity:.28}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__shadow{opacity:.35}.mhu-cube--guides-minimal .mhu-cube__frame-floor-guide,.mhu-cube--guides-minimal .mhu-cube__shadow-floor,.mhu-cube--guides-minimal .mhu-cube__shadow-drop{display:none}.mhu-cube__cube{z-index:var(--cube-layer,1);shape-rendering:geometricprecision;width:100%;height:100%;display:block;position:relative;overflow:visible}.mhu-cube__top,.mhu-cube__left,.mhu-cube__right{stroke:color-mix(in srgb, var(--_outline) 75%, transparent);stroke-width:.85px;stroke-linejoin:bevel;pointer-events:fill;transition:fill-opacity .17s,stroke .17s,stroke-width .17s}.mhu-cube__top{fill:var(--_primary);fill-opacity:.4}.mhu-cube__left{fill:var(--_primary);fill-opacity:.5}.mhu-cube__right{fill:var(--_primary);fill-opacity:.64}.mhu-cube__edge{fill:none;stroke:color-mix(in srgb, var(--_on-surface) 38%, transparent);stroke-width:.75px;pointer-events:none;transition:stroke .17s,stroke-width .17s}.mhu-cube__select:hover .mhu-cube__top,.mhu-cube__select:hover .mhu-cube__left,.mhu-cube__select:hover .mhu-cube__right,.mhu-cube__select:focus-visible .mhu-cube__top,.mhu-cube__select:focus-visible .mhu-cube__left,.mhu-cube__select:focus-visible .mhu-cube__right{stroke:var(--_on-surface);stroke-width:2.3px}.mhu-cube__select:hover .mhu-cube__edge,.mhu-cube__select:focus-visible .mhu-cube__edge{stroke:var(--_on-surface);stroke-width:2px}.mhu-cube__select:hover .mhu-cube__top,.mhu-cube__select:focus-visible .mhu-cube__top{fill-opacity:.46}.mhu-cube__select:hover .mhu-cube__left,.mhu-cube__select:focus-visible .mhu-cube__left{fill-opacity:.56}.mhu-cube__select:hover .mhu-cube__right,.mhu-cube__select:focus-visible .mhu-cube__right{fill-opacity:.68}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__top,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__left,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__right,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__edge{stroke:var(--_primary);stroke-width:1.2px}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__top{fill-opacity:.9}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__left{fill-opacity:.96}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__right{fill-opacity:1}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__top{fill-opacity:.08}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__left{fill-opacity:.1}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__right{fill-opacity:.12}.mhu-cube__card{z-index:1000;top:var(--card-top,50%);border:1px solid color-mix(in srgb, var(--_outline) 75%, transparent);opacity:0;background:var(--_surface-container);width:15rem;box-shadow:0 .5rem 1.2rem color-mix(in srgb, var(--_on-surface) 22%, transparent);pointer-events:none;padding:.75rem .85rem;transition:opacity .12s;position:absolute;left:calc(100% + .75rem);transform:translateY(-50%)}.mhu-cube__item--card-left .mhu-cube__card{left:auto;right:calc(100% + .75rem)}.mhu-cube__select:hover .mhu-cube__card,.mhu-cube__select:focus-visible .mhu-cube__card{opacity:1}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__card{opacity:0}.mhu-cube__label{color:var(--_on-surface);font-family:var(--mat-sys-title-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-title-small-size,.875rem);font-weight:var(--mat-sys-title-small-weight,500);line-height:var(--mat-sys-title-small-line-height,1.25rem);letter-spacing:var(--mat-sys-title-small-tracking,.00625rem);display:block}.mhu-cube__metadata{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);font-weight:var(--mat-sys-body-small-weight,400);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem);grid-template-columns:auto 1fr;gap:.2rem .5rem;margin:.5rem 0 0;display:grid}.mhu-cube__metadata-key{font-family:var(--mat-sys-label-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-small-size,.6875rem);font-weight:var(--mat-sys-label-small-weight,500);line-height:var(--mat-sys-label-small-line-height,1rem);letter-spacing:var(--mat-sys-label-small-tracking,.03125rem)}.mhu-cube__metadata-value{overflow-wrap:anywhere;min-width:0}.mhu-cube__status{color:var(--_on-primary-container);font-family:var(--mat-sys-label-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-small-size,.6875rem);font-weight:var(--mat-sys-label-small-weight,500);line-height:var(--mat-sys-label-small-line-height,1rem);letter-spacing:var(--mat-sys-label-small-tracking,.03125rem);text-transform:uppercase;margin-top:.4rem;display:inline-block}.mhu-cube__item--current .mhu-cube__top,.mhu-cube__item--current .mhu-cube__left,.mhu-cube__item--current .mhu-cube__right{stroke:var(--_primary);stroke-width:2.5px}.mhu-cube__item--unavailable .mhu-cube__cube{opacity:.62;filter:grayscale()}.mhu-cube__item--unavailable .mhu-cube__top,.mhu-cube__item--unavailable .mhu-cube__left,.mhu-cube__item--unavailable .mhu-cube__right,.mhu-cube__item--unavailable .mhu-cube__edge{stroke-dasharray:3 2}.mhu-cube__compact-card{display:none}.mhu-cube__unpositioned{border-left:3px solid var(--_outline);background:var(--_surface-container);align-self:end;width:min(100%,38rem);padding:.75rem 1rem}.mhu-cube__unpositioned-heading{font-family:var(--mat-sys-title-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-title-small-size,.875rem);font-weight:var(--mat-sys-title-small-weight,500);line-height:var(--mat-sys-title-small-line-height,1.25rem);letter-spacing:var(--mat-sys-title-small-tracking,.00625rem);margin:0}.mhu-cube__unpositioned-guidance{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);font-weight:var(--mat-sys-body-small-weight,400);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem);margin:.25rem 0 0}.mhu-cube__unpositioned-list{flex-wrap:wrap;gap:.5rem;margin:.625rem 0 0;padding:0;list-style:none;display:flex}.mhu-cube__unpositioned-button{border:1px solid var(--_outline);background:var(--_surface);min-height:2.75rem;color:var(--_on-surface);font-family:var(--mat-sys-label-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-large-size,.875rem);font-weight:var(--mat-sys-label-large-weight,500);line-height:var(--mat-sys-label-large-line-height,1.25rem);letter-spacing:var(--mat-sys-label-large-tracking,.00625rem);cursor:pointer;padding:.625rem .75rem}.mhu-cube__unpositioned-button:hover{background:var(--_primary-container);color:var(--_on-primary-container)}.mhu-cube__unpositioned-button:focus-visible{outline:3px solid var(--_focus);outline-offset:3px}.mhu-cube__unpositioned-item.mhu-cube__item--selected .mhu-cube__unpositioned-button{border-color:var(--_primary);background:var(--_primary-container);color:var(--_on-primary-container);border-width:2px}.mhu-cube__intro{flex-direction:column;height:100%;min-height:0;display:flex}.mhu-cube__intro-eyebrow,.mhu-cube__details-eyebrow{color:var(--_primary);font-family:var(--mat-sys-label-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-small-size,.6875rem);font-weight:600;line-height:var(--mat-sys-label-small-line-height,1rem);letter-spacing:var(--mat-sys-label-small-tracking,.03125rem);text-transform:uppercase;margin:0 0 .5rem}.mhu-cube__intro-heading{font-family:var(--mat-sys-headline-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-headline-large-size,2rem);font-weight:var(--mat-sys-headline-large-weight,600);line-height:var(--mat-sys-headline-large-line-height,2.5rem);letter-spacing:var(--mat-sys-headline-large-tracking,0);white-space:nowrap;margin:0}.mhu-cube__details-heading,.mhu-cube__compact-heading{font-family:var(--mat-sys-title-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-title-large-size,1.375rem);font-weight:500;line-height:var(--mat-sys-title-large-line-height,1.75rem);letter-spacing:var(--mat-sys-title-large-tracking,0);margin:0}.mhu-cube__intro-compact,.mhu-cube__details-unavailable{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-large-size,1rem);font-weight:var(--mat-sys-body-large-weight,400);line-height:var(--mat-sys-body-large-line-height,1.5rem);letter-spacing:var(--mat-sys-body-large-tracking,.03125rem);margin:1rem 0 0}.mhu-cube__intro-visualization{min-height:0;color:var(--_on-surface-variant);font-family:var(--mat-sys-body-medium-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-medium-size,.875rem);font-weight:var(--mat-sys-body-medium-weight,400);line-height:var(--mat-sys-body-medium-line-height,1.25rem);letter-spacing:var(--mat-sys-body-medium-tracking,.015625rem);flex-direction:column;flex:1;margin:.75rem 0 0;display:flex}.mhu-cube__intro-summary,.mhu-cube__intro-attribution{margin:0}.mhu-cube__intro-compact,.mhu-cube__details:empty{display:none}.mhu-cube__details-card,.mhu-cube__compact-card{border:1px solid var(--_outline-variant);background:var(--_surface-container);box-shadow:0 1rem 2.5rem color-mix(in srgb, var(--_on-surface) 10%, transparent)}.mhu-cube__details-card{width:100%;padding:1.25rem}.mhu-cube__details-action,.mhu-cube__compact-action{background:var(--_primary);min-height:2.75rem;color:var(--_on-primary);font-family:var(--mat-sys-label-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-large-size,.875rem);font-weight:var(--mat-sys-label-large-weight,500);line-height:var(--mat-sys-label-large-line-height,1.25rem);letter-spacing:var(--mat-sys-label-large-tracking,.00625rem);white-space:nowrap;justify-content:center;align-items:center;margin-top:1.75rem;padding:.75rem 1rem;text-decoration:none;display:inline-flex}.mhu-cube__details-action:hover,.mhu-cube__compact-action:hover{filter:brightness(.92)}.mhu-cube__details-action:focus-visible,.mhu-cube__compact-action:focus-visible{outline:3px solid var(--_focus);outline-offset:3px}.mhu-cube__empty,.mhu-cube__plot-unavailable{color:var(--_on-surface-variant);text-align:center;place-items:center;margin:0;padding:2rem;display:grid;position:absolute;inset:0}.mhu-cube__sr-only{clip:rect(0, 0, 0, 0);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}@container mhu-cube-host (width<=64rem){.mhu-cube{flex-direction:column;height:auto;min-height:0;padding:clamp(1.5rem,4vw,2.5rem) 0 0;display:flex;overflow:visible}.mhu-cube__content{max-width:45rem;padding:0;display:block}.mhu-cube__intro{height:auto;min-height:0;margin-bottom:2rem;display:block}.mhu-cube__intro-eyebrow{margin:0 0 .875rem}.mhu-cube__intro-heading{font-family:var(--mat-sys-headline-medium-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-headline-medium-size,1.75rem);font-weight:var(--mat-sys-headline-medium-weight,600);line-height:var(--mat-sys-headline-medium-line-height,2.25rem);letter-spacing:var(--mat-sys-headline-medium-tracking,0);white-space:normal}.mhu-cube__intro-visualization{display:none}.mhu-cube__intro-compact{margin-top:.875rem;display:block}.mhu-cube__stage{display:block;container-type:normal}.mhu-cube__plot{aspect-ratio:auto;width:100%;max-height:none}.mhu-cube__frame,.mhu-cube__axes{display:none}.mhu-cube__list{grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;display:grid;position:static}.mhu-cube__item{pointer-events:auto;width:auto;min-width:0;height:auto;display:grid;position:static}.mhu-cube__select{display:none}.mhu-cube__compact-card{flex-direction:column;gap:1.5rem;width:100%;min-width:0;height:100%;padding:1.25rem;display:flex}.mhu-cube__compact-heading{overflow-wrap:anywhere}.mhu-cube__compact-action{align-self:flex-start;margin-top:auto}.mhu-cube__compact-card .mhu-cube__details-unavailable{margin-top:auto}.mhu-cube__details,.mhu-cube__unpositioned{display:none}.mhu-cube__empty,.mhu-cube__plot-unavailable{position:static}}@container mhu-cube-host (width<=40rem){.mhu-cube__list{grid-template-columns:minmax(0,1fr)}}@media (prefers-reduced-motion:reduce){.mhu-cube__top,.mhu-cube__left,.mhu-cube__right,.mhu-cube__edge,.mhu-cube__card,.mhu-cube__shadow-floor,.mhu-cube__time-marker{transition:none}}@media (forced-colors:active){.mhu-cube__frame-line,.mhu-cube__top,.mhu-cube__left,.mhu-cube__right,.mhu-cube__edge{stroke:canvastext}.mhu-cube__frame-guide,.mhu-cube__frame-floor-guide,.mhu-cube__shadow-drop{stroke:graytext}.mhu-cube__shadow-floor{fill:canvas;stroke:graytext}.mhu-cube__time-leader,.mhu-cube__time-bracket{stroke:highlight}.mhu-cube__top,.mhu-cube__left,.mhu-cube__right{fill:canvas;fill-opacity:1}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__top,.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__left,.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__right{fill-opacity:1}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__top,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__left,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__right,.mhu-cube__select:hover .mhu-cube__top,.mhu-cube__select:hover .mhu-cube__left,.mhu-cube__select:hover .mhu-cube__right{fill:highlight;stroke:highlighttext}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__edge,.mhu-cube__select:hover .mhu-cube__edge{stroke:highlighttext}.mhu-cube__item--unavailable .mhu-cube__cube{opacity:1;filter:none}.mhu-cube__card,.mhu-cube__details-card,.mhu-cube__compact-card,.mhu-cube__unpositioned{box-shadow:none;border-color:canvastext}.mhu-cube__details-action,.mhu-cube__compact-action,.mhu-cube__unpositioned-button{border:1px solid buttontext}.mhu-cube__select:focus-visible,.mhu-cube__details-action:focus-visible,.mhu-cube__compact-action:focus-visible,.mhu-cube__unpositioned-button:focus-visible{outline-color:highlight}}", t = ".mhu-cube__intro-attribution{font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem);margin-top:auto;padding-top:1rem}.mhu-cube__intro-attribution a{color:var(--_primary)}.mhu-cube__intro-attribution a:focus-visible{outline:3px solid var(--_focus);outline-offset:3px}.mhu-cube__intro-dimensions{margin:0}.mhu-cube__intro-dimensions-header,.mhu-cube__intro-dimensions-row{grid-template-columns:minmax(7rem,32%) minmax(0,1fr);gap:.75rem;display:grid}.mhu-cube__intro-dimensions-header{border-bottom:1px solid var(--_outline-variant);color:var(--_on-surface);margin-top:1.5rem;padding-bottom:.5rem;font-weight:600}.mhu-cube__intro-dimensions-row{border-bottom:1px solid var(--_outline-variant);padding:.5rem 0}.mhu-cube__intro-dimensions-row:last-child{border-bottom:0}.mhu-cube__intro-dimensions dt,.mhu-cube__intro-dimensions dd{overflow-wrap:anywhere;min-width:0;margin:0}.mhu-cube__intro-dimensions dt{color:var(--_on-surface);white-space:nowrap;font-weight:500}.mhu-cube__intro-dimensions dd{color:var(--_on-surface-variant)}.mhu-cube--has-selection .mhu-cube__intro-dimensions-header,.mhu-cube--has-selection .mhu-cube__intro-dimensions{display:none}.mhu-cube__details{margin:1.5rem 0 0}.mhu-cube__details-header{grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:.75rem;display:grid}.mhu-cube__details-close{width:2.75rem;height:2.75rem;min-height:2.75rem;color:var(--_on-surface);cursor:pointer;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:grid}.mhu-cube__details-close:hover{background:color-mix(in srgb, var(--_on-surface) 8%, transparent)}.mhu-cube__details-close:focus-visible{outline:3px solid var(--_focus);outline-offset:2px;background:color-mix(in srgb, var(--_on-surface) 10%, transparent)}.mhu-cube__details-close:active{background:color-mix(in srgb, var(--_on-surface) 10%, transparent)}.mhu-cube__details-close-icon{fill:currentColor;width:1.5rem;height:1.5rem;display:block}.mhu-cube__details-metadata{font-family:var(--mat-sys-body-medium-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-medium-size,.875rem);font-weight:var(--mat-sys-body-medium-weight,400);line-height:var(--mat-sys-body-medium-line-height,1.25rem);letter-spacing:var(--mat-sys-body-medium-tracking,.015625rem);margin:1.5rem 0 0}.mhu-cube__details-metadata-row{border-bottom:1px solid var(--_outline-variant);grid-template-columns:minmax(5.5rem,38%) minmax(0,1fr);gap:.75rem;padding:.5rem 0;display:grid}.mhu-cube__details-metadata-row:last-child{border-bottom:0}.mhu-cube__details-metadata dt,.mhu-cube__details-metadata dd{overflow-wrap:anywhere;min-width:0;margin:0}.mhu-cube__details-metadata dt{color:var(--_on-surface);font-weight:500}.mhu-cube__details-metadata dd{color:var(--_on-surface-variant)}.mhu-cube__details-card>.mhu-cube__details-metadata,.mhu-cube__details-card>.mhu-cube__details-action{margin-top:1rem}@container mhu-cube-host (width<=64rem){.mhu-cube__compact-card .mhu-cube__details-metadata{margin-top:0}}@media (forced-colors:active){.mhu-cube__intro-dimensions-header,.mhu-cube__intro-dimensions-row,.mhu-cube__details-metadata-row{border-color:canvastext}.mhu-cube__details-close{color:buttontext;border:1px solid buttontext}}", n = {
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
	corner: {
		planes: {
			top: {
				x0z0: {
					x: 57.31,
					y: 19.2
				},
				x1z0: {
					x: 15.15,
					y: 9.6
				},
				x1z1: {
					x: 57.31,
					y: 1.8
				},
				x0z1: {
					x: 99.47,
					y: 9.6
				}
			},
			bottom: {
				x0z0: {
					x: 57.31,
					y: 90.5
				},
				x1z0: {
					x: 19.5,
					y: 77.2
				},
				x1z1: {
					x: 57.31,
					y: 65.8
				},
				x0z1: {
					x: 95.1,
					y: 77.2
				}
			}
		},
		near: [0, 0],
		ticks: [1, 0],
		laneAxis: "x"
	},
	front: {
		planes: {
			top: {
				x0z0: {
					x: 16,
					y: 18
				},
				x1z0: {
					x: 20,
					y: 10
				},
				x1z1: {
					x: 82,
					y: 10
				},
				x0z1: {
					x: 78,
					y: 18
				}
			},
			bottom: {
				x0z0: {
					x: 16,
					y: 86
				},
				x1z0: {
					x: 20,
					y: 78
				},
				x1z1: {
					x: 82,
					y: 78
				},
				x0z1: {
					x: 78,
					y: 86
				}
			}
		},
		near: [0, 1],
		ticks: [0, 0],
		laneAxis: "z"
	}
}, m = .868, ee = .7, te = .07, ne = .9, h = .02, g = .02, re = 12, ie = 88, ae = [
	[[
		0,
		0,
		0
	], [
		1,
		0,
		0
	]],
	[[
		0,
		0,
		1
	], [
		1,
		0,
		1
	]],
	[[
		0,
		1,
		0
	], [
		1,
		1,
		0
	]],
	[[
		0,
		1,
		1
	], [
		1,
		1,
		1
	]],
	[[
		0,
		0,
		0
	], [
		0,
		0,
		1
	]],
	[[
		1,
		0,
		0
	], [
		1,
		0,
		1
	]],
	[[
		0,
		1,
		0
	], [
		0,
		1,
		1
	]],
	[[
		1,
		1,
		0
	], [
		1,
		1,
		1
	]],
	[[
		0,
		0,
		0
	], [
		0,
		1,
		0
	]],
	[[
		1,
		0,
		0
	], [
		1,
		1,
		0
	]],
	[[
		0,
		0,
		1
	], [
		0,
		1,
		1
	]],
	[[
		1,
		0,
		1
	], [
		1,
		1,
		1
	]]
];
function oe(e, t) {
	return t > 0 ? (e + .5) / t : .5;
}
function se(e, t, n) {
	if (t <= 1) return .5;
	let r = Math.min(.5 / t, n + te);
	return r + e * (1 - 2 * r) / (t - 1);
}
function _(e, t, n) {
	let r = {
		x0z0: (1 - t) * (1 - n),
		x1z0: t * (1 - n),
		x1z1: t * n,
		x0z1: (1 - t) * n
	};
	return {
		x: e.x0z0.x * r.x0z0 + e.x1z0.x * r.x1z0 + e.x1z1.x * r.x1z1 + e.x0z1.x * r.x0z1,
		y: e.x0z0.y * r.x0z0 + e.x1z0.y * r.x1z0 + e.x1z1.y * r.x1z1 + e.x0z1.y * r.x0z1
	};
}
function v(e, t, n, r = "corner") {
	let { planes: i } = p[r], a = _(i.top, e, n), o = _(i.bottom, e, n);
	return {
		x: o.x + (a.x - o.x) * t,
		y: o.y + (a.y - o.y) * t
	};
}
function y(e, t) {
	return (e - t.min) / (t.max - t.min);
}
function ce(e, t) {
	return .5 / Math.max(e, t, 1) * ee;
}
function b(e) {
	let t = e.space.values.length, n = e.organ.values.length, r = ce(t, n), i = e.space.values.map((e, n) => se(n, t, r)), a = i.map((e) => 1 - e), o = i.map((e, n) => {
		let r = n === 0 ? 0 : (i[n - 1] + e) / 2;
		return [1 - (n === t - 1 ? 1 : (e + i[n + 1]) / 2), 1 - r];
	}), s = e.organ.values.map((e, t) => oe(t, n));
	return {
		halfSize: r,
		space: a,
		spaceBands: o,
		organ: s,
		organBands: s.map((e) => [e - .5 / n, e + .5 / n])
	};
}
function le(e = "corner") {
	return ae.map(([t, n]) => [v(...t, e), v(...n, e)]);
}
function ue(e, t = "corner") {
	let { near: n, ticks: r } = p[t], i = [n[0] === 0 ? 1 : 0, n[1] === 0 ? 1 : 0];
	return [
		r,
		i,
		[i[0] === r[0] ? n[0] : i[0], i[1] === r[1] ? n[1] : i[1]]
	].map(([n, r]) => v(n, e, r, t));
}
function de(e, t, n = "corner") {
	let r = t.x - e.x, i = (t.y - e.y) * m, a = Math.hypot(r, i) || 1, o = {
		x: i / a,
		y: -r / a
	}, s = v(.5, .5, .5, n), c = {
		x: (e.x + t.x) / 2 - s.x,
		y: ((e.y + t.y) / 2 - s.y) * m
	};
	return o.x * c.x + o.y * c.y < 0 ? {
		x: -o.x,
		y: -o.y
	} : o;
}
function fe(e = "corner") {
	let { near: t, ticks: n } = p[e], r = (t, n) => {
		let r = v(...t, e), i = v(...n, e);
		return {
			start: r,
			end: i,
			normal: de(r, i, e)
		};
	};
	return {
		time: r([
			n[0],
			0,
			n[1]
		], [
			n[0],
			1,
			n[1]
		]),
		space: r([
			0,
			0,
			t[1]
		], [
			1,
			0,
			t[1]
		]),
		organ: r([
			t[0],
			0,
			0
		], [
			t[0],
			0,
			1
		])
	};
}
function pe(e, t, n) {
	let r = y(e.start, t), i = y(e.end, t);
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
function x(e, t) {
	let [n, r] = p[t].near, i = n === 0 ? e.x0 : e.x1, a = n === 0 ? e.x1 : e.x0, o = r === 0 ? e.z0 : e.z1, s = r === 0 ? e.z1 : e.z0;
	return {
		front: [i, o],
		left: [a, o],
		right: [i, s],
		back: [a, s]
	};
}
function me(e, t = "corner") {
	let { front: n, left: r, right: i, back: a } = x(e, t), o = {
		topFront: v(n[0], e.y1, n[1], t),
		topLeft: v(r[0], e.y1, r[1], t),
		topBack: v(a[0], e.y1, a[1], t),
		topRight: v(i[0], e.y1, i[1], t),
		bottomFront: v(n[0], e.y0, n[1], t),
		bottomLeft: v(r[0], e.y0, r[1], t),
		bottomRight: v(i[0], e.y0, i[1], t)
	}, s = Object.values(o), c = .3, l = Math.min(...s.map((e) => e.x)) - c, u = Math.min(...s.map((e) => e.y)) - c, d = Math.max(...s.map((e) => e.x)) + c, f = Math.max(...s.map((e) => e.y)) + c;
	return {
		corners: o,
		bounds: {
			left: l,
			top: u,
			width: d - l,
			height: f - u
		}
	};
}
function S(e, t) {
	return e < t ? -1 : e > t ? 1 : 0;
}
function he(e, t) {
	return e.map((e, t) => ({
		item: e,
		index: t
	})).sort((e, n) => {
		let r = e.item.position, i = n.item.position;
		return !r || !i ? r ? -1 : i ? 1 : e.index - n.index : t.organ.values.indexOf(r.organ) - t.organ.values.indexOf(i.organ) || t.space.values.indexOf(r.space) - t.space.values.indexOf(i.space) || r.time.start - i.time.start || r.time.end - i.time.end || S(e.item.id, n.item.id);
	}).map(({ item: e }) => e);
}
function C(e, t) {
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
function ge(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
	return e.forEach((e) => {
		let t = `${e.spaceIndex}:${e.organIndex}`;
		n.set(t, [...n.get(t) ?? [], e]);
	}), n.forEach((e) => {
		e.sort((e, t) => e.y0 - t.y0 || e.y1 - t.y1 || S(e.id, t.id));
		let n = [], r = -Infinity;
		e.forEach((e) => {
			n.length > 0 && e.y0 >= r + g && (C(n, t), n = []), r = n.length === 0 ? e.y1 : Math.max(r, e.y1), n.push(e);
		}), n.length > 0 && C(n, t);
	}), t;
}
function w(e, t, n, r, i) {
	if (r.laneCount === 1) return [e - t, e + t];
	let a = 2 * Math.min(e - n[0], n[1] - e) * ne, o = Math.min(2 * t * (1 + .5 * (r.laneCount - 1)), a), s = (o - h * (r.laneCount - 1)) / r.laneCount, c = o / 2 - r.lane * (s + h);
	return i === 1 ? [e + c - s, e + c] : [e - c, e - c + s];
}
function T(e, t, n) {
	let [r, i] = p[n].near;
	return Math.abs(e - r) + Math.abs(t - i);
}
function _e(e, t, n) {
	let { front: r, left: i, right: a, back: o } = x(e, n), s = [
		r,
		i,
		o,
		a
	].map(([e, t]) => v(e, 0, t, n)), c = e.y0 > 0 ? [
		r,
		i,
		a
	].map(([t, r]) => [v(t, e.y0, r, n), v(t, 0, r, n)]) : [], [l, u] = p[n].ticks, d = l === 1 ? e.x1 : e.x0, f = u === 1 ? e.z1 : e.z0;
	return {
		floor: s,
		drops: c,
		leaders: (t.start === t.end ? [t.start] : [t.start, t.end]).map((e) => [
			v(d, e, f, n),
			v(l, e, f, n),
			v(l, e, u, n)
		]),
		bracket: [v(l, t.start, u, n), v(l, t.end, u, n)]
	};
}
function ve(e, t, n = "corner") {
	let r = b(t), { halfSize: i } = r, { laneAxis: a, near: o } = p[n], s = [];
	e.forEach((e) => {
		if (!e.position) return;
		let n = t.space.values.indexOf(e.position.space), r = t.organ.values.indexOf(e.position.organ);
		n < 0 || r < 0 || s.push({
			id: e.id,
			spaceIndex: n,
			organIndex: r,
			time: {
				start: y(e.position.time.start, t.time),
				end: y(e.position.time.end, t.time)
			},
			...pe(e.position.time, t.time, i * 2)
		});
	});
	let c = ge(s), l = s.map((e) => {
		let t = r.space[e.spaceIndex], s = r.organ[e.organIndex], l = c.get(e.id) ?? {
			lane: 0,
			laneCount: 1
		}, [u, d] = a === "x" ? w(t, i, r.spaceBands[e.spaceIndex], l, o[0] === 0 ? 1 : 0) : [t - i, t + i], [f, p] = a === "z" ? w(s, i, r.organBands[e.organIndex], l, o[1] === 0 ? 1 : 0) : [s - i, s + i], m = {
			x0: u,
			x1: d,
			y0: e.y0,
			y1: e.y1,
			z0: f,
			z1: p
		};
		return {
			id: e.id,
			box: m,
			time: e.time,
			cellDepth: T(t, s, n),
			laneDepth: T((u + d) / 2, (f + p) / 2, n)
		};
	});
	l.sort((e, t) => t.cellDepth - e.cellDepth || t.laneDepth - e.laneDepth || e.box.y0 - t.box.y0 || S(e.id, t.id));
	let u = /* @__PURE__ */ new Map();
	return l.forEach(({ id: e, box: t, time: r }, i) => {
		let a = me(t, n), { bounds: o } = a, s = v((t.x0 + t.x1) / 2, t.y1, (t.z0 + t.z1) / 2, n), c = Math.min(Math.max(s.y, re), ie);
		u.set(e, {
			box: t,
			time: r,
			geometry: a,
			..._e(t, r, n),
			layer: i + 1,
			cardSide: o.left + o.width / 2 > 66 ? "left" : "right",
			cardTop: (c - o.top) / o.height * 100
		});
	}), u;
}
//#endregion
//#region packages/mhu-cube/src/mhu-cube-visualization.ts
var ye = "http://www.w3.org/2000/svg", E = new Intl.NumberFormat("en", { maximumFractionDigits: 2 }), D = .15;
function O(e) {
	return e.filter((e) => e.length > 1).map((e) => e.map((e, t) => `${t === 0 ? "M" : "L"}${e.x} ${e.y}`).join("")).join("");
}
function k(e, t) {
	let n = document.createElementNS(ye, e);
	return Object.entries(t).forEach(([e, t]) => n.setAttribute(e, t)), n;
}
function be(e, t) {
	if (e.label) return e.label;
	let n = e.start === e.end ? E.format(e.start) : `${E.format(e.start)}–${E.format(e.end)}`;
	return t.unit ? `${n} ${t.unit}` : n;
}
function xe(e, t) {
	let n = k("svg", {
		class: "mhu-cube__frame",
		viewBox: "0 0 100 100",
		preserveAspectRatio: "none",
		"aria-hidden": "true"
	}), r = b(e), i = (e.time.ticks ?? []).filter((t) => t > e.time.min && t < e.time.max).map((n) => ue(y(n, e.time), t)), a = [...r.space.map((e) => [v(e, 0, 0, t), v(e, 0, 1, t)]), ...r.organ.map((e) => [v(0, 0, e, t), v(1, 0, e, t)])];
	return n.append(k("path", {
		class: "mhu-cube__frame-guide",
		d: O(i)
	}), k("path", {
		class: "mhu-cube__frame-floor-guide",
		d: O(a)
	}), k("path", {
		class: "mhu-cube__frame-line",
		d: O(le(t))
	})), n;
}
function A(e) {
	return e > D ? "0%" : e < -D ? "-100%" : "-50%";
}
function j(e, t) {
	let n = document.createElement("div");
	n.className = "mhu-cube__axes", n.setAttribute("aria-hidden", "true");
	let r = (e, t, r, i) => {
		let a = document.createElement("span");
		return a.className = t, a.textContent = e, a.style.left = `${r.x}%`, a.style.top = `${r.y}%`, a.style.setProperty("--axis-normal-x", i.x.toFixed(4)), a.style.setProperty("--axis-normal-y", i.y.toFixed(4)), n.append(a), a;
	}, i = (e, t) => ({
		x: e.start.x + (e.end.x - e.start.x) * t,
		y: e.start.y + (e.end.y - e.start.y) * t
	}), a = (e, t, n, i) => {
		let a = r(e, `mhu-cube__axis-value mhu-cube__axis-value--${t}`, n, i);
		a.style.setProperty("--_align-x", A(i.x)), a.style.setProperty("--_align-y", A(i.y));
	}, o = (e, t, n) => {
		r(e, `mhu-cube__axis-title mhu-cube__axis-title--${t}`, i(n, .5), n.normal).style.setProperty("--_offset", `${(.75 + 1.6 * Math.abs(n.normal.y) + 5.5 * Math.abs(n.normal.x)).toFixed(3)}rem`);
	}, s = fe(t), c = b(e);
	return r(e.time.label, "mhu-cube__axis-title mhu-cube__axis-title--time", s.time.end, s.time.normal), o(e.space.label, "space", s.space), o(e.organ.label, "organ", s.organ), (e.time.ticks ?? []).forEach((t) => {
		a(E.format(t), "time", i(s.time, y(t, e.time)), s.time.normal);
	}), e.space.values.forEach((e, t) => a(e, "space", i(s.space, c.space[t]), s.space.normal)), e.organ.values.forEach((e, t) => a(e, "organ", i(s.organ, c.organ[t]), s.organ.normal)), n;
}
function M({ corners: e, bounds: t }) {
	let n = (...e) => e.map((e) => `${e.x},${e.y}`).join(" "), r = (...e) => e.map((e, t) => `${t === 0 ? "M" : "L"}${e.x} ${e.y}`).join(""), i = k("svg", {
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
	return i.append(k("polygon", {
		class: "mhu-cube__top",
		points: n(...a),
		"vector-effect": "non-scaling-stroke"
	}), k("polygon", {
		class: "mhu-cube__left",
		points: n(...o),
		"vector-effect": "non-scaling-stroke"
	}), k("polygon", {
		class: "mhu-cube__right",
		points: n(...s),
		"vector-effect": "non-scaling-stroke"
	}), k("path", {
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
function Se({ floor: e, drops: t, leaders: n, bracket: r, geometry: { bounds: i } }) {
	let a = k("svg", {
		class: "mhu-cube__shadow",
		viewBox: `${i.left} ${i.top} ${i.width} ${i.height}`,
		preserveAspectRatio: "none",
		"aria-hidden": "true"
	});
	a.append(k("polygon", {
		class: "mhu-cube__shadow-floor",
		points: e.map((e) => `${e.x},${e.y}`).join(" "),
		"vector-effect": "non-scaling-stroke"
	})), t.length > 0 && a.append(k("path", {
		class: "mhu-cube__shadow-drop",
		d: O(t),
		"vector-effect": "non-scaling-stroke"
	}));
	let o = k("g", { class: "mhu-cube__time-marker" });
	return o.append(k("path", {
		class: "mhu-cube__time-leader",
		d: O(n),
		"vector-effect": "non-scaling-stroke"
	}), k("path", {
		class: "mhu-cube__time-bracket",
		d: O([r]),
		"vector-effect": "non-scaling-stroke"
	})), a.append(o), a;
}
function N(e) {
	let t = document.createElement("p");
	t.className = "mhu-cube__sr-only";
	let n = e.time.unit ? ` ${e.time.unit}` : "";
	return t.textContent = [
		`${e.time.label}: ${E.format(e.time.min)} to ${E.format(e.time.max)}${n}`,
		`${e.space.label}: ${e.space.values.join(", ")}`,
		`${e.organ.label}: ${e.organ.values.join(", ")}`
	].join(". "), t;
}
function P(e, t) {
	let n = Object.entries(e.metadata ?? {}).filter((e) => e[1] !== null && e[1] !== void 0).map(([e, t]) => `${e}: ${t}`), r = e.position, i = r ? [
		`${t.time.label}: ${be(r.time, t.time)}`,
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
var Ce = 90, we = 140, Te = class {
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
			duration: Ce,
			easing: "ease-out",
			fill: "forwards"
		});
		this.#e = r, r.finished.then(() => {
			if (n !== this.#t) return;
			t();
			let i = e.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: we,
				easing: "ease-in",
				fill: "forwards"
			});
			r.cancel(), this.#e = i, i.finished.then(() => {
				n === this.#t && (i.cancel(), this.#e = null);
			}).catch(() => void 0);
		}).catch(() => void 0);
	}
}, F = {
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
}, Ee = new Set([
	"available",
	"current",
	"unavailable"
]), I = 5, L = new Intl.Collator("en", {
	sensitivity: "base",
	numeric: !0
});
function R(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function z(e) {
	return typeof e == "number" && Number.isFinite(e);
}
function B(e) {
	return !("time" in e || "space" in e || "organ" in e) && ("x" in e || "y" in e || "z" in e);
}
function V(e, t, n, r, i) {
	return {
		code: e,
		message: t,
		path: n,
		severity: r,
		...i ? { itemId: i } : {}
	};
}
function De(e, t) {
	return L.compare(e, t) || (e < t ? -1 : e > t ? 1 : 0);
}
function Oe(e) {
	return e.time.max > e.time.min && e.space.values.length > 0 && e.organ.values.length > 0;
}
function H(e, t, n, r) {
	if (e == null) return {
		value: n,
		issues: []
	};
	let i = typeof e == "string" ? e.trim() : "";
	if (t.includes(i)) return {
		value: i,
		issues: []
	};
	let a = t.map((e) => `“${e}”`).join(" or ");
	return {
		value: n,
		issues: [V(`${r}.invalid`, `${r[0].toUpperCase()}${r.slice(1)} must be ${a}; “${n}” is used.`, r, "warning")]
	};
}
function U(e) {
	return H(e, ["corner", "front"], "corner", "view");
}
function W(e) {
	return H(e, ["full", "minimal"], "full", "guides");
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
	return i || r.push(V("axis.label.invalid", `${t} axis is using a fallback label.`, `${n}.label`, "warning")), i || t;
}
function q(e, t, n, r) {
	let i = `axes.${t}`;
	if (!R(e)) return r.push(V("axis.invalid", `${n} axis must provide a label and values.`, i, "error")), {
		label: n,
		values: []
	};
	let a = K(e, n, i, r), o = e.values;
	if (!Array.isArray(o) || o.length === 0) return r.push(V("axis.values.invalid", `${a} must provide at least one value.`, `${i}.values`, "error")), {
		label: a,
		values: []
	};
	if (!o.every((e) => typeof e == "string" && e.trim().length > 0)) return r.push(V("axis.value.invalid", `${a} contains an empty or non-text value.`, `${i}.values`, "error")), {
		label: a,
		values: []
	};
	let s = o.map((e) => e.trim());
	return s.some((e, t) => s.findIndex((t) => L.compare(e, t) === 0) !== t) ? (r.push(V("axis.values.duplicate", `${a} contains duplicate values and cannot be plotted safely.`, `${i}.values`, "error")), {
		label: a,
		values: []
	}) : {
		label: a,
		values: t === "organ" ? s.sort(De) : s
	};
}
function ke(e, t) {
	let n = "axes.time";
	if (!R(e)) return t.push(V("axis.invalid", "Time axis must provide a label, min, and max.", n, "error")), {
		...F.time,
		ticks: []
	};
	let r = K(e, "Time", n, t), i;
	e.unit !== void 0 && (typeof e.unit == "string" && e.unit.trim() ? i = e.unit.trim() : t.push(V("axis.time.unit.invalid", "Time unit must be nonempty text and was omitted.", `${n}.unit`, "warning")));
	let a = i ? { unit: i } : {}, { min: o, max: s } = e;
	if (!z(o) || !z(s) || o >= s) return t.push(V("axis.time.range.invalid", `${r} needs finite min and max values with min less than max.`, n, "error")), {
		label: r,
		...a,
		min: 0,
		max: 0,
		ticks: []
	};
	let c = Array.from({ length: I + 1 }, (e, t) => o + (s - o) * t / I);
	if (e.ticks !== void 0) {
		let i = e.ticks;
		Array.isArray(i) && i.length > 0 && i.every((e) => z(e) && e >= o && e <= s) ? c = [...new Set(i)].sort((e, t) => e - t) : t.push(V("axis.time.ticks.invalid", `${r} ticks must be numbers between min and max; default ticks are used.`, `${n}.ticks`, "warning"));
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
	if (!R(e)) return {
		value: F,
		issues: [V("axes.invalid", "Axes must be an object with time, space, and organ definitions.", "axes", "error")]
	};
	if (B(e)) return {
		value: F,
		issues: [V("axes.invalid", "Axes use the retired x, y, and z format; provide time, space, and organ definitions.", "axes", "error")]
	};
	let t = [];
	return {
		value: {
			time: ke(e.time, t),
			space: q(e.space, "space", "Space", t),
			organ: q(e.organ, "organ", "Organ", t)
		},
		issues: t
	};
}
function Ae(e, t, n, r) {
	if (e === void 0) return;
	if (!R(e)) {
		r.push(V("item.metadata.invalid", "Metadata must be an object.", t, "warning", n));
		return;
	}
	let i = {};
	return Object.entries(e).forEach(([e, a]) => {
		if (!e.trim()) {
			r.push(V("item.metadata.key.invalid", "Metadata field with an empty name was omitted.", t, "warning", n));
			return;
		}
		typeof a == "string" || typeof a == "number" && Number.isFinite(a) || a == null ? i[e] = a : r.push(V("item.metadata.value.invalid", `Metadata field “${e}” was omitted because its value is unsupported.`, `${t}.${e}`, "warning", n));
	}), i;
}
function je(e, t, n, r, i) {
	if (!R(e) || !z(e.start) || !z(e.end) || e.start > e.end) {
		i.push(V("item.position.time.invalid", "Time must provide finite start and end values with start no later than end; the dataset will not be plotted.", n, "warning", r));
		return;
	}
	let a;
	if (e.label !== void 0 && (typeof e.label == "string" && e.label.trim() ? a = e.label.trim() : i.push(V("item.position.time.label.invalid", "Time label must be nonempty text; formatted values are shown instead.", `${n}.label`, "warning", r))), !(t.max > t.min) || e.start < t.min || e.end > t.max) {
		i.push(V("item.position.time.out-of-range", "Time falls outside the configured time axis; the dataset will not be plotted.", n, "warning", r));
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
	a.push(V(`item.position.${n}.unknown`, s, r, "warning", i));
}
function Me(e, t, n, r, i) {
	if (e == null) {
		i.push(V("item.position.missing", "Dataset is available but will not be plotted because it has no position.", n, "warning", r));
		return;
	}
	if (!R(e)) {
		i.push(V("item.position.invalid", "Position must provide time, space, and organ.", n, "warning", r));
		return;
	}
	if (B(e)) {
		i.push(V("item.position.invalid", "Position uses the retired x, y, and z index format; provide time, space, and organ instead.", n, "warning", r));
		return;
	}
	let a = je(e.time, t.time, `${n}.time`, r, i), o = Y(e.space, t.space, "space", `${n}.space`, r, i), s = Y(e.organ, t.organ, "organ", `${n}.organ`, r, i);
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
		issues: [V("items.invalid", "Items must be an array.", "items", "error")]
	};
	let r = /* @__PURE__ */ new Set(), i = [];
	return e.forEach((e, a) => {
		let o = `items[${a}]`;
		if (!R(e)) {
			n.push(V("item.invalid", "Dataset must be an object and was excluded.", o, "error"));
			return;
		}
		let s = typeof e.id == "string" ? e.id.trim() : "";
		if (!s) {
			n.push(V("item.id.invalid", "Dataset requires a nonempty text ID and was excluded.", `${o}.id`, "error"));
			return;
		}
		if (r.has(s)) {
			n.push(V("item.id.duplicate", `Duplicate dataset ID “${s}” was excluded.`, `${o}.id`, "error", s));
			return;
		}
		r.add(s);
		let c = typeof e.label == "string" ? e.label.trim() : "", l = c || s;
		c || n.push(V("item.label.invalid", "Dataset label is missing; its ID is shown instead.", `${o}.label`, "warning", s));
		let u;
		e.href !== void 0 && (typeof e.href == "string" && G(e.href) ? u = e.href.trim() : n.push(V("item.href.unsafe", "Metadata destination was removed because it is invalid or uses an unsafe protocol.", `${o}.href`, "error", s)));
		let d = "available";
		e.status !== void 0 && (typeof e.status == "string" && Ee.has(e.status) ? d = e.status : n.push(V("item.status.invalid", "Unknown status was replaced with “available”.", `${o}.status`, "warning", s))), !u && d === "available" && (d = "unavailable", n.push(V("item.href.missing", "Dataset has no metadata destination and is treated as unavailable.", `${o}.href`, "warning", s)));
		let f = Ae(e.metadata, `${o}.metadata`, s, n), p = Me(e.position, t, `${o}.position`, s, n);
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
var Z = "mhu-cube-selection-change", Q = "mhu-cube-validation", Ne = typeof HTMLElement > "u" ? class {} : HTMLElement, Pe = 0, $ = class extends Ne {
	static observedAttributes = [
		"items",
		"axes",
		"label",
		"view",
		"guides"
	];
	#e = [];
	#t = [];
	#n = F;
	#r = "corner";
	#i = "full";
	#a = [];
	#o = [];
	#s = [];
	#c = [];
	#l = [];
	#u = null;
	#d = this.attachShadow({ mode: "open" });
	#f = `mhu-cube-${++Pe}`;
	#p = null;
	#m = null;
	#h = null;
	#g = null;
	#_ = `${this.#f}-details`;
	#v = `${this.#f}-details-heading`;
	#y = !1;
	#b = !1;
	#x = new Te();
	get items() {
		return this.#t;
	}
	set items(e) {
		this.#e = e, this.#T(), this.#w(!0);
	}
	get axes() {
		return this.#n;
	}
	set axes(e) {
		this.#E(e), this.#w(!0);
	}
	get view() {
		return this.#r;
	}
	set view(e) {
		this.#S(e), this.#w(!0);
	}
	get guides() {
		return this.#i;
	}
	set guides(e) {
		this.#C(e), this.#w(!0);
	}
	get validationIssues() {
		return [
			...this.#s,
			...this.#c,
			...this.#l,
			...this.#a,
			...this.#o
		];
	}
	get selectedId() {
		return this.#u;
	}
	set selectedId(e) {
		this.#u = this.#t.some((t) => t.id === e) ? e : null, this.#w(!1);
	}
	connectedCallback() {
		this.#D("axes", !1), this.#D("items", !1), this.#w(!0);
	}
	disconnectedCallback() {
		this.#x.cancel();
	}
	attributeChangedCallback(e) {
		e === "view" ? this.#S(this.getAttribute(e) ?? void 0) : e === "guides" ? this.#C(this.getAttribute(e) ?? void 0) : e !== "label" && this.#D(e, !0), this.#w(e !== "label");
	}
	#S(e) {
		let t = U(e);
		this.#r = t.value, this.#c = t.issues;
	}
	#C(e) {
		let t = W(e);
		this.#i = t.value, this.#l = t.issues;
	}
	#w(e) {
		this.#b ||= e, !this.#y && (this.#y = !0, queueMicrotask(() => {
			this.#y = !1, this.isConnected && (this.#F(), this.#b && this.#O(), this.#b = !1);
		}));
	}
	#T() {
		let e = X(this.#e, this.#n);
		this.#t = e.value, this.#o = e.issues, this.#t.some((e) => e.id === this.#u) || (this.#u = null);
	}
	#E(e) {
		let t = J(e);
		this.#n = t.value, this.#a = t.issues, this.#T();
	}
	#D(e, t) {
		this.#s = this.#s.filter((t) => t.path !== e);
		let n = this.getAttribute(e);
		if (n === null) {
			t && (e === "axes" ? this.#E(F) : (this.#e = [], this.#T()));
			return;
		}
		let r;
		try {
			r = JSON.parse(n);
		} catch {
			this.#s.push({
				code: `${e}.json.invalid`,
				message: `${e} contains invalid JSON.`,
				path: e,
				severity: "error"
			});
		}
		e === "axes" ? this.#E(r) : (this.#e = r, this.#T());
	}
	#O() {
		this.isConnected && this.dispatchEvent(new CustomEvent(Q, {
			bubbles: !0,
			composed: !0,
			detail: { issues: this.validationIssues }
		}));
	}
	#k(e, t) {
		let n = this.#u !== e.id;
		this.#u = e.id, this.#M(), n && this.#m ? this.#x.run(this.#m, () => {
			this.#m && (d(this.#m, e, this.#v, () => this.#A()), t && this.#m.querySelector(".mhu-cube__details-action")?.focus());
		}) : t && this.#m?.querySelector(".mhu-cube__details-action")?.focus(), this.dispatchEvent(new CustomEvent(Z, {
			bubbles: !0,
			composed: !0,
			detail: { item: e }
		}));
	}
	#A() {
		let e = this.#u;
		if (!e || !this.#m) return;
		let t = [...this.#d.querySelectorAll("[data-item-id]")].find((t) => t.dataset.itemId === e);
		this.#x.cancel(), this.#u = null, this.#M(), d(this.#m, null, this.#v, () => this.#A()), t?.focus(), this.dispatchEvent(new CustomEvent(Z, {
			bubbles: !0,
			composed: !0,
			detail: { item: null }
		}));
	}
	#j() {
		let n = document.createElement("style");
		n.textContent = `${e}\n${t}`;
		let r = document.createElement("section");
		r.className = "mhu-cube";
		let a = document.createElement("div");
		a.className = "mhu-cube__content";
		let o = u(this.#_);
		a.append(i(o));
		let s = document.createElement("div");
		s.className = "mhu-cube__stage";
		let c = document.createElement("div");
		c.className = "mhu-cube__plot", s.append(c), r.append(a, s), this.#d.replaceChildren(n, r), this.#p = r, this.#m = o, this.#h = s, this.#g = c;
	}
	#M() {
		let e = this.#t.find((e) => e.id === this.#u) ?? null;
		this.#p?.classList.toggle("mhu-cube--has-selection", !!e), this.#d.querySelectorAll("[data-item-id]").forEach((t) => {
			let n = t.dataset.itemId === e?.id;
			t.closest("li")?.classList.toggle("mhu-cube__item--selected", n), t.setAttribute("aria-pressed", String(n));
		});
	}
	#N(e, t, n) {
		e.type = "button", e.dataset.itemId = t.id, e.setAttribute("aria-label", `Select ${o(t)}`), e.setAttribute("aria-describedby", n), e.setAttribute("aria-controls", this.#_), e.setAttribute("aria-pressed", String(t.id === this.#u)), e.addEventListener("click", (e) => this.#k(t, e.detail === 0));
	}
	#P(e, t) {
		let n = document.createElement("section");
		n.className = "mhu-cube__unpositioned";
		let r = document.createElement("h3");
		r.className = "mhu-cube__unpositioned-heading", r.textContent = "Not plotted";
		let i = document.createElement("p");
		i.className = "mhu-cube__unpositioned-guidance", i.textContent = "These datasets do not include usable visualization coordinates.";
		let a = document.createElement("ul");
		return a.className = "mhu-cube__unpositioned-list", e.forEach((e) => {
			let n = t.get(e.id) ?? 0, r = document.createElement("li");
			r.className = "mhu-cube__unpositioned-item", e.id === this.#u && r.classList.add("mhu-cube__item--selected");
			let i = document.createElement("span");
			i.className = "mhu-cube__sr-only", i.id = `${this.#f}-unpositioned-${n}-description`, i.textContent = P(e, this.#n);
			let o = document.createElement("button");
			o.className = "mhu-cube__unpositioned-button", o.textContent = e.label, this.#N(o, e, i.id), r.append(i, o), a.append(r);
		}), n.append(r, i, a), n;
	}
	#F() {
		if ((!this.#p || !this.#m || !this.#h || !this.#g) && this.#j(), !this.#p || !this.#m || !this.#h || !this.#g) return;
		this.#p.setAttribute("aria-label", this.getAttribute("label") ?? "Metadata datasets"), this.#p.classList.remove("mhu-cube--view-corner", "mhu-cube--view-front", "mhu-cube--guides-full", "mhu-cube--guides-minimal"), this.#p.classList.add(`mhu-cube--view-${this.#r}`, `mhu-cube--guides-${this.#i}`), this.#h.querySelector(".mhu-cube__unpositioned")?.remove();
		let e = Oe(this.#n);
		if (e) this.#g.replaceChildren(xe(this.#n, this.#r), j(this.#n, this.#r), N(this.#n));
		else {
			let e = document.createElement("p");
			e.className = "mhu-cube__plot-unavailable", e.textContent = "Visualization unavailable because the axis data is incomplete.", this.#g.replaceChildren(e);
		}
		let t = this.#t.find((e) => e.id === this.#u) ?? null;
		if (this.#p.classList.toggle("mhu-cube--has-selection", !!t), this.#x.cancel(), d(this.#m, t, this.#v, () => this.#A()), this.#t.length === 0) {
			if (e) {
				let e = document.createElement("p");
				e.className = "mhu-cube__empty", e.textContent = "No datasets are available.", this.#g.append(e);
			}
			return;
		}
		let n = document.createElement("ul");
		n.className = "mhu-cube__list";
		let r = new Map(this.#t.map((e, t) => [e.id, t])), i = e ? ve(this.#t, this.#n, this.#r) : /* @__PURE__ */ new Map();
		he(this.#t, this.#n).forEach((e) => {
			let t = r.get(e.id) ?? 0, a = e.status ?? "available", o = e.id === this.#u, s = document.createElement("li");
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
			p.className = "mhu-cube__sr-only", p.id = `${this.#f}-item-${t}-description`, p.textContent = P(e, this.#n), this.#N(d, e, p.id), d.append(Se(c), M(c.geometry), l(e)), s.append(p, d, f(e)), n.append(s);
		}), this.#g.append(n);
		let a = this.#t.filter((e) => !i.has(e.id));
		a.length > 0 && this.#h.append(this.#P(a, r));
	}
};
function Fe() {
	typeof customElements > "u" || customElements.get("mhu-cube") || customElements.define("mhu-cube", $);
}
//#endregion
export { Z as MHU_CUBE_SELECTION_EVENT, Q as MHU_CUBE_VALIDATION_EVENT, $ as MhuCube, Fe as defineMhuCube, G as isSafeMetadataHref, J as validateAxes, W as validateGuides, X as validateItems, U as validateView };

//# sourceMappingURL=mhu-cube.js.map