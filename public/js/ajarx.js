$(document).ready(function () {
    $(function () {
        var frm = $('#registerForm');
        frm.submit(function (ev) {
            ev.preventDefault();
            $.ajax({
                type: frm.attr('method'),
                url: frm.attr('action'),
                dataType: "jsonp",
                data: frm.serialize(),
                success: function (data) {
                    alert('ok');
                },
                error: function (data) {
                    console.log(data)
                }
            });
        });
    });

    $(function () {
        var frm = $('#loginForm');
        frm.submit(function (ev) {
            ev.preventDefault();
            $.ajax({
                type: frm.attr('method'),
                url: frm.attr('action'),
                dataType: "jsonp",
                data: frm.serialize(),
                success: function (data) {
                    alert('ok');
                },
                error: function (data) {
                    console.log(data)
                }
            });
        });
    });
    $(function () {
        var frm = $('#verificationForm');
        frm.submit(function (ev) {
            ev.preventDefault();
            $.ajax({
                type: frm.attr('method'),
                url: frm.attr('action'),
                dataType: "jsonp",
                data: frm.serialize(),
                success: function (data) {
                    alert('ok');
                },
                error: function (data) {
                    console.log(data)
                }
            });
        });
    });
    $(function () {
        var frm = $('#editUserForm');
        frm.submit(function (ev) {
            ev.preventDefault();
            $.ajax({
                type: frm.attr('method'),
                url: frm.attr('action'),
                dataType: "jsonp",
                data: frm.serialize(),
                success: function (data) {
                    alert('ok');
                },
                error: function (data) {
                    console.log(data)
                }
            });
        });
    });
});