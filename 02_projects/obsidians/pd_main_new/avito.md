select * from avito_employee_item where avito_item_id = 1744358290 order by id desc ;

[[storage-json]]
блять и как надо было настраиивать авито ебучий?
забыл совсем


1. Настройка 
	1. docker ps
	2. docker exec -it 400fa6c9958e /bin/bash
	3. cd /html/lp/amd-avito
	4. php -S 0.0.0.0:7000 -t mock-server/
	5. ![[Pasted image 20250428094513.png]]
	6. root@400fa6c9958e:/html/lp/amd-avito/mock-server# php send-message.php -t 3 -m 'hello world'
2. -



---


Я должен создать тестовую воронку и добавить , я все запомнил

