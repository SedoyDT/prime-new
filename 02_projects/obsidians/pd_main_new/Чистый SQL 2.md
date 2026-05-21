```sql
UPDATE call_registry_missed AS m  
    JOIN (  
        SELECT  
            m.id            AS missed_id,  
            CASE  
                WHEN cr.direction = 2 AND DATE(cr.date) = DATE(m.called_at)  
                    THEN 4  -- SAME_DAY  
                WHEN cr.direction = 2 AND DATE(cr.date) > DATE(m.called_at)  
                    THEN 3  -- DELAYED  
                WHEN cr.direction = 1  
                    THEN 2  -- CLIENT  
                ELSE 1  
            END AS new_status  
        FROM call_registry_missed m  
                 INNER JOIN call_registry_phones crp ON  
            crp.phone = m.client_phone_formatted  
                 INNER JOIN call_registry cr ON  
            crp.registry_id = cr.id AND  
            cr.direction IN (2) AND  
            cr.record_status IN (1,2)  
        WHERE cr.date >= m.called_at  
          AND DATEDIFF(cr.date, m.called_at)  
                  - (  
                  SELECT COUNT(id)  
                  FROM calendar_date_options cdo  
                  WHERE cdo.sql_date BETWEEN m.called_at AND cr.date  
              ) <= 5  
          AND NOT EXISTS (  
            SELECT 1  
            FROM call_registry cr2  
                     INNER JOIN call_registry_phones crp2 ON  
                crp2.registry_id = cr2.id  
            WHERE crp2.phone = m.client_phone_formatted  
              AND cr2.direction IN (2)  
              AND cr2.record_status IN (1,2)  
              AND cr2.date >= m.called_at  
              AND DATEDIFF(cr2.date, m.called_at)  
                      - (  
                      SELECT COUNT(id)  
                      FROM calendar_date_options cdo  
                      WHERE cdo.sql_date BETWEEN m.called_at AND cr2.date  
                  ) <= 5  
              AND cr2.date < cr.date  
        )  
    ) AS t ON m.id = t.missed_id  
SET m.callback_status_id = t.new_status  
WHERE t.missed_id > 0 OR m.callback_status_id IS NULL
```