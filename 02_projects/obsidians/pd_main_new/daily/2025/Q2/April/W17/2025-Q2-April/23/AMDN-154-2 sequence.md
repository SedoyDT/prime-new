---
author: Frolov Anatolui
date: 2025-04-23
time: 15:04:05
aliases: 
- 
tags:
- unique-note
---


```plantuml

title Создание отчета в методе createReportAction

actor User
participant "[[Analitics_DirectorWage_AjaxController]]" as Controller
participant "[[CalculatorService]]" as CalculatorService
participant "Analitics_Model_DirectorWage_Calculator" AS Calculator
participant "Some1" AS Some
participant "Some2" AS Some2

User -> Controller: Нажимает "Показать" (calculateAction)
Controller -> CalculatorService: month() 
CalculatorService -> Calculator: Calculate
Some1 -> Some2
CalculatorService -> Calculator: getDataExpenses()  " Тут я получаю данные, которые мне нужно изменить
```


1. если $report пустой, 
	1. Получаем список отделов в [[в виде 154]]
2. -
3. -

----


