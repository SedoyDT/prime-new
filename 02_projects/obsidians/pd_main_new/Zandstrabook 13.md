# Шаблоны баз данных 

```plantuml
@startuml
title Example 2 — Domain Model + Mappers (SQLite)

skinparam classAttributeIconSize 0

' ===== Base =====
abstract class DomainObject {
  - id: int?
  + __construct(id: int? = null)
  + getId(): int?
  + setId(id: int): void
}

' ===== Domain =====
class Venue extends DomainObject {
  - name: string
  - spaces: SpaceCollection
  + __construct(name: string, id: int? = null, spaces: SpaceCollection? = null)
  + getName(): string
  + setName(name: string): void
  + addSpace(space: Space): void
  + getSpaces(): SpaceCollection
  + findSpace(name: string): Space?
}

class Space extends DomainObject {
  - name: string
  - events: Event[*]
  + __construct(name: string, id: int? = null)
  + getName(): string
  + setName(name: string): void
  + bookEvent(event: Event): void
  + hasConflictWith(candidate: Event): bool
  + eventsOnDate(date: DateTimeInterface): Event[*]
  + getEvents(): Event[*]
}

class Event extends DomainObject {
  - name: string
  - start: DateTime
  - end: DateTime
  + __construct(name: string, start: DateTime, end: DateTime, id: int? = null)
  + intersects(other: Event): bool
  + getName(): string
  + getStart(): DateTime
  + getEnd(): DateTime
}

class SpaceCollection {
  - items: Space[*]
  + add(space: Space): void
  + getIterator(): Traversable
  + count(): int
  + findByName(name: string): Space?
  + toArray(): Space[*]
}

' ===== Persistence =====
abstract class Mapper {
  # pdo: PDO
  + __construct(pdo: PDO)
  + findById(id: int): DomainObject?
  + insert(obj: DomainObject): void
  + update(obj: DomainObject): void
  # lastId(): int
}

class VenueMapper extends Mapper {
  + findById(id: int): Venue?
  + insert(obj: DomainObject): void
  + update(obj: DomainObject): void
}

class SpaceMapper extends Mapper {
  + findById(id: int): Space?
  + insert(obj: DomainObject): void
  + update(obj: DomainObject): void
}

class Db {
  - pdo: PDO?
  + pdo(): PDO
  - initSchema(pdo: PDO): void
}

' ===== Relationships =====
Venue o-- SpaceCollection : has
SpaceCollection *-- "0..*" Space
Space o-- "0..*" Event : schedules

Mapper *-- PDO
VenueMapper --|> Mapper
SpaceMapper --|> Mapper

Venue --|> DomainObject
Space  --|> DomainObject
Event  --|> DomainObject

VenueMapper ..> Venue : maps
VenueMapper ..> Space : inserts child
VenueMapper ..> SpaceCollection
SpaceMapper ..> Space  : maps
Db ..> PDO : provides

' Legend
note right of Mapper
  Mapper изолирует SQL от доменной модели.
  Вся бизнес-логика остаётся в Venue/Space/Event.
end note

@enduml

```




# Domain model + Repository + Unit of work

```plantuml
@startuml
title Example 3 — Domain Model + Repository + Unit of Work

skinparam classAttributeIconSize 0

' ===== Base =====
abstract class DomainObject {
  - id: int?
  + getId(): int?
  + setId(id: int): void
}

' ===== Domain =====
class Venue extends DomainObject {
  - name: string
  - spaces: SpaceCollection
  + getName(): string
  + setName(name: string): void
  + addSpace(space: Space): void
  + getSpaces(): SpaceCollection
  + findSpace(name: string): Space?
}

class Space extends DomainObject {
  - name: string
  - events: Event[*]
  + bookEvent(event: Event): void
  + hasConflictWith(candidate: Event): bool
  + eventsOnDate(date: DateTimeInterface): Event[*]
  + getEvents(): Event[*]
}

class Event extends DomainObject {
  - name: string
  - start: DateTime
  - end: DateTime
  + intersects(other: Event): bool
}

class SpaceCollection {
  - items: Space[*]
  + add(space: Space): void
  + findByName(name: string): Space?
  + getIterator(): Traversable
  + count(): int
}

' ===== Persistence =====
abstract class Mapper {
  # pdo: PDO
  + findById(id: int): DomainObject?
  + insert(obj: DomainObject): void
  + update(obj: DomainObject): void
}

class VenueMapper extends Mapper {
  + findById(id: int): Venue?
  + insert(venue: Venue): void
  + update(venue: Venue): void
}

class SpaceMapper extends Mapper {
  + findById(id: int): Space?
  + insert(space: Space): void
  + update(space: Space): void
}

class Db {
  - pdo: PDO?
  + pdo(): PDO
}

class ObjectWatcher {
  - all: DomainObject[*]
  - new: DomainObject[*]
  - dirty: DomainObject[*]
  - delete: DomainObject[*]
  + add(obj: DomainObject): void
  + exists(class, id): DomainObject?
  + markNew(obj: DomainObject): void
  + markDirty(obj: DomainObject): void
  + markDeleted(obj: DomainObject): void
  + performOperations(pdo: PDO): void
}

class VenueRepository {
  - pdo: PDO
  + findById(id: int): Venue?
  + findAll(): Venue[*]
  + save(venue: Venue): void
}

' ===== Relationships =====
Venue o-- SpaceCollection : has
SpaceCollection *-- "0..*" Space
Space o-- "0..*" Event : schedules

Venue --|> DomainObject
Space --|> DomainObject
Event --|> DomainObject

Mapper *-- PDO
VenueMapper --|> Mapper
SpaceMapper --|> Mapper

VenueMapper ..> Venue : maps
VenueMapper ..> Space : inserts child
SpaceMapper ..> Space

Db ..> PDO : provides
VenueRepository ..> VenueMapper
VenueRepository ..> ObjectWatcher
VenueRepository ..> Db

ObjectWatcher ..> DomainObject : tracks
ObjectWatcher ..> VenueMapper : uses for insert/update
ObjectWatcher ..> SpaceMapper : uses for insert/update

note right of VenueRepository
  Репозиторий — фасад над маппером и ObjectWatcher.
  Клиентский код работает с ним, а не с SQL напрямую.
end note

@enduml

```


# Domain object factory (566 стр)

```plantuml
@startuml

class Mapper
class Collection

abstract class DomainObjectFactory {
    +createObject(row: array)
}

class SpaceDomainObjectFactory {
    +createObject(row: array)
}
class VenueDomainObjectFactory {
    +createObject(row: array)
}
class EventDomainObjectFactory {
    +createObject(row: array)
}

' Наследование фабрик
DomainObjectFactory <|-- SpaceDomainObjectFactory
DomainObjectFactory <|-- VenueDomainObjectFactory
DomainObjectFactory <|-- EventDomainObjectFactory

' Зависимости
Mapper ..> DomainObjectFactory
Collection ..> DomainObjectFactory

@enduml

```

На второй картинке снова **UML-диаграмма классов**, но теперь уже про фабрики объектов предметной области.

🔎 Разбор:

1. **Mapper** и **Collection**
    
    - Они связаны пунктирной зависимостью с `DomainObjectFactory`.
        
    - То есть используют фабрику для создания объектов.
        
2. **DomainObjectFactory** (абстрактная фабрика)
    
    - Метод: `+createObject(row: array)`
        
    - Это базовый интерфейс/абстрактный класс для конкретных фабрик.
        
3. Конкретные фабрики, наследники:
    
    - **SpaceDomainObjectFactory**
        
    - **VenueDomainObjectFactory**
        
    - **EventDomainObjectFactory**  
        Все они реализуют метод `createObject(row: array)`.
        

Таким образом, эта часть описывает **шаблон проектирования Factory Method** (или Abstract Factory) для создания объектов (`Venue`, `Space`, `Event`) на основе данных (например, строки из БД).

---