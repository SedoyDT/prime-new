Отлично! Давай составим рабочий пример **POST-запроса на создание клиента** по твоей спецификации OpenAPI, а потом дам пошаговую инструкцию, как быстро самому собирать такие запросы.

---

## Пример запроса

**POST URL:**

```
http://localhost/external-link/rest-api_clients_client/
```

**Headers:**

```
Content-Type: multipart/form-data
Authorization: <твой ApiKey>
```

**Тело запроса (multipart/form-data)**

```json
{
  "legalStatusId": 1,
  "countryId": 1,
  "inn": "1234567890",
  "mainType[customer]": 1,
  "mainType[supplier]": 0,
  "subType[consumables]": 1,
  "subType[product]": 0,
  "subType[otherExpenses]": 0,
  "subType[marketplace]": 1,
  "ownershipType": "ООО",
  "legalTitleShort": "Краткое название",
  "legalTitle": "Полное название компании",
  "contactPersonName": "Иванов Иван",
  "workTime": "9:00-18:00",
  "activityDescription": "Описание деятельности",
  "economicActivityKinds[]": [1,2,3],
  "ndsPayer": 1,
  "edm": 0,
  "officialPhoneNumbers[0][countryId]": 1,
  "officialPhoneNumbers[0][phoneNumber]": "+79123456789",
  "contactPhoneNumbers[0][countryId]": 1,
  "contactPhoneNumbers[0][phoneNumber]": "+79123456789",
  "users[]": [1968],
  "comment": "Пример комментария"
}
```

> ⚠️ Обратите внимание:
> 
> - Для **объектов внутри multipart/form-data** используется синтаксис `имя_объекта[поле]`. Например, `mainType[customer]`.
>     
> - Для массивов — `economicActivityKinds[]` или `officialPhoneNumbers[0][phoneNumber]`.
>     

---

### Инструкция: как быстро собрать запрос самостоятельно

1. **Открыть спецификацию OpenAPI (JSON/YAML)**.
    
2. **Найти endpoint**:  
    В твоём случае `/external-link/rest-api_clients_client/` → `post`.
    
3. **Смотреть `requestBody` → `schema`**:
    
    - `multipart/form-data` → объект `NewClientFieldsModel`.
        
4. **Посмотреть обязательные поля**:  
    В `required: true` → `legalStatusId`, `countryId`, `mainType.customer` и т.д.
    
5. **Составить JSON/multipart тело запроса**:
    
    - Массивы → `[ ]`
        
    - Объекты → `[объект][поле]` при multipart
        
6. **Добавить заголовки**:
    
    - `Authorization: <ApiKey>`
        
    - `Content-Type: multipart/form-data`
        
7. **Протестировать через Postman / curl**.
    

---

### Быстрый способ проверки типов и обязательных полей

- **Поле boolean** в OpenAPI → обычно `1` или `0`.
    
- **Поле string с maxLength / pattern** → проверять длину и соответствие regex.
    
- **Массивы** → использовать индекс `[0]`, `[1]` в multipart.
    

---

Если хочешь, я могу сразу написать **готовый рабочий curl-запрос**, который можно скопировать и выполнить прямо в терминале — он будет полностью соответствовать спецификации и формату multipart.

Хочешь, чтобы я это сделал?


### Остальное 
### GET request to example server  
GET https://examples.http-client.intellij.net/get  
    ?generated-in=PhpStorm  
  
###  
  
### POST request to create a new lead  
  
### POST request to create a new lead  
POST http://pzo.178.a.test/external-link/rest-api_sales-funnel_lead/  
Content-Type: application/json  
Authorization: hV9lyWxE4rC0IocI2V7yM!M!@IW8hj  
  
{  
  "userId": 1968,  "title": "title",  "stageId": 85,  "funnelId": 8,  "plannedSum": 100,  "actualSum": 0,  "isAdvertising": false,  "advertisingPlatformId": null,  "props": {    "prop_t5rza6j": null,    "prop_1w6f24m": [],    "prop_jh5i0td": null,    "prop_u66j2yy": null,    "prop_ji3g3bv": null,    "prop_3914v9m": null,    "prop_cvp13oe": [],    "prop_9r1julq": [],    "prop_tmfyemr": [],    "prop_gey0vwv": [],    "prop_h3bcpkk": [],    "prop_gon4kbp": [],    "prop_0ywz1iv": null,    "prop_3ey3z3k": null,    "prop_yuotvga": [],    "prop_kwt7i1m": null,    "prop_km3k6f3": null,    "prop_v0gkyvz": null,    "prop_flsucl8": null,    "prop_jhm4dzd": null,    "prop_kdwet4w": null,    "prop_ugnd17r": null,    "prop_v4maefk": null,    "prop_mafl5jj": null,    "prop_p3tx4mo": null,    "prop_j6ts5eb": null,    "prop_pp36vry": null,    "prop_xftvkyy": [],    "prop_3mlh24y": [],    "prop_pow1bfu": null  },  "phones": [    "79185489958"  
  ],    "emails": [  
    ],  "annotation": "1300 шредер n55 \r\nКраснодарский край\r\nНе работает автоматический режим.\r\nСтягивает ленту на транспортёре.",  "tags": [    "шредер"  ]}  
  
  
  
###  
  
GET http://pzo.178.a.test/external-link/rest-api_sales-funnel_lead/149225  
Content-Type: application/json  
Authorization: hV9lyWxE4rC0IocI2V7yM!M!@IW8hj  
  
{  
  
}  
  
### POST request to create a new lead  
POST http://pzo.178.a.test/external-link/rest-api_clients_client/  
Content-Type: application/json  
Authorization: uDZWeFBrC@B8Qt25aS*Va5!vuwxVz1  
  
{  
  "userId": 1968,  "title": "title",  "stageId": 85,  "funnelId": 8,  "plannedSum": 100,  "actualSum": 0,  "isAdvertising": 1,  "advertisingPlatformId": null,  "props": {    "prop_t5rza6j": null,    "prop_1w6f24m": [],    "prop_jh5i0td": null,    "prop_u66j2yy": null,    "prop_ji3g3bv": null,    "prop_3914v9m": null,    "prop_cvp13oe": [],    "prop_9r1julq": [],    "prop_tmfyemr": [],    "prop_gey0vwv": [],    "prop_h3bcpkk": [],    "prop_gon4kbp": [],    "prop_0ywz1iv": null,    "prop_3ey3z3k": null,    "prop_yuotvga": [],    "prop_kwt7i1m": null,    "prop_km3k6f3": null,    "prop_v0gkyvz": null,    "prop_flsucl8": null,    "prop_jhm4dzd": null,    "prop_kdwet4w": null,    "prop_ugnd17r": null,    "prop_v4maefk": null,    "prop_mafl5jj": null,    "prop_p3tx4mo": null,    "prop_j6ts5eb": null,    "prop_pp36vry": null,    "prop_xftvkyy": [],    "prop_3mlh24y": [],    "prop_pow1bfu": null  },  "phones": ["79185489958"],  "emails": [],  "annotation": "1300 шредер n55 \r\nКраснодарский край\r\nНе работает автоматический режим.\r\nСтягивает ленту на транспортёре.",  "tags": ["шредер"]}  
  
  
### POST request to create a new lead  
POST http://pzo.178.a.test/external-link/rest-api_clients_client/  
Content-Type: application/json  
Authorization: S8v7oKWCI@hS6Ss66fysA@FceoZ6@J  
  
{  
  "legalStatusId": 1,  "countryId": 1,  "inn": "1234567890",  "mainType": {    "customer": 1,    "supplier": 0,    "consumables": 1,    "product": 0,    "otherExpenses": 0,    "marketplace": 1  },  "ownershipType": "ООО",  "legalTitleShort": "Краткое название",  "legalTitle": "Полное название компании",  "contactPersonName": "Иванов Иван",  "workTime": "9:00-18:00",  "activityDescription": "Описание деятельности",  "economicActivityKinds": [1,2,3],  "ndsPayer": 1,  "edm": 0,  "officialPhoneNumbers": {    "countryId": 1,    "phoneNumber": "+79123456789"  },  "contactPhoneNumbers": {    "countryId": 1,    "phoneNumber": "+79123456789"  },  "users": [1968],  "comment": "Пример комментария"}  
  
### POST request to create a new client  
POST http://pzo.178.a.test/external-link/rest-api_clients_client/149225  
Content-Type: application/json  
Authorization: S8v7oKWCI@hS6Ss66fysA@FceoZ6@J  
  
{  
"legalStatusId": 1,  
"countryId": 1,  
"inn": "12345678911",  
"mainType[customer]": 1,  
"mainType[supplier]": 0,  
"subType[consumables]": 1,  
"subType[product]": 0,  
"subType[otherExpenses]": 0,  
"subType[marketplace]": 1,  
"ownershipType": "ООО",  
"legalTitleShort": "Краткое название",  
"legalTitle": "Полное название компании",  
"contactPersonName": "Иванов Иван",  
"workTime": "9:00-18:00",  
"activityDescription": "Описание деятельности",  
"economicActivityKinds[]": [1,2,3],  
"ndsPayer": 1,  
"edm": 0,  
"officialPhoneNumbers[0][countryId]": 1,  
"officialPhoneNumbers[0][phoneNumber]": "+79123456789",  
"contactPhoneNumbers[0][countryId]": 1,  
"contactPhoneNumbers[0][phoneNumber]": "+79123456789",  
"users[]": [1968],  
"comment": "Пример комментария"  
}  
  
### POST request to create a new client  
POST http://pzo.178.a.test/external-link/rest-api_clients_client/  
Content-Type: application/json  
Authorization: S8v7oKWCI@hS6Ss66fysA@FceoZ6@J  
  
{  
  "legalStatusId": 1,  "countryId": 1,  "inn": "12345678911",  "mainType": {    "marketplace": 1,    "otherExpenses": [1],    "product": [1],    "consumables": [1],    "customer": [2],    "supplier": [2]  },  "subType": {    "marketplace": 1,    "otherExpenses": [1],    "product": [1],    "consumables": [1]  },  "ownershipType": "ООО",  "legalTitleShort": "Краткое название",  "legalTitle": "Полное название компании",  "contactPersonName": "Иванов Иван",  "workTime": "9:00-18:00",  "activityDescription": "Описание деятельности",  "economicActivityKinds": [1,2,3],  "ndsPayer": 1,  "edm": 0,  "officialPhoneNumbers": [    {      "countryId": 1,      "phoneNumber": "+79123456789"    }  ],  "contactPhoneNumbers": [    {      "countryId": 1,      "phoneNumber": "+79123456789"    }  ],  "users": [1968],  "comment": "Пример комментария"}



