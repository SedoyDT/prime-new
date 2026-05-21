```html
<!DOCTYPE html>  
<html lang="ru">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>Город памяти: Page Controller</title>  
    <style>  
        body {  
            margin: 0;  
            padding: 20px;  
            font-family: 'Georgia', serif;  
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  
            min-height: 100vh;  
            color: #333;  
        }  
  
        .city-container {  
            max-width: 1200px;  
            margin: 0 auto;  
            background: rgba(255, 255, 255, 0.95);  
            border-radius: 20px;  
            padding: 30px;  
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);  
        }  
  
        .city-title {  
            text-align: center;  
            font-size: 2.5em;  
            color: #4a5568;  
            margin-bottom: 10px;  
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);  
        }  
  
        .city-subtitle {  
            text-align: center;  
            font-size: 1.2em;  
            color: #718096;  
            margin-bottom: 40px;  
            font-style: italic;  
        }  
  
        .district {  
            margin: 40px 0;  
            padding: 25px;  
            border-radius: 15px;  
            position: relative;  
            transition: all 0.3s ease;  
        }  
  
        .district:hover {  
            transform: translateY(-5px);  
            box-shadow: 0 15px 30px rgba(0,0,0,0.15);  
        }  
  
        .simple-district {  
            background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);  
            border-left: 8px solid #e17055;  
        }  
  
        .separated-district {  
            background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);  
            color: white;  
            border-left: 8px solid #2d3436;  
        }  
  
        .full-district {  
            background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);  
            color: white;  
            border-left: 8px solid #2d3436;  
        }  
  
        .district-title {  
            font-size: 1.8em;  
            font-weight: bold;  
            margin-bottom: 15px;  
            display: flex;  
            align-items: center;  
        }  
  
        .district-icon {  
            font-size: 2em;  
            margin-right: 15px;  
        }  
  
        .building {  
            background: rgba(255,255,255,0.2);  
            margin: 15px 0;  
            padding: 15px;  
            border-radius: 10px;  
            border-left: 4px solid rgba(255,255,255,0.5);  
        }  
  
        .building-name {  
            font-weight: bold;  
            font-size: 1.1em;  
            margin-bottom: 8px;  
        }  
  
        .building-description {  
            font-size: 0.95em;  
            line-height: 1.5;  
        }  
  
        .connection {  
            display: flex;  
            align-items: center;  
            justify-content: center;  
            margin: 20px 0;  
            font-size: 1.5em;  
            color: #636e72;  
        }  
  
        .memory-tip {  
            background: linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%);  
            border-radius: 15px;  
            padding: 20px;  
            margin: 30px 0;  
            border-left: 6px solid #e84393;  
        }  
  
        .memory-tip-title {  
            font-weight: bold;  
            font-size: 1.2em;  
            margin-bottom: 10px;  
            color: #2d3436;  
        }  
  
        .route {  
            background: rgba(99, 110, 114, 0.1);  
            border-radius: 10px;  
            padding: 20px;  
            margin: 20px 0;  
            border: 2px dashed #636e72;  
        }  
  
        .route-title {  
            font-weight: bold;  
            color: #2d3436;  
            margin-bottom: 10px;  
        }  
  
        @keyframes pulse {  
            0% { transform: scale(1); }  
            50% { transform: scale(1.05); }  
            100% { transform: scale(1); }  
        }  
  
        .district:hover .district-icon {  
            animation: pulse 1s infinite;  
        }  
    </style>  
</head>  
<body>  
<div class="city-container">  
    <h1 class="city-title">🏛️ Город Page Controller</h1>  
    <p class="city-subtitle">Метод Цицерона для запоминания шаблона проектирования</p>  
  
    <div class="memory-tip">  
        <div class="memory-tip-title">🧠 Принцип запоминания:</div>  
        Представьте город с 3 районами, где каждый район эволюционирует от простого к сложному.  
        Идите по маршруту: сначала Простая деревня → затем Организованный квартал → наконец Деловой центр.  
    </div>  
  
    <!-- Район 1: Простой Page Controller -->  
    <div class="district simple-district">  
        <div class="district-title">  
            <span class="district-icon">🏘️</span>  
            Простая деревня (Simple Page Controller)  
        </div>  
  
        <div class="building">  
            <div class="building-name">🏠 Дом venues.php</div>  
            <div class="building-description">  
                Маленький домик, где ВСЕ происходит в одном месте: и готовка (контроллер), и столовая (представление).  
                Хозяин (PHP код) сначала готовит список заведений, потом накрывает на стол (HTML).  
            </div>  
        </div>  
  
        <div class="building">  
            <div class="building-name">🚑 Больница error.php</div>  
            <div class="building-description">  
                Если что-то пошло не так в доме venues.php, жители бегут в больницу.  
                Врач (error.php) лечит все проблемы одинаково.  
            </div>  
        </div>  
    </div>  
  
    <div class="connection">⬇️ ЭВОЛЮЦИЯ ГОРОДА ⬇️</div>  
  
    <!-- Район 2: Разделенный Page Controller -->  
    <div class="district separated-district">  
        <div class="district-title">  
            <span class="district-icon">🏢</span>  
            Организованный квартал (Separated Page Controller)  
        </div>  
  
        <div class="building">  
            <div class="building-name">🏛️ Мэрия PageController</div>  
            <div class="building-description">  
                Центральное здание с мэром (базовый класс), который знает общие правила:  
                как принимать заявления (Request), как отправлять к специалистам (forward),  
                как показывать документы (render).  
            </div>  
        </div>  
  
        <div class="building">  
            <div class="building-name">📝 Отдел регистрации AddVenueController</div>  
            <div class="building-description">  
                Специальный кабинет для добавления заведений. Чиновник проверяет документы,  
                и если все хорошо - отправляет к архивариусу (forward), если плохо - показывает форму снова.  
            </div>  
        </div>  
  
        <div class="building">  
            <div class="building-name">📋 Представления (view/)</div>  
            <div class="building-description">  
                Отдельная папка-здание с красивыми витринами (HTML шаблоны),  
                которые показывают информацию посетителям.  
            </div>  
        </div>  
    </div>  
  
    <div class="connection">⬇️ МАКСИМАЛЬНОЕ РАЗВИТИЕ ⬇️</div>  
  
    <!-- Район 3: Полный Page Controller -->  
    <div class="district full-district">  
        <div class="district-title">  
            <span class="district-icon">🏙️</span>  
            Деловой центр (Full Page Controller)  
        </div>  
  
        <div class="building">  
            <div class="building-name">🏗️ Многоэтажка контроллеров</div>  
            <div class="building-description">  
                Целый небоскреб с разными отделами: AddVenueController (регистрация),  
                ListVenuesController (архив), каждый со своим лифтом (process())  
                и переходами между этажами (forward()).  
            </div>  
        </div>  
  
        <div class="building">  
            <div class="building-name">🔄 Система переходов</div>  
            <div class="building-description">  
                Сложная система коридоров и переходов между зданиями.  
                Посетитель может попасть из регистрации сразу в архив,  
                минуя лишние остановки.  
            </div>  
        </div>  
    </div>  
  
    <div class="route">  
        <div class="route-title">🗺️ Маршрут запоминания:</div>  
        1. Начните с <strong>простой деревни</strong> - один файл, все вместе<br>  
        2. Переезжайте в <strong>организованный квартал</strong> - разделяем ответственность<br>  
        3. Заканчивайте в <strong>деловом центре</strong> - полная иерархия классов<br><br>  
        💡 <strong>Ключевая ассоциация:</strong> Page Controller = "Одна страница - один хозяин",  
        в отличие от Front Controller = "Одна входная дверь для всего города"  
    </div>  
  
    <div class="memory-tip">  
        <div class="memory-tip-title">🎯 Якорные образы для запоминания:</div>  
        • <strong>Простота</strong> = Деревенский дом (все в одном месте)<br>  
        • <strong>Разделение</strong> = Квартал с мэрией (общие правила + специализация)<br>  
        • <strong>Иерархия</strong> = Деловой центр (сложная структура, много взаимодействий)<br>  
        • <strong>Выбор шаблона</strong> = "Неделя работы = деревня, месяцы работы = деловой центр"  
    </div>  
</div>  
</body>  
</html>
```