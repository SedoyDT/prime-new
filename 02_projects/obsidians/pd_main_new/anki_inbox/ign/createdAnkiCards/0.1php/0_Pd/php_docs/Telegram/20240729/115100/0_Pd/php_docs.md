
# Начало карточки

<!-- basicblock-start oid="ObsIYcaJbJTSAVGKap4INsb0"  deck='0_Pd_php_docs' -->
Что можно сказать про изолирование от html?::


Пример #1 Продвинутое изолирование с использованием условий

```


<?php if ($expression == true): ?>
  Это будет отображено, если выражение истинно.
<?php else: ?>
  В ином случае будет отображено это.
<?php endif; ?>

```


В этом примере PHP пропускает блоки, где условие не соблюдается. Даже несмотря на то, что они находятся вне пары открывающих/закрывающих тегов, PHP пропустит их в соответствии с условием, так как интерпретатор PHP будет перепрыгивать через блоки, содержащиеся внутри условия, которое не соблюдается.

При выводе больших блоков текста выход из режима синтаксического разбора PHP обычно более эффективен, чем отправка текста с помощью функций echo или print.

    Замечание:

    Кроме того, если вы намереваетесь вставлять PHP-код в XML или XHTML, чтобы соответствовать XML стандартам, вам следует использовать форму <?php ?>.



```

When the documentation says that the PHP parser ignores everything outside the <?php ... ?> tags, it means literally EVERYTHING. Including things you normally wouldn't consider "valid", such as the following:

<html><body>
<p<?php if ($highlight): ?> class="highlight"<?php endif;?>>This is a paragraph.</p>
</body></html>

Notice how the PHP code is embedded in the middle of an HTML opening tag. The PHP parser doesn't care that it's in the middle of an opening tag, and doesn't require that it be closed. It also doesn't care that after the closing ?> tag is the end of the HTML opening tag. So, if $highlight is true, then the output will be:

<html><body>
<p class="highlight">This is a paragraph.</p>
</body></html>

Otherwise, it will be:

<html><body>
<p>This is a paragraph.</p>
</body></html>

Using this method, you can have HTML tags with optional attributes, depending on some PHP condition. Extremely flexible and useful!|
```
<!-- basicblock-end -->

# Конец карточки

# Содержимое карточки
**Forwarded from [Анатолий Фролов](https://t.me/rempant)**

Что можно сказать про изолирование от html?

Пример #1 Продвинутое изолирование с использованием условий

```


<?php if ($expression == true): ?>
  Это будет отображено, если выражение истинно.
<?php else: ?>
  В ином случае будет отображено это.
<?php endif; ?>

```


В этом примере PHP пропускает блоки, где условие не соблюдается. Даже несмотря на то, что они находятся вне пары открывающих/закрывающих тегов, PHP пропустит их в соответствии с условием, так как интерпретатор PHP будет перепрыгивать через блоки, содержащиеся внутри условия, которое не соблюдается.

При выводе больших блоков текста выход из режима синтаксического разбора PHP обычно более эффективен, чем отправка текста с помощью функций echo или print.

    Замечание:

    Кроме того, если вы намереваетесь вставлять PHP-код в XML или XHTML, чтобы соответствовать XML стандартам, вам следует использовать форму <?php ?>.



```

When the documentation says that the PHP parser ignores everything outside the <?php ... ?> tags, it means literally EVERYTHING. Including things you normally wouldn't consider "valid", such as the following:

<html><body>
<p<?php if ($highlight): ?> class="highlight"<?php endif;?>>This is a paragraph.</p>
</body></html>

Notice how the PHP code is embedded in the middle of an HTML opening tag. The PHP parser doesn't care that it's in the middle of an opening tag, and doesn't require that it be closed. It also doesn't care that after the closing ?> tag is the end of the HTML opening tag. So, if $highlight is true, then the output will be:

<html><body>
<p class="highlight">This is a paragraph.</p>
</body></html>

Otherwise, it will be:

<html><body>
<p>This is a paragraph.</p>
</body></html>

Using this method, you can have HTML tags with optional attributes, depending on some PHP condition. Extremely flexible and useful!|
```



