//mobile detec
/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 **/
(function (a) {
	(jQuery.browser=jQuery.browser||{}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4));
})(navigator.userAgent||navigator.vendor||window.opera);



//init
(function () {

	//document.body.className += (jQuery.browser.mobile) ? ' f-mobile' : ' f-desktop';

	$(function () {
		document.getElementById('main').style.minHeight = (window.innerHeight || 500) +'px';

		$('.e-gallary').colorbox({
			rel:'b-preview-link',
			transition:"fade",
			//maxWidth: 720,
			current: "{current} из {total}",
			onComplete: function(ins) {
				$('#colorbox').css({'margin-left': -ins.w/2});
			}
		});

		if (jQuery().popup) {
			$('.e-popup-img').popup({
				overlay: '#overlay',
				layer: '#layer',
				type: 'ajax',
				// width: 720,
				onLoad: function(el, popup) {
					popup.find('.b-slider').nslider({
						'count': 1,
						'point': 'hidden',
						'nav': 'b-slider-nav',
						'loop': true,
						'animation': 3
					});

				}
			});
		}
			$('.e-popup-video').colorbox({
				href: function(){
					return $(this).attr('data-ajax');
				},
				className: 'b-colorbox-video',
				transition:"fade",
				innerWidth: false,
				innerHeight: false,
				initialWidth: 0,
				initialHeight: 0,
				scrolling: false,				
				onComplete: function(ins) {
					var video_tag = $('#ajax-content').find('video');

					var videoH = parseInt(video_tag.css('height'));
					var videoW = parseInt(video_tag.css('width'));

					var screenH = $(window).height();
					var screenW = $(window).width();

					if(videoW > screenW){
						videoH = (screenW*videoH)/videoW;
						videoW = screenW;
					}

					var newVidH = screenH * 0.8;
					var newVidW = newVidH * (videoW/videoH);
					var newVidVerticalW = screenW * 0.8 ;
					var newVidVerticalH = newVidVerticalW * (videoH/videoW);

					if(videoH > screenH*0.8 && screenW > screenH){
						video_tag.css('height', newVidH);
						video_tag.css('width',newVidW);
						$('.b-colorbox-video#colorbox').css({'width': newVidW, 'height': newVidH, 'margin-left': - newVidW/2});
						$.colorbox.resize({width: newVidW +"px" , height: newVidH +"px"});

					}
					else if(videoW > screenW && screenW < screenH) {
						video_tag.css('height', newVidVerticalH);
						video_tag.css('width',newVidVerticalW);
						$('.b-colorbox-video#colorbox').css({'width': newVidVerticalW, 'height': newVidVerticalH, 'margin-left': - newVidVerticalW/2});
						$.colorbox.resize({width: newVidVerticalW +"px" , height: newVidVerticalH +"px"});
					}

					else {
						video_tag.css('height', videoH);
						video_tag.css('width',videoW);
						$('.b-colorbox-video#colorbox').css({'width': videoW, 'height': videoH, 'margin-left': -videoW/2});
						$.colorbox.resize({width: videoW +"px" , height: videoH +"px"});
					}

					video_tag.mediaelementplayer({
						startVolume: 1,
						features: ['playpause','current','duration','progress','volume','downloadlink','fullscreen'],
						alwaysShowControls: false,
						iPadUseNativeControls: true,
						iPhoneUseNativeControls: true,
						AndroidUseNativeControls: true,
						enableKeyboard: false,
						videoVolume: 'horizontal',
						pluginPath: '/media/mil/js/mediaelement/'
					});
				}
			});

		if(jQuery().mediaelementplayer) {
			$('video').mediaelementplayer({
				startVolume: 1,
				features: ['playpause','current','duration','progress','volume','downloadlink','fullscreen'],
				alwaysShowControls: false,
				iPadUseNativeControls: true,
				iPhoneUseNativeControls: true, 
				AndroidUseNativeControls: false,
				enableKeyboard: false,
				videoVolume: 'horizontal',
				pluginPath: '/media/mil/js/mediaelement/'
			});

			$('audio').mediaelementplayer({
				audioWidth: '100%',
				startVolume: 1,
				features: ['playpause','current','duration','progress','volume'],
				alwaysShowControls: false,
				iPadUseNativeControls: true,
				iPhoneUseNativeControls: true, 
				AndroidUseNativeControls: true,
				enableKeyboard: false,
				audioVolume: 'horizontal',
				pluginPath: '/media/mil/js/mediaelement/'
			});
		};

		var ar2 = $('.e-togglevideo');
		if (ar2.length) {
			ar2.each(function () {
				var el = $(this),
					v = el.find('video');
				v.bind('play', function () {
					el.addClass('f-active');
				}).bind('pause stop', function () {
					el.removeClass('f-active');
				});
			});
		};

		var ar3 = $('.e-toggle');
		if (ar3.length) {
			ar3.each(function () {
				var el = $(this),
					toggleTitle = el.find('.b-toggle-title');

				var fn_set = function(ar) {
					ar.find('.b-toggle-btn').html( ar.hasClass('is-close') ? 'Развернуть' : 'Свернуть');
				};

				$('<a href="#"></a>')
					.appendTo(toggleTitle)
					.addClass('b-toggle-btn')
					.bind('click', function(e) {
						e.preventDefault();
						el.toggleClass('is-close');
						fn_set(el);
					});

				fn_set(el);
			});
		}

		var ar4 = $('.b-tiny-slider');
		if (ar4.length) {
			ar4.each(function () {
				$(this).nslider({
					'count': 5,
					'point': 'hidden',
					'nav': 'b-slider-nav-tiny',
					'loop': true,
					'animation': 2
				});
			});
		}

		var ar5 = $('.e-column');
		if (ar5.length) {
			ar5.each(function () {
				var innerItems = $(this).children().size();
				$(this).addClass('col-'+innerItems);
			});
		}

		var ar6 = $('.b-tiny-slider-i');
		if (ar6.length) {
			ar6.each(function () {
				$(this).nslider({
					'count': 3,
					'point': 'hidden',
					'nav': 'b-slider-nav-tiny',
					'loop': true,
					'animation': 2
				});
			});
		}

		var ar7 = $('article table');
		if (ar7.length) {
			ar7.each(function () {
				if ( !$(this).parent().hasClass('b-table') ) {
					$(this).wrap('<div class="b-table"></div>')
				}
			});
		}

	});

	$(window).bind('load', function () {
		var ar1 = $('.e-autocolumnmenu');
		if (ar1.length) {
			ar1.each(function () {
				var el = $(this),
					ar = el.children(),
					w_tr = el.width()/2-60;
				for (var i=0, l=ar.length, w=0; i<l; i++) {
					w += $(ar[i]).width();
					if (w > w_tr) {
						ar.slice(0, i).wrapAll('<div class="f-column_left"></div>');
						ar.slice(i, l).wrapAll('<div class="f-column_right"></div>');
						return false;
					};
				};
			});
		};
	});

})();

var initVisionVersion = function () {
	var visionSettings;
    if (window.localStorage) {
        visionSettings = localStorage.visionSettings ? JSON.parse(localStorage.visionSettings) : {
            fontSize: "medium",
            theme: "black-white",
            images: !0
        };
    }else{
        visionSettings = {
            fontSize: "medium",
            theme: "black-white",
            images: !0
        };
	}

    function updateVision() {
        if (window.localStorage) {
            localStorage.visionSettings = JSON.stringify(visionSettings);
        }
        $('.vision-panel__btn-font-size[data-value="' + visionSettings.fontSize + '"]')
            .addClass("vision-panel__btn-font-size--checked")
            .siblings()
            .removeClass("vision-panel__btn-font-size--checked");
        $('.vision-panel__btn-theme[data-value="' + visionSettings.theme + '"]')
            .addClass("vision-panel__btn-theme--checked")
            .siblings()
            .removeClass("vision-panel__btn-theme--checked");
        $(".vision-panel__btn-images").toggleClass("vision-panel__btn-images--checked", !visionSettings.images);

        if ($("body").removeClass(function (e, t) {
                var i = "";
                return t.split(" ").forEach(function (e) {
                    -1 !== e.indexOf("vision-") && (i += " " + e)
                }), i
            })) {
            var e = "vision-version";
            e += " vision-font-size-" + visionSettings.fontSize, e += " vision-theme-" + visionSettings.theme, !visionSettings.images && (e += " vision-images-hidden"), $("body").addClass(e)
        }
    }

    $(document).on("click", '[data-toggle="vision-font-size"]', function (e) {
        e.preventDefault(), visionSettings.fontSize = $(this).data("value"), updateVision()
    }).on("click", '[data-toggle="vision-theme"]', function (e) {
        e.preventDefault(), visionSettings.theme = $(this).data("value"), updateVision()
    }).on("click", '[data-toggle="vision-images"]', function (e) {
        e.preventDefault(), visionSettings.images = !visionSettings.images, updateVision()
    })

    updateVision();
};

$(document).ready(function(){
	if($("body").hasClass("vision-version")) {
		initVisionVersion();
	}
});

// Add download link for video player
(function ($) {

    $.extend(MediaElementPlayer.prototype, {
        builddownloadlink: function (player, controls, layers, media) {
            var
            t = this,
            // create the loop button
            link =
                $('<div title="Скачать" class="mejs__button mejs__download-button">' +
                    '<button type="button" aria-controls="' + t.id + '"></button>' +
                '</div>')
                // append it to the toolbar
                .insertAfter(controls.find(".mejs-time-rail"))
                // add a click toggle event
                .click(function () {
                    var scr = player.media.currentSrc;
                    window.location.href = scr.replace('/upload/', '/download/upload/');
                });
        }
    });

})(mejs.$);

