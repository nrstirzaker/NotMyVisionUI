var ip = '';
var pageSize = 16;
//var pageNumber = 1;
var firstItem = 0;
//var last = pageSize - 1;
$(document).ready(function () {

    addNavButtonCode();

    $.getJSON("https://jsonip.com/?callback=?", function (data) {
        ip = data.ip;
    });

    var layout = $('#layout');

    var row = '<div class="row">';
    var columnDiv = '<div class="gallery_product col-md-3 col-sm-4 col-xs-6">';
    var endDiv = '</div>';
    $.ajax({
        url: "/api/tweets",
        method: "get",
        success: function (data) {

            generatePage(data);

        }

    });
});



var addNavButtonCode = function () {

    $('#btn-back').click(function () {
        $.ajax({
            url: "/api/tweets?back=" + firstItem,
            method: "get",
            success: function (data) {

                generatePage(data);

            }

        });
    });

    $('#btn-forward').click(function () {
        $.ajax({
            url: "/api/tweets?forward=" + firstItem,
            method: "get",
            success: function (data) {

                generatePage(data);

            }

        });
    });

}

var generatePage = function (data) {

    if (data.length === 0) {return}; 

    var tweets = JSON.stringify(data);

    var rows = [];
    var images = [];

    firstItem = data[0].pageIndex;
    //last  =  data[data.length - 1 ].pageIndex;
    $.each(data, function (i, item) {


        var photo = {};
        photo.url = item.mediaUrl;
        photo.thumbHeight = item.sizes[0].small.h;
        photo.thumbWidth = item.sizes[0].small.w;
        photo.largeHeight = item.sizes[0].large.h;
        photo.largeWidth = item.sizes[0].large.w;
        photo.tweetId = item.tweetId;
        
        var imageRow = '<div class="box"><a href="' + photo.url + '"><img src="' + photo.url + '" ></a></div>';
        
        images.push(photo);

    });


    justifyPhotos(images);
    addLightBox();
    addDeleteEvents();

}


var justifyPhotos = function (photos) {

    $('.layout').empty().justifiedImages({
        images: photos,
        rowHeight: 200,
        maxRowHeight: 400,
        thumbnailPath: function (photo, width, height) {
            var purl = photo.url;
            return purl;
        },
        template: function (photo) {

            var calculatedWidth = photo.displayWidth;
            var outerPrefix = '<div class="photo-container" style="height:' + photo.displayHeight + 'px;margin-right:' + photo.marginRight + 'px;">'
            var imageRow = '<img class="image-thumb" src="' + photo.url + '" style="width:' + calculatedWidth + 'px;height:' + photo.displayHeight + 'px;" >';
            var overlay = '<div class="overlay"><a href="' + photo.url + '"><span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span></a><span id="' + photo.tweetId + '" class="glyphicon glyphicon-remove" aria-hidden="true"></span></div>';
            return outerPrefix + imageRow + overlay + '</div>';
        },
        getSize: function (photo) {
            return { width: photo.thumbWidth, height: photo.thumbHeight };
        },
        margin: 1
    });

}



var addLightBox = function () {
    $(".overlay a").each(function (index) {
        var imageUrl = $(this).parent().parent().children('a').attr('href');
        var img = $(this).parent().parent().children('a');
        img.colorbox({
            photo: 'false', title: function () {
                var response = '<a href="' + imageUrl + '" target="_blank">Open In New Window</a>';
                return response;
            }
        });
    });
}


var addDeleteEvents = function () {
    $(".glyphicon-remove").each(function () {

        $(this).click(function () {
            var tweetId = this.id;
            $.ajax({
                url: "/api/tweet",
                method: "DELETE",
                data: { tweetId: tweetId, ip: ip },
                success: function (data) {
                    location.reload();
                },
                fail: function (error) {
                    console.log(error);
                }
            })

        })

    })
}

