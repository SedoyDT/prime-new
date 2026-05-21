```plantuml
actor User
participant "script.php" as Script
participant "Login" as Login
participant "SecurityMonitor" as Security
participant "GeneralLogger" as Logger
participant "PartnershipTool" as Partner

== Инициализация системы ==
Script -> Login: new Login()
activate Login
Script -> Security: new SecurityMonitor(Login)
activate Security
Security -> Login: attach(self)
deactivate Security

Script -> Logger: new GeneralLogger(Login)
activate Logger
Logger -> Login: attach(self)
deactivate Logger

Script -> Partner: new PartnershipTool(Login)
activate Partner
Partner -> Login: attach(self)
deactivate Partner

== Обработка входа ==
User -> Script: handleLogin(user, pass, ip)
Script -> Login: handleLogin(user, pass, ip)
activate Login

Login -> Login: setStatus(status, user, ip)

Login -> Login: notify()
Login -> Security: update(self)
activate Security
Security -> Security: doUpdate()
Security --> Login: 
deactivate Security

Login -> Logger: update(self)
activate Logger
Logger -> Logger: doUpdate()
Logger --> Login: 
deactivate Logger

Login -> Partner: update(self)
activate Partner
Partner -> Partner: doUpdate()
Partner --> Login: 
deactivate Partner

Login --> Script: return result
deactivate Login

```