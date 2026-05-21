
# Начало карточки

<!-- basicblock-start oid="Obs7cfA2rdyn0Bu6KWWOM2dR"  deck='0_Pd_CSSHTML_5_styles' -->
Что можно сказать про псевдокласс :is() :where() ?::


```

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>METANIT.COM</title>
    <style>
        /* header > p, main > p, footer > p {font-size: 18px; font-family: Verdana;} альтернативный вариант без :is*/
        :is(header, main, footer) > p  {font-size: 18px; font-family: Verdana;}
         
        :where(header, main, footer) > p  {font-size: 18px; font-family: Verdana;}
    </style>
</head>
<body>
<header>
    <p>Text in Header</p>
    <div><p>Text in Header Div</p></div>
</header>
<main>
    <p>Text in Main</p>
    <div><p>Text in Main Div</p></div>
</main>
<footer>
    <p>Text in Footer</p>
    <div><p>Text in Footer Div</p></div>
</footer>
</body>
</html>

```
is и where здесь отработают одинаково, но с одной лишь разницей - В чем же разница между :is() и :where()? Псевдокласс :is() применяет каскадность стилей (selector specificity), которая определяется по селектору с самым большим рангом. А для стилей псевдокласса :where() ранг селекторов всегда равен 0.
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что можно сказать про псевдокласс :is() :where() ?

```

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>METANIT.COM</title>
    <style>
        /* header > p, main > p, footer > p {font-size: 18px; font-family: Verdana;} альтернативный вариант без :is*/
        :is(header, main, footer) > p  {font-size: 18px; font-family: Verdana;}
         
        :where(header, main, footer) > p  {font-size: 18px; font-family: Verdana;}
    </style>
</head>
<body>
<header>
    <p>Text in Header</p>
    <div><p>Text in Header Div</p></div>
</header>
<main>
    <p>Text in Main</p>
    <div><p>Text in Main Div</p></div>
</main>
<footer>
    <p>Text in Footer</p>
    <div><p>Text in Footer Div</p></div>
</footer>
</body>
</html>

```
is и where здесь отработают одинаково, но с одной лишь разницей - В чем же разница между :is() и :where()? Псевдокласс :is() применяет каскадность стилей (selector specificity), которая определяется по селектору с самым большим рангом. А для стилей псевдокласса :where() ранг селекторов всегда равен 0.



