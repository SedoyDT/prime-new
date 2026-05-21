
#L_linux
#linux

#telegram 

# Как использовать xclip?
<!-- basicblock-start oid="Obsm1bdfV48AHsZ1Azx6ysoH"  deck='L_linux' -->
Как использовать xclip?::


`xclip` — это утилита для командной строки в Linux, которая позволяет работать с буфером обмена (clipboard). Она может быть использована для копирования данных в буфер обмена и вставки данных из него. Вот несколько основных примеров использования:

### Установка `xclip`
Чтобы установить `xclip`, используйте пакетный менеджер для вашей системы. Например, на системах, основанных на Debian/Ubuntu, выполните:

```
sudo apt-get install xclip
```

### Основные команды `xclip`

#### 1. Копирование текста в буфер обмена
Можно скопировать вывод любой команды в буфер обмена. Например, чтобы скопировать строку "Привет, мир!" в буфер обмена:

```
echo "Привет, мир!" | xclip -selection clipboard
```

#### 2. Вставка текста из буфера обмена
Чтобы вставить текст из буфера обмена в командную строку или другую программу:

```
xclip -selection clipboard -o
```

Здесь `-o` используется для вывода содержимого буфера обмена.

#### 3. Копирование содержимого файла в буфер обмена
Чтобы скопировать содержимое файла в буфер обмена:

```
xclip -selection clipboard < file.txt
```

#### 4. Вставка содержимого из буфера обмена в файл
Чтобы вставить текст из буфера обмена в файл:

```
xclip -selection clipboard -o > file.txt
```

### Буферы `xclip`
`xclip` работает с несколькими буферами обмена:
- `-selection clipboard` — основной буфер обмена (системный).
- `-selection primary` — буфер, используемый для текста, выделенного мышкой.
- `-selection secondary` — используется реже и имеет вспомогательное значение.

Обычно используется именно `clipboard` для копирования и вставки данных через системный буфер обмена.
<!-- basicblock-end -->




#L_linux
#linux

#telegram 

# git diff > $(git branch --show-current).patch && cat $(git branch --show-current).patch && mv $(git branch --show-current).patch ~/Documents && ll ~/Documents
<!-- basicblock-start oid="ObssqV3LTkVDsNbWr10UYB98"  deck='L_linux' -->
git diff > $(git branch --show-current).patch && cat $(git branch --show-current).patch && mv $(git branch --show-current).patch ~/Documents && ll ~/Documents::


<!-- basicblock-end -->



