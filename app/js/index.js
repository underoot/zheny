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
  });

  $('#update_captcha').click(function() {
    $.get('http://zheny-memory.underoot.ru/captcha', function(data) {
      updateCaptcha(data.image, data.uid);
    });
  });

  $('#submit').click(function() {

    $.ajax('http://zheny-memory.underoot.ru', {
      type: 'PUT',
      data: $('.form-memory').serialize()
    }).fail(function(jqXHR) {

      var body = jqXHR.responseJSON;

      updateCaptcha(body.image, body.uid);

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
        $('.form-memory').append(new String(
          '<div class="alert alert-danger alert-dismissible" role="alert">'
            + '<button type="button" class="close" data-dismiss="alert">'
            + '<span aria-hidden="true">&times;</span><span class="sr-only">Закрыть</span></button>'
            + '<strong>Ошибка на сервере!</strong> Попробуйте повторить запрос позднее!'
          + '</div>')
        );
        break;

      }
    }).done(function() {
      $('.form-memory').hide().html(new String(
        '<div class="alert alert-success alert-dismissible" role="alert">'
          + '<button type="button" class="close" data-dismiss="alert">'
          + '<span aria-hidden="true">&times;</span><span class="sr-only">Закрыть</span></button>'
          + '<strong>Сообщение отправлено!</strong> После проверки администратором ваше воспоминание появится здесь!'
        + '</div>')
      ).show();
    });
  });
});
