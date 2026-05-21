
#P_php_functions
#php_functions

#telegram 

# str_replace php example
<!-- basicblock-start oid="ObsmEBbhuCtFi5gd3bUI9KMC"  deck='P_php_functions' -->
str_replace php example::


In PHP, `str_replace` is used to replace occurrences of a search string with a replacement string within a given string.

Here’s an example of how to use `str_replace`:

### Example:

```
<?php
// Original string
$originalString = "Hello, world! Welcome to the PHP world.";

// Replace "world" with "universe"
$replacedString = str_replace("world", "universe", $originalString);

// Output the result
echo $replacedString;
?>
```

### Output:
```
Hello, universe! Welcome to the PHP universe.
```

### Explanation:
- The `str_replace()` function takes three arguments:
  1. The **search** string (the string you want to find).
  2. The **replace** string (the string you want to replace it with).
  3. The **original string** (the string where the search will occur).

In the example above:
- `"world"` is replaced with `"universe"` in the `$originalString`.
<!-- basicblock-end -->




#P_php_functions
#php_functions

#telegram 

# Работа str_replace с ассоциативными массивами
<!-- basicblock-start oid="Obsa0X6qGkmTvVKfg0cBN3QO"  deck='P_php_functions' -->
Работа str_replace с ассоциативными массивами::


В PHP функция `str_replace` не поддерживает напрямую использование ассоциативных массивов, но вы можете использовать их с небольшой модификацией, например, с помощью цикла или функции `array_keys()` и `array_values()`.

Если у вас есть ассоциативный массив, где ключи — это строки для поиска, а значения — это строки для замены, вы можете выполнить замену с использованием этих массивов.

### Пример с ассоциативным массивом:

```
<?php
// Исходная строка
$originalString = "Hello, world! Welcome to PHP programming world.";

// Ассоциативный массив для поиска и замены
$replaceArray = array(
    "world" => "universe", // заменяем "world" на "universe"
    "PHP" => "Python"      // заменяем "PHP" на "Python"
);

// Преобразуем ассоциативный массив в два обычных массива для поиска и замены
$search = array_keys($replaceArray);
$replace = array_values($replaceArray);

// Выполним замену
$replacedString = str_replace($search, $replace, $originalString);

// Выводим результат
echo $replacedString;
?>
```

### Вывод:
```
Hello, universe! Welcome to Python programming universe.
```

### Объяснение:
- **Ассоциативный массив `$replaceArray`** содержит строки для поиска как ключи и строки для замены как значения.
- Функция `array_keys($replaceArray)` извлекает ключи массива и создает массив для поиска.
- Функция `array_values($replaceArray)` извлекает значения массива и создает массив для замены.
- После этого мы передаем эти массивы в `str_replace()`, чтобы выполнить замену в исходной строке.

Этот подход позволяет использовать ассоциативные массивы для замены нескольких строк в одном вызове `str_replace()`.
<!-- basicblock-end -->




#P_php_functions
#php_functions

#telegram 

# str_replace example with array 
<!-- basicblock-start oid="ObsWY69BqMktwYhf5vlxfjr8"  deck='P_php_functions' -->
str_replace example with array ::


In PHP, `str_replace` can also work with arrays, both for the search and replacement strings. When using arrays, you can replace multiple occurrences of different search strings with their corresponding replacements.

### Example with Arrays:

```
<?php
// Original string
$originalString = "Hello, world! Welcome to the PHP world.";

// Arrays of search strings and replacement strings
$search = array("world", "PHP");
$replace = array("universe", "Python");

// Replace all occurrences from the arrays
$replacedString = str_replace($search, $replace, $originalString);

// Output the result
echo $replacedString;
?>
```

### Output:
```
Hello, universe! Welcome to the Python universe.
```

### Explanation:
- The `str_replace()` function is passed two arrays:
  - **$search**: An array containing the strings we want to replace (e.g., `"world"` and `"PHP"`).
  - **$replace**: An array containing the corresponding replacement strings (e.g., `"universe"` and `"Python"`).
  
Each occurrence of the strings in the **$search** array will be replaced with the corresponding string in the **$replace** array. The replacement happens in order, so `"world"` becomes `"universe"` and `"PHP"` becomes `"Python"` in the `$originalString`.

### Important Note:
- The arrays **$search** and **$replace** must have the same number of elements. Each element in the **$search** array corresponds to an element in the **$replace** array.
<!-- basicblock-end -->



