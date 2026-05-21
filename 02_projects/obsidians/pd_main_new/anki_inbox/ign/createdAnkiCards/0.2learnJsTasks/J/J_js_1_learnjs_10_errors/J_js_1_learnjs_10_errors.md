
#J_js_1_learnjs_10_errors
#js_1_learnjs_10_errors

#telegram 

# Как выглядит интересный пример обработки ошибки?
<!-- basicblock-start oid="ObsYrZ7DCOBJDzWIZTdTUZag"  deck='J_js_1_learnjs_10_errors' -->
Как выглядит интересный пример обработки ошибки?::


```
class ReadError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = 'ReadError';
  }
}

class ValidationError extends Error { /*...*/ }
class PropertyRequiredError extends ValidationError { /* ... */ }

function validateUser(user) {
  if (!user.age) {
    throw new PropertyRequiredError("age");
  }

  if (!user.name) {
    throw new PropertyRequiredError("name");
  }
}

function readUser(json) {
  let user;

  try {
    user = JSON.parse(json);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new ReadError("Синтаксическая ошибка", err);
    } else {
      throw err;
    }
  }

  try {
    validateUser(user);
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new ReadError("Ошибка валидации", err);
    } else {
      throw err;
    }
  }

}

try {
  readUser('{bad json}');
} catch (e) {
  if (e instanceof ReadError) {
    alert(e);
    // Исходная ошибка: SyntaxError:Unexpected token b in JSON at position 1
    alert("Исходная ошибка: " + e.cause);
  } else {
    throw e;
  }
}
```
<!-- basicblock-end -->




#J_js_1_learnjs_10_errors
#js_1_learnjs_10_errors

#telegram 

# Что можно сказать в общем про обработку ошибок в js?
<!-- basicblock-start oid="Obs3CNslfU1gg4MLy9qP4Q5V"  deck='J_js_1_learnjs_10_errors' -->
Что можно сказать в общем про обработку ошибок в js?::



    Мы можем наследовать свои классы ошибок от Error и других встроенных классов ошибок, но нужно позаботиться о свойстве name и не забыть вызвать super.
    Мы можем использовать instanceof для проверки типа ошибок. Это также работает с наследованием. Но иногда у нас объект ошибки, возникшей в сторонней библиотеке, и нет простого способа получить класс. Тогда для проверки типа ошибки можно использовать свойство name.
    Обёртывание исключений является распространённой техникой: функция ловит низкоуровневые исключения и создаёт одно «высокоуровневое» исключение вместо разных низкоуровневых. Иногда низкоуровневые исключения становятся свойствами этого объекта, как err.cause в примерах выше, но это не обязательно.
<!-- basicblock-end -->



