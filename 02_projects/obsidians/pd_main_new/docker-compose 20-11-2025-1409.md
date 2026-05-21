```
networks:  
  amd_net:  
    ipam:  
      config:  
        - subnet: 192.168.52.0/24  
services:  
  amd-php-fpm:  
    image: amd-php-fpm-8.4:0.0.0  
    build:  
      dockerfile: Dockerfile  
      context: ./images/php-fpm  
    volumes:  
      - /etc/passwd:/etc/passwd:ro  
      - /etc/group:/etc/group:ro  
      - ./data/www/:/html  
      - ./configs/php/php.ini:/usr/local/etc/php/php.ini  
      - ./configs/php/php-fpm.conf:/usr/local/etc/php-fpm.conf  
      - ./configs/ssl/openssl.cnf:/etc/ssl/openssl.cnf  
      - ./configs/image-magick/policy.xml:/etc/ImageMagick-6/policy.xml  
      - "$HOME/.cache/composer:/home/.composer/cache"  
    dns:  
      - 192.168.52.5  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.10  
    logging:  
      driver: "json-file"  
      options:  
        tag: "{{.ImageName}}|{{.Name}}"  
  
  # nginx  
  amd-nginx:  
    image: nginx:latest  
    depends_on:  
      - amd-php-fpm  
    volumes:  
      - ./configs/nginx/templates:/etc/nginx/templates  
      - ./configs/php/setdocroot.php:/html/setdocroot.php  
      - ./data/www/:/html  
      # ssl  
      #- ./configs/nginx/ssl/templates:/etc/nginx/templates      #- ./custom/configs/nginx/ssl/nginx-selfsigned.crt:/etc/ssl/certs/nginx-selfsigned.crt      #- ./custom/configs/nginx/ssl/nginx-selfsigned.key:/etc/ssl/private/nginx-selfsigned.key    environment:  
      - STAGE=${STAGE}  
      - IS_DEVELOPMENT=${IS_DEVELOPMENT}  
    dns:  
      - 192.168.52.5  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.2  
    # на случай если придется запускать несколько групп контейнеров  
    #ports:    #  - "8888:80"    #  - "8443:443"    logging:  
      driver: "json-file"  
      options:  
        tag: "{{.ImageName}}|{{.Name}}"  
  
  # mysql  
  amd-mysql:  
    image: mysql:8.4  
    environment:  
      - MYSQL_ROOT_PASSWORD=root  
    volumes:  
      # Mounting the content of the database inside of a subfolder named mariadb_data  
      - ./data/db:/var/lib/mysql  
      - ./configs/mysql/my.cnf:/etc/mysql/conf.d/mysql.cnf  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.3  
  
  amd-memcached:  
    image: library/memcached:1.5.6  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.4  
  
  # обработка зон .a.dev, .c.dev  
  amd-dev-dns:  
    build:  
      dockerfile: Dockerfile  
      context: ./images/dns  
    restart: unless-stopped  
    volumes:  
    - ./configs/dns:/etc/dnsmasq  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.5  
  
  amd-mobile-proxy:  
    image: nginx:1.21.1-alpine  
    # ENV COMPOSE_PROFILES=mobile  
    profiles:  
      - mobile  
    dns:  
      - 192.168.52.5  
    ports:  
      - "80:80"  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.6  
    volumes:  
      - ./configs/mobile-proxy:/etc/nginx/conf.d  
  
  # генерация из html в pdf  
  amd-pdfgenerator:  
    image: amd-pdfgenerator:0.0.0  
    build:  
      dockerfile: Dockerfile  
      context: ./images/pdfgenerator  
    profiles:  
      - pdfgenerator  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.7  
    dns:  
      - 192.168.52.5  
    volumes:  
      - ./configs/pdfgenerator/config.php:/var/www/pdfgenerator/config/config.php  
  
  amd-rabbitmq:  
    image: rabbitmq:3.9.13-management-alpine  
    profiles:  
      - rabbitmq  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.8  
    # http://192.168.52.8:15672  
    # guest:guest  
  amd-telegram:  
    image: amd-telegram:0.0.0  
    build:  
      dockerfile: Dockerfile  
      context: ./images/telegram  
    profiles:  
      - telegram  
#    env_file:  
#      - custom/env/telegram.env  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.9  
    dns:  
      - 192.168.52.5  
#    entrypoint: ["/srv/telegram-bot-api", "--local"]  
  
  amd-pdf-exporter:  
    image: git.ns56.org:5050/amd/amd-pdf-exporter:docker  
    depends_on:  
      - amd-rabbitmq  
    profiles:  
      - pdf-exporter  
    env_file:  
      - custom/env/pdf-exporter.env  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.12  
    dns:  
      - 192.168.52.5  
  
  # логи и мониторинг  
  # сборщик логов  amdmon-promtail:  
    image: grafana/promtail:2.0.0  
    profiles:  
      - monitoring  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.100  
    volumes:  
      - /var/log:/var/log  
      - /var/lib/docker/containers:/var/lib/docker/containers  
      - ./custom/logs:/var/custom  
      - ./configs/monitoring/promtail.yml:/etc/promtail/config.yml  
    command: -config.file=/etc/promtail/config.yml  
    logging:  
      driver: "json-file"  
      options:  
        tag: "{{.ImageName}}|{{.Name}}"  
  
  amdmon-prometheus:  
    image: prom/prometheus:v2.30.3  
    profiles:  
      - monitoring  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.101  
    volumes:  
      - ./configs/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml  
      - ./data/prometheus:/prometheus  
  
  amdmon-grafana:  
    image: grafana/grafana:8.2.2  
    profiles:  
      - monitoring  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.102  
#    ports:  
#      - 3000:3000  
    volumes:  
      - ./data/grafana:/var/lib/grafana  
    environment:  
      - GF_SECURITY_ADMIN_PASSWORD=password  
      - GF_USERS_ALLOW_SIGN_UP=false  
      - GF_SERVER_DOMAIN=192.168.52.102  
      - GF_SERVER_ROOT_URL=http://192.168.52.102:3000  
      - GF_SMTP_ENABLED=true  
      - GF_SMTP_HOST=smtp.gmail.com:587  
      - GF_SMTP_USER=myadrress@gmail.com  
      - GF_SMTP_PASSWORD=MYPASSWORD  
      - GF_SMTP_FROM_ADDRESS=myaddress@gmail.com  
#      - GF_RENDERING_SERVER_URL=http://stmon-grafana-renderer:8081/render  
#      - GF_RENDERING_CALLBACK_URL=http://stmon-grafana:3000/  
#      - GF_LOG_FILTERS=rendering:debug  
  
  amdmon-loki:  
    image: grafana/loki:2.2.0  
    command: -config.file=/etc/loki/local-config.yaml  
    profiles:  
      - monitoring  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.103  
    volumes:  
      #      - ./configs/loki.yml:/etc/loki/local-config.yaml  
      - ./data/loki:/loki  
  
  # сборщик статистики mysql  
  amdmon-mysql:  
    image: prom/mysqld-exporter:v0.12.1  
    profiles:  
      - monitoring  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.104  
    environment:  
      DATA_SOURCE_NAME: root:root@(amd-mysql:3306)/  
    command:  
      - --collect.info_schema.processlist  
    logging:  
      driver: "json-file"  
      options:  
        tag: "{{.ImageName}}|{{.Name}}"  
  
  # сборщик статистики апач  
  amdmon-apache:  
    image: apache_exporter  
    profiles:  
      - monitoring  
    networks:  
      amd_net:  
        ipv4_address: 192.168.52.106  
    command:  
      - --scrape_uri=http://amd-apache/server-status?auto
```