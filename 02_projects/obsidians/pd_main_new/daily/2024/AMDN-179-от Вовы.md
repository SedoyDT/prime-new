# залить AMDN-264 и заново всё проверить
# файл sql
1. объединить **ОК**
# application/modules/call/models/Missed/Filter.php
1. зачем ограничивать по callback_status_id все записи фильтра **ОК!!!!**
2. не нужно вычислять статусы записей на лету **В процессе**
# application/modules/call/models/Missed/FilterConfigurator.php
1. запрос бессмысленный  - **связь между телефоном и пропущенным звокном делаем через client_phone**
   ``` 
	FROM clients
	INNER JOIN call_registry_client
        ON clients.id = call_registry_client.client_id    
    LEFT JOIN call_registry_missed ON
   ```
# library/App/Call/ConsoleCommands/CreateFakeCall.php ОК!!!!
1. надо для новой опции описать все возможные значения, без этого непонятно как создать пропущенный звонок **ОК!!!!**
# library/App/Call/Services/MissedCallService.php
1. нужен тип $event **ОК!!!!**
2. запросы на получение бесполезны
3. **callback_registry_id** **---- перенести вызов сервиса в отдельный сабскрайбер** **+**
# library/App/Event/MissedCall/Subject.php
1. названия свойств сломаны **????** **вроде готово**
2. нет уточнения типа subject у событий **?????** **вроде готово**
# library/App/Network/Service/Ats/Call/Reciever.php **ОК**!!!!
1. надо добавить выставление флагов рекламных площадок для пропущенных звонков  **ОК**!!!!

Фильтр по стутусам перезвона должен скрываться, три статуса по умолчанию должно быть выбрано


/home/anatoluy/amd-docker-dev/data/www/lp/ development-b/library/App/Filter/Component/Behaviour/Result.php