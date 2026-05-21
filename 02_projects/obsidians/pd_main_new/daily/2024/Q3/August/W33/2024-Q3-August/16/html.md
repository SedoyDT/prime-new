---
author: Frolov Anatolui
date: 2024-08-16
time: 13:08:37
aliases: 
- 
tags:
- unique-note
---


```HTML
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Таблица 16x16</title>
    <style>
        table {
            border-collapse: collapse;
        }
        td {
            width: 20px;
            height: 20px;
            text-align: center;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <table>
        <?php
            require 'for_loop.php';
            // require 'foreach_loop.php';
            // require 'while_loop.php';
        ?>
    </table>
</body>
</html>

```