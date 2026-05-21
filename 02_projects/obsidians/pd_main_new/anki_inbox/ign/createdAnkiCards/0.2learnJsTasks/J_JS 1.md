
#J_JS
#JS

#telegram 

# **<u>🤔</u>****<u> Как бы добавлял статический метод в prototype?</u>**
<!-- basicblock-start oid="ObspPgtwPCNMtFZTD2RaCskL"  deck='J_JS' -->
**<u>🤔</u>****<u> Как бы добавлял статический метод в prototype?</u>**::


На самом деле, статические методы не добавляются в `prototype`, потому что они принадлежат самому классу, а не его экземплярам.  
Но если ты хочешь имитировать статический метод в `prototype`, можно использовать функцию-конструктор и добавить метод вручную.  

🚩**Как работают статические методы? (`static`)**  

В классе статические методы объявляются с помощью `static`. Они не находятся в `prototype`, а принадлежат самому классу.  
```
class User {
  static sayHello() {
    return "Привет!";
  }
}

console.log(User.sayHello()); // ✅ "Привет!"
console.log(User.prototype.sayHello); // ❌ undefined (нет в prototype)
```

🚩**Добавление "статического" метода в `prototype` (не совсем статический)**  

Если нужно, чтобы каждый объект имел доступ к "статическому" методу через `prototype`, можно сделать так
```
function User(name) {
  this.name = name;
}

// Добавляем метод в prototype
User.prototype.sayHello = function () {
  return "Привет!";
};

const user1 = new User("Иван");
console.log(user1.sayHello()); // ✅ "Привет!"
```

🚩**Добавление метода напрямую в сам класс (имитация `static`)**  

Если хочется добавить метод на сам класс, а не в `prototype`, можно сделать так
```
function User(name) {
  this.name = name;
}

// Добавляем метод прямо в функцию-конструктор
User.sayHello = function () {
  return "Привет!";
};

console.log(User.sayHello()); // ✅ "Привет!"
```

**Ставь** [**👍**](https://t.me/eo_test_task_bot)** и забирай** [**📚]**(https://t.me/eo_test_task_bot) [**Базу знаний**](https://t.me/easy_javascript_ru/596)
<!-- basicblock-end -->



