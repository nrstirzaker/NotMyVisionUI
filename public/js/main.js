var ip = '';
$(document).ready(function () {

    

    $.getJSON("http://jsonip.com/?callback=?", function (data) {
        console.log(data);
        ip = data.ip;
    });

    var layout = $('#layout');

    const row = '<div class="row">';
    const columnDiv = '<div class="gallery_product col-md-3 col-sm-4 col-xs-6">';
    const endDiv = '</div>';
    $.ajax({
        url: "/api/tweets",
        method: "get",
        success: function (data) {



            var tweets = JSON.stringify(data);

            var rows = [];
            var images = [];

            $.each(data, function (i, item) {


                var photo = {};
                photo.url = item.mediaUrl;
                photo.thumbHeight = item.sizes[0].small.h;
                photo.thumbWidth = item.sizes[0].small.w;
                photo.largeHeight = item.sizes[0].large.h;
                photo.largeWidth = item.sizes[0].large.w;
                photo.tweetId = item.tweetId;



                //var imageRow = '<div class="box"><a href="' + photo.url + '"><img src="' + photo.url + '" width="' + photo.thumbWidth + '" height="' + photo.thumbHeight + '" ></a></div>';
                var imageRow = '<div class="box"><a href="' + photo.url + '"><img src="' + photo.url + '" ></a></div>';
                //images.push(imageRow);
                images.push(photo);




                if ((i % 4) === 0) {

                    //	<div class="col-md-3 col-sm-4 col-xs-6"><img class="img-responsive" src="http://2.bp.blogspot.com/-H6MAoWN-UIE/TuRwLbHRSWI/AAAAAAAABBk/89iiEulVsyg/s400/Free%2BNature%2BPhoto.jpg" /></div>
                    //<a data-fancybox="gallery" href="big_1.jpg"><img src="small_1.jpg"></a>
                    // var image1 = data[i + 3].mediaUrl;
                    // var imageRow1 = columnDiv + '<a data-fancybox="gallery" href="' + image1 + '"><img src="' + image1 + '" class="img-responsive"/></a></div>';
                    // var imageRow2 = columnDiv + '<img src="' + data[i + 2].mediaUrl + '" class="img-responsive"/></div>';
                    // var imageRow3 = columnDiv + '<img src="' + data[i + 1].mediaUrl + '" class="img-responsive"/></div>';
                    // var imageRow4 = columnDiv + '<img src="' + data[i].mediaUrl + '" class="img-responsive"/></div>';

                    // rows.push(row + imageRow1 + imageRow2 + imageRow3 + imageRow4 + endDiv);


                }



            });

            //$('.gallery-container').append(rows[0]).append(rows[1]).append(rows[2]).append(rows[3]);
            console.log("start");
            //$('#layout').append(images).nested('append',images);
            //$('#layout').nested();
            justifyPhotos(images);
            console.log("middle");
            addLightBox();
            addDeleteEvents();
            //addFrames(images);
            console.log("finish");

        }

    });
});

var justifyPhotos = function (photos) {

    // savvior.init('#layout', {
    //     "screen and (max-width: 20em)": { columns: 2 },
    //     "screen and (min-width: 20em) and (max-width: 40em)": { columns: 3 },
    //     "screen and (min-width: 40em)": { columns: 4 },
    // });

    // var options = {
    //     method: 'append',
    //     clone: false
    // };
    // //var someItems = document.querySelectorAll('.new-items');
    // savvior.addItems('#layout', images, options, function (grid) {
    //     // All done by now.
    //     console.log(grid);
    // });


    $('.layout').empty().justifiedImages({
        images: photos,
        rowHeight: 200,
        maxRowHeight: 400,
        thumbnailPath: function (photo, width, height) {
            var purl = photo.url;
            return purl;
        },
        template: function (photo) {


            var calculatedWidth = photo.displayWidth;// + 1;
            //var activeDiv = '<div class="frame-me" style="width:' + calculatedWidth + 'px;height:' + Math.round(calculatedWidth) + 'px;" >';
            var outerPrefix = '<div class="photo-container" style="height:' + photo.displayHeight + 'px;margin-right:' + photo.marginRight + 'px;">'
            var imageRow = '<img class="image-thumb" src="' + photo.url + '" style="width:' + calculatedWidth + 'px;height:' + photo.displayHeight + 'px;" >';
            //var imageRow = '<img class="image-thumb" src="' + photo.url + '" style="width:' + calculatedWidth + 'px;height:' + photo.displayHeight + 'px;" >';

            //<img class="image-thumb" src="http://pbs.twimg.com/media/C_VPjwSW0AEt_0J.jpg" style="width: 417px; height: 258px;">
            //var imageRow = '<div class="box"><a href="' + photo.url + '"><img src="' + photo.url + '" ></a></div>';
            //return activeDiv + outerPrefix + imageRow + '</div>' + '</div>';
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
    console.log("start:lightbox");
    $(".overlay a").each(function (index) {
        var imageUrl = $(this).parent().parent().children('a').attr('href');
        var img = $(this).parent().parent().children('a');
        img.colorbox({
            photo: 'false', title: function () {
                var response = '<a href="' + imageUrl + '" target="_blank">Open In New Window</a>';
                return response;
            }
        });
        //colorbox();
    });
    console.log("end:lightbox");
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
                    console.log('success');
                    location.reload();
                },
                fail: function(error){
                    console.log(error);
                }
            })

        })

    })
}