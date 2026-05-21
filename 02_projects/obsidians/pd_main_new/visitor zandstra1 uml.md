```plantuml
skinparam classAttributeIconSize 0

abstract class Unit {
  - depth: int
  + accept(visitor: ArmyVisitor): void
  + setDepth(depth: int): void
  + getDepth(): int
  # bombardStrength(): int
}

class CompositeUnit {
  - units: array
  + addUnit(unit: Unit): void
  + units(): array
  + accept(visitor: ArmyVisitor): void
}

class Army {
  + bombardStrength(): int
}

class Archer {
  + bombardStrength(): int
}

class LaserCanonUnit {
  + bombardStrength(): int
}

class Cavalry {
  + bombardStrength(): int
}

abstract class ArmyVisitor {
  + visit(node: Unit): void
  + visitArcher(node: Archer): void
  + visitCavalry(node: Cavalry): void
  + visitLaserCanonUnit(node: LaserCanonUnit): void
  + visitArmy(node: Army): void
}

class TextDumpArmyVisitor {
  - text: string
  + visit(node: Unit): void
  + getText(): string
}

class TaxCollectionVisitor {
  - due: int
  - report: string
  + visit(node: Unit): void
  + visitArcher(node: Archer): void
  + visitCavalry(node: Cavalry): void
  + getReport(): string
  + getTax(): int
}

Unit <|-- CompositeUnit
CompositeUnit <|-- Army
Unit <|-- Archer
Unit <|-- LaserCanonUnit
Unit <|-- Cavalry

ArmyVisitor <|.. TextDumpArmyVisitor
ArmyVisitor <|.. TaxCollectionVisitor

Unit --> ArmyVisitor : <<accept>> 
CompositeUnit --> Unit : contains
Army --> CompositeUnit : inherits
TextDumpArmyVisitor --> Unit : visits
TaxCollectionVisitor --> Unit : visits

note right of ArmyVisitor
  Шаблон Visitor:
  - Отделяет алгоритмы от структуры объектов
  - Позволяет добавлять новые операции без изменения классов Unit
end note
```

