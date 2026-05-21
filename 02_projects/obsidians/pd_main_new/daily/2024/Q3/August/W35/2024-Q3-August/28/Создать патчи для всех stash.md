---
author: Frolov Anatolui
date: 2024-08-28
time: 14:08:43
aliases: 
- 
tags:
- unique-note
---


Чтобы создать патчи для всех сохранённых `stash` в вашем репозитории, вы можете последовательно просмотреть каждый `stash` и сохранить его содержимое в отдельный патч-файл. Вот пошаговый процесс:

### Шаг 1: Просмотреть список всех `stash`
Сначала убедитесь, что у вас есть список всех сохранённых `stash`:

```bash
git stash list
```

Это покажет вам все `stash` с их индексами (`stash@{0}`, `stash@{1}`, и так далее).

### Шаг 2: Создать патчи для всех `stash`
Теперь, чтобы создать патчи для всех `stash`, выполните следующий скрипт на Bash:

```bash
#!/bin/bash

# Получаем список всех stash
stash_list=$(git stash list | awk -F: '{print $1}')

# Перебираем каждый stash и создаем патч
for stash in $stash_list; do
    # Получаем имя патч-файла, используя имя stash
    patch_name="patch_${stash//\{\}/}.patch"
    
    # Сохраняем stash как патч
    git stash show -p $stash > $patch_name
    
    echo "Created $patch_name"
done
```

### Шаг 3: Сохранение и запуск скрипта
1. Сохраните этот скрипт в файл, например `save_stash_patches.sh`.
2. Сделайте скрипт исполняемым:

   ```bash
   chmod +x save_stash_patches.sh
   ```

3. Запустите скрипт:

   ```bash
   ./save_stash_patches.sh
   ```

Этот скрипт создаст отдельный патч-файл для каждого `stash` в текущем каталоге, с именами вроде `patch_stash@0.patch`, `patch_stash@1.patch` и т.д.

### Альтернативный способ без скрипта
Если у вас не так много `stash` и вы хотите сохранить каждый из них вручную, вы можете использовать следующую команду для каждого `stash`:

```bash
git stash show -p stash@{0} > patch_stash0.patch
git stash show -p stash@{1} > patch_stash1.patch
# и так далее...
```

Это позволит вам вручную сохранить каждый `stash` в отдельный файл.