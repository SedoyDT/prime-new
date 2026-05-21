проксирование при обращении к сервису smsc.ru

1. library/App/Smsc/SMSCenterService.php
2. library/App/Smsc/Sender/RealSender.php:25
	1. Первое что надо сделать это понять что происходит в этом методе
3. library/App/Api/ContourFocus/Service/ClientService.php
	1. это код Олега
	2. т.к. он в офисе можно на него ориентироваться
	3. или можешь поискать как ещё Guzzle используется у нас
	4. в коде Олега есть также настройка нужная тебе
4. я бы переписал код обращения к АПИ на Guzzle
5. library/App/Smsc/Sender/RealSender.php
	1. это потом ещё нужно проверить
	2. начни с того что через Guzzle сможешь отправлять запросы и обрабатывать ответы
	3. поищи какоенибудь открытое API для тестирования
	4. чтоб смс не спамить
	5. Понимаешь о чем я?
	6. Чтобы потренироваться работать с Guzzle
6. https://dadata.ru
	1. у них бесплатно можно запросы слать
7. кстати можешь сначала постманом попробовать
8. или .http файл в шторме создать
9. **БЛЯ, ЕСЛИ Я ТАКОЙ УМНЫЙ КАК БЫ Я ОПИСАЛ, ЧТО МНЕ НУЖНО СДЕЛАТЬ В ПАРУ ШАГОВ**
	1. Нужно создать smsc.config или посмотереть есть ли он уже
	2. Далее или создать или убедиться в наличии в этом конфиге настройки прокси
	3. Далее в методе который делает запрос к smsc проверять  так же как это делает Ваня и Олег 
		1. Если есть устанавливать в конфиг и передавать в клиент
	4. Убедиться, что прокси используется
![[Pasted image 20251217174456.png]]

# Development Index
```php
public function indexAction()  
{  
  
    $client = new Client();  
  
    $response = $client->request('POST', 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/address', [  
        'headers' => [  
            'Content-Type'  => 'application/json',  
            'Accept'        => 'application/json',  
            'Authorization' => 'Token 04541ce41e8a5fd91c59ca4735bcc07c2569d46a',  
        ],  
        'json' => [  
            'query' => '9120b43f-2fae-4838-a144-85e43c2bfb29'  
        ]  
    ]);  
  
    echo $response->getBody();  
}
```
## result
![[Pasted image 20251217174741.png]]