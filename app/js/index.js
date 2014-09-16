$(function() {

  function addCaptcha(image, uid) {

    $('.captcha')
      .append('<img src="' + image + '">')
      .find('input').val(uid);

  };

  function updateCaptcha(image, uid) {

    $('.form-memory .captcha > img').attr('src', image);
    $('.form-memory .captcha > input').val(uid);

  };

  $.get('http://zheny-memory.underoot.ru/captcha', function(data) {
    addCaptcha(data.image, data.uid);
  }).fail(function() {
    $('.form-memory').html(new String(
      '<div class="alert alert-info alert-dismissible" role="alert">'
        + '<button type="button" class="close" data-dismiss="alert">'
        + '<span aria-hidden="true">&times;</span><span class="sr-only">Закрыть</span></button>'
        + '<strong>Сервер временно не доступен!</strong> Попробуйте повторить запрос позднее '
        + 'или оправьте воспоминание <a href="mailto:alexshoronov@gmail.com">сюда</a>!'
      + '</div>')
    );
  });

  $('#update_captcha').click(function() {
    $.get('http://zheny-memory.underoot.ru/captcha', function(data) {
      updateCaptcha(data.image, data.uid);
    });
  });

  $('#submit').click(function() {
    var validate = true;

    $('.form-memory input.form-control').each(function() {
      if($(this).val().trim() === "") {
        validate = false;
      };
    });

    if(!validate) {
      $('.form-memory').append(new String(
        '<div class="alert alert-warning alert-dismissible" role="alert">'
          + '<button type="button" class="close" data-dismiss="alert">'
          + '<span aria-hidden="true">&times;</span><span class="sr-only">Закрыть</span></button>'
          + '<strong>Должны быть заполнены все поля!</strong>'
        + '</div>')
      );
      return;
    };

    $.ajax('http://zheny-memory.underoot.ru', {
      type: 'PUT',
      data: $('.form-memory').serialize()
    }).fail(function(jqXHR) {

      var body = jqXHR.responseJSON;

      if(body === undefined) {
        $('.form-memory').html(new String(
          '<div class="alert alert-info alert-dismissible" role="alert">'
            + '<button type="button" class="close" data-dismiss="alert">'
            + '<span aria-hidden="true">&times;</span><span class="sr-only">Закрыть</span></button>'
            + '<strong>Сервер временно не доступен!</strong> Попробуйте повторить запрос позднее '
            + 'или оправьте сообщение <a href="mailto:alexshoronov@gmail.com">сюда</a>'
          + '</div>')
        );

        return;
      };

      updateCaptcha(body.image, body.uid);
      $('.row-captcha input[name="captcha"]').val("").focus();

      switch(jqXHR.status) {
        case 403:
        $('.form-memory').append(new String(
          '<div class="alert alert-warning alert-dismissible" role="alert">'
            + '<button type="button" class="close" data-dismiss="alert">'
            + '<span aria-hidden="true">&times;</span><span class="sr-only">Закрыть</span></button>'
            + '<strong>Код с картинки введен неверно!</strong>'
          + '</div>')
        );
        break;

        case 404:
        $('.form-memory').append(new String(
          '<div class="alert alert-warning alert-dismissible" role="alert">'
            + '<button type="button" class="close" data-dismiss="alert">'
            + '<span aria-hidden="true">&times;</span><span class="sr-only">Закрыть</span></button>'
            + '<strong>Превышен тайм-аут запроса!</strong>'
          + '</div>')
        );
        break;

        case 500:
        $('.form-memory').html(new String(
          '<div class="alert alert-danger alert-dismissible" role="alert">'
            + '<button type="button" class="close" data-dismiss="alert">'
            + '<span aria-hidden="true">&times;</span><span class="sr-only">Закрыть</span></button>'
            + '<strong>Ошибка на сервере!</strong> Попробуйте повторить запрос позднее!'
          + '</div>')
        );
        break;

      }
    }).done(function() {
      $('.form-memory').html(new String(
        '<div class="alert alert-success alert-dismissible" role="alert">'
          + '<button type="button" class="close" data-dismiss="alert">'
          + '<span aria-hidden="true">&times;</span><span class="sr-only">Закрыть</span></button>'
          + '<strong>Сообщение отправлено!</strong> После проверки администратором ваше воспоминание появится здесь!'
        + '</div>')
      );
    });
  });
});
