```plantuml
actor Client
participant "Army" as Army
participant "CompositeUnit" as CompositeUnit
participant "Unit\n(Archer/LaserCanon/Cavalry)" as Unit
participant "TextDumpVisitor" as TextVisitor
participant "TaxVisitor" as TaxVisitor

== Инициализация ==
Client -> Army: new()
Client -> Army: addUnit(Archer)
Client -> Army: addUnit(LaserCanon)
Client -> Army: addUnit(Cavalry)

== Создание посетителя ==
Client -> TextVisitor: new()
Client -> Army: accept(TextVisitor)

== Обход структуры ==
Army -> TextVisitor: visitArmy()
activate TextVisitor
TextVisitor -> TextVisitor: формирует текст
deactivate TextVisitor

Army -> CompositeUnit: units()
CompositeUnit --> Army: список юнитов

loop для каждого юнита
Army -> Unit: accept(TextVisitor)
activate Unit
Unit -> TextVisitor: visitArcher()/visitLaserCanon()/visitCavalry()
activate TextVisitor
TextVisitor -> TextVisitor: добавляет данные в текст
deactivate TextVisitor
deactivate Unit
end

== Получение результата ==
Client -> TextVisitor: getText()
TextVisitor --> Client: возвращает отчет

== Аналогично для TaxVisitor ==
Client -> TaxVisitor: new()
Client -> Army: accept(TaxVisitor)
...
TaxVisitor -> TaxVisitor: levy(сумма)
Client -> TaxVisitor: getTax()
```