let ip = '';
const pageSize = 16;
//const pageNumber = 1;
let firstItem = 0;
//const last = pageSize - 1;
$(document).ready(function () {

    addNavButtonCode();


    $.getJSON("https://jsonip.com/?callback=?", function (data) {
        ip = data.ip;
    });

    const layout = $('#layout');

    const row = '<div class="row">';
    const columnDiv = '<div class="gallery_product col-md-3 col-sm-4 col-xs-6">';
    const endDiv = '</div>';
    $.ajax({
        url: "/api/tweets",
        method: "get",
        success: function (data) {

            generatePage(data);

        }

    });
});


const addNavButtonCode = function () {

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

const generatePage = function (data) {

    if (data.length === 0) {
        return
    }
    ;

    const tweets = JSON.stringify(data);

    const rows = [];
    const images = [];

    firstItem = data[0].pageIndex;
    //last  =  data[data.length - 1 ].pageIndex;
    $.each(data, function (i, item) {


        const photo = {};
        photo.url = item.mediaUrl;
        photo.thumbHeight = item.sizes[0].small.h;
        photo.thumbWidth = item.sizes[0].small.w;
        photo.largeHeight = item.sizes[0].large.h;
        photo.largeWidth = item.sizes[0].large.w;
        photo.tweetId = item.tweetId;

        const imageRow = '<div class="box"><a href="' + photo.url + '"><img src="' + photo.url + '" ></a></div>';

        images.push(photo);

    });


    justifyPhotos(images);
    addLightBox();
    addDeleteEvents();

}


const justifyPhotos = function (photos) {

    $('.layout').empty().justifiedImages({
        images: photos,
        rowHeight: 200,
        maxRowHeight: 400,
        thumbnailPath: function (photo, width, height) {
            const purl = photo.url;
            return purl;
        },
        template: function (photo) {

            const calculatedWidth = photo.displayWidth;
            const outerPrefix = '<div class="photo-container" style="height:' + photo.displayHeight + 'px;margin-right:' + photo.marginRight + 'px;">'
            const imageRow = '<img class="image-thumb" src="' + photo.url + '" style="width:' + calculatedWidth + 'px;height:' + photo.displayHeight + 'px;" >';
            const overlay = '<div class="overlay"><a href="' + photo.url + '"><span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span></a><span id="' + photo.tweetId + '" class="glyphicon glyphicon-remove" aria-hidden="true"></span></div>';
            return outerPrefix + imageRow + overlay + '</div>';
        },
        getSize: function (photo) {
            return {width: photo.thumbWidth, height: photo.thumbHeight};
        },
        margin: 1
    });

}


const addLightBox = function () {
    $(".overlay a").each(function (index) {
        const imageUrl = $(this).parent().parent().children('a').attr('href');
        const img = $(this).parent().parent().children('a');
        img.colorbox({
            photo: 'false', title: function () {
                const response = '<a href="' + imageUrl + '" target="_blank">Open In New Window</a>';
                return response;
            }
        });
    });
}


const addDeleteEvents = function () {
    $(".glyphicon-remove").each(function () {

        $(this).click(function () {
            const tweetId = this.id;
            $.ajax({
                url: "/api/tweet",
                method: "DELETE",
                data: {tweetId: tweetId, ip: ip},
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



