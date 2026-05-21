
#P_pet-tasks
#pet-tasks

#telegram 

# Как выглядит базвый роутинг в моем calendar (задание 9 от Вовы)?
<!-- basicblock-start oid="ObsTLu3uTc4AcY2cqWEf9r1X"  deck='P_pet-tasks' -->
Как выглядит базвый роутинг в моем calendar (задание 9 от Вовы)?::


```
// Функция для маршрутизации с использованием регулярных выражений
function indexRoute($routes) {
    $uri = $_SERVER["REQUEST_URI"];

    foreach ($routes as $pattern => $callback) {
        if (preg_match($pattern, $uri, $params)) {
            // Если найдено совпадение, вызываем соответствующий callback
            return $callback($params[0]);
        }
    }

    // Если ничего не найдено, вызываем 404
    handle404();
}

// Определяем маршруты и связанные с ними обработчики
$routes = [
    // Маршрут для месяца в году (например, /calendar/year/2024/10)
    REGEX_YEAR_MONTH => function ($params) {
        handleMonthRequest($params);
    },

    // Маршрут для года (например, /calendar/year/2024)
    REGEX_YEAR => function ($params) {
        echo json_encode(handleYearRequest($params));
    },

    // Маршрут для общего календаря (например, /calendar)
    '/\/calendar\/?$/' => function () use ($template) {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            echo $template;
        } else {
            handle404();
        }
    },

];
```
<!-- basicblock-end -->



