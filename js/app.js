var validateForm = (function() {
  console.log("hello!");
  //prywatne wlasciwosci
  var options = {};
  var classError = 'error';

  //etap 3

  var showFieldValidation = function(input, inputIsValid) {
    if (!inputIsValid) {
      if (!input.parentNode.className || input.parentNode.className.indexOf(options.classError)==-1) {
        input.parentNode.className += ' ' + options.classError
      }
    } else {
      var regError = new RegExp('(\\s|^)'+options.classError+'(\\s|$)');
      input.parentNode.className = input.parentNode.className.replace(regError, '');
    }
  };

  //input text
  var testInputText = function(input) {
    var inputIsValid = true;
    var pattern = input.getAttribute('pattern');

    if (pattern != null) {
      var reg = new RegExp(pattern, 'gi');
      if (!reg.test(input.value)) {
        inputIsValid = false;
      }
    } else {
      if (input.value=='') {
        inputIsValid = false;
      }
    }
    if (inputIsValid) {
      showFieldValidation(input, true);
      return true;
    } else {
      showFieldValidation(input, false);
      return false;
    }
  };

  //input email
  var testInputEmail = function(input) {
      var fieldHasError = false;
      var mailReg = new RegExp('^[0-9a-zA-Z_.-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,3}$', 'gi');

      if (!mailReg.test(input.value)) {
          showFieldValidation(input, false);
          return false;
      } else {
          showFieldValidation(input, true);
          return true;
      }
  };

  //select
  var testInputSelect = function(select) {
    if (select.options[select.selectedIndex].value=='' || select.options[select.selectedIndex].value=='-1') {
      showFieldValidation(select, false);
      return false;
    } else {
      showFieldValidation(select, true);
      return true;
    }
  };

  //checkbox
  var testInputCheckbox = function(input) {
    var name = input.getAttribute('name');
    var group = input.form.querySelectorAll('input[name="'+name+'"]:checked');

    if (group.length) {
      showFieldValidation(input, true);
      return true;
    } else {
      showFieldValidation(input, false);
      return false;
    }
  };

  //etap 2
  var prepareElements = function() {
    var elements = options.form.querySelectorAll('input[required], textarea[required], select[required]');

    [].forEach.call(elements, function(element) {
      //usuwamy atrybut required - inaczej przy wysyłaniu wyskakiwały by domyślne błędy przeglądarki
      element.removeAttribute('required');
      //dodajemy klasę - po niej będziemy później sprawdzać pola
      element.className += ' required';

      //sprawdzamy typ pola
      if (element.nodeName.toUpperCase() == 'INPUT') {
        var type = element.type.toUpperCase();

        //dla każdego pola dodajemy obsługę funkcji sprawdzającej
        if (type == 'TEXT') {
          element.addEventListener('keyup', function() {testInputText(element)});
          element.addEventListener('blur', function() {testInputText(element)});
        }
        if (type == 'EMAIL') {
          element.addEventListener('keyup', function() {testInputEmail(element)});
          element.addEventListener('blur', function() {testInputEmail(element)});
        }
        if (type == 'CHECKBOX') {
          element.addEventListener('click', function() {testInputCheckbox(element)});
        }
        if (type == 'TEL') {
          element.addEventListener('click', function() {testInputCheckbox(element)});
        }
      }
      if (element.nodeName.toUpperCase() == 'SELECT') {
        element.addEventListener('change', function() {testInputSelect(element)});
      }
    });
  };


  //etap 4
  //submit

  var formSubmit = function() {
    options.form.addEventListener('submit', function(e) {
      e.preventDefault();

      var validated = true;

      //pobieramy wszystkie pola, którym wcześniej ustawiliśmy klasę .required
      var elements = options.form.querySelectorAll('.required');

      //podobne działanie już robiliśmy przy przygotowywaniu pól
      [].forEach.call(elements, function(element) {
        if (element.nodeName.toUpperCase() == 'INPUT') {
          var type = element.type.toUpperCase();
          if (type == 'EMAIL') {
            if (!testInputEmail(element)) validated = false;
          }
          if (type == 'TEXT') {
            if (!testInputText(element)) validated = false;
          }
          if (type == 'CHECKBOX') {
            if (!testInputCheckbox(element)) validated = false;
          }
          if (type == 'TEL') {
            if (!testInputCheckbox(element)) validated = false;
          }
        }
        if (element.nodeName.toUpperCase() == 'SELECT') {
          if (!testInputSelect(element)) validated = false;
        }
      });

      if (validated) {
        this.submit();
      } else {
        return false;
      }
    });
  };


  //etap 1 i 4
  var init = function(_options) {
    //do naszego modulu bedziemy przekazywac opcje
    options = {
      form : _options.form || null,
      classError : _options.classError || 'error'
    }
    if (options.form == null || options.form == undefined || options.form.length==0) {
      console.warn('validateForm: Źle przekazany formularz');
      return false;
    }
    prepareElements();
    formSubmit();
  }

  return {
    init : init
  }


})();


document.addEventListener("DOMContentLoaded", function() {
  var form = document.querySelector('.form');
  validateForm.init({form : form})
});
