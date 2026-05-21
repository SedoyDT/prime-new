---
created: 2024-03-17T12:09:32 (UTC +03:00)
tags: [kafka,kafka apache,doc,post,liquibase,testcontainers]
source: https://habr.com/ru/articles/742786/
author: MiSta1984
tags:
 - web
 - firefox
 - ApacheKafka
---
[[2024-03-17]]

# Apache Kafka. Пишем простой producer и consumer и тестируем их / Хабр

> ## Excerpt
> Всем привет. В данной статье будет описано, как создать простой kafka producer и kafka consumer, а затем протестировать их.Данная статья будет полезна начинающим...

---
Всем привет.

В данной статье будет описано, как создать простой kafka producer и kafka consumer, а затем протестировать их.

Данная статья будет полезна начинающим разработчикам, которые еще не работали с технологией Apache Kafka.

Немного теории.

Вначале надо разобраться, что такое Apache Kafka и для чего она используется. И тут сразу могут возникнуть первые вопросы, так как первое, что приходит в голову, если идет речь о kafka, то это - распределенная система обмена сообщениями между серверными приложениями в режиме реального времени. Но если "копнуть глубже" и посмотреть на определение kafka на официальном сайте [https://kafka.apache.org/](https://kafka.apache.org/) мы увидим.

**Apache Kafka is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.**

Исходя из этого определения Apache Kafka — это больше, чем просто система обмена сообщениями, это распределенная платформа потоковой передачи событий, а также потоковой аналитики и интеграции данных.

То есть kafka может использоваться и как база данных, и как распределенное хранилище логов, и как очередь, и как платформа для потоковой обработки данных и т.д.

В данной статье будет рассмотрен пример, как с помощью kafka организовать обмен сообщениями между двумя микросервисами.

Kafka, как и почти все сервисы обработки очередей, условно состоит из трех основных частей:

1) сервер или еще его называют брокер;

2) producer - отправляют сообщения брокеру;

3) consumer - считывают сообщения с брокера, использую модель pull, то есть консьюмеры сами отправляют запросы к брокеру для получения новых сообщений.

Главной отличительной чертой kafka от других систем обработки очередей (например RabbitMQ), является то, что сообщения в kafka могут храниться на брокере днями, неделями или даже годами. Благодаря этому одно и тоже сообщение может быть обработано разными консьюмерами по-разному.

Рассмотрим какая структура сообщения в kafka. Оно состоит из ключа (key), значения (value), таймстампа (timestamp) и набора метаданных (headers).

Сообщения хранятся в топиках (topics). Топики состоят из партиций (partitions). Партиции или их еще называют разделы - это копии очередей наших сообщений. Чтобы повысить надежность и доступность данных в кластере-Kafka, разделы могут иметь копии, число которых задается коэффициентом репликации (replication factor), который показывает, на сколько брокеров-последователей (follower) будут скопированы данные с ведущего-лидера (leader). Таким образом, гарантируется наличие нескольких копий сообщения на разных брокерах. Партиции, в свою очередь, распределены между брокерами внутри одного кластера. Такая сложная, на первый взгляд, система хранения сообщений необходима для отказоустойчивости, масштабирования и повышения производительности работы, так как она позволяет продюсерам писать в несколько брокеров одновременно, а консьюмерам - читать, также из нескольких брокеров.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/5b3e37cf6374946ec0c7fc1a079be75e.png]]

У каждой партиции есть свой "лидер" (leader) - это тот брокер, который работает с продюсером и на него приходит сообщение, а также у каждой партиции имеются несколько "фолловеров" (followers) - это брокеры, которые хранят копии партиций. Перед отправкой сообщения консьюмер обращается к брокеру и запрашивает данные, кто является лидером партиции.

Таким образом, общая схема сохранения сообщения в kafka выглядит следующим образом. Имеется какой-то топик, в который записываются сообщения, и есть несколько партиций (копий очередей наших сообщений), распределенных по брокерам в кластере. Продюсер вначале обращается к брокеру с вопросом, кто является лидером партиции в данном брокере, и после получения данной информации отправляет туда свое сообщение, на втором этапе, фолловеры данной партиции копируют себе отправленное сообщение на свой брокер. Так происходит с каждой партицией.

Время хранения сообщения в kafka регулируется с помощью специальных настроек.

Рассмотрим сейчас как выглядит работа консьюмера в kafka.

Каждый консьюмер должен быть частью какой-нибудь консьюмер группы. Данная группа должна иметь уникальное название и должна быть зарегистрирована в кластере. Как правило, если у нас есть несколько консьюмеров, в одной группе, то они получают сообщения из разных партиций. Желательно, чтобы количество консьюмеров было равно количеству партиций, и каждый консьюмер читал сообщения из своей партиции, таким образом, распределяется нагрузка и повышается производительность работы.

Есть еще один важный вопрос. Если мы захотим добавить консьюмера к топику не сразу, а позже или, например, произойдет сбой консьюмера, а позже он восстановится и вопрос, откуда он будет знать с какого сообщения продолжить работу? Для этого имеется специальный механизм консьюмер-офсетов (offset). Перед началом работы консьюмер делает специальный запрос к брокеру с указанием группы, топика, партиции и офсета, который должен быть помечен как обработанный. Брокер сохраняет эту информацию у себя. При сбое в работе, консьюмер запрашивает у брокера последний закомиченный офсет и продолжает читать с данной позиции сообщения.

Это упрощенное описание работы kafka-продюсера и kafka-консьюмера.

Также при описании kafka нельзя не вспомнить про один важный компонент - zookeeper.

ZooKeeper - это хранилище метаданных kafka, именно он знает в каком состоянии находятся брокеры, какая партиция играет роль лидера, сколько партиций и где они находятся, сколько у каждой партиции реплик и так далее.

Разобравшись немного с теорией приступим к нашему примеру.

Весь код примера будет доступен по [ссылке](https://github.com/mista1984gmail/kafka-article).

Пример будет очень простой. Допустим у нас будет три микросервиса. Один - это продюсер - он будет производить и отправлять сообщения в kafka, в нашем случае это будет Заказ.

```
<span>@Data</span><br><span>@AllArgsConstructor</span><br><span>@NoArgsConstructor</span><br><span>public</span> <span>class</span> <span>Order</span> {<br><br>    <span>private</span> <span>String</span> <span>productName</span>;<br>    <span>private</span> <span>String</span> <span>barCode</span>;<br>    <span>private</span> <span>int</span> <span>quantity</span>;<br>    <span>private</span> <span>BigDecimal</span> <span>price</span>;<br><br>}
```

Второй микросервис - консьюмер, который будет читать наше сообщение и записывать его в базу данных.

И третий микросервис - также будет читать наше сообщение и просто выводить его в консоль.

Таким образом, я хочу показать, что можно настроить несколько консьюмеров, которые будут подписаны на один топик и будут получать из него сообщения, но поступать с ними по-разному.

Весь код приводить не буду, буду останавливаться только на главных моментах.

Kafka, zookeeper, kafka-ui (для просмотра сообщений в kafka), database (postgres) и pgadmin (для просмотра данных в базе) поднимем с помощью docker.

Для этого напишем следующий docker-compose.yml файл.

```
<span>services</span>:<br><br>  <span>zookeeper</span>:<br>    <span>image</span>: <span>confluentinc</span><span>/</span><span>cp</span><span>-</span><span>zookeeper</span>:<span>6.2</span><span>.4</span><br>    <span>healthcheck</span>:<br>      <span>test</span>: [ <span>"CMD"</span>, <span>"nc"</span>, <span>"-vz"</span>, <span>"localhost"</span>, <span>"2181"</span> ]<br>      <span>interval</span>: <span>10</span><span>s</span><br>      <span>timeout</span>: <span>3</span><span>s</span><br>      <span>retries</span>: <span>3</span><br>    <span>environment</span>:<br>      <span>ZOOKEEPER_CLIENT_PORT</span>: <span>2181</span><br>      <span>ZOOKEEPER_TICK_TIME</span>: <span>2000</span><br>    <span>ports</span>:<br>      <span>-</span> <span>22181</span>:<span>2181</span><br><br>  <span>kafka</span>:<br>    <span>image</span>: <span>confluentinc</span><span>/</span><span>cp</span><span>-</span><span>kafka</span>:<span>6.2</span><span>.4</span><br>    <span>depends_on</span>:<br>      <span>zookeeper</span>:<br>        <span>condition</span>: <span>service_healthy</span><br>    <span>ports</span>:<br>      <span>-</span> <span>29092</span>:<span>29092</span><br>    <span>healthcheck</span>:<br>      <span>test</span>: [ <span>"CMD"</span>, <span>"nc"</span>, <span>"-vz"</span>, <span>"localhost"</span>, <span>"9092"</span> ]<br>      <span>interval</span>: <span>10</span><span>s</span><br>      <span>timeout</span>: <span>3</span><span>s</span><br>      <span>retries</span>: <span>3</span><br>    <span>environment</span>:<br>      <span>KAFKA_BROKER_ID</span>: <span>1</span><br>      <span>KAFKA_ZOOKEEPER_CONNECT</span>: <span>zookeeper</span>:<span>2181</span><br>      <span>KAFKA_LISTENERS</span>: <span>OUTSIDE</span>:<span>//:29092,INTERNAL://:9092</span><br>      <span>KAFKA_ADVERTISED_LISTENERS</span>: <span>OUTSIDE</span>:<span>//localhost:29092,INTERNAL://kafka:9092</span><br>      <span>KAFKA_LISTENER_SECURITY_PROTOCOL_MAP</span>: <span>INTERNAL</span>:<span>PLAINTEXT</span>,<span>OUTSIDE</span>:<span>PLAINTEXT</span><br>      <span>KAFKA_INTER_BROKER_LISTENER_NAME</span>: <span>INTERNAL</span><br>      <span>KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR</span>: <span>1</span><br><br>  <span>kafka</span><span>-</span><span>ui</span>:<br>    <span>image</span>: <span>provectuslabs</span><span>/</span><span>kafka</span><span>-</span><span>ui</span><br>    <span>container_name</span>: <span>kafka</span><span>-</span><span>ui</span><br>    <span>ports</span>:<br>      <span>-</span> <span>"8080:8080"</span><br>    <span>restart</span>: <span>always</span><br>    <span>depends_on</span>:<br>      <span>kafka</span>:<br>        <span>condition</span>: <span>service_healthy</span><br>    <span>environment</span>:<br>      <span>KAFKA_CLUSTERS_0_NAME</span>: <span>local</span><br>      <span>KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS</span>: <span>kafka</span>:<span>9092</span><br><br>  <span>service</span><span>-</span><span>db</span>:<br>    <span>image</span>: <span>postgres</span>:<span>14.7</span><span>-</span><span>alpine</span><br>    <span>environment</span>:<br>      <span>POSTGRES_USER</span>: <span>username</span><br>      <span>POSTGRES_PASSWORD</span>: <span>password</span><br>    <span>healthcheck</span>:<br>      <span>test</span>: [<span>"CMD-SHELL"</span>, <span>"pg_isready"</span>, <span>"-d"</span>, <span>"clients_database"</span>]<br>      <span>interval</span>: <span>10</span><span>s</span><br>      <span>timeout</span>: <span>3</span><span>s</span><br>      <span>retries</span>: <span>3</span><br>    <span>ports</span>:<br>      <span>-</span> <span>"15432:5432"</span><br>    <span>volumes</span>:<br>      <span>-</span> .<span>/</span><span>infrastructure</span><span>/</span><span>db</span><span>/</span><span>create_db</span>.<span>sql</span>:<span>/</span><span>docker</span><span>-</span><span>entrypoint</span><span>-</span><span>initdb</span>.<span>d</span><span>/</span><span>create_db</span>.<span>sql</span><br>    <span>restart</span>: <span>unless</span><span>-</span><span>stopped</span><br><br>  <span>pgadmin</span>:<br>    <span>container_name</span>: <span>pgadmin4_container</span><br>    <span>image</span>: <span>dpage</span><span>/</span><span>pgadmin4</span>:<span>7</span><br>    <span>restart</span>: <span>always</span><br>    <span>environment</span>:<br>      <span>PGADMIN_DEFAULT_EMAIL</span>: <span>admin</span><span>@admin</span>.<span>com</span><br>      <span>PGADMIN_DEFAULT_PASSWORD</span>: <span>root</span><br>    <span>ports</span>:<br>      <span>-</span> <span>"5050:80"</span><br><br>  <span>kafka</span><span>-</span><span>topics</span><span>-</span><span>generator</span>:<br>    <span>image</span>: <span>confluentinc</span><span>/</span><span>cp</span><span>-</span><span>kafka</span>:<span>6.2</span><span>.4</span><br>    <span>depends_on</span>:<br>      <span>kafka</span>:<br>        <span>condition</span>: <span>service_healthy</span><br>    <span>entrypoint</span>: [ <span>'/bin/sh'</span>, <span>'-c'</span> ]<br>    <span>command</span>: <span>|</span><br>        <span>"</span><br>        <span>#</span> <span>blocks</span> <span>until</span> <span>kafka</span> <span>is</span> <span>reachable</span><br>        <span>kafka</span><span>-</span><span>topics</span> <span>--</span><span>bootstrap</span><span>-</span><span>server</span> <span>kafka</span>:<span>9092</span> <span>--</span><span>list</span><br>        <br>        <span>echo</span> <span>-</span><span>e</span> <span>'Creating kafka topics'</span><br>        <span>kafka</span><span>-</span><span>topics</span> <span>--</span><span>bootstrap</span><span>-</span><span>server</span> <span>kafka</span>:<span>9092</span> <span>--</span><span>create</span> <span>--</span><span>if</span><span>-</span><span>not</span><span>-</span><span>exists</span> <span>--</span><span>topic</span> <span>send</span><span>-</span><span>order</span><span>-</span><span>event</span> <span>--</span><span>replication</span><span>-</span><span>factor</span> <span>1</span> <span>--</span><span>partitions</span> <span>2</span><br>        <br>        <span>echo</span> <span>-</span><span>e</span> <span>'Successfully created the following topics:'</span><br>        <span>kafka</span><span>-</span><span>topics</span> <span>--</span><span>bootstrap</span><span>-</span><span>server</span> <span>kafka</span>:<span>9092</span> <span>--</span><span>list</span><br>        <span>"</span>
```

Базу данных orders\_database, создадим на этапе поднятия контейнера с postgres.

Топик (send-order-event) создадим с помощью команды в отдельном контейнере, здесь же создадим две партиции, так как у нас будет два консьюмера и желательно, чтобы каждый консьюмер читал из своей патриции.

Топики можно также создавать и с помощью кода.

Пройдемся по этапам создания продюсера.

Вначале необходимо сделать некоторые настройки продюсера. Это можно делать с помощью кода или прописывать в application файле. Мы это сделаем с помощью application.yml файла.

```
<span>server</span>:<br>  <span>port</span>: <span>8081</span><br><br><span>spring</span>:<br>  <span>kafka</span>:<br>    <span>bootstrap</span><span>-</span><span>servers</span>: <span>localhost</span>:<span>29092</span><br>    <span>producer</span>:<br>      <span>key</span><span>-</span><span>serializer</span>: <span>org</span>.<span>apache</span>.<span>kafka</span>.<span>common</span>.<span>serialization</span>.<span>StringSerializer</span><br>      <span>value</span><span>-</span><span>serializer</span>: <span>org</span>.<span>springframework</span>.<span>kafka</span>.<span>support</span>.<span>serializer</span>.<span>JsonSerializer</span><br>      <span>properties</span>:<br>        <span>acks</span>: <span>1</span><br>        <span>spring</span>:<br>          <span>json</span>:<br>            <span>add</span>:<br>              <span>type</span>:<br>                <span>headers</span>: <span>false</span><br><br><span>topic</span>:<br>  <span>send</span><span>-</span><span>order</span>: <span>send</span><span>-</span><span>order</span><span>-</span><span>event</span>
```

Здесь указываем порт, на котором будет работать kafka (должен совпадать с внешним портом, который мы открыли в docker для kafka), также необходимо указать как мы будем сериализовать ключ и значение (значение - это и будет наш заказ, поэтому здесь надо указать JsonSerializer). Также прописываем название нашего топика send-order-event, название должно совпадать с тем, что мы указали при создании топика в docker. Данное название мы потом с помощью аннотации @Value будем сетать в переменную.

Далее создадим сам сервис по отправке сообщений.

```
<span>@Service</span><br><span>@RequiredArgsConstructor</span><br><span>public</span> <span>class</span> <span>KafkaMessagingService</span> {<br><br>    <span>@Value</span>(<span>"${topic.send-order}"</span>)<br>    <span>private</span> <span>String</span> <span>sendClientTopic</span>;<br><br>    <span>private</span> <span>final</span> <span>KafkaTemplate</span><span>&lt;</span><span>String</span> , <span>Object</span><span>&gt;</span> <span>kafkaTemplate</span>;<br><br>    <span>public</span> <span>void</span> <span>sendOrder</span>(<span>OrderSendEvent</span> <span>orderSendEvent</span>) {<br>       <span>kafkaTemplate</span>.<span>send</span>(<span>sendClientTopic</span>, <span>orderSendEvent</span>.<span>getBarCode</span>(), <span>orderSendEvent</span>);<br>    }<br><br>}
```

Внедряем бин private final KafkaTemplate<String , Object> kafkaTemplate в данный класс с помощью аннотации [@RequiredArgsConstructor](https://habr.com/users/RequiredArgsConstructor). Также как было сказано раньше сетаем в переменную sendClientTopic название нашего топика с application.yml файла. Далее пишем сам метод по отправке сообщения, который на вход будет принимать OrderSendEvent - то есть наш заказ. Вызываем у kafkaTemplate метод send куда передаем название топика, ключ (в качестве ключа будет выступать код продукта). Ключ нужен для того чтобы сообщения с одинаковыми ключами всегда записываются в одну и ту же партицию. Последним передаем сам заказ.

```
<span>@Data</span><br><span>@AllArgsConstructor</span><br><span>@NoArgsConstructor</span><br><span>public</span> <span>class</span> <span>OrderSendEvent</span> {<br><br>    <span>private</span> <span>String</span> <span>productName</span>;<br>    <span>private</span> <span>String</span> <span>barCode</span>;<br>    <span>private</span> <span>int</span> <span>quantity</span>;<br>    <span>private</span> <span>BigDecimal</span> <span>price</span>;<br><br>}
```

Создадим еще класс Producer.

```
<span>@Slf4j</span><br><span>@Component</span><br><span>@RequiredArgsConstructor</span><br><span>public</span> <span>class</span> <span>Producer</span> {<br><br>    <span>private</span> <span>final</span> <span>KafkaMessagingService</span> <span>kafkaMessagingService</span>;<br>    <span>private</span> <span>final</span> <span>ModelMapper</span> <span>modelMapper</span>;<br><br><br>    <span>public</span> <span>Order</span> <span>sendOrderEvent</span>(<span>Order</span> <span>order</span>) {<br>        <span>kafkaMessagingService</span>.<span>sendOrder</span>(<span>modelMapper</span>.<span>map</span>(<span>order</span>, <span>OrderSendEvent</span>.<span>class</span>));<br>        <span>log</span>.<span>info</span>(<span>"Send order from producer {}"</span>, <span>order</span>);<br>        <span>return</span> <span>order</span>;<br>    }<br>}
```

Он нужен просто для того чтобы отделить логику отправки от маппинга сущностей.

Отправку сообщения будем производить с помощью postman, поэтому создадим еще контроллер OrderController.

```
<span>@Slf4j</span><br><span>@Validated</span><br><span>@RestController</span><br><span>@RequiredArgsConstructor</span><br><span>@RequestMapping</span>(<span>"/api/v1/orders"</span>)<br><span>public</span> <span>class</span> <span>OrderController</span> {<br>    <span>private</span> <span>final</span> <span>Producer</span> <span>producer</span>;<br><br>    <span>@PostMapping</span><br>    <span>@ResponseStatus</span>(<span>HttpStatus</span>.<span>OK</span>)<br>    <span>public</span> <span>Order</span> <span>sendOrder</span>(<span>@RequestBody</span> <span>Order</span> <span>order</span>) {<br>        <span>log</span>.<span>info</span>(<span>"Send order to kafka"</span>);<br>        <span>producer</span>.<span>sendOrderEvent</span>(<span>order</span>);<br>        <span>return</span> <span>order</span>;<br>    }<br><br>}
```

Рассмотрим теперь первый консьюмер.

Вначале также создадим application.yml файл, в котором настроим наш консьюмер.

```
<span>server</span>:<br>  <span>port</span>: <span>8082</span><br><br><span>spring</span>:<br>  <span>kafka</span>:<br>    <span>bootstrap</span><span>-</span><span>servers</span>: <span>localhost</span>:<span>29092</span><br>    <span>consumer</span>:<br>      <span>group</span><span>-</span><span>id</span>: <span>"order-1"</span><br>      <span>auto</span><span>-</span><span>offset</span><span>-</span><span>reset</span>: <span>earliest</span><br>      <span>key</span><span>-</span><span>deserializer</span>: <span>org</span>.<span>apache</span>.<span>kafka</span>.<span>common</span>.<span>serialization</span>.<span>StringDeserializer</span><br>      <span>value</span><span>-</span><span>deserializer</span>: <span>org</span>.<span>springframework</span>.<span>kafka</span>.<span>support</span>.<span>serializer</span>.<span>JsonDeserializer</span><br>      <span>properties</span>:<br>        <span>spring</span>:<br>          <span>json</span>:<br>            <span>trusted</span>:<br>              <span>packages</span>: <span>'*'</span><br><br>  <span>datasource</span>:<br>    <span>url</span>: <span>jdbc</span>:<span>postgresql</span>:<span>//${DB_HOST:localhost}:${DB_PORT:15432}/orders_database</span><br>    <span>username</span>: <span>username</span><br>    <span>password</span>: <span>password</span><br><br>  <span>liquibase</span>:<br>    <span>enabled</span>: <span>true</span><br>    <span>drop</span><span>-</span><span>first</span>: <span>false</span><br>    <span>change</span><span>-</span><span>log</span>: <span>classpath</span>:<span>db</span><span>/</span><span>changelog</span><span>/</span><span>db</span>.<span>changelog</span><span>-</span><span>master</span>.<span>xml</span><br>    <span>default</span><span>-</span><span>schema</span>: <span>public</span><br><br>  <span>jpa</span>:<br>    <span>show</span><span>-</span><span>sql</span>: <span>false</span><br>    <span>open</span><span>-</span><span>in</span><span>-</span><span>view</span>: <span>false</span><br>    <span>hibernate</span>:<br>      <span>ddl</span><span>-</span><span>auto</span>: <span>none</span><br>    <span>properties</span>:<br>      <span>hibernate</span>:<br>        <span>dialect</span>: <span>org</span>.<span>hibernate</span>.<span>dialect</span>.<span>PostgreSQLDialect</span><br><br><span>topic</span>:<br>  <span>send</span><span>-</span><span>order</span>: <span>send</span><span>-</span><span>order</span><span>-</span><span>event</span>
```

Здесь как и в продюсере указываем порт, на котором работает kafka.

Прописываем group-id: "order-1" - так как консьюмеры должны быть объединены в группы.

Указываем настройку auto-offset-reset: earliest - она нужна для того, если мы добавим новую партицию, когда в топик пишут сообщения продюсеры, без данной настройки, мы можем потерять или не обработать кусок данных, записавшихся в новую партицию до того, как консьюмеры обновили метаданные по топику и начали читать данные из этой партиции.

Как и в продюсере указываем как мы будем уже только десериализовать наши ключ и значение. Также прописываем настройку для того чтобы `JsonDeserializer` доверял десериализовать только классы в доверенном пакете. То есть тут можно указать конкретный пакет или с помощью "\*" - указать, что нужно доверять всем классам во всех пакетах.

Также прописываем название нашего топика send-order-event.

В данном файле также прописываем настройки по подключению к базе данных, накатыванию таблиц с помощью liquibase и чтобы выводились sql запросы к базе данных.

Далее создадим класс OrderEvent. По структуре он должен совпадать с тем классом (OrderSendEvent), который мы отправляем через продюсер.

```
<span>@Data</span><br><span>@AllArgsConstructor</span><br><span>@NoArgsConstructor</span><br><span>public</span> <span>class</span> <span>OrderEvent</span> {<br><br>    <span>private</span> <span>String</span> <span>productName</span>;<br>    <span>private</span> <span>String</span> <span>barCode</span>;<br>    <span>private</span> <span>int</span> <span>quantity</span>;<br>    <span>private</span> <span>BigDecimal</span> <span>price</span>;<br><br>}
```

И сам сервис по приемке сообщения.

```
<span>@Slf4j</span><br><span>@Service</span><br><span>@AllArgsConstructor</span><br><span>public</span> <span>class</span> <span>KafkaMessagingService</span> {<br>    <span>private</span> <span>static</span> <span>final</span> <span>String</span> <span>topicCreateOrder</span> <span>=</span> <span>"${topic.send-order}"</span>;<br>    <span>private</span> <span>static</span> <span>final</span> <span>String</span> <span>kafkaConsumerGroupId</span> <span>=</span> <span>"${spring.kafka.consumer.group-id}"</span>;<br>    <span>private</span> <span>final</span> <span>OrderService</span> <span>orderService</span>;<br>    <span>private</span> <span>final</span> <span>ModelMapper</span> <span>modelMapper</span>;<br><br>    <span>@Transactional</span><br>    <span>@KafkaListener</span>(<span>topics</span> <span>=</span> <span>topicCreateOrder</span>, <span>groupId</span> <span>=</span> <span>kafkaConsumerGroupId</span>, <span>properties</span> <span>=</span> {<span>"spring.json.value.default.type=com.example.consumer.service.messaging.event.OrderEvent"</span>})<br>    <span>public</span> <span>OrderEvent</span> <span>createOrder</span>(<span>OrderEvent</span> <span>orderEvent</span>) {<br>        <span>log</span>.<span>info</span>(<span>"Message consumed {}"</span>, <span>orderEvent</span>);<br>        <span>orderService</span>.<span>save</span>(<span>modelMapper</span>.<span>map</span>(<span>orderEvent</span>, <span>OrderDto</span>.<span>class</span>));<br>        <span>return</span> <span>orderEvent</span>;<br>    }<br><br>}
```

Здесь сетаем переменным topicCreateOrder и kafkaConsumerGroupId с application.yml файла значения названия топика и группы.

Создаем сам метод по обработке сообщений. Вешаем на него аннотацию `@KafkaListener` куда передаем название топика, который надо слушать, название группы, а также передаем еще настройку по дефолтному типу данных, который мы принимаем. Данную настройку, можно прописать и в application.yml файле, но я хотел показать как можно передавать настройки каждому слушателю, или, например, у вас в группе есть слушатель, который принимает другую сущность.

Далее с полученным сообщением, то есть OrderEvent, можно выполнять различную логику, зависящую от бизнес-требований. В нашем случае мы будем сохранять наш заказ в базу данных.

Рассмотрим еще один консьюмер, он создан в другом микросервисе и его настройки идентичны первому, поэтому только покажу сам метод по приемке сообщений - он будет выводить наш заказ в консоль. Здесь я хочу показать, что на один топик могут быть подписаны несколько консьюмеров и по разному трактовать, что делать с тем сообщением, которое будет появляться в топике.

```
<span>@Slf4j</span><br><span>@Service</span><br><span>@AllArgsConstructor</span><br><span>public</span> <span>class</span> <span>KafkaMessagingService</span> {<br>    <span>private</span> <span>static</span> <span>final</span> <span>String</span> <span>topicCreateOrder</span> <span>=</span> <span>"${topic.send-order}"</span>;<br>    <span>private</span> <span>static</span> <span>final</span> <span>String</span> <span>kafkaConsumerGroupId</span> <span>=</span> <span>"${spring.kafka.consumer.group-id}"</span>;<br><br><br>    <span>@Transactional</span><br>    <span>@KafkaListener</span>(<span>topics</span> <span>=</span> <span>topicCreateOrder</span>, <span>groupId</span> <span>=</span> <span>kafkaConsumerGroupId</span>, <span>properties</span> <span>=</span> {<span>"spring.json.value.default.type=com.example.service.OrderEvent"</span>})<br>    <span>public</span> <span>OrderEvent</span> <span>printOrder</span>(<span>OrderEvent</span> <span>orderEvent</span>) {<br>        <span>log</span>.<span>info</span>(<span>"The product: {} was ordered in quantity: {} and at a price: {}"</span>, <span>orderEvent</span>.<span>getProductName</span>(), <span>orderEvent</span>.<span>getQuantity</span>(), <span>orderEvent</span>.<span>getPrice</span>());<br>        <span>log</span>.<span>info</span>(<span>"To pay: {}"</span>, <span>new</span> <span>BigDecimal</span>(<span>orderEvent</span>.<span>getQuantity</span>()).<span>multiply</span>(<span>orderEvent</span>.<span>getPrice</span>()));<br>        <span>return</span> <span>orderEvent</span>;<br>    }<br><br>}
```

Давайте сейчас посмотрим как все это работает.

Вначале запустим наш docker-compose.yml командой docker-compose up -d в консоли.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/fa4c46910e1e047b982fb9083385402a.png]]

Далее необходимо подождать, пока docker стянет необходимые образы с docker hub и на их основе запустит контейнеры.

Идем в docker desktop и мы должны увидеть следующее.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/3b17105db3c75eaccf38873702617124.png]]

Kafka, zookeeper, kafka-ui, postgres и pgadmin должны быть запущены и работать. Зайдем в kafka-topics-generator и убедимся, что топик создался.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/2fa98d59df9bcb57584eb4be29337e39.png]]

Далее запускаем все наши три микросервиса.

Идем в postman и отправляем json с заказом на адрес http://localhost:8081/api/v1/orders, так как мы запустили наш продюсер на порту 8081.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/065ecdd55375850c1a53a4db7c1ee198.png]]

В логах продюсера мы должны увидеть, что сообщение отправилось.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/902c4f82932c05cc12d16f9a405ff63b.png]]

Теперь зайдем на [http://localhost:8080/](http://localhost:8080/) здесь мы должны увидеть в Topics наш топик.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/d7e64d59ce0ebead515d73383641edb8.png]]

Также в Messages мы должны увидеть наше отправленное сообщение.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/15cdd4883230753dc74a1e02f07faccb.png]]

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/8ba5543879b5512b3706783111586d80.png]]

И в Consumers мы можем увидеть, что у нас есть два консьюмера.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/828830f009da2690f085c3f3e83fec2c.png]]

Также проверим сохранился ли наш заказ, это должен был сделать наш первый консьюмер.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/26c09196744d903c9746d1507085bbdf.png]]

В логах мы видим, что сообщение обработано.

Идем на [http://localhost:5050](http://localhost:5050/browser/) заходим используя креды указанные в docker-compose.yml.

Далее настраиваем подключение.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/804d40a6f9540326cca33f6412b10ae9.png]]

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/659db51f5e7543c17fbe84c776be0333.png]]

Делаем select \* from orders и должны увидеть сохраненный заказ.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/3bf33f06d8ae88d3e599ec1c6fc5a07e.png]]

Теперь еще проверим как сработал наш второй консьюмер. Смотрим логи и видим, что наш второй консьюмер также отработал и вывел в консоль наш заказ.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/743e4734d6c3c4e0af4edaa4465220c3.png]]

Еще посмотрим как можно протестировать продюсер и консьюмер.

Вначале обратимся к продюсеру. Его мы протестируем с помощью EmbeddedKafka, он будет работать быстрее, чем использовать KafkaContainer, но для тестов консьюмера мы попробуем использовать KafkaContainer.

```
<span>@SpringBootTest</span><br><span>@DirtiesContext</span><br><span>@EmbeddedKafka</span>(<span>partitions</span> <span>=</span> <span>1</span>, <span>brokerProperties</span> <span>=</span> { <span>"listeners=PLAINTEXT://localhost:9092"</span>, <span>"port=9092"</span> })<br><span>public</span> <span>class</span> <span>KafkaMessageProducerServiceIT</span> {<br>    <span>public</span> <span>static</span> <span>final</span> <span>String</span> <span>TOPIC_NAME_SEND_CLIENT</span> <span>=</span> <span>"send-order-event"</span>;<br>    <span>@Autowired</span><br>    <span>private</span> <span>KafkaMessagingService</span> <span>kafkaMessagingService</span>;<br><br>    <span>@Test</span><br>    <span>public</span> <span>void</span> <span>it_should_send_order_event</span>() {<br>        <span>OrderSendEvent</span> <span>order</span> <span>=</span> <span>FakeOrder</span>.<span>getOrderSendEvent</span>();<br>        <span>kafkaMessagingService</span>.<span>sendOrder</span>(<span>order</span>);<br><br>        <span>Properties</span> <span>properties</span> <span>=</span> <span>new</span> <span>Properties</span>();<br>        <span>properties</span>.<span>put</span>(<span>ConsumerConfig</span>.<span>BOOTSTRAP_SERVERS_CONFIG</span>, <span>"localhost:9092"</span>);<br>        <span>properties</span>.<span>put</span>(<span>ConsumerConfig</span>.<span>KEY_DESERIALIZER_CLASS_CONFIG</span>, <span>StringDeserializer</span>.<span>class</span>);<br>        <span>properties</span>.<span>put</span>(<span>ConsumerConfig</span>.<span>VALUE_DESERIALIZER_CLASS_CONFIG</span>, <span>JsonDeserializer</span>.<span>class</span>);<br>        <span>properties</span>.<span>put</span>(<span>JsonDeserializer</span>.<span>TRUSTED_PACKAGES</span>, <span>"*"</span>);<br>        <span>properties</span>.<span>put</span>(<span>ConsumerConfig</span>.<span>GROUP_ID_CONFIG</span>, <span>"group-java-test"</span>);<br>        <span>properties</span>.<span>put</span>(<span>ConsumerConfig</span>.<span>AUTO_OFFSET_RESET_CONFIG</span>, <span>"earliest"</span>);<br>        <span>properties</span>.<span>put</span>(<span>JsonDeserializer</span>.<span>VALUE_DEFAULT_TYPE</span>, <span>OrderSendEvent</span>.<span>class</span>);<br>        <span>KafkaConsumer</span><span>&lt;</span><span>String</span>, <span>OrderSendEvent</span><span>&gt;</span> <span>consumer</span> <span>=</span> <span>new</span> <span>KafkaConsumer</span><span>&lt;&gt;</span>(<span>properties</span>);<br>        <span>consumer</span>.<span>subscribe</span>(<span>Arrays</span>.<span>asList</span>(<span>TOPIC_NAME_SEND_CLIENT</span>));<br>        <span>ConsumerRecords</span><span>&lt;</span><span>String</span>, <span>OrderSendEvent</span><span>&gt;</span> <span>records</span> <span>=</span> <span>consumer</span>.<span>poll</span>(<span>Duration</span>.<span>ofMillis</span>(<span>10000L</span>));<br>        <span>consumer</span>.<span>close</span>();<br><br>        <span>//then</span><br>        <span>assertEquals</span>(<span>1</span>, <span>records</span>.<span>count</span>());<br>        <span>assertEquals</span>(<span>order</span>.<span>getProductName</span>(), <span>records</span>.<span>iterator</span>().<span>next</span>().<span>value</span>().<span>getProductName</span>());<br>        <span>assertEquals</span>(<span>order</span>.<span>getBarCode</span>(), <span>records</span>.<span>iterator</span>().<span>next</span>().<span>value</span>().<span>getBarCode</span>());<br>        <span>assertEquals</span>(<span>order</span>.<span>getQuantity</span>(), <span>records</span>.<span>iterator</span>().<span>next</span>().<span>value</span>().<span>getQuantity</span>());<br>        <span>assertEquals</span>(<span>order</span>.<span>getPrice</span>(), <span>records</span>.<span>iterator</span>().<span>next</span>().<span>value</span>().<span>getPrice</span>());<br>    }<br>}
```

Суть данного теста проста, мы внедряем наш реальный сервис по отправке сообщений KafkaMessagingService и вызываем метод sendOrder(), куда передаем тестовое сообщение. После создаем консьюмера, подключаемся к нашему топику, читаем оттуда сообщение и проверяем совпадает ли оно с отправленным.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/ca1efa583cb4c841e34613de8fa9c712.png]]

Как видим тест прошел успешно.

Протестируем наш консьюмер, который сохраняет заказ в базу данных.

```
<span>@Testcontainers</span><br><span>@SpringBootTest</span><br><span>class</span> <span>KafkaMessagingServiceIT</span> {<br>    <span>public</span> <span>static</span> <span>final</span> <span>Long</span> <span>ORDER_ID</span> <span>=</span> <span>1L</span>;<br>    <span>public</span> <span>static</span> <span>final</span> <span>String</span> <span>TOPIC_NAME_SEND_ORDER</span><span>=</span> <span>"send-order-event"</span>;<br><br>    <span>@Container</span><br>    <span>static</span> <span>PostgreSQLContainer</span><span>&lt;?&gt;</span> <span>postgreSQLContainer</span> <span>=</span> <span>new</span> <span>PostgreSQLContainer</span><span>&lt;&gt;</span>(<span>"postgres:12"</span>)<br>            .<span>withUsername</span>(<span>"username"</span>)<br>            .<span>withPassword</span>(<span>"password"</span>)<br>            .<span>withExposedPorts</span>(<span>5432</span>)<br>            .<span>withReuse</span>(<span>true</span>);<br>    <span>@Container</span><br>    <span>static</span> <span>final</span> <span>KafkaContainer</span> <span>kafkaContainer</span> <span>=</span><br>                <span>new</span> <span>KafkaContainer</span>(<span>DockerImageName</span>.<span>parse</span>(<span>"confluentinc/cp-kafka:6.2.4"</span>))<br>            .<span>withEmbeddedZookeeper</span>()<br>          .<span>withEnv</span>(<span>"KAFKA_LISTENERS"</span>, <span>"PLAINTEXT://0.0.0.0:9093 ,BROKER://0.0.0.0:9092"</span>)<br>          .<span>withEnv</span>(<span>"KAFKA_LISTENER_SECURITY_PROTOCOL_MAP"</span>, <span>"BROKER:PLAINTEXT,PLAINTEXT:PLAINTEXT"</span>)<br>          .<span>withEnv</span>(<span>"KAFKA_INTER_BROKER_LISTENER_NAME"</span>, <span>"BROKER"</span>)<br>          .<span>withEnv</span>(<span>"KAFKA_BROKER_ID"</span>, <span>"1"</span>)<br>          .<span>withEnv</span>(<span>"KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR"</span>, <span>"1"</span>)<br>          .<span>withEnv</span>(<span>"KAFKA_OFFSETS_TOPIC_NUM_PARTITIONS"</span>, <span>"1"</span>)<br>          .<span>withEnv</span>(<span>"KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR"</span>, <span>"1"</span>)<br>          .<span>withEnv</span>(<span>"KAFKA_TRANSACTION_STATE_LOG_MIN_ISR"</span>, <span>"1"</span>)<br>          .<span>withEnv</span>(<span>"KAFKA_LOG_FLUSH_INTERVAL_MESSAGES"</span>, <span>Long</span>.<span>MAX_VALUE</span> <span>+</span> <span>""</span>)<br>          .<span>withEnv</span>(<span>"KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS"</span>, <span>"0"</span>);<br><br><br>    <span>static</span> {<br>        <span>Startables</span>.<span>deepStart</span>(<span>Stream</span>.<span>of</span>(<span>postgreSQLContainer</span>, <span>kafkaContainer</span>)).<span>join</span>();<br>    }<br><br>    <span>@DynamicPropertySource</span><br>    <span>static</span> <span>void</span> <span>overrideProperties</span>(<span>DynamicPropertyRegistry</span> <span>registry</span>) {<br>        <span>registry</span>.<span>add</span>(<span>"spring.kafka.bootstrap-servers"</span>, <span>kafkaContainer</span>::<span>getBootstrapServers</span>);<br>        <span>registry</span>.<span>add</span>(<span>"spring.datasource.url"</span>, <span>postgreSQLContainer</span>::<span>getJdbcUrl</span>);<br>        <span>registry</span>.<span>add</span>(<span>"spring.datasource.username"</span>, <span>postgreSQLContainer</span>::<span>getUsername</span>);<br>        <span>registry</span>.<span>add</span>(<span>"spring.datasource.password"</span>, <span>postgreSQLContainer</span>::<span>getPassword</span>);<br>        <span>registry</span>.<span>add</span>(<span>"spring.datasource.driver-class-name"</span>, <span>postgreSQLContainer</span>::<span>getDriverClassName</span>);<br>    }<br><br>    <span>@Autowired</span><br>    <span>private</span> <span>OrdersRepository</span> <span>ordersRepository</span>;<br><br>    <span>@Test</span><br>    <span>void</span> <span>save_order</span>() <span>throws</span> <span>InterruptedException</span> {<br>        <span>//given</span><br>        <span>String</span> <span>bootstrapServers</span> <span>=</span> <span>kafkaContainer</span>.<span>getBootstrapServers</span>();<br>        <span>OrderEvent</span> <span>orderEvent</span> <span>=</span> <span>FakeOrder</span>.<span>getOrderEvent</span>();<br>        <span>Order</span> <span>order</span> <span>=</span> <span>FakeOrder</span>.<span>getOrder</span>();<br><br>        <span>Map</span><span>&lt;</span><span>String</span>, <span>Object</span><span>&gt;</span> <span>configProps</span> <span>=</span> <span>new</span> <span>HashMap</span><span>&lt;&gt;</span>();<br>        <span>configProps</span>.<span>put</span>(<span>ProducerConfig</span>.<span>BOOTSTRAP_SERVERS_CONFIG</span>, <span>bootstrapServers</span>);<br>        <span>configProps</span>.<span>put</span>(<span>ProducerConfig</span>.<span>KEY_SERIALIZER_CLASS_CONFIG</span>, <span>StringSerializer</span>.<span>class</span>);<br>        <span>configProps</span>.<span>put</span>(<span>ProducerConfig</span>.<span>VALUE_SERIALIZER_CLASS_CONFIG</span>, <span>JsonSerializer</span>.<span>class</span>);<br>        <span>ProducerFactory</span><span>&lt;</span><span>String</span>, <span>OrderEvent</span><span>&gt;</span> <span>producerFactory</span> <span>=</span> <span>new</span> <span>DefaultKafkaProducerFactory</span><span>&lt;&gt;</span>(<span>configProps</span>);<br>        <span>KafkaTemplate</span><span>&lt;</span><span>String</span>, <span>OrderEvent</span><span>&gt;</span> <span>kafkaTemplate</span> <span>=</span> <span>new</span> <span>KafkaTemplate</span><span>&lt;&gt;</span>(<span>producerFactory</span>);<br><br>        <span>//when</span><br><br>        <span>SECONDS</span>.<span>sleep</span>(<span>5</span>);<br>        <span>kafkaTemplate</span>.<span>send</span>(<span>TOPIC_NAME_SEND_ORDER</span>, <span>orderEvent</span>.<span>getBarCode</span>(), <span>orderEvent</span>);<br>        <span>SECONDS</span>.<span>sleep</span>(<span>5</span>);<br><br>        <span>//then</span><br>        <span>Order</span> <span>orderFromDB</span> <span>=</span> <span>ordersRepository</span>.<span>findById</span>(<span>ORDER_ID</span>).<span>get</span>();<br>        <span>assertEquals</span>(<span>orderFromDB</span>.<span>getId</span>(), <span>ORDER_ID</span>);<br>        <span>assertEquals</span>(<span>orderFromDB</span>.<span>getProductName</span>(), <span>order</span>.<span>getProductName</span>());<br>        <span>assertEquals</span>(<span>orderFromDB</span>.<span>getBarCode</span>(), <span>order</span>.<span>getBarCode</span>());<br>        <span>assertEquals</span>(<span>orderFromDB</span>.<span>getQuantity</span>(), <span>order</span>.<span>getQuantity</span>());<br>        <span>assertEquals</span>(<span>orderFromDB</span>.<span>getPrice</span>(), <span>order</span>.<span>getPrice</span>().<span>setScale</span>(<span>2</span>,  <span>RoundingMode</span>.<span>HALF_DOWN</span>));<br>        <span>assertEquals</span>(<span>orderFromDB</span>.<span>getAmount</span>(), <span>order</span>.<span>getAmount</span>().<span>setScale</span>(<span>2</span>));<br>        <span>assertEquals</span>(<span>orderFromDB</span>.<span>getOrderDate</span>().<span>getYear</span>(), <span>order</span>.<span>getOrderDate</span>().<span>getYear</span>());<br>        <span>assertEquals</span>(<span>orderFromDB</span>.<span>getStatus</span>(), <span>order</span>.<span>getStatus</span>());<br>    }<br>}
```

Так как это интеграционный тест, то мы будем использовать KafkaContainer и PostgreSQLContainer, и проверим, что наше сообщение прочиталось и сохранилось в базу данных.

То есть вначале настраиваем контейнеры с kafka и postgreSQL.

Далее внедряем OrdersRepository, чтобы потом получить оттуда данные.

И сам тест тоже довольно прост. Вначале мы создаем продюсера и отправляем в наш топик сообщение с заказом. Далее с помощью ordersRepository обращаемся к базе данных, оттуда получаем наш сохраненный заказ, который должен был сам сохраниться и проверяем правильный ли он.

Данный тест будет выполняться довольно долго, так как надо еще поднять контейнеры с kafka и postgreSQL.

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/91672df8fbfd704850f06ce9d614756e.png]]

![[Apache Kafka. Пишем простой producer и consumer и тестируем их  Хабр/38ebffb014ecf83271eb6ee09d52d403.png]]

Как видим наш тест прошел успешно.

На этом все.

Спасибо. Всем кто дочитал до конца.

Всем пока.
