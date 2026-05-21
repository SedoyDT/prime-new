---
author: Frolov Anatolui
date: 2024-08-16
time: 13:08:48
aliases: 
- 
tags:
- unique-note
---
```PHP
<?php
$combinations = [];
$index = 0;

for ($i = 0; $i < 16 * 16; $i++) {
    $combination = '';

    $temp = $i;
    while ($temp >= 0) {
        $combination = chr($temp % 26 + ord('A')) . $combination;
        $temp = floor($temp / 26) - 1;
    }

    $combinations[] = $combination;
}

$i = 0;
foreach ($combinations as $combination) {
    if ($i % 16 == 0) {
        echo "<tr>";
    }

    $hue = $i * (360 / 256);
    $color = "hsl($hue, 100%, 70%)";
    echo "<td style='background-color: $color;'>$combination</td>";

    if ($i % 16 == 15) {
        echo "</tr>";
    }
    $i++;
}

```

