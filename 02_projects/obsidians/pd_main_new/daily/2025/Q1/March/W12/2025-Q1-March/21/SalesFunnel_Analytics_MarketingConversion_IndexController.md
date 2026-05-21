---
author: Frolov Anatolui
date: 2025-03-21
time: 11:03:39
aliases: 
- 
tags:
- unique-note
---


```plantuml

class SalesFunnel_Analytics_MarketingConversion_IndexController {
    - reportService: ReportService
    - settingsService: SettingsService
    + preDispatch()
    + indexAction()
    + createReportAction()
    + updateRowFieldAction()
    + excelAction()
}

class ReportService {
    + create(trafficTypeRestriction, periodStart, periodEnd)
}

class SettingsService {
    + getSettings()
}

class TrafficTypeModel {
    + getId()
    + getTitle()
}

class PageView {
}

class App_Access {
    + get(key, access)
}

class App_Form_AjaxForm_Factory {
    + send(callback)
}

class App_Db_SalesFunnelMarketingConversionPeriodData {
    + insertUpdate(data)
}

class Excel {
    + setData(data)
    + download(filename)
}

SalesFunnel_Analytics_MarketingConversion_IndexController --> ReportService
SalesFunnel_Analytics_MarketingConversion_IndexController --> SettingsService
SalesFunnel_Analytics_MarketingConversion_IndexController --> PageView
SalesFunnel_Analytics_MarketingConversion_IndexController --> App_Access
SalesFunnel_Analytics_MarketingConversion_IndexController --> App_Form_AjaxForm_Factory
SalesFunnel_Analytics_MarketingConversion_IndexController --> App_Db_SalesFunnelMarketingConversionPeriodData
SalesFunnel_Analytics_MarketingConversion_IndexController --> Excel
SettingsService --> TrafficTypeModel


```