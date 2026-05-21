---
created: 2024-03-17T17:45:18 (UTC +03:00)
tags: [java,spring,Асинхронное взаимодействие,kafka,Spring-микросервисы,Picocli,консольные приложения]
source: https://habr.com/ru/companies/otus/articles/663264/
author: Ксения Мосеенкова
tags:
 - web
 - firefox
 - ApacheKafka2
---
[[2024-03-17]]

# Асинхронное взаимодействие Spring-микросервисов с помощью Kafka / Хабр

> ## Excerpt
> В этой статье разберемся, как реализовать обмен сообщениями между Java-микросервисами на Spring с помощью Kafka.1. АрхитектураУ нас будет Producer-микросервис ("...

---
![[Асинхронное взаимодействие Spring-микросервисов с помощью Kafka  Хабр/52dce85d8879308e3ba99f7acf7bf774.png]]

В этой статье разберемся, как реализовать обмен сообщениями между Java-микросервисами на Spring с помощью Kafka.

## 1\. Архитектура

![[Асинхронное взаимодействие Spring-микросервисов с помощью Kafka  Хабр/6842c2e606c1d8d28bc0713ffcaf2673.png]]

У нас будет Producer-микросервис ("писатель"), который получает заказы на еду (Food Order) и передает их через Kafka в Consumer-микросервис ("читатель") для сохранения в базу данных.

## 2\. Пара слов о Kafka

Кластер Kafka обладает высокой масштабируемостью и отказоустойчивостью: при поломке одного из узлов, другие узлы берут на себя его работу, обеспечивая непрерывность работы без потери данных.

Чтение и запись данных в Kafka выполняется в виде событий, содержащих информацию в различном формате, например, в виде строки, массива или JSON-объекта. 

Producer (производитель, издатель) публикует (записывает) события в Kafka, а Consumer (потребитель, подписчик) подписывается на эти события и обрабатывает их.

## 3\. Топики

События группируются в топики (topic). Топик похож на папку, а события — на файлы в этой папке. У топика может быть ноль, один или много издателей и подписчиков.

События можно прочитать столько раз, сколько необходимо. В этом отличие Kafka от традиционных систем обмена сообщениями: после чтения события не удаляются. Можно настроить, как долго Kafka хранит события.

## 4\. Разделы

Топики поделены на разделы (partition). Публикация события в топике фактически означает добавление его к одному из разделов. События с одинаковыми ключами записываются в один раздел. В рамках раздела Kafka гарантирует порядок событий.

![[Асинхронное взаимодействие Spring-микросервисов с помощью Kafka  Хабр/9537d9be25206001ee0388e5e130aba5.png]]

Для отказоустойчивости и высокой доступности топик может быть реплицирован, в том числе между различными, географически удаленными, датацентрами. То есть всегда будет несколько брокеров с копиями данных на случай, если что-то пойдет не так.

## 5\. Создание проектов

Перейдите на [<u>start.spring.io</u>](https://start.spring.io/) и создайте проекты с зависимостями, показанными на рисунках ниже.

Producer-микросервис:

![[Асинхронное взаимодействие Spring-микросервисов с помощью Kafka  Хабр/8cde594713a26bcdbd2abcc26c8b9f04.png]]

Consumer-микросервис:

![[Асинхронное взаимодействие Spring-микросервисов с помощью Kafka  Хабр/86cd951d231829467b1b6c92501ab1ba.png]]

## 6\. Запуск Kafka в докере

В корне одного из проектов, неважно каком, создайте файл `docker-compose.yml`, содержащий параметры запуска Kafka, Kafdrop и Zookeeper в докере.

```
version: "3.7"

networks:
  kafka-net:
    name: kafka-net
    driver: bridge

services:
  zookeeper:
    image: zookeeper:3.7.0
    container_name: zookeeper
    restart: "no"
    networks:
      - kafka-net
    ports:
      - "2181:2181"

  kafka:
    image: obsidiandynamics/kafka
    container_name: kafka
    restart: "no"
    networks:
      - kafka-net
    ports:
      - "9092:9092"
    environment:
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: DOCKER_INTERNAL:PLAINTEXT,DOCKER_EXTERNAL:PLAINTEXT
      KAFKA_LISTENERS: DOCKER_INTERNAL://:29092,DOCKER_EXTERNAL://:9092
      KAFKA_ADVERTISED_LISTENERS: DOCKER_INTERNAL://kafka:29092,DOCKER_EXTERNAL://${DOCKER_HOST_IP:-127.0.0.1}:9092
      KAFKA_INTER_BROKER_LISTENER_NAME: DOCKER_INTERNAL
      KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181"
      KAFKA_BROKER_ID: 1
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper

  kafdrop:
    image: obsidiandynamics/kafdrop
    container_name: kafdrop
    restart: "no"
    networks:
      - kafka-net
    ports:
      - "9000:9000"
    environment:
      KAFKA_BROKERCONNECT: "kafka:29092"
    depends_on:
      - "kafka"
```

Далее, находясь в папке с `docker-compose.yml` выполните `docker-compose up`. После запуска контейнеров откройте Kafdrop (веб-интерфейс для управления Kafka) по адресу [<u>http://localhost:9000</u>](http://localhost:9000/).

В Kafdrop можно смотреть топики, создавать их, удалять и делать многое другое.

![[Асинхронное взаимодействие Spring-микросервисов с помощью Kafka  Хабр/eb5291d72ddcd481d19b1d97d52acbef.png]]

## 7\. Producer-микросервис

Архитектура:

![[Асинхронное взаимодействие Spring-микросервисов с помощью Kafka  Хабр/16b1f8b66ebd9a36b38909821be68dac.png]]

Этапы создания Producer-микросервиса:

-   создаем конфигурационные бины;
    
-   создаем топик для заказов;
    
-   создаем контроллер FoodOrderController, сервис FoodOrderService и Producer;
    
-   преобразуем заказы FoodOrder в текстовый вид для отправки брокеру.
    

Переменные окружения и порт для нашего API (application.yml):

```
server:
  port: 8080

topic:
  name: t.food.order
```

`Config` отвечает за создание топика и бина `KafkaTemplate`, используемого для отправки сообщения.

```
@Configuration
public class Config {

    private final KafkaProperties kafkaProperties;

    @Autowired
    public Config(KafkaProperties kafkaProperties) {
        this.kafkaProperties = kafkaProperties;
    }

    @Bean
    public ProducerFactory&lt;String, String&gt; producerFactory() {
        // get configs on application.properties/yml
        Map&lt;String, Object&gt; properties = kafkaProperties.buildProducerProperties();
        return new DefaultKafkaProducerFactory&lt;&gt;(properties);
    }

    @Bean
    public KafkaTemplate&lt;String, String&gt; kafkaTemplate() {
        return new KafkaTemplate&lt;&gt;(producerFactory());
    }

    @Bean
    public NewTopic topic() {
        return TopicBuilder
                .name("t.food.order")
                .partitions(1)
                .replicas(1)
                .build();
    }

}
```

Класс модели `FoodOrder`:

```
@Data
@Value
public class FoodOrder {
    String item;
    Double amount;
}
```

`FoodOrderController` отвечает за получение заказа `FoodOrder` и передачу его на уровень сервиса.

```
@Slf4j
@RestController
@RequestMapping("/order")
public class FoodOrderController {

    private final FoodOrderService foodOrderService;

    @Autowired
    public FoodOrderController(FoodOrderService foodOrderService) {
        this.foodOrderService = foodOrderService;
    }

    @PostMapping
    public String createFoodOrder(@RequestBody FoodOrder foodOrder) throws JsonProcessingException {
        log.info("create food order request received");
        return foodOrderService.createFoodOrder(foodOrder);
    }
}
```

`FoodOrderService` — получение заказа `FoodOrder` и передачу его Producer.

```
@Slf4j
@Service
public class FoodOrderService {

    private final Producer producer;

    @Autowired
    public FoodOrderService(Producer producer) {
        this.producer = producer;
    }

    public String createFoodOrder(FoodOrder foodOrder) throws JsonProcessingException {
        return producer.sendMessage(foodOrder);
    }
}
```

`Producer` получает заказ `FoodOrder` и публикует его в Kafka в виде сообщения.

В строке 18 мы конвертируем объект `FoodOrder` в JSON-строку для его передачи в виде строки в Consumer-микросервис.

В строке 19 фактически отправляем сообщение, передавая топик для публикации (переменная окружения в строке 6) и заказ в виде сообщения.

```
@Slf4j
@Component
public class Producer {

    @Value("${topic.name}")
    private String orderTopic;

    private final ObjectMapper objectMapper;
    private final KafkaTemplate&lt;String, String&gt; kafkaTemplate;

    @Autowired
    public Producer(KafkaTemplate&lt;String, String&gt; kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public String sendMessage(FoodOrder foodOrder) throws JsonProcessingException {
        String orderAsMessage = objectMapper.writeValueAsString(foodOrder);
        kafkaTemplate.send(orderTopic, orderAsMessage);

        log.info("food order produced {}", orderAsMessage);

        return "message sent";
    }
}
```

При запуске приложения мы должны увидеть топик, созданный в Kafdrop. А при отправке заказа FoodOrder — информацию в логе, что сообщение отправлено.

![[Асинхронное взаимодействие Spring-микросервисов с помощью Kafka  Хабр/b7b063404062228d4db79f6e9d91b28b.png]]

![[Асинхронное взаимодействие Spring-микросервисов с помощью Kafka  Хабр/aa3cf2db01f4a70d12a6bd0a9bcd9563.png]]

Теперь в Kafdrop в разделе `Topics` можем посмотреть созданный топик t.food.order и увидеть наше сообщение.

![[Асинхронное взаимодействие Spring-микросервисов с помощью Kafka  Хабр/2797d9ad7cf28fcd590b91bcdf0375e8.png]]

## 8\. Consumer-микросервис

Архитектура:

![[Асинхронное взаимодействие Spring-микросервисов с помощью Kafka  Хабр/44c2732eb680af91d277d8a4cbe62b22.png]]

Этапы создания Consumer-микросервиса:

-   конфигурируем group-id и бины;
    
-   настраиваем доступ к базе данных;
    
-   создаем Consumer и FoodOrderService;
    
-   создаем репозиторий FoodOrderRepository.
    

Начнем с настройки порта для запуска нашего API, топика, который будем слушать, group-id для Consumer-микросервиса и конфигурации базы данных.

```
server:
  port: 8081

topic:
  name: t.food.order

spring:
  kafka:
    consumer:
      group-id: "default"

  h2:
    console:
      enabled: true
      path: /h2-console
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
    password: password
```

`Config` отвечает за настройку бина `ModelMapper` — библиотеки для маппинга одних объектов на другие. Например, для DTO, используемого далее.

```
@Configuration
public class Config {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

}
```

Классы модели:

```
@Data
@Value
public class FoodOrderDto {
    String item;
    Double amount;
}
```

```
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class FoodOrder {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String item;
    private Double amount;
}
```

`Consumer` отвечает за прослушивание топика с заказами и получение сообщений. Полученные сообщения мы преобразуем в `FoodOrderDto`, не содержащего ничего, связанного с персистентностью, например, ID.

```
@Slf4j
@Component
public class Consumer {

    private static final String orderTopic = "${topic.name}";

    private final ObjectMapper objectMapper;
    private final FoodOrderService foodOrderService;

    @Autowired
    public Consumer(ObjectMapper objectMapper, FoodOrderService foodOrderService) {
        this.objectMapper = objectMapper;
        this.foodOrderService = foodOrderService;
    }

    @KafkaListener(topics = orderTopic)
    public void consumeMessage(String message) throws JsonProcessingException {
        log.info("message consumed {}", message);

        FoodOrderDto foodOrderDto = objectMapper.readValue(message, FoodOrderDto.class);
        foodOrderService.persistFoodOrder(foodOrderDto);
    }

}
```

`FoodOrderService` — преобразование полученного DTO в объект `FoodOrder` и сохранение его в БД.

```
@Slf4j
@Service
public class FoodOrderService {

    private final FoodOrderRepository foodOrderRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public FoodOrderService(FoodOrderRepository foodOrderRepository, ModelMapper modelMapper) {
        this.foodOrderRepository = foodOrderRepository;
        this.modelMapper = modelMapper;
    }

    public void persistFoodOrder(FoodOrderDto foodOrderDto) {
        FoodOrder foodOrder = modelMapper.map(foodOrderDto, FoodOrder.class);
        FoodOrder persistedFoodOrder = foodOrderRepository.save(foodOrder);

        log.info("food order persisted {}", persistedFoodOrder);
    }

}
```

Код `FoodOrderRepository`:

```
@Repository
public interface FoodOrderRepository extends JpaRepository&lt;FoodOrder, Long&gt; {
}
```

Теперь при запуске Consumer-микросервиса отправленные ранее сообщения будут прочитаны из соответствующего топика.

![[Асинхронное взаимодействие Spring-микросервисов с помощью Kafka  Хабр/03973cb6a5394e4f7610b781dbe97708.png]]

Здесь отмечу одну важную деталь: если мы перейдем в Kafdrop и проверим сообщение, которое только что получили, оно будет доступно. Но, например, в RabbitMQ мы бы его не увидели.

![[Асинхронное взаимодействие Spring-микросервисов с помощью Kafka  Хабр/0ffb348b0a9a572d38b5186eda96e9c5.png]]

## 9\. Дополнительный функционал

Мы можем отправлять периодические сообщения, включив функционал запуска задач по расписанию.

Для этого добавляем аннотацию `@EnableScheduling` к классу конфигурации Producer-микросервиса.

```
@EnableScheduling
@Configuration
public class Config {
    
    ...
    
}
```

Будем отправлять сообщения с фиксированным интервалом в 1000 миллисекунд.

```
@Slf4j
@Component
public class Scheduler {

    @Autowired
    private KafkaTemplate&lt;String, String&gt; kafkaTemplate;
    private Integer count = 0;

    @Scheduled(fixedRate = 1000)
    public void sendMessage() {
        count++;
        kafkaTemplate.send("t.scheduled", "message " + count);
        log.info("sent message count {}", count);
    }

}
```

Топик будет создан автоматически, но можно определить бин также, как делали раньше.

Получим следующий результат:

![[Асинхронное взаимодействие Spring-микросервисов с помощью Kafka  Хабр/3b2bfe29b861ffa59a989225b8baccfc.png]]

## 10\. Заключение

Основная идея статьи была познакомить вас с использованием Kafka совместно с Java и Spring для реализации на ее основе более сложных решений.

Исходный код из статьи доступен на GitHub [здесь](https://github.com/pedroluiznogueira/medium-microservices-kafka).

### Ссылки

1.  [Документация Apache Kafka](https://kafka.apache.org/documentation)
    
2.  [Kafka The Definitive Guide](https://www.confluent.io/resources/kafka-the-definitive-guide/), O’Reilly
    
3.  [Apache Kafka](https://link.springer.com/referenceworkentry/10.1007/978-3-319-63962-8_196-1), Matthias J. Sax
    

___

Приглашаем всех желающих на открытое занятие «Разработка консольных приложений на Spring и Picocli». На данном занятии мы покажем, как строить Command Line Interface и утилиты командной строки на Picocli, как альтернативу Spring Shell. Также будут рассмотрены некоторые возможности Java для создания таких консольных утилит. Регистрация — [**по ссылке.**](https://otus.pw/edNT/)
