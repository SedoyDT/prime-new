```sql
UPDATE call_registry_missed AS m  
JOIN (  
    SELECT  
        m.id AS missed_id,  
        m.called_at AS called_at,  
        m.client_phone_formatted AS missed_client_phone,  
        m.user_phone_formatted AS missed_user_phone,  
        crp.phone AS call_regestry_client_phone,  
        cr.manager_phone AS call_regestry_manager_phone,  
        cr.date AS call_registry_date,  
        ROW_NUMBER() over (PARTITION BY m.id ORDER BY cr.date) AS RowNum,  
        CASE  
            WHEN cr.direction = 2 AND DATE(cr.date) = DATE(m.called_at)  
                THEN 4 -- SAME_DAY  
            WHEN cr.direction = 2 AND DATE(cr.date) > DATE(m.called_at)  
                THEN 3 -- DELAYED  
            WHEN cr.direction = 1  
                THEN 2 -- CLIENT  
            ELSE 1  
        END AS new_status  
    FROM call_registry_missed AS m  
    INNER JOIN call_registry_phones AS crp ON  
        m.client_phone_formatted = crp.phone  
    INNER JOIN call_registry AS cr ON  
        crp.registry_id = cr.id AND  
        cr.direction IN (1,2) AND  
        cr.record_status IN (1,2)  
    WHERE cr.date >= m.called_at AND  
        DATEDIFF(cr.date, m.called_at) - (  
            SELECT  
                count(*)  
            FROM  
                calendar_date_options AS cdo  
            WHERE  
                cdo.sql_date  
            BETWEEN m.called_at AND cr.date  
        ) <= 5  
) AS tabl ON  
    tabl.missed_id = m.id  
SET m.callback_status_id = tabl.new_status  
WHERE RowNum = 1
```