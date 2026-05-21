1. [[Тестирование]]
2. Подзадачи
	1. [[AMDN-411 - изменить бд для хранения счетчика sales_funnel_aggregated_data]]
	2. [[AMDN-412 - Добавить изменение счетчика по звонкам и письмам ]]
	3. [[AMDN-413 - добавить отображение счетчика в плитке лида]]
	4. [[AMDN-414 - Добавить изменение счетчика при создании/обновлении лида через REST API]]
	5. [[AMDN-415 - добавить подсчет коммуникаций через авито]]
	6. [[AMDN-416 - добавить подсчет ком edna]]
	7. [[AMDN-417 - добавить скрипт для проставления счетчика коммуникаций для существующих лидов]]
2. 
3. Создание звонка
4. ./bin/amd-executor.sh -e amdcoru -w /html/lp/178 php ../amd-code-generator/bin/console.php typescript:create-dialog typescript/app/application/call/missed/index/component/dialog/page.component.ts


В leadService 
library/app/sales_funnel/lead/

evnt/sales_funnel/rest_api

Добавить икремент счетчика коммуникаций в \App\RestAPI\Module\SalesFunnel\Lead\Service\LeadService.


[[Создание REIn CreateInMessage.php line 110:
                                                          
  Не удалось найти канал для: userIdentifier=79651138551  


1. https://my-atlassian-site-131.atlassian.net/browse/AMD-1059
2. Скопировать тестовый ключ API
	1. KVid7LV4xXA9d7puxfhNodzLjkxVi0cBO29phXPtXu3hELYya1bLA4y/7Y4ywTeUoqsrV0ihRViUJaTEtQcPzYvJ+jpkX2NQXtd3GToAACXc2UANDRR8Ck1Aqp2yFPE1
3. для callback
	1. 7Y4ywTeUoqsrV0ihRViUJaTEtQcPzYvJ+jpkX2NQXtd3GToAACXc2UANDRR8Ck1Aqp2yFPE1
4. ![[Pasted image 20251110173953.png]]]]

---
1. [[Создание лидов API]]
2. [[Создание клиентов через API]]
3. [[Ответное сообщение авито]]
4. [[Тестирование AMDN-178]]
5. [[Разработка]]
6. [[Создание сущностей лида]]
7. [[Создание лида через REST API]]