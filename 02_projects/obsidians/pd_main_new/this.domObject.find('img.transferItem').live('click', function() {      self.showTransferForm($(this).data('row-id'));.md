/home/anatoluy/amd-docker-dev/data/www/lp/master/public/js/analitics/managersblocks/filter/index.js  
// Перераспределение строки  
this.domObject.find('img.transferItem').live('click', function() {  
    self.showTransferForm($(this).data('row-id'));  
});


this.domObject = $('section#managers-blocks');


Этот код выполняет следующее:

1. `this.domObject.find('img.transferItem')` ищет все элементы `<img>` с классом `transferItem` внутри элемента, на котором вызывается метод `find`. `this.domObject` предположительно является объектом jQuery или jQuery-подобным объектом, который представляет DOM элемент, в котором выполняется поиск.

2. `.live('click', function() { ... })` привязывает обработчик события клика к найденным элементам `<img>` с классом `transferItem`. В старых версиях jQuery использовался метод `.live()` для делегирования обработчиков событий, но в более новых версиях jQuery он был заменён на `.on()`.

3. `function() { self.showTransferForm($(this).data('row-id')); }` - это функция обратного вызова, которая будет выполнена при клике на соответствующий `<img>` элемент. Внутри функции `$(this)` относится к конкретному элементу `<img>`, на который был совершен клик. `$(this).data('row-id')` использует метод jQuery `data()` для извлечения значения атрибута `data-row-id` этого `<img>` элемента.

Таким образом, при клике на любой `<img>` элемент с классом `transferItem` внутри `this.domObject`, будет вызван метод `self.showTransferForm()` с передачей значения `row-id` в качестве аргумента.