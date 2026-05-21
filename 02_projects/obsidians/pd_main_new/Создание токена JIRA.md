Ниже — самые простые способы проверить, что у тебя есть доступ к Jira Cloud REST API для твоего сайта  
`https://my-atlassian-site-131.atlassian.net`.

---

## 1. Быстрая проверка через браузер

1. Убедись, что ты залогинен в Jira в браузере под нужным пользователем.
    
2. Открой в новой вкладке:
    
    `https://my-atlassian-site-131.atlassian.net/rest/api/3/myself`
    
    или (старый вариант):
    
    `https://my-atlassian-site-131.atlassian.net/rest/api/2/myself`
    
3. Варианты результата:
    
    - Если ты видишь JSON с информацией о пользователе (`displayName`, `emailAddress` и т.п.) — у тебя есть доступ к API.
        
    - Если видишь страницу логина — ты не залогинен, или нет доступа.
        
    - Если 401 / 403 — учётка есть, но нет прав / неверная авторизация.
        

Этот способ работает потому, что браузер использует ту же сессию, что и Jira UI.

---

## 2. Проверка через `curl` с API Token (рекомендуемый способ)

1. Создай API Token (если ещё нет):
    
    - Зайди в Atlassian аккаунт:  
        [https://id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
        
    - Нажми **Create API token**, дай имя, скопируй токен.
        
2. Выполни в терминале (Linux/macOS/Powershell):
    
    `curl -u "ТВОЙ_EMAIL@пример.com:API_TOKEN" \ -H "Accept: application/json" \ https://my-atlassian-site-131.atlassian.net/rest/api/3/myself`
    
3. Анализ результата:
    
    - HTTP 200 и JSON с информацией о пользователе → доступ к API есть.
        
    - HTTP 401 → ошибка авторизации (неверный email или токен).
        
    - HTTP 403 → авторизован, но нет прав на запрошенный ресурс.
        

---

## 3. Проверка конкретных прав через REST (опционально)

Если тебе нужно убедиться не только, что API доступен, но и что у пользователя есть права в проектах, можно вызвать эндпоинт `mypermissions` (на базе статьи Atlassian:  
[https://support.atlassian.com/jira/kb/automated-verification-of-user-permissions-using-cli-tools-and-rest-api/):](https://support.atlassian.com/jira/kb/automated-verification-of-user-permissions-using-cli-tools-and-rest-api/\):)

`curl -s -u "ТВОЙ_EMAIL@пример.com:API_TOKEN" \ "https://my-atlassian-site-131.atlassian.net/rest/api/2/mypermissions"`

В ответ придёт JSON со списком прав и флагом `havePermission`.

---

## 4. Типичные проблемы

- **401 Unauthorized**
    
    - Неверный email или API token.
        
    - Для Jira Cloud нужен именно API token, а не пароль.
        
- **403 Forbidden**
    
    - Пользователь есть, но нет прав (например, нет доступа к проекту, админских прав и т.п.).
        

---

Хочешь, я помогу составить точную curl-команду под твою платформу (Windows cmd / PowerShell / Linux/macOS)? Напиши:

- на какой ОС ты запускаешь команды;
    
- используешь ли уже API token или ещё только логин/пароль.
- 