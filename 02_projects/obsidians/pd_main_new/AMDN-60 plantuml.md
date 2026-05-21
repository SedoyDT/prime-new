```plantuml

title Создание отчета в методе createReportAction

actor User
participant "[[SalesFunnel_Analytics_MarketingConversion_IndexController]]" as Controller
participant "ReportService" as ReportService
participant "SettingsService" as SettingsService
participant "Database" as Database

User -> Controller: createReportAction()
Controller -> ReportService: create(trafficTypeRestriction, periodStart, periodEnd)
ReportService -> SettingsService: getSettings()
SettingsService -> ReportService: return settings
ReportService -> Database: getData(trafficType, dateFrom, dateTo)
Database -> ReportService: return data
ReportService -> Controller: return result




```