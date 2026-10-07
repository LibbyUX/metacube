//#region packages/mhu-cube/src/mhu-cube.css?inline
var e = ":host{--_surface:var(--mhu-cube-surface,var(--mat-sys-surface,#fcfcfc));--_surface-container:var(--mhu-cube-surface-container,var(--mat-sys-surface-container,#eceff1));--_surface-container-lowest:var(--mhu-cube-surface-container-lowest,var(--mat-sys-surface-container-lowest,#fff));--_on-surface:var(--mhu-cube-on-surface,var(--mat-sys-on-surface,#1d2429));--_on-surface-variant:var(--mhu-cube-on-surface-variant,var(--mat-sys-on-surface-variant,#354b57));--_primary:var(--mhu-cube-primary,var(--mat-sys-primary,#8b1510));--_on-primary:var(--mhu-cube-on-primary,var(--mat-sys-on-primary,#fff));--_primary-container:var(--mhu-cube-primary-container,var(--mat-sys-primary-container,#ffdad5));--_on-primary-container:var(--mhu-cube-on-primary-container,var(--mat-sys-on-primary-container,#6b0f0a));--_outline:var(--mhu-cube-outline,var(--mat-sys-outline,#6c7f8a));--_outline-variant:var(--mhu-cube-outline-variant,var(--mat-sys-outline-variant,#c0cbd1));--_focus:var(--mhu-cube-focus,var(--mat-sys-primary,#8b1510));box-sizing:border-box;width:100%;min-width:0;max-width:100%;color:var(--_on-surface);font-family:var(--mat-sys-body-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-large-size,1rem);font-weight:var(--mat-sys-body-large-weight,400);line-height:var(--mat-sys-body-large-line-height,1.5rem);letter-spacing:var(--mat-sys-body-large-tracking,.03125rem);display:block;container:mhu-cube-host/inline-size}*{box-sizing:border-box}.mhu-cube{background:var(--_surface);grid-template:\"content stage\"minmax(0,1fr)/minmax(22rem,28rem) minmax(0,1fr);gap:clamp(1.5rem,3cqw,4rem);width:100%;height:100%;min-height:36rem;padding:clamp(1.5rem,3cqw,3rem);display:grid;overflow:visible}.mhu-cube__content{flex-direction:column;grid-area:content;align-self:stretch;gap:clamp(1.5rem,3vh,2.5rem);width:100%;height:100%;min-height:0;padding:0 0 1rem;display:flex}.mhu-cube__stage{grid-area:stage;grid-template-rows:minmax(0,1fr) auto;place-items:center;min-width:0;min-height:0;display:grid;container-type:size}.mhu-cube__plot{--_gutter-top:.5rem;--_gutter-right:.5rem;--_gutter-bottom:1.25rem;--_gutter-left:3rem;--_gutter-x:calc(var(--_gutter-left) + var(--_gutter-right));--_gutter-y:calc(var(--_gutter-top) + var(--_gutter-bottom));--_plot-width:min(100cqw, calc((100cqh - var(--_gutter-y)) / var(--_area-ratio,.868) + var(--_gutter-x)));width:var(--_plot-width);height:calc((var(--_plot-width) - var(--_gutter-x)) * var(--_area-ratio,.868) + var(--_gutter-y));position:relative}.mhu-cube--view-front .mhu-cube__plot{--_gutter-right:6rem;--_gutter-bottom:3.25rem}.mhu-cube__frame,.mhu-cube__axes,.mhu-cube__list{top:var(--_gutter-top);left:var(--_gutter-left);width:calc(100% - var(--_gutter-x));height:calc(100% - var(--_gutter-y));position:absolute}.mhu-cube__frame{z-index:0;pointer-events:none;shape-rendering:geometricprecision;overflow:visible}.mhu-cube__frame-line{fill:none;stroke:color-mix(in srgb, var(--_outline) 68%, transparent);stroke-width:1.1px;vector-effect:non-scaling-stroke}.mhu-cube__frame-guide,.mhu-cube__frame-floor-guide{fill:none;stroke:color-mix(in srgb, var(--_outline) 30%, transparent);stroke-width:1px;vector-effect:non-scaling-stroke}.mhu-cube__frame-floor-guide{stroke:color-mix(in srgb, var(--_outline) 45%, transparent)}.mhu-cube__axes{z-index:1;-webkit-user-select:text;user-select:text}.mhu-cube__axis-title,.mhu-cube__axis-value{--_align-x:-50%;--_align-y:-50%;--_offset:.5rem;transform:translate(calc(var(--_align-x) + var(--axis-normal-x,0) * var(--_offset)), calc(var(--_align-y) + var(--axis-normal-y,0) * var(--_offset)));white-space:nowrap;position:absolute}.mhu-cube__axis-title{color:var(--_primary);font-family:var(--mat-sys-label-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-large-size,.875rem);font-weight:600;line-height:var(--mat-sys-label-large-line-height,1.25rem);letter-spacing:var(--mat-sys-label-large-tracking,.00625rem)}.mhu-cube__axis-title--time{--_align-x:-100%;--_align-y:calc(-100% - .75rem)}.mhu-cube__axis-value{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);font-weight:var(--mat-sys-body-small-weight,400);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem)}.mhu-cube__axis-title--space,.mhu-cube__axis-title--organ,.mhu-cube__axis-value--space,.mhu-cube__axis-value--organ{text-shadow:-2px -2px 0 var(--_surface), 2px -2px 0 var(--_surface), -2px 2px 0 var(--_surface), 2px 2px 0 var(--_surface)}.mhu-cube__list{z-index:2;pointer-events:none;margin:0;padding:0;list-style:none}.mhu-cube__item{top:var(--cube-top);left:var(--cube-left);width:var(--cube-width);height:var(--cube-height);pointer-events:none;position:absolute}.mhu-cube__item--unpositioned{display:none}.mhu-cube__select{width:100%;height:100%;color:inherit;font:inherit;text-align:left;cursor:pointer;pointer-events:none;background:0 0;border:0;margin:0;padding:0;display:block;position:relative}.mhu-cube__select:focus-visible{z-index:999;outline:3px solid var(--_focus);outline-offset:5px}.mhu-cube__shadow{z-index:0;pointer-events:none;width:100%;height:100%;position:absolute;inset:0;overflow:visible}.mhu-cube__shadow-floor{fill:var(--_primary);fill-opacity:.12;stroke:color-mix(in srgb, var(--_primary) 45%, transparent);stroke-width:1px;transition:fill-opacity .17s}.mhu-cube__shadow-drop{fill:none;stroke:color-mix(in srgb, var(--_on-surface) 40%, transparent);stroke-width:1px;stroke-dasharray:3 3}.mhu-cube__time-marker{opacity:0;transition:opacity .12s}.mhu-cube__time-leader{fill:none;stroke:var(--_primary);stroke-width:1.25px;stroke-dasharray:5 3}.mhu-cube__time-bracket{fill:none;stroke:var(--_primary);stroke-width:6px;stroke-linecap:round}.mhu-cube__select:hover .mhu-cube__time-marker,.mhu-cube__select:focus-visible .mhu-cube__time-marker,.mhu-cube__item--selected .mhu-cube__time-marker{opacity:1}.mhu-cube__select:hover .mhu-cube__shadow-floor,.mhu-cube__select:focus-visible .mhu-cube__shadow-floor,.mhu-cube__item--selected .mhu-cube__shadow-floor{fill-opacity:.28}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__shadow{opacity:.35}.mhu-cube--guides-minimal .mhu-cube__frame-floor-guide,.mhu-cube--guides-minimal .mhu-cube__shadow-floor,.mhu-cube--guides-minimal .mhu-cube__shadow-drop{display:none}.mhu-cube__cube{z-index:var(--cube-layer,1);shape-rendering:geometricprecision;width:100%;height:100%;display:block;position:relative;overflow:visible}.mhu-cube__top,.mhu-cube__left,.mhu-cube__right{stroke:color-mix(in srgb, var(--_outline) 75%, transparent);stroke-width:.85px;stroke-linejoin:bevel;pointer-events:fill;transition:fill-opacity .17s,stroke .17s,stroke-width .17s}.mhu-cube__top{fill:var(--_primary);fill-opacity:.4}.mhu-cube__left{fill:var(--_primary);fill-opacity:.5}.mhu-cube__right{fill:var(--_primary);fill-opacity:.64}.mhu-cube__edge{fill:none;stroke:color-mix(in srgb, var(--_on-surface) 38%, transparent);stroke-width:.75px;pointer-events:none;transition:stroke .17s,stroke-width .17s}.mhu-cube__select:hover .mhu-cube__top,.mhu-cube__select:hover .mhu-cube__left,.mhu-cube__select:hover .mhu-cube__right,.mhu-cube__select:focus-visible .mhu-cube__top,.mhu-cube__select:focus-visible .mhu-cube__left,.mhu-cube__select:focus-visible .mhu-cube__right{stroke:var(--_on-surface);stroke-width:2.3px}.mhu-cube__select:hover .mhu-cube__edge,.mhu-cube__select:focus-visible .mhu-cube__edge{stroke:var(--_on-surface);stroke-width:2px}.mhu-cube__select:hover .mhu-cube__top,.mhu-cube__select:focus-visible .mhu-cube__top{fill-opacity:.46}.mhu-cube__select:hover .mhu-cube__left,.mhu-cube__select:focus-visible .mhu-cube__left{fill-opacity:.56}.mhu-cube__select:hover .mhu-cube__right,.mhu-cube__select:focus-visible .mhu-cube__right{fill-opacity:.68}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__top,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__left,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__right,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__edge{stroke:var(--_primary);stroke-width:1.2px}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__top{fill-opacity:.9}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__left{fill-opacity:.96}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__right{fill-opacity:1}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__top{fill-opacity:.08}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__left{fill-opacity:.1}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__right{fill-opacity:.12}.mhu-cube__card{z-index:1000;top:var(--card-top,50%);border:1px solid color-mix(in srgb, var(--_outline) 75%, transparent);opacity:0;background:var(--_surface-container);width:15rem;box-shadow:0 .5rem 1.2rem color-mix(in srgb, var(--_on-surface) 22%, transparent);pointer-events:none;padding:.75rem .85rem;transition:opacity .12s;position:absolute;left:calc(100% + .75rem);transform:translateY(-50%)}.mhu-cube__item--card-left .mhu-cube__card{left:auto;right:calc(100% + .75rem)}.mhu-cube__select:hover .mhu-cube__card,.mhu-cube__select:focus-visible .mhu-cube__card{opacity:1}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__card{opacity:0}.mhu-cube__label{color:var(--_on-surface);font-family:var(--mat-sys-title-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-title-small-size,.875rem);font-weight:var(--mat-sys-title-small-weight,500);line-height:var(--mat-sys-title-small-line-height,1.25rem);letter-spacing:var(--mat-sys-title-small-tracking,.00625rem);display:block}.mhu-cube__metadata{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);font-weight:var(--mat-sys-body-small-weight,400);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem);grid-template-columns:auto 1fr;gap:.2rem .5rem;margin:.5rem 0 0;display:grid}.mhu-cube__metadata-key{font-family:var(--mat-sys-label-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-small-size,.6875rem);font-weight:var(--mat-sys-label-small-weight,500);line-height:var(--mat-sys-label-small-line-height,1rem);letter-spacing:var(--mat-sys-label-small-tracking,.03125rem)}.mhu-cube__metadata-value{overflow-wrap:anywhere;min-width:0}.mhu-cube__status{color:var(--_on-primary-container);font-family:var(--mat-sys-label-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-small-size,.6875rem);font-weight:var(--mat-sys-label-small-weight,500);line-height:var(--mat-sys-label-small-line-height,1rem);letter-spacing:var(--mat-sys-label-small-tracking,.03125rem);text-transform:uppercase;margin-top:.4rem;display:inline-block}.mhu-cube__item--current .mhu-cube__top,.mhu-cube__item--current .mhu-cube__left,.mhu-cube__item--current .mhu-cube__right{stroke:var(--_primary);stroke-width:2.5px}.mhu-cube__item--unavailable .mhu-cube__cube{opacity:.62;filter:grayscale()}.mhu-cube__item--unavailable .mhu-cube__top,.mhu-cube__item--unavailable .mhu-cube__left,.mhu-cube__item--unavailable .mhu-cube__right,.mhu-cube__item--unavailable .mhu-cube__edge{stroke-dasharray:3 2}.mhu-cube__unpositioned{border-left:3px solid var(--_outline);background:var(--_surface-container);align-self:end;width:min(100%,38rem);margin-top:.75rem;padding:.75rem 1rem}.mhu-cube__unpositioned-heading{font-family:var(--mat-sys-title-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-title-small-size,.875rem);font-weight:var(--mat-sys-title-small-weight,500);line-height:var(--mat-sys-title-small-line-height,1.25rem);letter-spacing:var(--mat-sys-title-small-tracking,.00625rem);margin:0}.mhu-cube__unpositioned-guidance{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);font-weight:var(--mat-sys-body-small-weight,400);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem);margin:.25rem 0 0}.mhu-cube__unpositioned-list{flex-wrap:wrap;gap:.5rem;margin:.625rem 0 0;padding:0;list-style:none;display:flex}.mhu-cube__unpositioned-button{border:1px solid var(--_outline);background:var(--_surface);min-height:2.75rem;color:var(--_on-surface);font-family:var(--mat-sys-label-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-large-size,.875rem);font-weight:var(--mat-sys-label-large-weight,500);line-height:var(--mat-sys-label-large-line-height,1.25rem);letter-spacing:var(--mat-sys-label-large-tracking,.00625rem);cursor:pointer;padding:.625rem .75rem}.mhu-cube__unpositioned-button:hover{background:var(--_primary-container);color:var(--_on-primary-container)}.mhu-cube__unpositioned-button:focus-visible{outline:3px solid var(--_focus);outline-offset:3px}.mhu-cube__unpositioned-item.mhu-cube__item--selected .mhu-cube__unpositioned-button{border-color:var(--_primary);background:var(--_primary-container);color:var(--_on-primary-container);border-width:2px}.mhu-cube__intro{flex-direction:column;height:100%;min-height:0;display:flex}.mhu-cube__intro-eyebrow,.mhu-cube__details-eyebrow{color:var(--_primary);font-family:var(--mat-sys-label-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-small-size,.6875rem);font-weight:600;line-height:var(--mat-sys-label-small-line-height,1rem);letter-spacing:var(--mat-sys-label-small-tracking,.03125rem);text-transform:uppercase;margin:0 0 .5rem}.mhu-cube__intro-heading{font-family:var(--mat-sys-headline-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-headline-large-size,2rem);font-weight:var(--mat-sys-headline-large-weight,600);line-height:var(--mat-sys-headline-large-line-height,2.5rem);letter-spacing:var(--mat-sys-headline-large-tracking,0);white-space:nowrap;margin:0}.mhu-cube__intro-heading-compact{display:none}.mhu-cube__details-heading{font-family:var(--mat-sys-title-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-title-large-size,1.375rem);font-weight:500;line-height:var(--mat-sys-title-large-line-height,1.75rem);letter-spacing:var(--mat-sys-title-large-tracking,0);margin:0}.mhu-cube__details-unavailable{color:var(--_on-surface-variant);font-family:var(--mat-sys-body-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-large-size,1rem);font-weight:var(--mat-sys-body-large-weight,400);line-height:var(--mat-sys-body-large-line-height,1.5rem);letter-spacing:var(--mat-sys-body-large-tracking,.03125rem);margin:1rem 0 0}.mhu-cube__intro-visualization{min-height:0;color:var(--_on-surface-variant);font-family:var(--mat-sys-body-medium-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-medium-size,.875rem);font-weight:var(--mat-sys-body-medium-weight,400);line-height:var(--mat-sys-body-medium-line-height,1.25rem);letter-spacing:var(--mat-sys-body-medium-tracking,.015625rem);flex-direction:column;flex:1;margin:.75rem 0 0;display:flex}.mhu-cube__intro-summary,.mhu-cube__intro-attribution{margin:0}.mhu-cube__details:empty{display:none}.mhu-cube__details-card{border:1px solid var(--_outline-variant);background:var(--_surface-container);box-shadow:0 1rem 2.5rem color-mix(in srgb, var(--_on-surface) 10%, transparent);width:100%;padding:1.25rem}.mhu-cube__details-action{background:var(--_primary);min-height:2.75rem;color:var(--_on-primary);font-family:var(--mat-sys-label-large-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-large-size,.875rem);font-weight:var(--mat-sys-label-large-weight,500);line-height:var(--mat-sys-label-large-line-height,1.25rem);letter-spacing:var(--mat-sys-label-large-tracking,.00625rem);white-space:nowrap;justify-content:center;align-items:center;margin-top:1.75rem;padding:.75rem 1rem;text-decoration:none;display:inline-flex}.mhu-cube__details-action:hover{filter:brightness(.92)}.mhu-cube__details-action:focus-visible{outline:3px solid var(--_focus);outline-offset:3px}.mhu-cube__empty,.mhu-cube__plot-unavailable{color:var(--_on-surface-variant);text-align:center;place-items:center;margin:0;padding:2rem;display:grid;position:absolute;inset:0}.mhu-cube__sr-only{clip:rect(0, 0, 0, 0);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}@container mhu-cube-host (width<=64rem){.mhu-cube{flex-direction:column;height:auto;min-height:0;padding:clamp(1.5rem,4cqw,2.5rem) 0 0;display:flex;overflow:visible}.mhu-cube__content{max-width:45rem;padding:0;display:block}.mhu-cube__intro{height:auto;min-height:0;margin-bottom:2rem;display:block}.mhu-cube__intro-eyebrow{margin:0 0 .875rem}.mhu-cube__intro-heading{font-family:var(--mat-sys-headline-medium-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-headline-medium-size,1.75rem);font-weight:var(--mat-sys-headline-medium-weight,600);line-height:var(--mat-sys-headline-medium-line-height,2.25rem);letter-spacing:var(--mat-sys-headline-medium-tracking,0);white-space:normal}.mhu-cube__intro-heading-wide,.mhu-cube__intro-visualization{display:none}.mhu-cube__intro-heading-compact{display:inline}.mhu-cube__stage{display:block;container-type:normal}.mhu-cube__plot{width:100%;height:auto;max-height:none}.mhu-cube__frame,.mhu-cube__axes{display:none}.mhu-cube__list{grid-template-columns:repeat(auto-fill,minmax(min(100%,16.125rem),1fr));gap:1rem;width:auto;height:auto;display:grid;position:static}.mhu-cube__item{pointer-events:auto;width:auto;min-width:0;height:auto;display:grid;position:static}.mhu-cube__select,.mhu-cube__details,.mhu-cube__unpositioned{display:none}.mhu-cube__empty,.mhu-cube__plot-unavailable{position:static}}@media (prefers-reduced-motion:reduce){.mhu-cube__top,.mhu-cube__left,.mhu-cube__right,.mhu-cube__edge,.mhu-cube__card,.mhu-cube__shadow-floor,.mhu-cube__time-marker{transition:none}}@media (forced-colors:active){.mhu-cube__frame-line,.mhu-cube__top,.mhu-cube__left,.mhu-cube__right,.mhu-cube__edge{stroke:canvastext}.mhu-cube__frame-guide,.mhu-cube__frame-floor-guide,.mhu-cube__shadow-drop{stroke:graytext}.mhu-cube__shadow-floor{fill:canvas;stroke:graytext}.mhu-cube__time-leader,.mhu-cube__time-bracket{stroke:highlight}.mhu-cube__top,.mhu-cube__left,.mhu-cube__right{fill:canvas;fill-opacity:1}.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__top,.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__left,.mhu-cube--has-selection .mhu-cube__item:not(.mhu-cube__item--selected) .mhu-cube__right{fill-opacity:1}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__top,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__left,.mhu-cube__item--selected .mhu-cube__select .mhu-cube__right,.mhu-cube__select:hover .mhu-cube__top,.mhu-cube__select:hover .mhu-cube__left,.mhu-cube__select:hover .mhu-cube__right{fill:highlight;stroke:highlighttext}.mhu-cube__item--selected .mhu-cube__select .mhu-cube__edge,.mhu-cube__select:hover .mhu-cube__edge{stroke:highlighttext}.mhu-cube__item--unavailable .mhu-cube__cube{opacity:1;filter:none}.mhu-cube__card,.mhu-cube__details-card,.mhu-cube__unpositioned{box-shadow:none;border-color:canvastext}.mhu-cube__details-action,.mhu-cube__unpositioned-button{border:1px solid buttontext}.mhu-cube__select:focus-visible,.mhu-cube__details-action:focus-visible,.mhu-cube__unpositioned-button:focus-visible{outline-color:highlight}}", t = ".mhu-cube__intro-attribution{font-family:var(--mat-sys-body-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-small-size,.75rem);line-height:var(--mat-sys-body-small-line-height,1rem);letter-spacing:var(--mat-sys-body-small-tracking,.025rem);margin-top:auto;padding-top:1rem}.mhu-cube__intro-attribution a{color:var(--_primary)}.mhu-cube__intro-attribution a:focus-visible{outline:3px solid var(--_focus);outline-offset:3px}.mhu-cube__intro-dimensions{margin:0}.mhu-cube__intro-dimensions-header,.mhu-cube__intro-dimensions-row{grid-template-columns:minmax(7rem,32%) minmax(0,1fr);gap:.75rem;display:grid}.mhu-cube__intro-dimensions-header{border-bottom:1px solid var(--_outline-variant);color:var(--_on-surface);margin-top:1.5rem;padding-bottom:.5rem;font-weight:600}.mhu-cube__intro-dimensions-row{border-bottom:1px solid var(--_outline-variant);padding:.5rem 0}.mhu-cube__intro-dimensions-row:last-child{border-bottom:0}.mhu-cube__intro-dimensions dt,.mhu-cube__intro-dimensions dd{overflow-wrap:anywhere;min-width:0;margin:0}.mhu-cube__intro-dimensions dt{color:var(--_on-surface);white-space:nowrap;font-weight:500}.mhu-cube__intro-dimensions dd{color:var(--_on-surface-variant)}.mhu-cube--has-selection .mhu-cube__intro-dimensions-header,.mhu-cube--has-selection .mhu-cube__intro-dimensions{display:none}.mhu-cube__details{margin:1.5rem 0 0}.mhu-cube__details-header{grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:.75rem;display:grid}.mhu-cube__details-close{width:2.75rem;height:2.75rem;min-height:2.75rem;color:var(--_on-surface);cursor:pointer;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:grid}.mhu-cube__details-close:hover{background:color-mix(in srgb, var(--_on-surface) 8%, transparent)}.mhu-cube__details-close:focus-visible{outline:3px solid var(--_focus);outline-offset:2px;background:color-mix(in srgb, var(--_on-surface) 10%, transparent)}.mhu-cube__details-close:active{background:color-mix(in srgb, var(--_on-surface) 10%, transparent)}.mhu-cube__details-close-icon{fill:currentColor;width:1.5rem;height:1.5rem;display:block}.mhu-cube__details-metadata{font-family:var(--mat-sys-body-medium-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-medium-size,.875rem);font-weight:var(--mat-sys-body-medium-weight,400);line-height:var(--mat-sys-body-medium-line-height,1.25rem);letter-spacing:var(--mat-sys-body-medium-tracking,.015625rem);margin:1.5rem 0 0}.mhu-cube__details-metadata-row{border-bottom:1px solid var(--_outline-variant);grid-template-columns:minmax(5.5rem,38%) minmax(0,1fr);gap:.75rem;padding:.5rem 0;display:grid}.mhu-cube__details-metadata-row:last-child{border-bottom:0}.mhu-cube__details-metadata dt,.mhu-cube__details-metadata dd{overflow-wrap:anywhere;min-width:0;margin:0}.mhu-cube__details-metadata dt{color:var(--_on-surface);font-weight:500}.mhu-cube__details-metadata dd{color:var(--_on-surface-variant)}.mhu-cube__details-card>.mhu-cube__details-metadata,.mhu-cube__details-card>.mhu-cube__details-action{margin-top:1rem}@media (forced-colors:active){.mhu-cube__intro-dimensions-header,.mhu-cube__intro-dimensions-row,.mhu-cube__details-metadata-row{border-color:canvastext}.mhu-cube__details-close{color:buttontext;border:1px solid buttontext}}", n = ".mhu-cube__compact-card{display:none}@container mhu-cube-host (width<=64rem){.mhu-cube__compact-card{border:1px solid var(--_outline-variant);background:var(--_surface-container-lowest);flex-direction:column;align-items:center;gap:1rem;width:100%;min-width:0;height:100%;padding:1rem;display:flex;position:relative}.mhu-cube__compact-media{aspect-ratio:1;background:var(--_primary-container);flex:none;width:min(100%,14rem);display:block;overflow:hidden}.mhu-cube__compact-image{object-fit:contain;object-position:bottom;width:100%;height:100%;transition:transform .2s;display:block}.mhu-cube__compact-body{flex-direction:column;gap:.75rem;width:100%;min-width:0;max-width:14rem;display:flex}.mhu-cube__compact-facts{flex-wrap:wrap;gap:.25rem 1rem;margin:0;display:flex}.mhu-cube__compact-fact{align-items:center;gap:.25rem;display:flex}.mhu-cube__compact-fact:before{content:\"\";background:var(--_primary);flex:none;width:.25rem;height:.25rem}.mhu-cube__compact-fact dd{color:var(--_on-surface-variant);font-family:var(--mat-sys-label-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-small-size,.6875rem);font-weight:600;line-height:var(--mat-sys-label-small-line-height,1rem);letter-spacing:var(--mat-sys-label-small-tracking,.03125rem);white-space:nowrap;margin:0}.mhu-cube__compact-heading{color:var(--_on-surface);font-family:var(--mat-sys-title-medium-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-title-medium-size,1rem);font-weight:600;line-height:var(--mat-sys-title-medium-line-height,1.5rem);letter-spacing:var(--mat-sys-title-medium-tracking,.009375rem);overflow-wrap:anywhere;text-wrap:balance;margin:0}.mhu-cube__compact-link{color:inherit;text-decoration:none}.mhu-cube__compact-badge{background:var(--_primary-container);color:var(--_on-primary-container);font-family:var(--mat-sys-label-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-label-small-size,.6875rem);font-weight:600;line-height:var(--mat-sys-label-small-line-height,1rem);letter-spacing:var(--mat-sys-label-small-tracking,.03125rem);text-transform:uppercase;align-self:flex-start;margin:0;padding:.125rem .5rem}.mhu-cube__compact-details{border-top:1px solid var(--_outline-variant);color:var(--_on-surface-variant);gap:.75rem;margin:0;padding-top:.75rem;display:grid}.mhu-cube__compact-details-row{gap:.125rem;min-width:0;display:grid}.mhu-cube__compact-details dt{font-family:var(--mat-sys-title-small-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-title-small-size,.875rem);font-weight:600;line-height:var(--mat-sys-title-small-line-height,1.25rem);letter-spacing:var(--mat-sys-title-small-tracking,.00625rem);text-wrap:balance}.mhu-cube__compact-details dd{font-family:var(--mat-sys-body-medium-font,Roboto, Arial, sans-serif);font-size:var(--mat-sys-body-medium-size,.875rem);font-weight:var(--mat-sys-body-medium-weight,400);line-height:var(--mat-sys-body-medium-line-height,1.25rem);letter-spacing:var(--mat-sys-body-medium-tracking,.015625rem);overflow-wrap:anywhere;margin:0}.mhu-cube__compact-card .mhu-cube__details-unavailable{font-size:var(--mat-sys-body-medium-size,.875rem);line-height:var(--mat-sys-body-medium-line-height,1.25rem);margin:0}.mhu-cube__compact-link:after{content:\"\";position:absolute;inset:0}.mhu-cube__compact-link:active:after{background:color-mix(in srgb, var(--_on-surface) 10%, transparent)}.mhu-cube__compact-link:focus-visible{outline:none}.mhu-cube__compact-link:focus-visible:after{outline:3px solid var(--_focus);outline-offset:-3px}}@media (hover:hover) and (pointer:fine){.mhu-cube__compact-link:after{content:none}.mhu-cube__compact-link:hover{text-underline-offset:.15em;text-decoration:underline}.mhu-cube__compact-link:focus-visible{outline:3px solid var(--_focus);outline-offset:2px}.mhu-cube__compact-media:hover .mhu-cube__compact-image{transform:scale(1.08)}}@media (prefers-reduced-motion:reduce){.mhu-cube__compact-image{transition:none}}@media (forced-colors:active){.mhu-cube__compact-card,.mhu-cube__compact-details{border-color:canvastext}.mhu-cube__compact-media,.mhu-cube__compact-badge{border:1px solid canvastext}.mhu-cube__compact-fact:before{forced-color-adjust:none;background:canvastext}.mhu-cube__compact-link:focus-visible,.mhu-cube__compact-link:focus-visible:after{outline-color:highlight}}", r = {
	heading: "Explore multiscale data",
	compactHeading: "Explore multiscale data",
	visualization: {
		description: "This interactive visualization compares datasets across time, space, and organ. Select a block to view its details.",
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
	}
}, i = .868;
function a(e) {
	let t = [...Object.values(e.top), ...Object.values(e.bottom)], n = t.map((e) => e.x), r = t.map((e) => e.y), a = Math.min(...n), o = Math.min(...r), s = Math.max(...n) - a, c = Math.max(...r) - o, l = (e) => ({
		x: (e.x - a) / s * 100,
		y: (e.y - o) / c * 100
	}), u = (e) => ({
		x0z0: l(e.x0z0),
		x1z0: l(e.x1z0),
		x1z1: l(e.x1z1),
		x0z1: l(e.x0z1)
	});
	return {
		planes: {
			top: u(e.top),
			bottom: u(e.bottom)
		},
		heightRatio: c * i / s
	};
}
var o = {
	corner: {
		...a({
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
		}),
		near: [0, 0],
		ticks: [1, 0],
		laneAxis: "x"
	},
	front: {
		...a({
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
		}),
		near: [0, 1],
		ticks: [0, 0],
		laneAxis: "z"
	}
};
function s(e) {
	return o[e].heightRatio;
}
var c = .7, l = .07, u = .9, d = .02, f = .02, p = 12, m = 88, ee = [
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
function te(e, t) {
	return t > 0 ? (e + .5) / t : .5;
}
function ne(e, t, n) {
	if (t <= 1) return .5;
	let r = Math.min(.5 / t, n + l);
	return r + e * (1 - 2 * r) / (t - 1);
}
function re(e, t, n) {
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
function h(e, t, n, r = "corner") {
	let { planes: i } = o[r], a = re(i.top, e, n), s = re(i.bottom, e, n);
	return {
		x: s.x + (a.x - s.x) * t,
		y: s.y + (a.y - s.y) * t
	};
}
function g(e, t) {
	return (e - t.min) / (t.max - t.min);
}
function ie(e, t) {
	return .5 / Math.max(e, t, 1) * c;
}
function _(e) {
	let t = e.space.values.length, n = e.organ.values.length, r = ie(t, n), i = e.space.values.map((e, n) => ne(n, t, r)), a = i.map((e) => 1 - e), o = i.map((e, n) => {
		let r = n === 0 ? 0 : (i[n - 1] + e) / 2;
		return [1 - (n === t - 1 ? 1 : (e + i[n + 1]) / 2), 1 - r];
	}), s = e.organ.values.map((e, t) => te(t, n));
	return {
		halfSize: r,
		space: a,
		spaceBands: o,
		organ: s,
		organBands: s.map((e) => [e - .5 / n, e + .5 / n])
	};
}
function ae(e = "corner") {
	return ee.map(([t, n]) => [h(...t, e), h(...n, e)]);
}
function oe(e, t = "corner") {
	let { near: n, ticks: r } = o[t], i = [n[0] === 0 ? 1 : 0, n[1] === 0 ? 1 : 0];
	return [
		r,
		i,
		[i[0] === r[0] ? n[0] : i[0], i[1] === r[1] ? n[1] : i[1]]
	].map(([n, r]) => h(n, e, r, t));
}
function se(e, t, n = "corner") {
	let r = t.x - e.x, { heightRatio: i } = o[n], a = (t.y - e.y) * i, s = Math.hypot(r, a) || 1, c = {
		x: a / s,
		y: -r / s
	}, l = h(.5, .5, .5, n), u = {
		x: (e.x + t.x) / 2 - l.x,
		y: ((e.y + t.y) / 2 - l.y) * i
	};
	return c.x * u.x + c.y * u.y < 0 ? {
		x: -c.x,
		y: -c.y
	} : c;
}
function ce(e = "corner") {
	let { near: t, ticks: n } = o[e], r = (t, n) => {
		let r = h(...t, e), i = h(...n, e);
		return {
			start: r,
			end: i,
			normal: se(r, i, e)
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
function le(e, t, n) {
	let r = g(e.start, t), i = g(e.end, t);
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
function v(e, t) {
	let [n, r] = o[t].near, i = n === 0 ? e.x0 : e.x1, a = n === 0 ? e.x1 : e.x0, s = r === 0 ? e.z0 : e.z1, c = r === 0 ? e.z1 : e.z0;
	return {
		front: [i, s],
		left: [a, s],
		right: [i, c],
		back: [a, c]
	};
}
function ue(e, t = "corner") {
	let { front: n, left: r, right: i, back: a } = v(e, t), o = {
		topFront: h(n[0], e.y1, n[1], t),
		topLeft: h(r[0], e.y1, r[1], t),
		topBack: h(a[0], e.y1, a[1], t),
		topRight: h(i[0], e.y1, i[1], t),
		bottomFront: h(n[0], e.y0, n[1], t),
		bottomLeft: h(r[0], e.y0, r[1], t),
		bottomRight: h(i[0], e.y0, i[1], t)
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
function y(e, t) {
	return e < t ? -1 : e > t ? 1 : 0;
}
function de(e, t) {
	return e.map((e, t) => ({
		item: e,
		index: t
	})).sort((e, n) => {
		let r = e.item.position, i = n.item.position;
		return !r || !i ? r ? -1 : i ? 1 : e.index - n.index : t.organ.values.indexOf(r.organ) - t.organ.values.indexOf(i.organ) || t.space.values.indexOf(r.space) - t.space.values.indexOf(i.space) || r.time.start - i.time.start || r.time.end - i.time.end || y(e.item.id, n.item.id);
	}).map(({ item: e }) => e);
}
function fe(e, t) {
	let n = [];
	e.forEach((e) => {
		let t = n.find((t) => e.y0 >= t.end + f);
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
function pe(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
	return e.forEach((e) => {
		let t = `${e.spaceIndex}:${e.organIndex}`;
		n.set(t, [...n.get(t) ?? [], e]);
	}), n.forEach((e) => {
		e.sort((e, t) => e.y0 - t.y0 || e.y1 - t.y1 || y(e.id, t.id));
		let n = [], r = -Infinity;
		e.forEach((e) => {
			n.length > 0 && e.y0 >= r + f && (fe(n, t), n = []), r = n.length === 0 ? e.y1 : Math.max(r, e.y1), n.push(e);
		}), n.length > 0 && fe(n, t);
	}), t;
}
function b(e, t, n, r, i) {
	if (r.laneCount === 1) return [e - t, e + t];
	let a = 2 * Math.min(e - n[0], n[1] - e) * u, o = Math.min(2 * t * (1 + .5 * (r.laneCount - 1)), a), s = (o - d * (r.laneCount - 1)) / r.laneCount, c = o / 2 - r.lane * (s + d);
	return i === 1 ? [e + c - s, e + c] : [e - c, e - c + s];
}
function x(e, t, n) {
	let [r, i] = o[n].near;
	return Math.abs(e - r) + Math.abs(t - i);
}
function me(e, t, n) {
	let { front: r, left: i, right: a, back: s } = v(e, n), c = [
		r,
		i,
		s,
		a
	].map(([e, t]) => h(e, 0, t, n)), l = e.y0 > 0 ? [
		r,
		i,
		a
	].map(([t, r]) => [h(t, e.y0, r, n), h(t, 0, r, n)]) : [], [u, d] = o[n].ticks, f = u === 1 ? e.x1 : e.x0, p = d === 1 ? e.z1 : e.z0;
	return {
		floor: c,
		drops: l,
		leaders: (t.start === t.end ? [t.start] : [t.start, t.end]).map((e) => [
			h(f, e, p, n),
			h(u, e, p, n),
			h(u, e, d, n)
		]),
		bracket: [h(u, t.start, d, n), h(u, t.end, d, n)]
	};
}
function he(e, t, n = "corner") {
	let r = _(t), { halfSize: i } = r, { laneAxis: a, near: s } = o[n], c = [];
	e.forEach((e) => {
		if (!e.position) return;
		let n = t.space.values.indexOf(e.position.space), r = t.organ.values.indexOf(e.position.organ);
		n < 0 || r < 0 || c.push({
			id: e.id,
			spaceIndex: n,
			organIndex: r,
			time: {
				start: g(e.position.time.start, t.time),
				end: g(e.position.time.end, t.time)
			},
			...le(e.position.time, t.time, i * 2)
		});
	});
	let l = pe(c), u = c.map((e) => {
		let t = r.space[e.spaceIndex], o = r.organ[e.organIndex], c = l.get(e.id) ?? {
			lane: 0,
			laneCount: 1
		}, [u, d] = a === "x" ? b(t, i, r.spaceBands[e.spaceIndex], c, s[0] === 0 ? 1 : 0) : [t - i, t + i], [f, p] = a === "z" ? b(o, i, r.organBands[e.organIndex], c, s[1] === 0 ? 1 : 0) : [o - i, o + i], m = {
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
			cellDepth: x(t, o, n),
			laneDepth: x((u + d) / 2, (f + p) / 2, n)
		};
	});
	u.sort((e, t) => t.cellDepth - e.cellDepth || t.laneDepth - e.laneDepth || e.box.y0 - t.box.y0 || y(e.id, t.id));
	let d = /* @__PURE__ */ new Map();
	return u.forEach(({ id: e, box: t, time: r }, i) => {
		let a = ue(t, n), { bounds: o } = a, s = h((t.x0 + t.x1) / 2, t.y1, (t.z0 + t.z1) / 2, n), c = Math.min(Math.max(s.y, p), m);
		d.set(e, {
			box: t,
			time: r,
			geometry: a,
			...me(t, r, n),
			layer: i + 1,
			cardSide: o.left + o.width / 2 > 66 ? "left" : "right",
			cardTop: (c - o.top) / o.height * 100
		});
	}), d;
}
//#endregion
//#region packages/mhu-cube/src/mhu-cube-visualization.ts
var ge = "http://www.w3.org/2000/svg", S = new Intl.NumberFormat("en", { maximumFractionDigits: 2 }), C = .15;
function w(e) {
	return e.filter((e) => e.length > 1).map((e) => e.map((e, t) => `${t === 0 ? "M" : "L"}${e.x} ${e.y}`).join("")).join("");
}
function T(e, t) {
	let n = document.createElementNS(ge, e);
	return Object.entries(t).forEach(([e, t]) => n.setAttribute(e, t)), n;
}
function E(e) {
	return Object.entries(e.metadata ?? {}).filter((e) => e[1] !== null && e[1] !== void 0 && !(Array.isArray(e[1]) && e[1].length === 0));
}
function D(e) {
	return Array.isArray(e) ? e.join(", ") : String(e);
}
function O(e, t) {
	if (e.label) return e.label;
	let n = e.start === e.end ? S.format(e.start) : `${S.format(e.start)}–${S.format(e.end)}`;
	return t.unit ? `${n} ${t.unit}` : n;
}
function _e(e, t) {
	let n = T("svg", {
		class: "mhu-cube__frame",
		viewBox: "0 0 100 100",
		preserveAspectRatio: "none",
		"aria-hidden": "true"
	}), r = _(e), i = (e.time.ticks ?? []).filter((t) => t > e.time.min && t < e.time.max).map((n) => oe(g(n, e.time), t)), a = [...r.space.map((e) => [h(e, 0, 0, t), h(e, 0, 1, t)]), ...r.organ.map((e) => [h(0, 0, e, t), h(1, 0, e, t)])];
	return n.append(T("path", {
		class: "mhu-cube__frame-guide",
		d: w(i)
	}), T("path", {
		class: "mhu-cube__frame-floor-guide",
		d: w(a)
	}), T("path", {
		class: "mhu-cube__frame-line",
		d: w(ae(t))
	})), n;
}
function k(e) {
	return e > C ? "0%" : e < -C ? "-100%" : "-50%";
}
function ve(e, t) {
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
		a.style.setProperty("--_align-x", k(i.x)), a.style.setProperty("--_align-y", k(i.y));
	}, o = (e, t, n) => {
		r(e, `mhu-cube__axis-title mhu-cube__axis-title--${t}`, i(n, .5), n.normal).style.setProperty("--_offset", `${(.75 + 1.6 * Math.abs(n.normal.y) + 5.5 * Math.abs(n.normal.x)).toFixed(3)}rem`);
	}, s = ce(t), c = _(e);
	return r(e.time.label, "mhu-cube__axis-title mhu-cube__axis-title--time", s.time.end, s.time.normal), o(e.space.label, "space", s.space), o(e.organ.label, "organ", s.organ), (e.time.ticks ?? []).forEach((t) => {
		a(S.format(t), "time", i(s.time, g(t, e.time)), s.time.normal);
	}), e.space.values.forEach((e, t) => a(e, "space", i(s.space, c.space[t]), s.space.normal)), e.organ.values.forEach((e, t) => a(e, "organ", i(s.organ, c.organ[t]), s.organ.normal)), n;
}
function ye({ corners: e, bounds: t }) {
	let n = (...e) => e.map((e) => `${e.x},${e.y}`).join(" "), r = (...e) => e.map((e, t) => `${t === 0 ? "M" : "L"}${e.x} ${e.y}`).join(""), i = T("svg", {
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
	return i.append(T("polygon", {
		class: "mhu-cube__top",
		points: n(...a),
		"vector-effect": "non-scaling-stroke"
	}), T("polygon", {
		class: "mhu-cube__left",
		points: n(...o),
		"vector-effect": "non-scaling-stroke"
	}), T("polygon", {
		class: "mhu-cube__right",
		points: n(...s),
		"vector-effect": "non-scaling-stroke"
	}), T("path", {
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
function be({ floor: e, drops: t, leaders: n, bracket: r, geometry: { bounds: i } }) {
	let a = T("svg", {
		class: "mhu-cube__shadow",
		viewBox: `${i.left} ${i.top} ${i.width} ${i.height}`,
		preserveAspectRatio: "none",
		"aria-hidden": "true"
	});
	a.append(T("polygon", {
		class: "mhu-cube__shadow-floor",
		points: e.map((e) => `${e.x},${e.y}`).join(" "),
		"vector-effect": "non-scaling-stroke"
	})), t.length > 0 && a.append(T("path", {
		class: "mhu-cube__shadow-drop",
		d: w(t),
		"vector-effect": "non-scaling-stroke"
	}));
	let o = T("g", { class: "mhu-cube__time-marker" });
	return o.append(T("path", {
		class: "mhu-cube__time-leader",
		d: w(n),
		"vector-effect": "non-scaling-stroke"
	}), T("path", {
		class: "mhu-cube__time-bracket",
		d: w([r]),
		"vector-effect": "non-scaling-stroke"
	})), a.append(o), a;
}
function xe(e) {
	let t = document.createElement("p");
	t.className = "mhu-cube__sr-only";
	let n = e.time.unit ? ` ${e.time.unit}` : "";
	return t.textContent = [
		`${e.time.label}: ${S.format(e.time.min)} to ${S.format(e.time.max)}${n}`,
		`${e.space.label}: ${e.space.values.join(", ")}`,
		`${e.organ.label}: ${e.organ.values.join(", ")}`
	].join(". "), t;
}
function A(e, t) {
	let n = E(e).map(([e, t]) => `${e}: ${D(t)}`), r = e.position, i = r ? [
		`${t.time.label}: ${O(r.time, t.time)}`,
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
//#region packages/mhu-cube/src/validation.ts
var j = {
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
}, Se = new Set([
	"available",
	"current",
	"unavailable"
]), M = 5, N = new Intl.Collator("en", {
	sensitivity: "base",
	numeric: !0
});
function P(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function F(e) {
	return typeof e == "number" && Number.isFinite(e);
}
function I(e) {
	return !("time" in e || "space" in e || "organ" in e) && ("x" in e || "y" in e || "z" in e);
}
function L(e, t, n, r, i) {
	return {
		code: e,
		message: t,
		path: n,
		severity: r,
		...i ? { itemId: i } : {}
	};
}
function Ce(e, t) {
	return N.compare(e, t) || (e < t ? -1 : e > t ? 1 : 0);
}
function R(e) {
	return e.time.max > e.time.min && e.space.values.length > 0 && e.organ.values.length > 0;
}
function z(e, t, n, r) {
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
		issues: [L(`${r}.invalid`, `${r[0].toUpperCase()}${r.slice(1)} must be ${a}; “${n}” is used.`, r, "warning")]
	};
}
function B(e) {
	return z(e, ["corner", "front"], "corner", "view");
}
function V(e) {
	return z(e, ["full", "minimal"], "full", "guides");
}
function H(e, t, n, r) {
	return e == null ? {
		value: null,
		issues: []
	} : Array.isArray(e) && e.every((e) => typeof e == "string") ? {
		value: [...new Set(e.map((e) => e.trim()).filter(Boolean))],
		issues: []
	} : {
		value: null,
		issues: [L(n, r, t, "warning")]
	};
}
function U(e) {
	return H(e, "compactMetadata", "compact-metadata.invalid", "Compact metadata must be a list of metadata names; every remaining entry is shown.");
}
function W(e) {
	return H(e, "hoverMetadata", "hover-metadata.invalid", "Hover metadata must be a list of metadata names; every entry is shown.");
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
	return i || r.push(L("axis.label.invalid", `${t} axis is using a fallback label.`, `${n}.label`, "warning")), i || t;
}
function q(e, t, n, r) {
	let i = `axes.${t}`;
	if (!P(e)) return r.push(L("axis.invalid", `${n} axis must provide a label and values.`, i, "error")), {
		label: n,
		values: []
	};
	let a = K(e, n, i, r), o = e.values;
	if (!Array.isArray(o) || o.length === 0) return r.push(L("axis.values.invalid", `${a} must provide at least one value.`, `${i}.values`, "error")), {
		label: a,
		values: []
	};
	if (!o.every((e) => typeof e == "string" && e.trim().length > 0)) return r.push(L("axis.value.invalid", `${a} contains an empty or non-text value.`, `${i}.values`, "error")), {
		label: a,
		values: []
	};
	let s = o.map((e) => e.trim());
	return s.some((e, t) => s.findIndex((t) => N.compare(e, t) === 0) !== t) ? (r.push(L("axis.values.duplicate", `${a} contains duplicate values and cannot be plotted safely.`, `${i}.values`, "error")), {
		label: a,
		values: []
	}) : {
		label: a,
		values: t === "organ" ? s.sort(Ce) : s
	};
}
function we(e, t) {
	let n = "axes.time";
	if (!P(e)) return t.push(L("axis.invalid", "Time axis must provide a label, min, and max.", n, "error")), {
		...j.time,
		ticks: []
	};
	let r = K(e, "Time", n, t), i;
	e.unit !== void 0 && (typeof e.unit == "string" && e.unit.trim() ? i = e.unit.trim() : t.push(L("axis.time.unit.invalid", "Time unit must be nonempty text and was omitted.", `${n}.unit`, "warning")));
	let a = i ? { unit: i } : {}, { min: o, max: s } = e;
	if (!F(o) || !F(s) || o >= s) return t.push(L("axis.time.range.invalid", `${r} needs finite min and max values with min less than max.`, n, "error")), {
		label: r,
		...a,
		min: 0,
		max: 0,
		ticks: []
	};
	let c = Array.from({ length: M + 1 }, (e, t) => o + (s - o) * t / M);
	if (e.ticks !== void 0) {
		let i = e.ticks;
		Array.isArray(i) && i.length > 0 && i.every((e) => F(e) && e >= o && e <= s) ? c = [...new Set(i)].sort((e, t) => e - t) : t.push(L("axis.time.ticks.invalid", `${r} ticks must be numbers between min and max; default ticks are used.`, `${n}.ticks`, "warning"));
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
	if (!P(e)) return {
		value: j,
		issues: [L("axes.invalid", "Axes must be an object with time, space, and organ definitions.", "axes", "error")]
	};
	if (I(e)) return {
		value: j,
		issues: [L("axes.invalid", "Axes use the retired x, y, and z format; provide time, space, and organ definitions.", "axes", "error")]
	};
	let t = [];
	return {
		value: {
			time: we(e.time, t),
			space: q(e.space, "space", "Space", t),
			organ: q(e.organ, "organ", "Organ", t)
		},
		issues: t
	};
}
function Te(e, t, n, r) {
	if (e === void 0) return;
	if (!P(e)) {
		r.push(L("item.metadata.invalid", "Metadata must be an object.", t, "warning", n));
		return;
	}
	let i = {};
	return Object.entries(e).forEach(([e, a]) => {
		if (!e.trim()) {
			r.push(L("item.metadata.key.invalid", "Metadata field with an empty name was omitted.", t, "warning", n));
			return;
		}
		typeof a == "string" || typeof a == "number" && Number.isFinite(a) || a == null ? i[e] = a : Array.isArray(a) && a.every((e) => typeof e == "string") ? i[e] = a.map((e) => e.trim()).filter(Boolean) : r.push(L("item.metadata.value.invalid", `Metadata field “${e}” was omitted because its value is unsupported.`, `${t}.${e}`, "warning", n));
	}), i;
}
function Ee(e, t, n, r, i) {
	if (!P(e) || !F(e.start) || !F(e.end) || e.start > e.end) {
		i.push(L("item.position.time.invalid", "Time must provide finite start and end values with start no later than end; the dataset will not be plotted.", n, "warning", r));
		return;
	}
	let a;
	if (e.label !== void 0 && (typeof e.label == "string" && e.label.trim() ? a = e.label.trim() : i.push(L("item.position.time.label.invalid", "Time label must be nonempty text; formatted values are shown instead.", `${n}.label`, "warning", r))), !(t.max > t.min) || e.start < t.min || e.end > t.max) {
		i.push(L("item.position.time.out-of-range", "Time falls outside the configured time axis; the dataset will not be plotted.", n, "warning", r));
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
	a.push(L(`item.position.${n}.unknown`, s, r, "warning", i));
}
function De(e, t, n, r, i) {
	if (e == null) {
		i.push(L("item.position.missing", "Dataset is available but will not be plotted because it has no position.", n, "warning", r));
		return;
	}
	if (!P(e)) {
		i.push(L("item.position.invalid", "Position must provide time, space, and organ.", n, "warning", r));
		return;
	}
	if (I(e)) {
		i.push(L("item.position.invalid", "Position uses the retired x, y, and z index format; provide time, space, and organ instead.", n, "warning", r));
		return;
	}
	let a = Ee(e.time, t.time, `${n}.time`, r, i), o = Y(e.space, t.space, "space", `${n}.space`, r, i), s = Y(e.organ, t.organ, "organ", `${n}.organ`, r, i);
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
		issues: [L("items.invalid", "Items must be an array.", "items", "error")]
	};
	let r = /* @__PURE__ */ new Set(), i = [];
	return e.forEach((e, a) => {
		let o = `items[${a}]`;
		if (!P(e)) {
			n.push(L("item.invalid", "Dataset must be an object and was excluded.", o, "error"));
			return;
		}
		let s = typeof e.id == "string" ? e.id.trim() : "";
		if (!s) {
			n.push(L("item.id.invalid", "Dataset requires a nonempty text ID and was excluded.", `${o}.id`, "error"));
			return;
		}
		if (r.has(s)) {
			n.push(L("item.id.duplicate", `Duplicate dataset ID “${s}” was excluded.`, `${o}.id`, "error", s));
			return;
		}
		r.add(s);
		let c = typeof e.label == "string" ? e.label.trim() : "", l = c || s;
		c || n.push(L("item.label.invalid", "Dataset label is missing; its ID is shown instead.", `${o}.label`, "warning", s));
		let u;
		e.href !== void 0 && (typeof e.href == "string" && G(e.href) ? u = e.href.trim() : n.push(L("item.href.unsafe", "Metadata destination was removed because it is invalid or uses an unsafe protocol.", `${o}.href`, "error", s)));
		let d = "available";
		e.status !== void 0 && (typeof e.status == "string" && Se.has(e.status) ? d = e.status : n.push(L("item.status.invalid", "Unknown status was replaced with “available”.", `${o}.status`, "warning", s))), !u && d === "available" && (d = "unavailable", n.push(L("item.href.missing", "Dataset has no metadata destination and is treated as unavailable.", `${o}.href`, "warning", s)));
		let f;
		e.image !== void 0 && (typeof e.image == "string" && G(e.image) ? f = e.image.trim() : n.push(L("item.image.unsafe", "Image was removed because its URL is invalid or uses an unsafe protocol.", `${o}.image`, "warning", s)));
		let p = Te(e.metadata, `${o}.metadata`, s, n), m = De(e.position, t, `${o}.position`, s, n);
		i.push({
			id: s,
			label: l,
			...u ? { href: u } : {},
			...f ? { image: f } : {},
			...p ? { metadata: p } : {},
			...m ? { position: m } : {},
			status: d
		});
	}), {
		value: i,
		issues: n
	};
}
//#endregion
//#region packages/mhu-cube/src/mhu-cube-cards.ts
function Oe() {
	let e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	e.classList.add("mhu-cube__details-close-icon"), e.setAttribute("width", "24"), e.setAttribute("height", "24"), e.setAttribute("viewBox", "0 -960 960 960"), e.setAttribute("fill", "currentColor"), e.setAttribute("aria-hidden", "true"), e.setAttribute("focusable", "false");
	let t = document.createElementNS("http://www.w3.org/2000/svg", "path");
	return t.setAttribute("d", "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"), e.append(t), e;
}
function ke(e) {
	let t = document.createElement("header");
	if (t.className = "mhu-cube__intro", r.eyebrow) {
		let e = document.createElement("p");
		e.className = "mhu-cube__intro-eyebrow", e.textContent = r.eyebrow, t.append(e);
	}
	let n = document.createElement("h2");
	n.className = "mhu-cube__intro-heading";
	let i = document.createElement("span");
	i.className = "mhu-cube__intro-heading-wide", i.textContent = r.heading;
	let a = document.createElement("span");
	a.className = "mhu-cube__intro-heading-compact", a.textContent = r.compactHeading, n.append(i, a);
	let o = document.createElement("div");
	o.className = "mhu-cube__intro-visualization";
	let s = document.createElement("p");
	s.className = "mhu-cube__intro-summary", s.textContent = r.visualization.description;
	let c = document.createElement("div");
	c.className = "mhu-cube__intro-dimensions-header", c.setAttribute("aria-hidden", "true"), r.visualization.dimensionHeadings.forEach((e) => {
		let t = document.createElement("span");
		t.textContent = e, c.append(t);
	});
	let l = document.createElement("dl");
	l.className = "mhu-cube__intro-dimensions", r.visualization.dimensions.forEach((e) => {
		let t = document.createElement("div");
		t.className = "mhu-cube__intro-dimensions-row";
		let n = document.createElement("dt"), r = document.createElement("dd");
		n.textContent = e.term, r.textContent = e.description, t.append(n, r), l.append(t);
	});
	let u = document.createElement("p");
	u.className = "mhu-cube__intro-attribution";
	let d = document.createElement("a");
	return d.href = r.visualization.attribution.href, d.textContent = r.visualization.attribution.linkText, u.append(r.visualization.attribution.beforeLink, d, r.visualization.attribution.afterLink), o.append(s, c, l, e, u), t.append(n, o), t;
}
function Ae(e) {
	let t = E(e).map(([e, t]) => `${e}: ${D(t)}`).join(", ");
	return t ? `${e.label}; ${t}` : e.label;
}
function je(e, t = "mhu-cube__details-metadata", n = !1) {
	if (e.length === 0) return null;
	let r = document.createElement("dl");
	return r.className = t, e.forEach(([e, i]) => {
		let a = document.createElement("div");
		a.className = `${t}-row`;
		let o = document.createElement("dt");
		o.textContent = e, a.append(o), (Array.isArray(i) && n ? i : [D(i)]).forEach((e) => {
			let t = document.createElement("dd");
			t.textContent = e, a.append(t);
		}), r.append(a);
	}), r;
}
function Me() {
	let e = document.createElement("p");
	return e.className = "mhu-cube__details-unavailable", e.textContent = "Metadata is not currently available for this dataset.", e;
}
function Ne(e, t) {
	let n = e.status ?? "available";
	if (n === "unavailable" || !e.href) return Me();
	let r = document.createElement("a");
	return r.className = t, r.href = e.href, r.setAttribute("aria-label", `View metadata for ${Ae(e)}${n === "current" ? ", current page" : ""}`), r.textContent = "View metadata", r;
}
function Pe(e, t) {
	let n = E(e);
	return t.flatMap((e) => n.filter(([t]) => t.trim().toLowerCase() === e.toLowerCase()));
}
function Fe(e, t = null) {
	let n = document.createElement("span");
	n.className = "mhu-cube__card", n.setAttribute("aria-hidden", "true");
	let r = document.createElement("span");
	r.className = "mhu-cube__label", r.textContent = e.label, n.append(r);
	let i = t ? Pe(e, t) : E(e);
	if (i.length > 0) {
		let e = document.createElement("span");
		e.className = "mhu-cube__metadata", i.forEach(([t, n]) => {
			let r = document.createElement("span"), i = document.createElement("span");
			r.className = "mhu-cube__metadata-key", i.className = "mhu-cube__metadata-value", r.textContent = t, i.textContent = D(n), e.append(r, i);
		}), n.append(e);
	}
	if (e.status === "current" || e.status === "unavailable") {
		let t = document.createElement("span");
		t.className = "mhu-cube__status", t.textContent = e.status === "current" ? "Current page" : "Unavailable", n.append(t);
	}
	return n;
}
function Ie(e) {
	let t = document.createElement("div");
	return t.className = "mhu-cube__details", t.id = e, t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "true"), t;
}
function Z(e, t, n, r) {
	if (e.replaceChildren(), !t) return e;
	let i = document.createElement("article");
	i.className = "mhu-cube__details-card", i.setAttribute("aria-labelledby", n);
	let a = document.createElement("div");
	a.className = "mhu-cube__details-header";
	let o = document.createElement("div"), s = document.createElement("p");
	s.className = "mhu-cube__details-eyebrow", s.textContent = "Selected dataset";
	let c = document.createElement("h3");
	c.className = "mhu-cube__details-heading", c.id = n, c.textContent = t.label;
	let l = document.createElement("button");
	l.className = "mhu-cube__details-close", l.type = "button", l.setAttribute("aria-label", "Close dataset details"), l.append(Oe()), l.addEventListener("click", r), o.append(s, c), a.append(o, l), i.append(a);
	let u = je(E(t));
	return u && i.append(u), i.append(Ne(t, "mhu-cube__details-action")), e.append(i), e;
}
function Le(e, t) {
	let n = new Set([
		t.time.label,
		t.space.label,
		t.organ.label
	].map((e) => e.trim().toLowerCase()));
	return E(e).filter(([e]) => !n.has(e.trim().toLowerCase()));
}
function Re(e, t, n, r) {
	return r ? Pe(e, r) : n ? Le(e, t) : E(e);
}
function Q(e, t, n = null) {
	let r = document.createElement("article");
	r.className = "mhu-cube__compact-card";
	let i = e.status ?? "available", a = i === "unavailable" ? void 0 : e.href, o = R(t) ? e.position : void 0, s = document.createElement(a ? "a" : "div");
	if (s.className = "mhu-cube__compact-media", s instanceof HTMLAnchorElement && a && (s.href = a, s.tabIndex = -1, s.setAttribute("aria-hidden", "true")), e.image) {
		let t = document.createElement("img");
		t.className = "mhu-cube__compact-image", t.src = e.image, t.alt = "", t.loading = "lazy", t.decoding = "async", t.addEventListener("error", () => t.remove(), { once: !0 }), s.append(t);
	}
	let c = document.createElement("div");
	if (c.className = "mhu-cube__compact-body", o) {
		let e = document.createElement("dl");
		e.className = "mhu-cube__compact-facts", [[t.time.label, O(o.time, t.time)], [t.space.label, o.space]].forEach(([t, n]) => {
			let r = document.createElement("div");
			r.className = "mhu-cube__compact-fact";
			let i = document.createElement("dt");
			i.className = "mhu-cube__sr-only", i.textContent = t;
			let a = document.createElement("dd");
			a.textContent = n, r.append(i, a), e.append(r);
		}), c.append(e);
	}
	let l = document.createElement("h3");
	l.className = "mhu-cube__compact-heading";
	let u = o?.organ ?? e.label;
	if (a) {
		let e = document.createElement("a");
		if (e.className = "mhu-cube__compact-link", e.href = a, e.textContent = u, i === "current" && e.setAttribute("aria-current", "page"), o) {
			let n = document.createElement("span");
			n.className = "mhu-cube__sr-only", n.textContent = `, ${O(o.time, t.time)}, ${o.space}`, e.append(n);
		}
		l.append(e);
	} else l.textContent = u;
	if (c.append(l), i === "current") {
		let e = document.createElement("p");
		e.className = "mhu-cube__compact-badge", e.textContent = "Current page", c.append(e);
	}
	let d = je(Re(e, t, !!o, n), "mhu-cube__compact-details", !0);
	return d && c.append(d), a || c.append(Me()), r.append(s, c), r;
}
//#endregion
//#region packages/mhu-cube/src/details-transition.ts
var ze = 90, Be = 140, Ve = class {
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
			duration: ze,
			easing: "ease-out",
			fill: "forwards"
		});
		this.#e = r, r.finished.then(() => {
			if (n !== this.#t) return;
			t();
			let i = e.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: Be,
				easing: "ease-in",
				fill: "forwards"
			});
			r.cancel(), this.#e = i, i.finished.then(() => {
				n === this.#t && (i.cancel(), this.#e = null);
			}).catch(() => void 0);
		}).catch(() => void 0);
	}
}, $ = "mhu-cube-selection-change", He = "mhu-cube-validation", Ue = typeof HTMLElement > "u" ? class {} : HTMLElement, We = 0, Ge = class extends Ue {
	static observedAttributes = [
		"items",
		"axes",
		"label",
		"view",
		"guides",
		"compact-metadata",
		"hover-metadata"
	];
	#e = [];
	#t = [];
	#n = j;
	#r = "corner";
	#i = "full";
	#a = [];
	#o = [];
	#s = [];
	#c = [];
	#l = [];
	#u = null;
	#d = [];
	#f = null;
	#p = [];
	#m = null;
	#h = this.attachShadow({ mode: "open" });
	#g = `mhu-cube-${++We}`;
	#_ = null;
	#v = null;
	#y = null;
	#b = null;
	#x = `${this.#g}-details`;
	#S = `${this.#g}-details-heading`;
	#C = !1;
	#w = !1;
	#T = new Ve();
	get items() {
		return this.#t;
	}
	set items(e) {
		this.#e = e, this.#M(), this.#j(!0);
	}
	get axes() {
		return this.#n;
	}
	set axes(e) {
		this.#N(e), this.#j(!0);
	}
	get view() {
		return this.#r;
	}
	set view(e) {
		this.#E(e), this.#j(!0);
	}
	get guides() {
		return this.#i;
	}
	set guides(e) {
		this.#D(e), this.#j(!0);
	}
	get compactMetadata() {
		return this.#u;
	}
	set compactMetadata(e) {
		this.#O(e), this.#j(!0);
	}
	get hoverMetadata() {
		return this.#f;
	}
	set hoverMetadata(e) {
		this.#k(e), this.#j(!0);
	}
	get validationIssues() {
		return [
			...this.#s,
			...this.#c,
			...this.#l,
			...this.#d,
			...this.#p,
			...this.#a,
			...this.#o
		];
	}
	get selectedId() {
		return this.#m;
	}
	set selectedId(e) {
		this.#m = this.#t.some((t) => t.id === e) ? e : null, this.#j(!1);
	}
	connectedCallback() {
		this.#P("axes", !1), this.#P("items", !1), this.#j(!0);
	}
	disconnectedCallback() {
		this.#T.cancel();
	}
	attributeChangedCallback(e) {
		e === "view" ? this.#E(this.getAttribute(e) ?? void 0) : e === "guides" ? this.#D(this.getAttribute(e) ?? void 0) : e === "compact-metadata" ? this.#O(this.#A(e)) : e === "hover-metadata" ? this.#k(this.#A(e)) : e !== "label" && this.#P(e, !0), this.#j(e !== "label");
	}
	#E(e) {
		let t = B(e);
		this.#r = t.value, this.#c = t.issues;
	}
	#D(e) {
		let t = V(e);
		this.#i = t.value, this.#l = t.issues;
	}
	#O(e) {
		let t = U(e);
		this.#u = t.value, this.#d = t.issues;
	}
	#k(e) {
		let t = W(e);
		this.#f = t.value, this.#p = t.issues;
	}
	#A(e) {
		let t = this.getAttribute(e);
		if (t !== null) try {
			return JSON.parse(t);
		} catch {
			return t;
		}
	}
	#j(e) {
		this.#w ||= e, !this.#C && (this.#C = !0, queueMicrotask(() => {
			this.#C = !1, this.isConnected && (this.#H(), this.#w && this.#F(), this.#w = !1);
		}));
	}
	#M() {
		let e = X(this.#e, this.#n);
		this.#t = e.value, this.#o = e.issues, this.#t.some((e) => e.id === this.#m) || (this.#m = null);
	}
	#N(e) {
		let t = J(e);
		this.#n = t.value, this.#a = t.issues, this.#M();
	}
	#P(e, t) {
		this.#s = this.#s.filter((t) => t.path !== e);
		let n = this.getAttribute(e);
		if (n === null) {
			t && (e === "axes" ? this.#N(j) : (this.#e = [], this.#M()));
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
		e === "axes" ? this.#N(r) : (this.#e = r, this.#M());
	}
	#F() {
		this.isConnected && this.dispatchEvent(new CustomEvent(He, {
			bubbles: !0,
			composed: !0,
			detail: { issues: this.validationIssues }
		}));
	}
	#I(e, t) {
		let n = this.#m !== e.id;
		this.#m = e.id, this.#z(), n && this.#v ? this.#T.run(this.#v, () => {
			this.#v && (Z(this.#v, e, this.#S, () => this.#L()), t && this.#v.querySelector(".mhu-cube__details-action")?.focus());
		}) : t && this.#v?.querySelector(".mhu-cube__details-action")?.focus(), this.dispatchEvent(new CustomEvent($, {
			bubbles: !0,
			composed: !0,
			detail: { item: e }
		}));
	}
	#L() {
		let e = this.#m;
		if (!e || !this.#v) return;
		let t = [...this.#h.querySelectorAll("[data-item-id]")].find((t) => t.dataset.itemId === e);
		this.#T.cancel(), this.#m = null, this.#z(), Z(this.#v, null, this.#S, () => this.#L()), t?.focus(), this.dispatchEvent(new CustomEvent($, {
			bubbles: !0,
			composed: !0,
			detail: { item: null }
		}));
	}
	#R() {
		let r = document.createElement("style");
		r.textContent = `${e}\n${t}\n${n}`;
		let i = document.createElement("section");
		i.className = "mhu-cube";
		let a = document.createElement("div");
		a.className = "mhu-cube__content";
		let o = Ie(this.#x);
		a.append(ke(o));
		let s = document.createElement("div");
		s.className = "mhu-cube__stage";
		let c = document.createElement("div");
		c.className = "mhu-cube__plot", s.append(c), i.append(a, s), this.#h.replaceChildren(r, i), this.#_ = i, this.#v = o, this.#y = s, this.#b = c;
	}
	#z() {
		let e = this.#t.find((e) => e.id === this.#m) ?? null;
		this.#_?.classList.toggle("mhu-cube--has-selection", !!e), this.#h.querySelectorAll("[data-item-id]").forEach((t) => {
			let n = t.dataset.itemId === e?.id;
			t.closest("li")?.classList.toggle("mhu-cube__item--selected", n), t.setAttribute("aria-pressed", String(n));
		});
	}
	#B(e, t, n) {
		e.type = "button", e.dataset.itemId = t.id, e.setAttribute("aria-label", `Select ${Ae(t)}`), e.setAttribute("aria-describedby", n), e.setAttribute("aria-controls", this.#x), e.setAttribute("aria-pressed", String(t.id === this.#m)), e.addEventListener("click", (e) => this.#I(t, e.detail === 0));
	}
	#V(e, t) {
		let n = document.createElement("section");
		n.className = "mhu-cube__unpositioned";
		let r = document.createElement("h3");
		r.className = "mhu-cube__unpositioned-heading", r.textContent = "Not plotted";
		let i = document.createElement("p");
		i.className = "mhu-cube__unpositioned-guidance", i.textContent = "These datasets do not include usable visualization coordinates.";
		let a = document.createElement("ul");
		return a.className = "mhu-cube__unpositioned-list", e.forEach((e) => {
			let n = t.get(e.id) ?? 0, r = document.createElement("li");
			r.className = "mhu-cube__unpositioned-item", e.id === this.#m && r.classList.add("mhu-cube__item--selected");
			let i = document.createElement("span");
			i.className = "mhu-cube__sr-only", i.id = `${this.#g}-unpositioned-${n}-description`, i.textContent = A(e, this.#n);
			let o = document.createElement("button");
			o.className = "mhu-cube__unpositioned-button", o.textContent = e.label, this.#B(o, e, i.id), r.append(i, o), a.append(r);
		}), n.append(r, i, a), n;
	}
	#H() {
		if ((!this.#_ || !this.#v || !this.#y || !this.#b) && this.#R(), !this.#_ || !this.#v || !this.#y || !this.#b) return;
		this.#_.setAttribute("aria-label", this.getAttribute("label") ?? "Metadata datasets"), this.#_.classList.remove("mhu-cube--view-corner", "mhu-cube--view-front", "mhu-cube--guides-full", "mhu-cube--guides-minimal"), this.#_.classList.add(`mhu-cube--view-${this.#r}`, `mhu-cube--guides-${this.#i}`), this.#b.style.setProperty("--_area-ratio", String(s(this.#r))), this.#y.querySelector(".mhu-cube__unpositioned")?.remove();
		let e = R(this.#n);
		if (e) this.#b.replaceChildren(_e(this.#n, this.#r), ve(this.#n, this.#r), xe(this.#n));
		else {
			let e = document.createElement("p");
			e.className = "mhu-cube__plot-unavailable", e.textContent = "Visualization unavailable because the axis data is incomplete.", this.#b.replaceChildren(e);
		}
		let t = this.#t.find((e) => e.id === this.#m) ?? null;
		if (this.#_.classList.toggle("mhu-cube--has-selection", !!t), this.#T.cancel(), Z(this.#v, t, this.#S, () => this.#L()), this.#t.length === 0) {
			if (e) {
				let e = document.createElement("p");
				e.className = "mhu-cube__empty", e.textContent = "No datasets are available.", this.#b.append(e);
			}
			return;
		}
		let n = document.createElement("ul");
		n.className = "mhu-cube__list";
		let r = new Map(this.#t.map((e, t) => [e.id, t])), i = e ? he(this.#t, this.#n, this.#r) : /* @__PURE__ */ new Map();
		de(this.#t, this.#n).forEach((e) => {
			let t = r.get(e.id) ?? 0, a = e.status ?? "available", o = e.id === this.#m, s = document.createElement("li");
			s.className = `mhu-cube__item mhu-cube__item--${a}`, o && s.classList.add("mhu-cube__item--selected");
			let c = i.get(e.id);
			if (!c) {
				s.classList.add("mhu-cube__item--unpositioned"), s.append(Q(e, this.#n, this.#u)), n.append(s);
				return;
			}
			let { bounds: l } = c.geometry;
			s.classList.add(`mhu-cube__item--card-${c.cardSide}`), s.style.setProperty("--cube-left", `${l.left}%`), s.style.setProperty("--cube-top", `${l.top}%`), s.style.setProperty("--cube-width", `${l.width}%`), s.style.setProperty("--cube-height", `${l.height}%`), s.style.setProperty("--cube-layer", String(c.layer)), s.style.setProperty("--card-top", `${c.cardTop}%`);
			let u = document.createElement("button");
			u.className = "mhu-cube__select";
			let d = document.createElement("span");
			d.className = "mhu-cube__sr-only", d.id = `${this.#g}-item-${t}-description`, d.textContent = A(e, this.#n), this.#B(u, e, d.id), u.append(be(c), ye(c.geometry), Fe(e, this.#f)), s.append(d, u, Q(e, this.#n, this.#u)), n.append(s);
		}), this.#b.append(n);
		let a = this.#t.filter((e) => !i.has(e.id));
		a.length > 0 && this.#y.append(this.#V(a, r));
	}
};
function Ke() {
	typeof customElements > "u" || customElements.get("mhu-cube") || customElements.define("mhu-cube", Ge);
}
//#endregion
export { $ as MHU_CUBE_SELECTION_EVENT, He as MHU_CUBE_VALIDATION_EVENT, Ge as MhuCube, Ke as defineMhuCube, G as isSafeMetadataHref, J as validateAxes, U as validateCompactMetadata, V as validateGuides, W as validateHoverMetadata, X as validateItems, B as validateView };

//# sourceMappingURL=mhu-cube.js.map