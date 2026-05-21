```plantuml
actor User
participant "script.php" as Script
participant "Login" as Login
participant "SplObjectStorage" as Storage
participant "SecurityMonitor" as Security
participant "GeneralLogger" as Logger
participant "PartnershipTool" as Partner

== Инициализация системы ==
Script -> Login: new Login()
activate Login
Login -> Storage: new SplObjectStorage()
deactivate Login

Script -> Security: new SecurityMonitor(Login)
activate Security
Security -> Login: attach(self)
Login -> Storage: attach(observer)
deactivate Security

Script -> Logger: new GeneralLogger(Login)
activate Logger
Logger -> Login: attach(self)
Login -> Storage: attach(observer)
deactivate Logger

Script -> Partner: new PartnershipTool(Login)
activate Partner
Partner -> Login: attach(self)
Login -> Storage: attach(observer)
deactivate Partner

== Обработка входа ==
User -> Script: handleLogin(user, pass, ip)
Script -> Login: handleLogin(user, pass, ip)
activate Login

Login -> Login: setStatus(status, user, ip)

Login -> Login: notify()
Login -> Storage: foreach observers
activate Storage

Storage -> Security: update(self)
activate Security
Security -> Security: doUpdate()
Security --> Storage: 
deactivate Security

Storage -> Logger: update(self)
activate Logger
Logger -> Logger: doUpdate()
Logger --> Storage: 
deactivate Logger

Storage -> Partner: update(self)
activate Partner
Partner -> Partner: doUpdate()
Partner --> Storage: 
deactivate Partner

Storage --> Login: 
deactivate Storage

Login --> Script: return result
deactivate Login
```