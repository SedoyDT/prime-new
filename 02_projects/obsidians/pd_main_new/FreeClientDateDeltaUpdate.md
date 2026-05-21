
Считает циферки в таблице **FreeClientsAgreegatedData**



@startuml
namespace App.FreeClients.AggregatedData.Component {

    interface WithDateDelta {
        {static} +DATE_DELTA_TYPE_WORK : int = 1
        {static} +DATE_DELTA_TYPE_CALENDAR : int = 0

        +isCalendarDayDeltaType() : bool
        +isWorkDayDeltaType() : bool
        {static} +getDateDeltaType() : int
        {static} +getDaysDeltaField() : string
    }
}
@enduml

```plantuml
    interface WithDateDelta {
        {static} +DATE_DELTA_TYPE_WORK : int = 1
        {static} +DATE_DELTA_TYPE_CALENDAR : int = 0

        +isCalendarDayDeltaType() : bool
        +isWorkDayDeltaType() : bool
        {static} +getDateDeltaType() : int
        {static} +getDaysDeltaField() : string
    }
    
    
    interface WithFutureDelta {
	    +getDateDeltaFutureField(): string
    }
    
    
```


