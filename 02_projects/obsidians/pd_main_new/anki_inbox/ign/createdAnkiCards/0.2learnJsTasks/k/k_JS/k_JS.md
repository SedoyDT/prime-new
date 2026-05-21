
#k_JS
#JS

#telegram 

# var MODULE = (function (my) {
<!-- basicblock-start oid="ObsrEeGYxuIFOhH3TX8Y9Rq0"  deck='k_JS' -->
var MODULE = (function (my) {::

  var _private = my._private = my._private || {},
    _seal = my._seal = my._seal || function () {
      delete my._private;
      delete my._seal;
      delete my._unseal;
    },
    _unseal = my._unseal = my._unseal || function () {
      my._private = _private;
      my._seal = _seal;
      my._unseal = _unseal;
    };

  // постоянный доступ к _private, _seal и _unseal

  return my;
}(MODULE || {}));

Любой файл может устанавливать свойства на своей локальной переменной _private, и они будут немедленно доступны другим. Как только этот модуль будет полностью загружен, приложение должно вызвать MODULE._seal(), что предотвратит внешний доступ к внутреннему _private. Если этот модуль будет дополнен снова в течение жизненного цикла приложения, один из внутренних методов, в любом файле, может вызвать _unseal() перед загрузкой нового файла и вызвать _seal() снова после выполнения.

Этот паттерн пришел мне в
<!-- basicblock-end -->



