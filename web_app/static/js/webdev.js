var Share = {
    vkontakte: function (purl, ptitle) {
        var url = 'http://vkontakte.ru/share.php?';
        url += 'url=' + encodeURIComponent(purl);
        url += '&title=' + encodeURIComponent(ptitle);
        url += '&noparse=true';
        Share.popup(url);
    },
    odnoklassniki: function (purl, text) {
        var url = 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1';
        url += '&st.comments=' + encodeURIComponent(text);
        url += '&st._surl=' + encodeURIComponent(purl);
        Share.popup(url);
    },
    facebook: function (purl, ptitle) {
        var url = 'http://www.facebook.com/sharer.php?s=100';
        url += '&p[title]=' + encodeURIComponent(ptitle);
        url += '&p[url]=' + encodeURIComponent(purl);
        Share.popup(url);
    },
    twitter: function (purl, ptitle) {
        var url = 'http://twitter.com/share?';
        url += 'text=' + encodeURIComponent(ptitle);
        url += '&url=' + encodeURIComponent(purl);
        url += '&counturl=' + encodeURIComponent(purl);
        Share.popup(url);
    },

    popup: function (url) {
        window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
    }
};

$(function () {

    $('.e-popup-clbimg').click(function (e) {
        e.preventDefault();
        var url = $(this).attr('data-ajax');
        $.get(url, function (data) {
            var item;
            var layer = $('#layer');

            for (var i in data.list) {
                item = data.list[i];
                if (item.href) {
		    var title_res = "";
		    if(item.title && item.title.length > 0){
			title_res = "<div class='cboxTitle-in'>"+item.title+"</div>";
		    }
                    $('<a>')
                        .attr({href: item.href, title: title_res})
                        .text(item.title)
                        .appendTo(layer)
                        .addClass('b-colorbox-link hidden');
                }

                $('.b-colorbox-link').colorbox({
                    'rel': 'b-colorbox-link',
                    transition: "fade",
                    maxWidth: '100%',
                    current: "{current} из {total}",
                    onComplete: function(ins) {
                        $('#colorbox').css({'margin-left': -ins.w/2});
                        var title = $('#cboxGalaryTitle');

                        if (title.size()) {
                            title.text(data.title);
                        } else {
                            $('<div id="cboxGalaryTitle"></div>')
                                .appendTo('#cboxContent')
                                .text(data.title);
                        }
                    },
                    onClosed: function () {
                        $('#layer .hidden').remove();
                    }
                });

                $('.b-colorbox-link').eq(0).trigger('click')
            }
        });
    });

    $('.e-gallery-markup').colorbox({
        'rel': 'b-preview-link',
        transition: "fade",
        maxWidth: '100%',
        current: "{current} из {total}",
        onComplete: function(ins) {
            $('#colorbox').css({'margin-left': -ins.w/2});
        },
        onClosed: function () {
            $('#layer .hidden').remove();
        }
    });

});