---
author: Frolov Anatolui
date: 2024-08-16
time: 13:08:13
aliases: 
- 
tags:
- unique-note
---
```PHP
<?php
$combinations = [];

for ($i = 0; $i < 16; $i++) {
    for ($j = 0; $j < 16; $j++) {
        $index = $i * 16 + $j;
        $combination = '';

        $temp = $index;
        while ($temp >= 0) {
            $combination = chr($temp % 26 + ord('A')) . $combination;
            $temp = floor($temp / 26) - 1;
        }

        $combinations[] = $combination;
    }
}

for ($i = 0; $i < 16; $i++) {
    echo "<tr>";
    for ($j = 0; $j < 16; $j++) {
        $hue = ($i * 16 + $j) * (360 / 256);
        $color = "hsl($hue, 100%, 70%)";
        echo "<td style='background-color: $color;'>{$combinations[$i * 16 + $j]}</td>";
    }
    echo "</tr>";
}

```

