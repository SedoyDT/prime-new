```plantuml

class Analitics_Model_DirectorWage_Component_DataAbstract {}

class Analitics_DirectorWage_AjaxController {}

class App\Analytics\DirectorWage\Service\CalculatorService {
+month()
}

class Analitics_Model_DirectorWage_Component_DataBuilder_Modificator_Chain {

}

class Analitics_Model_DirectorWage_Component_DataBuilder_AccountantBuilder {

}

class Analitics_Model_DirectorWage_Data_Weight {

}

class Analitics_Model_DirectorWage_DataBuilder_Earnings_Modificator_AvantpackCoefficientCalculation {

}

class Analitics_Model_DirectorWage_DataBuilder_Expense_Modificator_DistributedCommonExpense {

}

class Analitics_Model_DirectorWage_DataBuilder_Weight_Modificator_AvantpackCoefficientCalculation {

}

class Analitics_Model_DirectorWage_Option_Model_DistributionRentSeoProgrammersAlgorithm{

}

class Analitics_Model_DirectorWage_Option_Validator_DistributionRentSeoProgrammersAlgorithm {
}

class Analitics_Model_DirectorWage_Option_ViewContainer_DistributionRentSeoProgrammersAlgorithm {

}

class Analitics_Model_DirectorWage_Option_Catalog {

}

class Analitics_Model_DirectorWage_Calculator {

}


note top of Analitics_Model_DirectorWage_Option_Catalog
	каталог опций
end note 

note top of Analitics_Model_DirectorWage_Calculator
	класс, запускающий расчёт зп руководителей
end note

note top of App\Analytics\DirectorWage\Service\CalculatorService 
	Пока хз
end note

note top of Analitics_Model_DirectorWage_Component_DataAbstract 
	Сущность данных для расчёта зп руководителей
end note

note top of Analitics_Model_DirectorWage_Data_Weight 
	Сущность для хранения данных об отгруженном весе по отделу
end note

note top of Analitics_Model_DirectorWage_DataBuilder_Earnings_Modificator_AvantpackCoefficientCalculation 
	Класс для пересчета коэффициента распределения для итогового проекта  
	Отделы с самостоятельных проектов учитываются наравне с отделами текущего проекта
end note


note top of Analitics_Model_DirectorWage_Component_DataBuilder_AccountantBuilder 
	создатель данных работающий с несколькими проектами и использующий классы-счетоводы
end note

note top of Analitics_Model_DirectorWage_Component_DataBuilder_Modificator_Chain
	Цепочка модификаторов для строителей данных
end note

note top of Analitics_Model_DirectorWage_DataBuilder_Expense_Modificator_DistributedCommonExpense
	Расчёт распределяемых общих расходов, вынесен в модификаторы, потому что на дочерних не нужен
end note

note top of Analitics_Model_DirectorWage_DataBuilder_Weight_Modificator_AvantpackCoefficientCalculation
	Класс для пересчета коэффициента распределения для итогового проекта  
	Отделы с самостоятельных проектов учитываются наравне с отделами текущего проекта
end note


```

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

```plantuml
' Импорт Abstract
class Abstract {
}

' Основной класс
class Analitics_DirectorWage_Option_ControlElement_DistributionRentSeoProgrammersAlgorithm {
    - options: Array
    + _getHtml(): String
    + _bindEvents(): void
    + _getControlElement(): Object
    + processAdditionalParams(params: Object): void
    + _showViewResult(): void
}

' Наследование
Abstract <|-- Analitics_DirectorWage_Option_ControlElement_DistributionRentSeoProgrammersAlgorithm

' Экспорт
class DistributionRentSeoProgrammersAlgorithm {
}

' Связь между классами
Analitics_DirectorWage_Option_ControlElement_DistributionRentSeoProgrammersAlgorithm --> DistributionRentSeoProgrammersAlgorithm

' Описание класса
note top of Analitics_DirectorWage_Option_ControlElement_DistributionRentSeoProgrammersAlgorithm
    Этот класс реализует алгоритм распределения аренды SEO-программистов.
    Он наследует методы из класса Abstract и содержит методы для работы с HTML, событиями и параметрами.
end note
```

Есть класс calculator 
calculateLocal 


# CalculateLocal
```plantuml


participant "CalculationContext" as CalculationContext



```