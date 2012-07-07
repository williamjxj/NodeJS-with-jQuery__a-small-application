/**
 * Created with JetBrains WebStorm.
 * User: william
 * Date: 10/06/12
 * Time: 4:26 PM
 * To change this template use File | Settings | File Templates.
 */
// Display 'Facebook Connect' icon
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=194915770634421";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(document).ready(function() {
  $('#regModal').modal({ show: false });
  $('#logModal').modal({ show: false });

	//////////////////////////////////////////////
    // $('#picker1').birthdaypicker({ minAge: 13 });

    $('#register, #login_form').css('margin-bottom', '0px');
    $('#regModal').find('.modal-body').css({height:"400px", maxHeight:"450px" });

    $('#reset').click(function() {
        $('#regModal').find('.modal-body').css({height:"400px", maxHeight:"450px" });
        $('div.control-group').removeClass('error');
        $('span.help-inline, span.search').fadeOut(200);
        $('#birthday_day, #birthday_month, #birthday_year', '#register').css('color', '#000');
    });

    function isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(emailAddress);
    };

    ///////////////////  Register  ///////////////////////////
    // Popover
    $('#register input').hover(function() {
        $(this).popover('show')
    });
    $('#register select').hover(function() {
        $(this).popover('show')
    });

    $.validator.addMethod("ge13", function(value, element) {
        // console.log(parseInt(value));
        var y1 = new Date().getFullYear();
        var y2 = parseInt(value) || y1;
        return !isNaN(value) && (y1-parseInt(value) >= 13);
    }, "Register age must be 13 years or older");


    var register_validator = $("#register").validate({
    rules:{
      username:"required",
      pm_email:{required:true,email: true},
      pm_email1:{required:true,email: true, equalTo: "#pm_email"},
      pm_passwd:{required:true,minlength: 6},
      firstname:"required",
      lastname: "required",
      sex:"required",
      birthday_date:"required",
      birthday_month:"required",
      birthday_year:"required",
      birthday_year: "ge13"
    },

    messages:{
      username:"Enter your username",
      pm_email:{
        required:"Enter your email address",
      email:"Enter valid email address"},
      pm_email1:{
        required:"Enter confirm email address",
        equalTo:"Email and Confirm Email must match"},
      pm_passwd:{
        required:"Enter your password",
        minlength:"Password must be minimum 6 characters"},
      firstname:"Enter your firstname",
      lastname:"Enter your lastname",
      sex:"Select Gender",
      birthday_month:"",
      birthday_day:"",
      birthday_year:""
    },

    errorClass: "help-inline",
    errorElement: "span",
    highlight:function(element, errorClass, validClass) {
      $(element).parents('.control-group').addClass('error');
    },
    unhighlight: function(element, errorClass, validClass) {
      $(element).parents('.control-group').removeClass('error');
      $(element).parents('.control-group').addClass('success');
    }
  });

	$('#register button:submit').click(function(e) {

		if(register_validator.form()) {
            return true;
        }
		else {
			$('#regModal').find('.modal-body').css({height:"450px", maxHeight:"520px" });
            var m=$('#birthday_month option:selected').val()
                , d=$('#birthday_day option:selected').val()
                , y=$('#birthday_year option:selected').val()
                , msg
                , div = $('<div/>').addClass('birthdate_error').css('color', '#BD4247');
            if(m==''||d==''||y=='') {
                msg = 'Complete Birthday information is needed.';
            }
            else if (y>2000) {
                msg = 'Only 13 years or older are allowed.'
            }
            else {
                msg = 'Error in Birthday: ' + m + '-' + n + '-' + y;
            }
            var t = $('#birthday_year').closest('.controls');
            t.parents('.control-group').removeClass('success').addClass('error');
            if(t.children('div.birthdate_error').html()!=null) {
                t.children('div.birthdate_error').hide().html(msg).fadeIn(1000);
            }
            else {
                $(div).html(msg).appendTo(t).show();
            }
            return false;
		}
	});

    $('#birthday_day, #birthday_month, #birthday_year', '#register').change(function(e) {
        e.preventDefault();
        var t = $(e.target);
        // alert(t.get(0).selectedIndex); Apr->4, Jul->7
        if(t.find('option:selected').val() !='') {
            t.css('color', '#BD4247');
            //t.find('option:first').css('color', '#BD4247');
        }
    });

    // Here why siblings() other than next():
    // because jquery.validator() auto insert <span/> between <input> and <span class="search">
    $('#regModal #username, #regModal #pm_email, #regModal #pm_email1').change(function(e) {
        e.preventDefault();

        var imgs = {
            'tick24':'/img/tick24.png',
            'cross24':'/img/cross24.png',
            'loading':'/img/loading.gif'
        };
        var inp = $(e.target);
        var img1 = $("<img/>").attr({'src': imgs.loading, 'title':'Loading...' });
        var img2 = $("<img/>").attr({'src': imgs.cross24, 'title':'User already exists.' });
        var img3 = $("<img/>").attr({'src': imgs.tick24, 'title':'User is available' });
        var t = inp.attr('id') + '=' + inp.val();
        var obj = $(e.target);

        if(/email/.test(obj.attr('id'))) {
            if( !isValidEmailAddress(obj.val())) {
                //alert(str.val());
                return false;
            }
            if( ($('pm_email1').val()!='') &&
                ($('pm_email12').val()!='') &&
                ($('pm_email1').val() != $('pm_email2').val()) ) {
                return false;
            }
        }

        $.ajax({
            type: 'get',
            url: '/checkAvailable',
            data: t,
            dataType: 'jsonp',
            jsonpCallback: "_callback",
            cache: false,
            beforeSend: function() {
                inp.siblings('span.search').prepend(img1).fadeIn(100);
            },
            success: function(data) {
                var obj = eval("(" + data + ')');
                if(obj.code) {
                    inp.siblings('span.search').find('img').replaceWith(img2).fadeIn(100);
                    inp.parents('.control-group').removeClass('success').addClass('error');
                    var msg;
                    if(/username/.test(inp.attr('id'))) {
                        msg = 'User [' + inp.val() + '] already exists.';
                    }
                    else if(/email/.test(inp.attr('id'))) {
                        msg = 'Email [' + inp.val() + '] already exists in DB.';
                    }
                    else {
                        msg = 'The input [' + inp.val() + '] already exists in DB.';
                    }
                    if(inp.siblings('div.help-inline').length) {
                        inp.siblings('div.help-inline').empty().html(msg);
                    }
                    else {
                        $('<div/>').addClass('help-inline').html(msg).insertAfter(inp.siblings('span.search'));
                    }
                    inp.select().focus();
                }
                else {
                    inp.parents('.control-group').removeClass('error').addClass('success');
                    inp.siblings('div.help-inline').empty().hide();
                    inp.siblings('span.search').find('img').replaceWith(img3).fadeIn(100);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
        /*
        if (! ($("#register").validate.element($('#username'))
            && $("#register").validate.element($('#pm-email1'))
            && $("#register").validate.element($('#pm-email2')))) {
            return false;
        }*/

    });


    //////////////////////// Login ////////////////////////////

    $('#login_form input').hover(function() {
        $(this).popover('show')
    });

    var login_validator = $("#login_form").validate({
        rules:{
            password2:{required:true,minlength: 6},
            email2:{required:true,email: true}
        },

        messages:{
            password2:{
                required: "Enter your Password",
                minlength:"Password must be minimum 6 characters"},
            email2:{
                required:"Enter your email address",
                email:"Enter valid email address"}
        },

        errorClass: "help-inline",
        errorElement: "span",
        highlight:function(element, errorClass, validClass) {
            $(element).parents('.control-group').addClass('error');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).parents('.control-group').removeClass('error');
            $(element).parents('.control-group').addClass('success');
        }
    });

    var rememberme = function() {
        var expires_day = 365;
        if ($('#rememberme2').is(':checked')) {
            $.cookie('pm[email]', $('#email2').val(), { expires: expires_day });
            $.cookie('pm[password]', $('#password2').val(), { expires: expires_day });
            $.cookie('pm[remember]', true, { expires: expires_day });
        }
        else {
            // reset cookies.
            $.cookie('pm[email]', null);
            $.cookie('pm[password]', null);
            $.cookie('pm[remember]', false);
        }
        return true; //let it continue
    };

    // ajax not work. '/login' can't be captured.
	$('#login_form button:submit').click(function(e) {
		e.preventDefault();

        if (login_validator.form()) {
            rememberme();

            var f = $('#login_form')
                , loading = $("<img/>").attr({'src': '/img/loading.gif', 'title':'Loading...' })
                , str = f.find('button:submit').text()
                , err = $('<div/>').addClass('alert alert-error').css('margin-bottom', '0px');

            $.ajax({
                type: f.attr('method'),
                url: f.attr('action'),
                data:f.serialize(),
                cache: false,
                dataType: 'jsonp',
                jsonpCallback: "_callback",
                beforeSend: function() {
                    f.find('button:submit').html(loading);
                },
                success: function(data) {
                    var obj = eval("(" + data + ')');
                    if(obj.msg != "1") {
                        var t1 = $('#email2').val()
                            , t2 = $('#password2').val()
                            , t3 = 'Invalid username or password - email: [' + t1 + '], password: [' + t2 +']';
                        if($('#logModal').children('div.alert').html()!=null ) {
                            $('#logModal').children('div.alert').hide().html(t3).fadeIn(1000);
                        }
                        else {
                            //err.html(t3).insertBefore('#logModal div.modal-header').show();
                            err.html(t3).insertBefore('#login_form').show();
                        }
                    }
                    else {
                        document.location.href="/"; // or window.reload()
                    }
                },
                complete: function(data) {
                    f.find('button:submit').text(str);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert('error ' + textStatus + " " + errorThrown);
                }
            });
        }
		return false;
	});


    ///////////////////////// Edit Profile ///////////////////////////
    $('#editModal').modal({ show: false });
    $('a.edit_pm').live('click', function(e) {
        e.preventDefault();
        // alert($(this).attr('href'));
        var url = $(this).attr('href');
        $.ajax({
            type: 'get',
            url: url,
            cache: false,
            success: function(data) {
                $('#editModal').modal({ show: true });
                // console.log(data);
                $('#editModal').html(data).show()
            },
            complete: function(data) {
                //$('#editModal').html(data).show();
                //$('<div/>').html(data).prepend('body');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
        // It is absolute to prevent a href to execute.
        return false;
    });


    ///////////////////////// Others /////////////////////////////
    /* for birthday picker:
     $('#register').submit(function() {
     var y = $('select.birth-year').val()
     , m = $('select.birth-month').val()
     , d = $('select.birth-day').val();
     if ((y===undefined || m===undefined || d===undefined) || (y=='0' || m==='0' || d=='0'))
     {
     alert('Birthday can not be null');
     $('select.birth-month').focus();
     return false;
     }
     return true;
     });
     */

});
