var validateForm = (function() {

  //prywatne wlasciwosci
  var options = {};

  //metoda publiczna
  var init = function(_options) {
    //do naszego modulu bedziemy przekazywac opcje
    //przekazane ustawimy w zmiennej options naszego modulu, lub ustawimy domyslne
    options = {
      form : _options.form || null,
      classError : _options.classError || 'error'
    }
    if (options.form == null || options.form == undefined || options.form.length==0) {
      console.warn('validateForm: Źle przekazany formularz');
      return false;
    }
  }

  return {
    init : init
  }

})();
