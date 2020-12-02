// tooltip ***
// $('div').tooltip();

(function($){

	$.fn.tooltip = function( method ) {
		if ( $.fn.tooltip.methods[ method ] ) {
			return $.fn.tooltip.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return $.fn.tooltip.methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}
	};

	$.fn.tooltip.methods = {

		init : function( options ) {

			options = $.extend( {}, $.fn.tooltip.options, options );

			var template = '<div class="tooltip-container"><div class="tooltip-holder"></div></div>',
				l = $(options.layer),
				t = $(template),
				h = t.find('.tooltip-holder');

			l.append(t.css('visibility', 'hidden'));

			function getPos(el, event, tt, options) {
				var p = {},
					el_pos,
					el_width,
					el_height;
				switch(options.mode) {
					case 'element':
						el_pos = el.offset();
						el_width = el.outerWidth();
						el_height = el.outerHeight();
						break;
					case 'cursor':
						el_pos = { 'left' : event.pageX, 'top' : event.pageY };
						el_width = 0;
						el_height = 0;
						break;
				};
				switch(options.pos) {
					case 'top':
						p.top = el_pos.top-tt.outerHeight();
						p.left = el_pos.left+el_width/2-tt.outerWidth()/2;
						break;
					case 'bottom':
						p.top = el_pos.top+el_height;
						p.left = el_pos.left+el_width/2-tt.outerWidth()/2;
						break;
					case 'right':
						p.top = el_pos.top+el_height;
						p.left = el_pos.left+el_width+10;
						break;
				};
				return p;
			};

			return this.each(function() {

				// start ******************************

				var e = $(this),
					e_event,
					trigger = false, //mouseover
					to;
				var tooltip_mouseover, tooltip_mouseout, tooltip_mousemove, tooltip_destroy;

				tooltip_mouseover = function (event) {
					var el = $(this)
					e_event = event;
					trigger = true;
					clearTimeout(to);
					to = setTimeout(function() {
						h.html( el.attr(options.source) );
						var p = getPos(el, e_event, t, options);
						t.addClass(options.pos).css({ 'position' : 'absolute', 'top' : p.top, 'left' : p.left, 'visibility' : 'visible' });
					}, options.timeout);
				};
				tooltip_mousemove = function (event) {
					if(!trigger) return;
					e_event = event;
				};
				tooltip_mouseout = function () {
					trigger = false;
					clearTimeout(to);
					to = setTimeout(function() {
						t.css({ 'visibility' : 'hidden' });
					}, options.timeout/2);
				};


				// action start
				e
					.bind('mouseover', tooltip_mouseover)
					.bind('mouseout', tooltip_mouseout)
				if(options.mode == 'cursor') e.bind('mousemove', tooltip_mousemove);
				// action end

				// api start
				tooltip_destroy = function () {
					e
						.unbind('mouseover', tooltip_mouseover)
						.unbind('mouseout', tooltip_mouseout)
						.unbind('mousemove', tooltip_mousemove)
						.unbind('destroy', tooltip_destroy);
					t.remove();
				};
				e.bind('destroy', tooltip_destroy);
				// api end

				// end ********************************

			});
		},
		destroy : function() {
			return this.each(function() {
				$(this).trigger('destroy');
			});
		}

	};

	$.fn.tooltip.options = {
		source: 'data-tooltip',
		layer: 'body',
		pos: 'top', //top, bottom
		mode: 'element', //element, cursor
		timeout: 200
	};

})(jQuery);

// popup ***
// 	$('a').popup();
//	$('a').popup({
//		overlay: '#overlay',
//		layer: '#layer',
//		type: 'iframe/html/image/ajax',
//		width: 560,
//		height: 315
//	});
// 	$('a').popup('update');
// 	$('a').popup('destroy');

(function($){

	$.popup = function( selector ) {
		if( typeof selector === 'string' ) {
			var a = $('<a href="'+ selector +'"></a>');
			return $.fn.popup.methods.init.apply( a, Array.prototype.slice.call( arguments, 1 )).trigger('open');
		} else {
		  $.error( 'Error' );
		};
	};

	$.fn.popup = function( method ) {
		if ( $.fn.popup.methods[ method ] ) {
			return $.fn.popup.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return $.fn.popup.methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}
	};

	$.fn.popup.methods = {

		init : function( options, functions ) {

			var selector = this.selector.replace(/[#]+/g, '1_').replace(/[\.]+/g, '2_').replace(/[^a-z0-9_]+/ig, '').slice(0,50);

			options = $.extend( {}, $.fn.popup.options, options );
			functions = $.fn.popup.functions;

			var template =  (options.template)
					?
				'<div class="popup">'+
				options.template +
				'<div class="popup-preload">Загрузка...</div>'+
				'</div>'
					:
				'<div class="popup">'+
				'<div class="popup-wrapper">'+
				'<div class="popup-control">'+
				'<a class="popup-but-prev" href="#prev"></a>'+
				'<a class="popup-but-next" href="#next"></a>'+
				'</div>'+
				'<div class="popup-holder"></div>'+
				'<div class="popup-title"></div>'+
				'<div class="popup-counter"></div>'+
				'<div class="popup-error">Error</div>'+
				'<a class="popup-but-close" href="#close">Close</a>'+
				'</div>'+
				'<div class="popup-preload">Loading...</div>'+
				'</div>',
				template_holder =   '<div class="popup-holder">'+
					'<div class="popup-content"></div>'+
					'</div>',
				body = $('body'),
				hold = {
					o : $(options.overlay),
					l : $(options.layer),
					p : $(template),
					h : $(template_holder)
				},
				current,
				tr = {
					open : false
				},
				nav = {
					prev : null,
					next : null
				},
				keeper = $.fn.popup.keeper[selector] = {},
				parent = false,
				line = false;

			hold.p_wrapper = hold.p.find('.popup-wrapper'),
			hold.p_holder = hold.p.find('.popup-holder'),
			hold.p_close = hold.p.find('.popup-but-close'),
			hold.p_prev = hold.p.find('.popup-but-prev'),
			hold.p_next = hold.p.find('.popup-but-next'),
			hold.p_preload = hold.p.find('.popup-preload'),
			hold.p_error = hold.p.find('.popup-error');
			hold.p_counter = hold.p.find('.popup-counter');

			keeper.ar = this,
			keeper.g_ar = {},
			keeper.total = keeper.ar.length;

			if (!options.counter) {
				hold.p_counter.addClass('disabled');
			};

			keeper.init = function(ar) {
				keeper.g_ar = functions.groupElements( 0, keeper.total, keeper.ar, {}, options );

				ar.bind('click open', keeper.popup_open);
				ar.bind('close', keeper.popup_close);
			};
			keeper.popup_open = function() {
				if(!tr.open) {
					line = ($.fn.popup.line.length) ? true : false;
					options.onBeforeOpen($(this), hold.p);
					tr.open = functions.openPopup( hold.o, hold.l, hold.p, hold.p_wrapper, hold.p_preload, hold.p_error, body, line, options );
					options.onOpen($(this), hold.p);
					$(document).bind('keyup', keeper.keypress);
				};
				current = $(this),
				hold.p_holder_old = hold.p_holder,
				hold.p_holder = hold.h.clone().hide(),
				nav = functions.setPopup( $(this), keeper.g_ar[ this.getAttribute(options.group) ], hold.p_prev, hold.p_next ),
				parent = functions.loadPopup( $(this), hold.p, hold.p_wrapper, hold.p_holder, hold.p_holder_old, hold.p_preload, hold.p_error, parent, options, keeper.g_ar[ this.getAttribute(options.group) ] );
				options.onSet($(this), hold.p, nav.prev, nav.next);
				functions.setCounter(hold.p_counter, nav.index, keeper.total, options.counterText);
				return false;
			};
			keeper.popup_close = function() {
				if(tr.open) {
					options.onClose(hold.p);
					functions.unloadPopup( hold.p_wrapper, hold.p_preload, hold.p_error, options );
					tr.open = functions.closePopup( hold.o, hold.l, hold.p, body, line, options );
					hold.p_holder.children().remove();
					$(document).unbind('keyup', keeper.keypress);
				};
				return false;
			};
			keeper.popup_prev = function() {
				if(nav.prev) {
					functions.unloadPopup( hold.p_wrapper, hold.p_preload, hold.p_error, options );
					nav.prev.trigger('click');
				};
				return false;
			};
			keeper.popup_next = function() {
				if(nav.next) {
					functions.unloadPopup( hold.p_wrapper, hold.p_preload, hold.p_error, options );
					nav.next.trigger('click');
				};
				return false;
			};
			keeper.destroy = function() {
				keeper.ar.unbind('click open', keeper.popup_open);
				hold.p.remove();
			};
			keeper.click = function(event) {
				if(!event.target || event.target === event.currentTarget) {
					keeper.popup_close.apply(this);
					return false;
				};
			};
			keeper.keypress = function(event) {
				if (event.which == 27 || event.keyCode == 27) {
					keeper.popup_close.apply(this);
				} else if (event.which == 37 || event.keyCode == 37) {
					keeper.popup_prev.apply(this);
				} else if (event.which == 39 || event.keyCode == 39) {
					keeper.popup_next.apply(this);
				};
			};

			// start ******************************

			hold.p.children()
				.bind('click', function(event) {
					event.stopPropagation();
				});
			hold.p_close.add(hold.p)
				.bind('click close', keeper.popup_close);
			hold.p_prev
				.bind('click', keeper.popup_prev);
			hold.p_next
				.bind('click', keeper.popup_next);

			hold.p.addClass( options.popupClass );

			keeper.init( keeper.ar );

			// end ********************************

			return this;

		},
		update : function() {
			var selector = this.selector.replace(/[#]+/g, '1_').replace(/[\.]+/g, '2_').replace(/[^a-z0-9_]+/ig, '').slice(0,50),
				keeper = $.fn.popup.keeper[selector],
				ar, new_el;
			if(keeper) {
				ar = this,
				new_el = ar.not(keeper.ar);
			};
			keeper.ar = ar,
			keeper.total = ar.length;
			keeper.init(new_el);

			return new_el;
		},
		destroy : function() {
			var selector = this.selector.replace(/[#]+/g, '1_').replace(/[\.]+/g, '2_').replace(/[^a-z0-9_]+/ig, '').slice(0,50),
				keeper = $.fn.popup.keeper[selector];

			keeper.destroy();
			$.fn.popup.keeper[selector] = keeper = {};
		}

	};

	$.fn.popup.functions = {
		groupElements : function(start, end, ar, g_ar, options) {
			for(var i=start; i<end; i++) {
				var g_name = ar[i].getAttribute(options.group);
				if( !g_name ) {
					g_name = 'g'+( (options.grouped)?0:i );
					ar[i].setAttribute( options.group, g_name );
				};
				if(!g_ar[g_name]) g_ar[g_name] = [];
				g_ar[g_name].push( $(ar[i]) );
				ar[i].setAttribute( 'data-popup-index', g_ar[g_name].length-1 );
			};

			return g_ar;
		},
		openPopup : function(o, l, p, p_wrapper, p_preload, p_error, body, line, options) {
			l.append(p);
			o.css({ 'display' : 'block' }).addClass( options.overlayClass );
			l.addClass( options.layerClass );
			p.css({ 'display' : 'block' });
			p_wrapper.css({ 'display' : 'none' });
			p_preload.css({ 'display' : 'block' });
			p_error.css({ 'display' : 'none' });
			if (options.block) body.css('overflow', 'hidden');

			if(line) {
				$.fn.popup.line[ $.fn.popup.line.length-1 ].css({ 'display' : 'none' });
			};
			$.fn.popup.line.push( p );

			return true;
		},
		setPopup : function(e, g, p_prev, p_next) {
			var index = e.data('popup-index'),
				total = g.length,
				tr = {
					prev : (index) ? true : false,
					next : (index != (total-1)) ? true : false
				},
				nav = {
					index : index,
					prev : (tr.prev) ? g[index-1] : null,
					next : (tr.next) ? g[index+1] : null
				};

			p_prev.removeClass('disabled').addClass( (tr.prev) ? '' : 'disabled' );
			p_next.removeClass('disabled').addClass( (tr.next) ? '' : 'disabled' );

			return nav;
		},
		loadPopup : function(e, p, p_wrapper, p_holder, p_holder_old, p_preload, p_error, parent_old, options, ar) {
			var title = e.attr('title'),
				p_title = p_wrapper.find('.popup-title'),
				p_content = p_holder.find('.popup-content'),
				html, parent;

			switch(options.type) {
				case 'html':
					html = $( e.attr('href').replace( /[^0-9a-zA-Z_#\-]+/g, '' ) );
					parent = html.parent();
					break;
				case 'iframe':
					html = $('<iframe class="popup-content-iframe" src="'+e.attr('href')+'" style="width: 100%; height: 100%;" frameborder="0" allowfullscreen="true">Error</iframe>');
					break;
				case 'image':
					html = $('<img class="popup-content-image" src="'+e.attr('href')+'" alt="" />');
					break;
				case 'ajax':
					options.request.url = e.attr('href');
					html = $('<div class="popup-content-ajax"></div>');
					break;
				case 'inline':
					html = $('<div>'+ options.content +'</div>');
					break;
			};

			p_holder_old.after( p_holder );
			if (title) {
				p_title.text(title).removeClass('disabled');

			} else {
				p_title.text('').addClass('disabled');
			};

			try {
				if( html.length != 1) { throw new Error('Error'); };
				switch(options.type) {
					case 'iframe':
					case 'image':
						p_content.html( html );
						html
							.bind('load', function() {
								return success();
							})
							.bind('error', function() {
								return error();
							});
						break;
					case 'html':
						p_content.html( html );
						if(parent_old) {
							parent_old.append( p_holder_old.find('.popup-content').children() );
						};
						return success();
						break;
					case 'ajax':
						$.ajax(options.request)
							.done(function( data ) {
								p_content.html( data );
								return success();
							})
							.fail(function() {
								return error();
							});
						break;
					case 'inline':
						p_content.html( html );
						return success();
						break;
				};
			} catch(er) {
				return error();
			};

			function success() {
				p_holder_old.remove();
				p_wrapper.css({ 'display' : 'block' }).css({ 'max-width' : '' });
				p_holder.css({ 'display' : 'block' });
				p_preload.css({ 'display' : 'none' });
				style();
				options.onLoad(e, p, ar);
				return (parent) ? parent : false;
			};
			function error() {
				p_holder_old.remove();
				p_wrapper.css({ 'display' : 'block' }).css({ 'max-width' : '' });
				p_preload.css({ 'display' : 'none' });
				p_error.css({ 'display' : 'block' });
				style();
				return false;
			};
			function style() {
				var w = (options.width == 'auto' && options.type == 'image') ? html.get(0).width : options.width,
					mw = html.get(0).width < html.get(0).height ? w : 680,
					h = options.height;
				p_wrapper.css({ 'max-width' : w/*, 'min-width': mw*/ });
				p_content.css({ 'height' : h });
			};
		},
		setCounter : function(p_counter, index, total, text) {
			p_counter.html( text.replace('{current}', index + 1).replace('{total}', total) );
		},
		unloadPopup : function(p_wrapper, p_preload, p_error, options) {
			p_preload.css({ 'display' : 'block' });
			p_error.css({ 'display' : 'none' });
		},
		closePopup : function(o, l, p, body, line, options) {
			if(!line) {
				o.css({ 'display' : 'none' }).removeClass( options.overlayClass );
				l.removeClass( options.layerClass );
				if (options.block) body.css({ 'overflow' : '' });
			};
			p.detach();

			$.fn.popup.line.pop();

			if(line) {
				$.fn.popup.line[$.fn.popup.line.length-1].css({ 'display' : 'block' });
			};

			return false;
		}
	};

	$.fn.popup.options = {
		template: null,
		overlay: null,
		layer: 'body',
		overlayClass: '',
		layerClass: '',
		popupClass: '',
		block: true,
		grouped: true,
		content: '',
		counter: false,
		counterText: '{current} / {total}',
		group: 'rel',
		type: 'image', //iframe, image, html, ajax
		width: 'auto',
		height: 'auto',
		request: {},
		onBeforeOpen: function() {}, //(element, popup)
		onOpen: function() {}, //(element, popup)
		onClose: function() {}, //(popup)
		onLoad: function() {}, //(element, popup, elements)
		onSet: function() {} //(element, popup, prev, next)
	};

	$.fn.popup.keeper = {};

	$.fn.popup.line = [];

})(jQuery);


(function($){

	$.fn.nslider = function( method ) {
		if ( $.fn.nslider.methods[ method ] ) {
		  return $.fn.nslider.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return $.fn.nslider.methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist' );
		}
	};

	$.fn.nslider.methods = {

		init : function( options ) {
	
			options = $.extend( {}, $.fn.nslider.options, options );
			var func = $.fn.nslider.func;
		
			return this.each(function() {

			// start ******************************

				// action start

				$(this).children().wrapAll('<div class="' + options.container + '"></div>');
				$(this).append('<div class="nslider-nav ' + options.nav + '"><a href="#" class="' + options.prev + '">Назад</a><a href="#" class="' + options.next + '">Дальше</a></div>');
				$(this).append('<div class="nslider-title ' + options.title + '"></div>');
				if(options.holderPoint) options.holderPoint.append('<div class="nslider-point ' + options.point + '"></div>'); else $(this).append('<div class="nslider-point ' + options.point + '"></div>');
				
				var e = $(this),
					c = e.find('.' + options.container),
					ar = c.children(),
					nav = e.children('.nslider-nav'),
					prev = nav.children('.' + options.prev),
					next = nav.children('.' + options.next),
					title = e.find('.nslider-title'),
					point = (options.holderPoint) ? options.holderPoint.find('.nslider-point') : e.children('.nslider-point'),
					pa = point.children('a'),
					count = e.find('.nslider-count'),
					total = ar.length,
					prop = {},
					add,
					interval_auto,
					nslider_mousedown, nslider_mousemove, nslider_mouseup;

				if(options.count > 1) {
					for( var i=0; i<total; i+=options.count ) {
						ar.slice( i, i+options.count).wrapAll('<div class="nslider-holder"></div>' );
					};
					var n = total%options.count;
					if(n) {
						add = ar.slice(total-options.count, total-n).clone(true);
					};
					ar = c.children(),
					total = ar.length;
					ar.last().prepend(add);
				};
				if(total < 2) {
					ar.unwrap().removeAttr('style');
					if(options.count > 1) {
						ar.children().unwrap();
					};
					nav.remove();
					point.remove();
					if(add) add.remove();
					return false;
				};
					
				func.preload(ar, point, total, init);

				function init(h) {
					prop.exindex = -1,
					prop.index = 0,
					prop.nav = {
						'prev' : false,
						'next' : true
					},
					prop.c_width = c.width(),
					prop.c_height = h,
					pa = point.children('a');
					ar.first().css({ 'position' : 'relative' }).siblings().css({ 'position' : 'absolute', 'display' : 'none' });
					c.css({ 'position' : 'relative'/*, 'overflow' : 'hidden'*/ });
					ar.css({ 'top' : 0, 'left' : 0, 'width' : '100%' });

					func.navigation(prev, next, prop.nav, pa, prop.index);
					func.count(count, prop.index+1, total);
					func.title(ar, title, prop.index);
					if(options.autoplay) autoOn();

					options.onLoad(prev, next, prop.index);
					options.onAnimateEnd(ar, prev, next, prop.index);

					prev.click(function() {
						autoOff();
						if(!prop.locked && (options.loop || prop.nav.prev)) {
							prevS();
						};
						return false;
					})
					.bind('mouseover', function() {
						options.onNavHover(nav, $(this), prop.index, (prop.nav.prev)?$(ar[prop.index-1]):(options.loop)?$(ar[total-1]):false );
					});
					next.click(function() {
						autoOff();
						if(!prop.locked && (options.loop || prop.nav.next)) {
							nextS();
						};
						return false;
					})
					.bind('mouseover', function() {
						options.onNavHover(nav, $(this), prop.index, (prop.nav.next)?$(ar[prop.index+1]):(options.loop)?$(ar[0]):false);
					});
					pa.click(function() {
						autoOff();
						if(!prop.locked) {
							pointS( Number(($(this).attr('href')).replace('#', '')) );
						};
						return false;
					});
				};
				function lock() {
					prop.locked = true;
				};
				function unlock() {
					prop.locked = false;
				};
				function prevS() {
					prop.exindex = prop.index,
					prop.index = prop.exindex-1,
					prop.index = (prop.index < 0) ? total-1 : prop.index,
					func.action(ar, prop, -1, options.speed, unlock, options.animation);
					action();
				};
				function nextS() {
					prop.exindex = prop.index,
					prop.index = prop.exindex+1,
					prop.index = (prop.index >= total) ? 0 : prop.index;
					func.action(ar, prop, 1, options.speed, unlock, options.animation);
					action();
				};
				function pointS(n) {
					prop.exindex = prop.index,
					prop.index = n;
					if(prop.exindex != prop.index) {
						func.action(ar, prop, (prop.index>prop.exindex)?1:-1, options.speed, unlock, options.animation);
						action();
					};
				};
				function action() {
					navigation();
					func.title(ar, title, prop.index);
					func.navigation(prev, next, prop.nav, pa, prop.index);
					func.count(count, prop.index+1, total);
					lock();
					options.onAnimateEnd(ar, prev, next, prop.index);
				};
				function navigation() {
					prop.nav.prev = (prop.index == 0) ? false : true;
					prop.nav.next = (prop.index == (total-1)) ? false : true;
				};
				function autoOn() {
					autoOff();
					interval_auto = setInterval(function() {
						nextS();
					}, options.autoplaySpeed);
				};
				function autoOff() {
					clearInterval(interval_auto);
				};
				// action end

				// api start
				e
					.bind('destroy', function() {
						$(document).unbind('mousemove', nslider_mousemove).unbind('mouseup', nslider_mouseup);
						e.unbind('destroy');
						ar.unwrap().removeAttr('style');
						if(options.count > 1) {
							ar.children().unwrap();
						};
						nav.remove();
						point.remove();
						if(add) add.remove();
					});
				// api end

			// end ********************************

			});
		},
		destroy : function() { 
			return this.each(function() {
				$(this).trigger('destroy');
			});
		}

	};

	$.fn.nslider.func = {

		preload : function(ar, point, loaded, func) {
			var h = 0, html = '';
			ar.each(function(i, v) {
				var e = $(this),
					img = e.find('img');
				html += '<a href="#'+i+'">'+(i+1)+'</a>'
				if(img.length) {
					var temp = new Image();
					$(temp).load(function() {
						loaded -= 1;
						h = (e.height() > h) ? e.height() : h;
						if(!loaded) {
							point.append(html);
							func(h);
						};
					});
					temp.src = img.attr('src');
				} else {
					loaded -= 1;
					h = (e.height() > h) ? e.height() : h;
					if(!loaded) {
						point.append(html);
						func(h);
					};
				};
			});
		},
		action : function(ar, prop, dir, speed, func, a) {
			switch(a) {
				case 1:
					$(ar[prop.exindex]).css({ 'position' : 'absolute', 'z-index' : '' }).stop(true).animate({
						opacity : 0,
						top: 50*dir*(-1)
					}, speed, function() {
						$(this).css({ 'top' : '', 'opacity' : '', 'display' : 'none' });
						func();
					});
					$(ar[prop.index]).css({ 'position' : 'relative', 'top': 50*dir, 'opacity' : 0, 'display' : 'block', 'z-index' : 1 }).stop(true).animate({
						opacity : 1,
						top: 0
					}, speed, function() {
						$(this).css({ 'opacity' : '', 'z-index' : '' });
					});
					break;
				case 2:
					$(ar[prop.exindex]).css({ 'position' : 'absolute', 'z-index' : '' }).stop(true).animate({
						opacity : 0,
						left: 50*dir*(-1)
					}, speed, function() {
						$(this).css({ 'left' : '', 'opacity' : '', 'display' : 'none' });
						func();
					});
					$(ar[prop.index]).css({ 'position' : 'relative', 'left': 50*dir, 'opacity' : 0, 'display' : 'block', 'z-index' : 1 }).stop(true).animate({
						opacity : 1,
						left: 0
					}, speed, function() {
						$(this).css({ 'opacity' : '', 'z-index' : '' });
					});
					break;
				case 3:
					$(ar[prop.exindex]).removeClass('f-active').css({ 'position' : 'absolute', 'z-index' : '' }).stop(true).animate({
						opacity : 1
					}, speed, function() {
						$(this).css({ 'opacity' : '', 'display' : 'none' });
						func();
					});
					$(ar[prop.index]).addClass('f-active').css({ 'position' : 'relative', 'opacity' : 0, 'display' : 'block', 'z-index' : 1 }).stop(true).animate({
						opacity : 1
					}, speed, function() {
						$(this).css({ 'opacity' : '', 'z-index' : '' });
					});
					break;
				case 4:
					$(ar[prop.exindex]).css({ 'position' : 'absolute', 'z-index' : '' }).stop(true).animate({
						opacity : 1
					}, speed, function() {
						$(this).css({ 'opacity' : '', 'display' : 'none' });
						func();
					});
					$(ar[prop.index]).css({ 'position' : 'relative', 'opacity' : 0, 'display' : 'block', 'z-index' : 1 }).stop(true).animate({
						opacity : 1
					}, speed, function() {
						$(this).css({ 'opacity' : '', 'z-index' : '' });
					});
					break;
			};
		},
		navigation : function(prev, next, nav, pa, index) {
			if(nav.prev) prev.removeClass('disabled');
			else prev.addClass('disabled');
			if(nav.next) next.removeClass('disabled');
			else next.addClass('disabled');
			pa.removeClass('active');
			$(pa[index]).addClass('active');
		},
		count : function(count, index, total) {
			count.html(index+'<span>/</span>'+total);
		},
		title : function(ar, title, index) {
			var t = $(ar[index]).attr('title');
			title.text( t ? t : '' );
		}

	};

	$.fn.nslider.options = {
		container: 'nslider-container',
		prev: 'nslider-nav-prev',
		next: 'nslider-nav-next',
		point: '',
		nav: '',
		title: '',
		holderPoint: null,
		holderNav: null,
		speed: 400,
		loop: false,
		animation: 3,
		count: 1,
		autoplay: false,
		autoplaySpeed: 4000,
		onNavHover: function() {},
		onLoad: function() {},
		onAnimateEnd: function() {}
	};
})(jQuery);