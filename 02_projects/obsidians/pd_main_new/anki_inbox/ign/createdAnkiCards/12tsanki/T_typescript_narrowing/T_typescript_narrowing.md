
#T_typescript_narrowing
#typescript_narrowing

#telegram 

# Что можно сказать про проверку исчерпываемости Что такое Exhaustiveness Checking??
<!-- basicblock-start oid="ObsNMuM9RSOAcWNY4PPi5fCk"  deck='T_typescript_narrowing' -->
Что можно сказать про проверку исчерпываемости Что такое Exhaustiveness Checking??::


**Объяснение Exhaustiveness Checking в TypeScript:**

### Что такое Exhaustiveness Checking?
Exhaustiveness checking (проверка исчерпываемости) — это механизм в TypeScript, который позволяет гарантировать, что все возможные варианты типов в union (объединении) были обработаны. Это полезно для предотвращения ошибок, когда вы забываете добавить новый вариант типа в условие `switch` или `if`.

### Как работает never type?
- **Тип `never`**: 
  - Это специальный тип в TypeScript, который указывает на значение, которое никогда не произойдёт. Например, функция, которая всегда выбрасывает исключение или никогда не возвращает результат, будет иметь тип `never`.
  - **Присваиваемость**: `never` может быть присвоен любому типу, но никакой тип не может быть присвоен `never` (кроме самого `never`). Это означает, что если в вашем коде есть ситуация, в которой TypeScript ожидает `never`, это указывает на то, что не должно быть никаких других возможностей.

### Пример с функцией `getArea`
Рассмотрим приведённый пример:

```
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape; // Проверка исчерпываемости
      return _exhaustiveCheck;
  }
}
```

1. **Обработка всех случаев**: 
   - В этой функции мы обрабатываем все возможные случаи для типа `Shape` — `circle` и `square`. 
   - Если ни один из этих случаев не совпадает, выполнение кода перейдёт к `default`, где мы пытаемся присвоить `shape` переменной типа `never`.

2. **Проверка исчерпываемости**: 
   - Если в union `Shape` добавляется новый тип, например `Triangle`, TypeScript выдаст ошибку при попытке присвоить `shape` переменной типа `never`. Это означает, что мы не обработали новый случай, и это поможет нам выявить ошибку на этапе компиляции.

```
interface Triangle {
  kind: "triangle";
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape; // Ошибка
      return _exhaustiveCheck; // Type 'Triangle' is not assignable to type 'never'.
}
```

### Вывод
Использование `never` в конструкции `default` функции позволяет TypeScript проверять, что вы не забыли учесть все варианты типов. Это делает код более безопасным и уменьшает вероятность ошибок, которые могут возникнуть при добавлении новых типов в ваши объединения.
<!-- basicblock-end -->



