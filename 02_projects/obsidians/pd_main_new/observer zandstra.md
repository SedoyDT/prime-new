```plantuml
' Определение интерфейсов
interface Observable {
    +attach(observer: Observer): void
    +detach(observer: Observer): void
    +notify(): void
}

interface Observer {
    +update(observable: Observable): void
}

' Определение классов
class Login {
    -observers: array
    -status: array
    +LOGIN_USER_UNKNOWN: int
    +LOGIN_WRONG_PASS: int
    +LOGIN_USER_ACCESS: int
    +attach(observer: Observer): void
    +detach(observer: Observer): void
    +notify(): void
    +handleLogin(user: string, pass: string, ip: string): bool
    +setStatus(status: int, user: string, ip: string): void
    +getStatus(): array
}

abstract class LoginObserver {
    -login: Login
    +__construct(login: Login)
    +update(observable: Observable): void
    #doUpdate(login: Login): void
}

class SecurityMonitor {
    +doUpdate(login: Login): void
}

class GeneralLogger {
    +doUpdate(login: Login): void
}

class PartnershipTool {
    +doUpdate(login: Login): void
}

' Связи между классами
Observable <|.. Login
Observer <|.. LoginObserver
LoginObserver <|-- SecurityMonitor
LoginObserver <|-- GeneralLogger
LoginObserver <|-- PartnershipTool

Login --> Observable : implements
LoginObserver --> Observer : implements

Login o-- LoginObserver : attaches >
```