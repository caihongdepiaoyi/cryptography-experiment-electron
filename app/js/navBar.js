/* Variables */
var home = $('#home')
var encrypt = $('#encrypt')
var decrpyt = $('#decrypt')
var home_c = $('#home_c');
var encrypt_c = $('#encrypt_c')

var nav_list = ['#home', '#encrypt', '#decrypt', '#other']
var content_list = ['#home_c', '#encrypt_c', '#decrypt_c', '#other_c']

$(nav_list[1]).click(function (event) {
    $(content_list[0]).hide();
    $(content_list[2]).hide();
    $(content_list[3]).hide();
    $(content_list[1]).fadeIn(500);

    if (!$(this).hasClass("a_hover")) {
        nav_list.forEach(function (v, i, a) {
            if ($(v).hasClass("a_hover")) {
                $(v).removeClass("a_hover")
            }
        })
        $(this).addClass("a_hover")

    }
})

$(nav_list[2]).click(function (event) {
    $(content_list[0]).hide();
    $(content_list[1]).hide();
    $(content_list[3]).hide();
    $(content_list[2]).fadeIn(500);
    if (!$(this).hasClass("a_hover")) {
        nav_list.forEach(function (v, i, a) {
            if ($(v).hasClass("a_hover")) {
                $(v).removeClass("a_hover")
            }
        })
        $(this).addClass("a_hover")
    }
})

$(nav_list[3]).click(function (event) {
    $(content_list[0]).hide();
    $(content_list[1]).hide();
    $(content_list[2]).hide();
    $(content_list[3]).fadeIn(500);
    if (!$(this).hasClass("a_hover")) {
        nav_list.forEach(function (v, i, a) {
            if ($(v).hasClass("a_hover")) {
                $(v).removeClass("a_hover")
            }
        })
        $(this).addClass("a_hover")
    }
})

$(nav_list[0]).click(function (event) {
    $(content_list[1]).hide();
    $(content_list[2]).hide();
    $(content_list[3]).hide();
    $(content_list[0]).fadeIn(500);
    if (!$(this).hasClass("a_hover")) {
        nav_list.forEach(function (v, i, a) {
            if ($(v).hasClass("a_hover")) {
                $(v).removeClass("a_hover")
            }
        })
        $(this).addClass("a_hover")
    }
})




//关闭遮盖层
// $("#btn2").click(function () {
//     $("#overlay").fadeOut(200);
//     $("#msg").hide();
// });