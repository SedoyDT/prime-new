<?php


// Путь к репозиторию Git
$gitRepoPath = '.';
// Путь к папке назначения
$destinationPath = '../folder';

// Функция для копирования файлов с сохранением структуры директорий
function copyFiles($source, $destination)
{
    // Получаем список всех файлов и папок в исходной директории
    $files = scandir($source);

    foreach ($files as $file) {
        // Пропускаем текущую и родительскую директории
        if ($file === '.' || $file === '..') {
            continue;
        }

        // Полный путь к текущему файлу или папке
        $sourceFilePath = $source . DIRECTORY_SEPARATOR . $file;
        $destinationFilePath = $destination . DIRECTORY_SEPARATOR . $file;

        // Если это директория, рекурсивно копируем ее
        if (is_dir($sourceFilePath)) {
            mkdir($destinationFilePath, 0755, true);
            copyFiles($sourceFilePath, $destinationFilePath);
        } else {
            // Копируем файл
            copy($sourceFilePath, $destinationFilePath);
        }
    }
}

// Переходим в директорию репозитория
chdir($gitRepoPath);

// Получаем список измененных файлов
$changedFiles = [];
exec('git diff --name-only HEAD', $changedFiles);

// Копируем измененные файлы в папку назначения
foreach ($changedFiles as $file) {
    // Получаем полный путь к файлу
    $sourceFilePath = $gitRepoPath . DIRECTORY_SEPARATOR . $file;

    // Получаем путь к папке назначения, сохраняя структуру
    $destinationFilePath = $destinationPath . DIRECTORY_SEPARATOR . $file;

    // Создаем директорию, если она не существует
    $destinationDir = dirname($destinationFilePath);
    if (!is_dir($destinationDir)) {
        mkdir($destinationDir, 0755, true);
    }

    // Копируем файл
    if (file_exists($sourceFilePath)) {
        copy($sourceFilePath, $destinationFilePath);
        echo "Скопирован: $file\n";
    } else {
        echo "Файл не найден: $sourceFilePath\n";
    }
}

echo "Копирование завершено.\n";