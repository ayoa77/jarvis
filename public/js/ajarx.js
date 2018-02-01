$(document).ready(function () {
    $(function () {
        var url = window.location.href;
        var modal = url.match(/#modal=[^\?]+/);
        console.log(modal);
        if (modal == "#modal=email-verify") { modalLoad("modal-email-verify"); }
        if (modal == "#modal=pass-reset") { modalLoad("modal-pass-reset"); }
        if (modal == "#modal=user-edit") { modalLoad("modal-user-edit"); }
        if (modal == "#modal=login") { modalLoad("modal-login"); }
        if (modal == "#modal=restricted-country") {modalLoad("modal-restricted-country")};
    });
    // $(window).bind('hashchange', (function () {
        // window.addEventListener('popstate', (function () {
            
    window.addEventListener('popstate', (function () {
        var url = window.location.href;
        // var modal = url.match(/#modal=([^\?]+)/)[1];
        // console.log(modal);
        // if (modal == "#modal=email-verify") { modalLoad("modal-email-verify"); }
        // if (modal == "#modal=pass-reset") {modalLoad("modal-pass-reset"); }
        // if (modal == "#modal=user-edit") {modalLoad("modal-user-edit"); }
        // if (modal == "#modal=login") {modalLoad("modal-login"); 
        // if (modal == "#modal=restricted-country") { modalLoad("modal-restricted-country") };
    }));
    
    //ajax the startup setter
    $(function() {
        $.ajax({
            type: 'POST',
            url: '/startup',
            data: 'starting up'
        })
        .done(function (data) {
            console.log("AJAX READY.");
        });
    });

    //ajax login 
    $(document).on('click', '#loginButton', function (ev) {
        ev.preventDefault();
        body = ($("#loginForm").serialize());
        // console.log(body)
        $.ajax({
            method: 'POST',
            url: `/login`,
            data: body
            })
            .done(function (data) {
                // console.log(data)
                if (typeof data.redirect === 'string' || data.redirect instanceof String) {
                    // alert(JSON.stringify(data.message));
                    location.href = location.protocol + '//' + data.redirect;
                } else {
                    errorHandle(data);
                    // alert(JSON.stringify(data));
                }
            });
    });

    //ajax register
    $(document).on('click', '#registerButton', function(ev) {
        ev.preventDefault();
        body = ($("#registerForm").serialize());
        console.log(body)
                $.ajax({
            method: 'POST',
            url: `/register`,
            data: body
            })
        .done(function (data) {
            console.log(data)
                if (typeof data.redirect === 'string' || data.redirect instanceof String) {
                    console.log(data);
                    console.log(location.protocol + '//' + data.redirect )
                    alert(data.message);
                    
                location.href = location.protocol + '//' + data.redirect 
                }else{
                    errorHandle(data.message);
                // alert(JSON.stringify(data));
                // location.reload();
            }
        });
    });
        
    // send email for password reset
    $(document).on('click', '#emailResetButton', function (ev) {
        ev.preventDefault();
        body = ($("#forgotPassForm").serialize());
        console.log(body)
        $.ajax({
            method: 'POST',
            url: `/emailresetpassword`,
            data: body
        })
        .done(function (data) {
            console.log(data)
            if (typeof data.redirect === 'string' || data.redirect instanceof String) {
                errorHandle(data.message);
                // alert(JSON.stringify(data.message));
                location.href = location.protocol + '//' + data.redirect;
                //location.reload
            } else {
                errorHandle(data);
                // alert(JSON.stringify(data));
            };
        });
    })
        
    // Ajax reset password
    $(document).on('click', '#passwordResetButton', function (ev) {
        ev.preventDefault();
        body = ($("#passwordResetForm").serialize());
        console.log(body)
        $.ajax({
            method: 'POST',
            url: `/resetpassword`,
            data: body

            })
            .done(function (data) {
                console.log(data)
                if (typeof data.redirect === 'string' || data.redirect instanceof String) {
                    // alert(JSON.stringify(data.message));
                    errorHandle(data.message);
                    location.href = location.protocol + '//' + data.redirect
                } else if (typeof data.failure === 'string' || data.failure instanceof String) {
                    // alert(JSON.stringify(data.message));
                    errorHandle(data.message);
                    location.href = location.protocol + '//' + data.failure
                } else {
                    errorHandle(data);
                    // alert(JSON.stringify(data));
                }
            });
    })

    //ajax send verification email
    $(document).on('click', '#verifyButton', function (ev) {
        ev.preventDefault();

        body = ($("#sendVerificationForm").serialize());
        $.ajax({
            method: 'POST',
            url: `//modal/email-verify`,
            data: body
            // contentType: "application/json",
            // dataType: "json"
        })

        .done(function (data) {
            if (typeof data.redirect === 'string' || data.redirect instanceof String) {
                // alert(JSON.stringify(data.message));
                errorHandle(data.message);
                location.href = location.protocol + '//' + data.redirect
            } else {
                // alert(JSON.stringify(data));
                errorHandle(data);
                //      location.reload();
            }
        });
    });


    //ajax user editor
    $(document).on('click', '#editUserButton', function (ev) {
        ev.preventDefault();
        body = ($("#editUserForm").serialize());
        console.log(body)
        $.ajax({
            method: 'POST',
            url: `/user`,
            data: body
        })
        .done(function (data) {
            console.log(data)
            if (typeof data.redirect === 'string' || data.redirect instanceof String) {
                // alert(JSON.stringify(data.message));
                errorHandle(data.message);
                location.href = location.protocol + '//' + data.redirect
            } else if (typeof data.failure === 'string' || data.failure instanceof String) {
                // alert(JSON.stringify(data.message));
                errorHandle(data.message);
                location.href = location.protocol + '//' + data.failure
            } else {
                // alert(JSON.stringify(data));
                errorHandle(data);
            }
        });

    })   
});


function errorHandle(data) {
    $('.error-handling').css('height', '80px');
    $('.error-handling').text(data);
    setTimeout(function() {
        $('.error-handling').css('height', '0px');
        $('.error-handling').text("");
    }, 3000)
}
