---
author: Frolov Anatolui
date: 2024-08-16
time: 13:08:12
aliases: 
- 
tags:
- unique-note
---
```PHP
<?php
$combinations = [];
$i = 0;

while ($i < 16 * 16) {
    $combination = '';

    $temp = $i;
    while ($temp >= 0) {
        $combination = chr($temp % 26 + ord('A')) . $combination;
        $temp = floor($temp / 26) - 1;
    }

    $combinations[] = $combination;
    $i++;
}

$i = 0;
while ($i < 16) {
    echo "<tr>";
    $j = 0;
    while ($j < 16) {
        $index = $i * 16 + $j;
        $hue = $index * (360 / 256);
        $color = "hsl($hue, 100%, 70%)";
        echo "<td style='background-color: $color;'>{$combinations[$index]}</td>";
        $j++;
    }
    echo "</tr>";
    $i++;
}

```

