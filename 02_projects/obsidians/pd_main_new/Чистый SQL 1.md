
```sql
UPDATE call_registry_missed m  
    JOIN (  
        SELECT  
            m.id AS missed_id,  
            CASE  
                WHEN cb.direction = 2 AND DATE(cb.date) = DATE(m.called_at)  
                    THEN 1  -- SAME_DAY  
                WHEN cb.direction = 2 AND DATE(cb.date) > DATE(m.called_at)  
                    THEN 2  -- DELAYED  
                WHEN cb.direction = 1  
                    THEN 3  -- CLIENT  
                ELSE NULL  
                END AS new_status  
        FROM call_registry_missed m  
                 LEFT JOIN (  
            SELECT  
                inner_cr.id,  
                inner_cr.date,  
                inner_cr.direction,  
                inner_crp.phone  
            FROM call_registry inner_cr  
                     JOIN call_registry_phones inner_crp ON  
                inner_cr.id = inner_crp.registry_id  
            WHERE  
                inner_cr.direction IN (1,2) AND  
                inner_cr.record_status IN (1,2)  
        ) cb ON  
            cb.phone = m.client_phone_formatted AND  
            cb.date >= m.called_at AND  
            DATEDIFF(cb.date, m.called_at) - (  
                SELECT COUNT(id)  
                FROM calendar_date_options cdo  
                WHERE cdo.sql_date BETWEEN m.called_at AND cb.date  
            ) <= 5  
    ) t ON t.missed_id = m.id  
SET m.callback_status_id = t.new_status  
WHERE t.new_status IS NOT NULL
```

