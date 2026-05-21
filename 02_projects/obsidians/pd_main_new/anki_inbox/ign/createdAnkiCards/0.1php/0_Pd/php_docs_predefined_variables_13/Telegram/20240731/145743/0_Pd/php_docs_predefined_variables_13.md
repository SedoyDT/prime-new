
# Начало карточки

<!-- basicblock-start oid="ObsvSNFb9s2m50bbAlShL35K"  deck='0_Pd_php_docs_predefined_variables_13' -->
Для чего используется $http_response_header?::


Массив (array) $http_response_header похож на функцию get_headers(). При использовании обёртки HTTP, $http_response_header будет заполняться заголовками ответа HTTP. $http_response_header будет создан в локальной области видимости. 

$http_response_header — Заголовки ответов HTTP

Пример #1 Пример $http_response_header

```


<?php
function get_contents() {
  file_get_contents("http://example.com");
  var_dump($http_response_header); // переменная заполняется в локальной области видимости
}
get_contents();
var_dump($http_response_header); // вызов функции get_contents() не заполняет переменную вне области видимости функции
?>
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Для чего используется $http_response_header?

Массив (array) $http_response_header похож на функцию get_headers(). При использовании обёртки HTTP, $http_response_header будет заполняться заголовками ответа HTTP. $http_response_header будет создан в локальной области видимости. 

$http_response_header — Заголовки ответов HTTP

Пример #1 Пример $http_response_header

```


<?php
function get_contents() {
  file_get_contents("http://example.com");
  var_dump($http_response_header); // переменная заполняется в локальной области видимости
}
get_contents();
var_dump($http_response_header); // вызов функции get_contents() не заполняет переменную вне области видимости функции
?>
```



