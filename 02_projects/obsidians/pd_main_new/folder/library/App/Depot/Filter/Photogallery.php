<?php

/**
 * Модель для работы с фильтром и гридом модуля "Фотогаллерея"
 */
class App_Depot_Filter_Photogallery extends App_Filter_Abstract
{

    protected static $sqlResult = "
        SELECT 
            ds.*
        FROM
            (SELECT 
                d.id,
                CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/t_',ddp.filename) filename,
                c.id claim_id,
                SUM(dd.amount) AS totalAmount,
                SUM(dd.block) AS block,
                {CONFIGQUERY},
                IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5,
                CONCAT(bp.value,IF(bp2.cur_price IS NOT NULL, CONCAT(' / ', bp2.cur_price), '')) baseprice,
                {ACCESS} accessBaseprice
            FROM
                (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                INNER JOIN depot_2 d ON d.id = ddp.item_id 
                INNER JOIN claims c ON 
                    c.id = ddp.claim_id 
                AND c.claim_status = 0 
                AND c.claimType NOT IN (14,15)
                INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                LEFT JOIN (SELECT * FROM base_prices_claim_products bbp) bp 
                    ON (
                        bp.claim_id = c.id 
                        AND bp.product_id = d.id 
                        AND bp.confirmed = '1'
                        AND bp.bp_type = '1'
                    ) 
                LEFT JOIN base_prices bp2
                    ON (
                        bp2.item_id = d.id
                        AND bp2.cur_date <= NOW()
                        AND (
                            bp2.date_to >= NOW() 
                         OR bp2.date_to IS NULL
                        )
                        AND bp2.type = 2
                        AND bp2.bp_type = 1
                    )
            {FIELDASCCESWHERE}
            GROUP BY claim_id, id
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/t_',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5,
                    CONCAT(bp.value,IF(bp2.cur_price IS NOT NULL, CONCAT(' / ', bp2.cur_price), '')) baseprice,
                    {ACCESS} accessBaseprice
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_product cirp ON ddp.item_id = cirp.product_id AND cirp.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                    LEFT JOIN (SELECT * FROM base_prices_claim_products bbp) bp 
                        ON (
                            bp.claim_id = c.id 
                            AND bp.product_id = d.id 
                            AND bp.confirmed = '1'
                            AND bp.bp_type = '1'
                        ) 
                    LEFT JOIN base_prices bp2
                        ON (
                            bp2.item_id = d.id
                            AND bp2.cur_date <= NOW()
                            AND (
                                bp2.date_to >= NOW() 
                             OR bp2.date_to IS NULL
                            )
                            AND bp2.type = 2
                            AND bp2.bp_type = 1
                        )
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/t_',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5,
                    CONCAT(bp.value,IF(bp2.cur_price IS NOT NULL, CONCAT(' / ', bp2.cur_price), '')) baseprice,
                    {ACCESS} accessBaseprice
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_waste cirw ON ddp.item_id = cirw.product_id AND cirw.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                    LEFT JOIN (SELECT * FROM base_prices_claim_products bbp) bp 
                        ON (
                            bp.claim_id = c.id 
                            AND bp.product_id = d.id 
                            AND bp.confirmed = '1'
                            AND bp.bp_type = '1'
                        ) 
                    LEFT JOIN base_prices bp2
                        ON (
                            bp2.item_id = d.id
                            AND bp2.cur_date <= NOW()
                            AND (
                                bp2.date_to >= NOW() 
                             OR bp2.date_to IS NULL
                            )
                            AND bp2.type = 2
                            AND bp2.bp_type = 1
                        )
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/t_',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5,
                    CONCAT(bp.value,IF(bp2.cur_price IS NOT NULL, CONCAT(' / ', bp2.cur_price), '')) baseprice,
                    {ACCESS} accessBaseprice
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_base_product cirbp ON ddp.item_id = cirbp.product_id AND cirbp.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                    LEFT JOIN (SELECT * FROM base_prices_claim_products bbp) bp 
                        ON (
                            bp.claim_id = c.id 
                            AND bp.product_id = d.id 
                            AND bp.confirmed = '1'
                            AND bp.bp_type = '1'
                        ) 
                    LEFT JOIN base_prices bp2
                        ON (
                            bp2.item_id = d.id
                            AND bp2.cur_date <= NOW()
                            AND (
                                bp2.date_to >= NOW() 
                             OR bp2.date_to IS NULL
                            )
                            AND bp2.type = 2
                            AND bp2.bp_type = 1
                        )
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
	) ds 
        LEFT JOIN `base_prices` AS bp 
            ON (
                bp.item_id = ds.id 
                AND cur_date = 
                    (SELECT 
                        MAX(cur_date) 
                    FROM
                        `base_prices` 
                    WHERE `base_prices`.item_id = ds.id 
                    AND `base_prices`.type = '1' AND `base_prices`.bp_type = '1') 
                AND bp.type = '1'
                AND bp.bp_type = 1
            ) 
        LEFT JOIN `base_prices_plans` AS bpp 
            ON (
                bpp.item_id = ds.id 
                AND bpp.bp_type = 1
                    AND (
                        bpp.dateto > NOW() 
                        OR (
                            bpp.dateto = '0000-00-00 00:00:00' 
                            AND bpp.is_plan_set = '0'
                        )
                    ) 
                    AND bpp.datefrom < NOW() 
                    AND cur_datetime = 
                        (SELECT 
                            MAX(cur_datetime) 
                        FROM
                            `base_prices_plans` 
                        WHERE `base_prices_plans`.item_id = ds.id 
                            AND `base_prices_plans`.bp_type = 1
                            AND (
                                `base_prices_plans`.dateto > NOW() 
                                OR (
                                    `base_prices_plans`.dateto = '0000-00-00 00:00:00' 
                                    AND `base_prices_plans`.is_plan_set = '0'
                                )
                            )
                        )
            )
        {WHERE}
    ";

    protected static $sqlResultids = "
        SELECT 
            ds.id
        FROM
            (SELECT 
                d.id,
                CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                c.id claim_id,
                SUM(dd.amount) AS totalAmount,
                SUM(dd.block) AS block,
                {CONFIGQUERY},
                IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
            FROM
                (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                INNER JOIN depot_2 d ON d.id = ddp.item_id 
                INNER JOIN claims c ON 
                    c.id = ddp.claim_id 
                AND c.claim_status = 0 
                AND c.claimType NOT IN (14,15)
                INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
            {FIELDASCCESWHERE}
            GROUP BY claim_id, id
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_product cirp ON ddp.item_id = cirp.product_id AND cirp.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_waste cirw ON ddp.item_id = cirw.product_id AND cirw.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_base_product cirbp ON ddp.item_id = cirbp.product_id AND cirbp.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
        ) ds 
        LEFT JOIN `base_prices` AS bp 
            ON (
                bp.item_id = ds.id 
                AND cur_date = 
                    (SELECT 
                        MAX(cur_date) 
                    FROM
                        `base_prices` 
                    WHERE `base_prices`.item_id = ds.id 
                      AND `base_prices`.type = '1' AND `base_prices`.bp_type = '1') 
                AND bp.type = '1'
                AND bp.bp_type = 1
            ) 
        LEFT JOIN `base_prices_plans` AS bpp 
            ON (
                bpp.item_id = ds.id 
                AND bpp.bp_type = 1
                    AND (
                        bpp.dateto > NOW() 
                        OR (
                            bpp.dateto = '0000-00-00 00:00:00' 
                            AND bpp.is_plan_set = '0'
                        )
                    ) 
                    AND bpp.datefrom < NOW() 
                    AND cur_datetime = 
                        (SELECT 
                            MAX(cur_datetime) 
                        FROM
                            `base_prices_plans` 
                        WHERE `base_prices_plans`.item_id = ds.id 
                            AND `base_prices_plans`.bp_type = 1
                            AND (
                                `base_prices_plans`.dateto > NOW() 
                                OR (
                                    `base_prices_plans`.dateto = '0000-00-00 00:00:00' 
                                    AND `base_prices_plans`.is_plan_set = '0'
                                )
                            )
                        )
            )
        {WHERE}
    ";

    protected static $sqlResultclaimids = "
        SELECT 
            ds.claim_id
        FROM
            (SELECT 
                d.id,
                CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                c.id claim_id,
                SUM(dd.amount) AS totalAmount,
                SUM(dd.block) AS block,
                {CONFIGQUERY},
                IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
            FROM
                (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                INNER JOIN depot_2 d ON d.id = ddp.item_id 
                INNER JOIN claims c ON 
                    c.id = ddp.claim_id 
                AND c.claim_status = 0 
                AND c.claimType NOT IN (14,15)
                INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
            {FIELDASCCESWHERE}
            GROUP BY claim_id, id
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_product cirp ON ddp.item_id = cirp.product_id AND cirp.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_waste cirw ON ddp.item_id = cirw.product_id AND cirw.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_base_product cirbp ON ddp.item_id = cirbp.product_id AND cirbp.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
        ) ds 
        LEFT JOIN `base_prices` AS bp 
            ON (
                bp.item_id = ds.id 
                AND cur_date = 
                    (SELECT 
                        MAX(cur_date) 
                    FROM
                        `base_prices` 
                    WHERE `base_prices`.item_id = ds.id 
                      AND `base_prices`.type = '1' AND `base_prices`.bp_type = '1') 
                      AND bp.type = '1'
                      AND bp.bp_type = 1
            ) 
        LEFT JOIN `base_prices_plans` AS bpp 
            ON (
                bpp.item_id = ds.id 
                    AND (
                        bpp.dateto > NOW() 
                        OR (
                            bpp.dateto = '0000-00-00 00:00:00' 
                            AND bpp.is_plan_set = '0'
                        )
                    ) 
                    AND bpp.bp_type = 1
                    AND bpp.datefrom < NOW() 
                    AND cur_datetime = 
                        (SELECT 
                            MAX(cur_datetime) 
                        FROM
                            `base_prices_plans` 
                        WHERE `base_prices_plans`.item_id = ds.id 
                            AND `base_prices_plans`.bp_type = 1
                            AND (
                                `base_prices_plans`.dateto > NOW() 
                                OR (
                                    `base_prices_plans`.dateto = '0000-00-00 00:00:00' 
                                    AND `base_prices_plans`.is_plan_set = '0'
                                )
                            )
                        )
            )
        {WHERE}
    ";

    protected static $sqlMask = "
        SELECT
            distinct {select_field} AS v
        FROM
            (SELECT 
                d.id,
                CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                c.id claim_id,
                SUM(dd.amount) AS totalAmount,
                SUM(dd.block) AS block,
                {CONFIGQUERY},
                IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
            FROM
                (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                INNER JOIN depot_2 d ON d.id = ddp.item_id 
                INNER JOIN claims c ON 
                    c.id = ddp.claim_id 
                AND c.claim_status = 0 
                AND c.claimType NOT IN (14,15)
                INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
            {FIELDASCCESWHERE}
            GROUP BY claim_id, id
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_product cirp ON ddp.item_id = cirp.product_id AND cirp.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_waste cirw ON ddp.item_id = cirw.product_id AND cirw.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_base_product cirbp ON ddp.item_id = cirbp.product_id AND cirbp.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
        ) ds 
        LEFT JOIN `base_prices` AS bp 
            ON (
                bp.item_id = ds.id 
                AND cur_date = 
                    (SELECT 
                        MAX(cur_date) 
                    FROM
                        `base_prices` 
                    WHERE `base_prices`.item_id = ds.id 
                      AND `base_prices`.type = '1' AND `base_prices`.bp_type = '1') 
                      AND bp.type = '1'
                      AND bp.bp_type = '1'
            ) 
        LEFT JOIN `base_prices_plans` AS bpp 
            ON (
                bpp.item_id = ds.id 
                    AND (
                        bpp.dateto > NOW() 
                        OR (
                            bpp.dateto = '0000-00-00 00:00:00' 
                            AND bpp.is_plan_set = '0'
                        )
                    ) 
                    AND bpp.bp_type = 1
                    AND bpp.datefrom < NOW() 
                    AND cur_datetime = 
                        (SELECT 
                            MAX(cur_datetime) 
                        FROM
                            `base_prices_plans` 
                        WHERE `base_prices_plans`.item_id = ds.id 
                            AND `base_prices_plans`.bp_type = 1
                            AND (
                                `base_prices_plans`.dateto > NOW() 
                                OR (
                                    `base_prices_plans`.dateto = '0000-00-00 00:00:00' 
                                    AND `base_prices_plans`.is_plan_set = '0'
                                )
                            )
                        )
            )
        {WHERE}
    ";

    protected static $sqlResultCount = "
        SELECT
            count(*) AS c
        FROM (SELECT 
                d.id,
                CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                c.id claim_id,
                SUM(dd.amount) AS totalAmount,
                SUM(dd.block) AS block,
                {CONFIGQUERY},
                IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
            FROM
                (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                INNER JOIN depot_2 d ON d.id = ddp.item_id 
                INNER JOIN claims c ON 
                    c.id = ddp.claim_id 
                AND c.claim_status = 0 
                AND c.claimType NOT IN (14,15)
                INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
            {FIELDASCCESWHERE}
            GROUP BY claim_id, id
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_product cirp ON ddp.item_id = cirp.product_id AND cirp.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_waste cirw ON ddp.item_id = cirw.product_id AND cirw.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_base_product cirbp ON ddp.item_id = cirbp.product_id AND cirbp.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
        ) ds 
        LEFT JOIN `base_prices` AS bp 
            ON (
                bp.item_id = ds.id 
                AND cur_date = 
                    (SELECT 
                        MAX(cur_date) 
                    FROM
                        `base_prices` 
                    WHERE `base_prices`.item_id = ds.id 
                      AND `base_prices`.type = '1' AND `base_prices`.bp_type = '1') 
                      AND bp.type = '1'
                      AND bp.bp_type = '1'
            ) 
        LEFT JOIN `base_prices_plans` AS bpp 
            ON (
                bpp.item_id = ds.id 
                    AND (
                        bpp.dateto > NOW() 
                        OR (
                            bpp.dateto = '0000-00-00 00:00:00' 
                            AND bpp.is_plan_set = '0'
                        )
                    ) 
                    AND bpp.bp_type = 1
                    AND bpp.datefrom < NOW() 
                    AND cur_datetime = 
                        (SELECT 
                            MAX(cur_datetime) 
                        FROM
                            `base_prices_plans` 
                        WHERE `base_prices_plans`.item_id = ds.id 
                            AND `base_prices_plans`.bp_type = 1
                            AND (
                                `base_prices_plans`.dateto > NOW() 
                                OR (
                                    `base_prices_plans`.dateto = '0000-00-00 00:00:00' 
                                    AND `base_prices_plans`.is_plan_set = '0'
                                )
                            )
                        )
            )
        {WHERE}
    ";

    /**
     * Общий вес(тоннаж) по выбранным товарам
     * @var string
     */
    protected static $sqlTotalWeight = "
        SELECT
            sum(ifnull(totalAmount, 0)) as totalWeightFilter
        FROM
            (SELECT 
                d.id,
                CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                c.id claim_id,
                SUM(dd.amount) AS totalAmount,
                SUM(dd.block) AS block,
                {CONFIGQUERY},
                IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
            FROM
                (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                INNER JOIN depot_2 d ON d.id = ddp.item_id 
                INNER JOIN claims c ON 
                    c.id = ddp.claim_id 
                AND c.claim_status = 0 
                AND c.claimType NOT IN (14,15)
                INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
            {FIELDASCCESWHERE}
            GROUP BY claim_id, id
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_product cirp ON ddp.item_id = cirp.product_id AND cirp.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_waste cirw ON ddp.item_id = cirw.product_id AND cirw.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_base_product cirbp ON ddp.item_id = cirbp.product_id AND cirbp.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
        ) ds 
        LEFT JOIN `base_prices` AS bp 
            ON (
                bp.item_id = ds.id 
                AND cur_date = 
                    (SELECT 
                        MAX(cur_date) 
                    FROM
                        `base_prices` 
                    WHERE `base_prices`.item_id = ds.id 
                      AND `base_prices`.type = '1' AND `base_prices`.bp_type = '1') 
                      AND bp.type = '1'
                      AND bp.bp_type = '1'
            ) 
        LEFT JOIN `base_prices_plans` AS bpp 
            ON (
                bpp.item_id = ds.id 
                    AND (
                        bpp.dateto > NOW() 
                        OR (
                            bpp.dateto = '0000-00-00 00:00:00' 
                            AND bpp.is_plan_set = '0'
                        )
                    ) 
                    AND bpp.bp_type = 1
                    AND bpp.datefrom < NOW() 
                    AND cur_datetime = 
                        (SELECT 
                            MAX(cur_datetime) 
                        FROM
                            `base_prices_plans` 
                        WHERE `base_prices_plans`.item_id = ds.id 
                            AND `base_prices_plans`.bp_type = 1
                            AND (
                                `base_prices_plans`.dateto > NOW() 
                                OR (
                                    `base_prices_plans`.dateto = '0000-00-00 00:00:00' 
                                    AND `base_prices_plans`.is_plan_set = '0'
                                )
                            )
                        )
            )
        {WHERE}
    ";

    /*
     * Вес заблокировано по товарам
     * @var String
     */
    protected static $sqlTotalWeightBlock = "
        SELECT
            sum(ifnull(block, 0)) as totalWeightBlockFilter
        FROM
            (SELECT 
                d.id,
                CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                c.id claim_id,
                SUM(dd.amount) AS totalAmount,
                SUM(dd.block) AS block,
                {CONFIGQUERY},
                IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
            FROM
                (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                INNER JOIN depot_2 d ON d.id = ddp.item_id 
                INNER JOIN claims c ON 
                    c.id = ddp.claim_id 
                AND c.claim_status = 0 
                AND c.claimType NOT IN (14,15)
                INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
            {FIELDASCCESWHERE}
            GROUP BY claim_id, id
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_product cirp ON ddp.item_id = cirp.product_id AND cirp.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_waste cirw ON ddp.item_id = cirw.product_id AND cirw.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
            UNION ALL (
                SELECT 
                    d.id,
                    CONCAT('/uploads/claim/detailed/',ddp.claim_id,'/',ddp.item_id,'/',ddp.filename) filename,
                    c.id claim_id,
                    SUM(dd.amount) AS totalAmount,
                    SUM(dd.block) AS block,
                    {CONFIGQUERY},
                    IFNULL(md5((SELECT d2f.text FROM depot_2_fields AS d2f WHERE d2f.fieldId=13 AND d2f.id = d.field13)), '0') AS description_md5
                FROM
                    (SELECT * FROM depot_detailed_photo GROUP BY claim_id, item_id) ddp
                    INNER JOIN depot_2 d ON d.id = ddp.item_id 
                    INNER JOIN claims c ON c.id = ddp.claim_id AND c.claimType = 14
                    INNER JOIN claim_in_raw_base_product cirbp ON ddp.item_id = cirbp.product_id AND cirbp.detailed_id > 0
                    INNER JOIN depot_detailed dd ON dd.claim_id = c.id AND ddp.item_id = dd.item_id
                {FIELDASCCESWHERE}
                GROUP BY claim_id, id
            )
        ) ds 
        LEFT JOIN `base_prices` AS bp 
            ON (
                bp.item_id = ds.id 
                AND cur_date = 
                    (SELECT 
                        MAX(cur_date) 
                    FROM
                        `base_prices` 
                    WHERE `base_prices`.item_id = ds.id 
                      AND `base_prices`.type = '1' AND `base_prices`.bp_type = '1') 
                      AND bp.type = '1'
                      AND bp.bp_type = '1'
            ) 
        LEFT JOIN `base_prices_plans` AS bpp 
            ON (
                bpp.item_id = ds.id 
                    AND (
                        bpp.dateto > NOW() 
                        OR (
                            bpp.dateto = '0000-00-00 00:00:00' 
                            AND bpp.is_plan_set = '0'
                        )
                    ) 
                    AND bpp.bp_type = 1
                    AND bpp.datefrom < NOW() 
                    AND cur_datetime = 
                        (SELECT 
                            MAX(cur_datetime) 
                        FROM
                            `base_prices_plans` 
                        WHERE `base_prices_plans`.item_id = ds.id 
                            AND `base_prices_plans`.bp_type = 1
                            AND (
                                `base_prices_plans`.dateto > NOW() 
                                OR (
                                    `base_prices_plans`.dateto = '0000-00-00 00:00:00' 
                                    AND `base_prices_plans`.is_plan_set = '0'
                                )
                            )
                        )
            )
        {WHERE}
    ";


    public static function getResult()
    {
        @$data = (object)unserialize(stripslashes($_POST['data']));
        @$page = (integer)$_POST['page'];
        @$perpage = (integer)$_POST['perpage'];
        $from = $page*@$perpage;
        @$sortColumn = $_POST['column'];
        @$sortType = $_POST['sort'];
        @$searchId = (integer)$_POST['searchId'];
        @$searchAmountOperator = (string)$_POST['searchAmountOperator'];
        @$searchAmount = (integer)$_POST['searchAmount'];
        @$notEmpty = (integer)$_POST['notEmpty'];
        @$onlyBlocked = (integer)$_POST['onlyBlocked'];
        @$showSale = (integer) $_POST['showSale'];

        static::_setConfigMask();
        static::_setConfigQuery();

        $where = array();
        foreach($data as $field => $data) {
            $data = (object)$data;
            if (!$data->sql) {
                continue;
            }
            $where[] = str_replace('{db_field_name}', static::$config->$field->{$data->filterUse}, $data->sql);
        }

        // Показать не пустые кол-во > 0
        if ($notEmpty) {
            $where[] = " (ds.totalAmount > 0)";
        }

        // Показать только заблокированные записи
        if($onlyBlocked) {
            $detailedTable = App_Db::get(DB_DEPOT_DETAILED);
            $blockedValues = $detailedTable->getAllBlockedItems();
            if(is_array($blockedValues) && count($blockedValues) > 0) {
                $blockedValues = implode(',', $blockedValues);
            }
            $where[] = " ds.id IN(" . $blockedValues . ")";
        }

        // Поиск товара по id
        if ($searchId) {
            $where[] = " ds.id = '" . $searchId . "'";
        }
        // Поиск товара по amount с оператором сравнения
        if ($searchAmountOperator) {
            $where[] = " ds.totalAmount " . $searchAmountOperator . " '" . $searchAmount . "'";
        }

        //показать только акции
        if($showSale){
            $where[] = " bpp.type = 1 AND bpp.price IS NOT NULL";
        }

        $sql = static::$sqlResult;
        if ($where) {
            $sql = str_replace('{WHERE}', ' WHERE '.join(' AND ', $where), $sql);
            $sql2 = str_replace('{WHERE}', ' WHERE '.join(' AND ', $where), self::$sqlResultCount);
            $sql3 = str_replace('{WHERE}', ' WHERE '.join(' AND ', $where), self::$sqlResultids);
            $sql7 = str_replace('{WHERE}', ' WHERE '.join(' AND ', $where), self::$sqlResultclaimids);
            $sql4 = str_replace('{WHERE}', ' WHERE '.join(' AND ', $where), self::$sqlTotalWeight);
            $sql5 = str_replace('{WHERE}', ' WHERE '.join(' AND ', $where), self::$sqlTotalWeightBlock);
        }
        else {
            $sql = str_replace('{WHERE}', '', $sql);
            $sql2 = str_replace('{WHERE}', '', self::$sqlResultCount);
            $sql3 = str_replace('{WHERE}', '', self::$sqlResultids);
            $sql7 = str_replace('{WHERE}', '', self::$sqlResultclaimids);
            $sql4 = str_replace('{WHERE}', '', self::$sqlTotalWeight);
            $sql5 = str_replace('{WHERE}', '', self::$sqlTotalWeightBlock);
        }

        if (trim($sortColumn)) {
            $sql .=  " ORDER BY " . $sortColumn . ' ' . $sortType;
        }
        else {
            $sql .=  " ORDER BY title ";
        }
        $sql6 = $sql;

        $sql .= " LIMIT " . ($from >= 0 ? $from : 0) . ", " . $perpage;

        return (object)array(
            'result' => App_Db::get()->query($sql)->fetchAll(Zend_Db::FETCH_OBJ),
            'total'  => App_Db::get()->query($sql2)->fetch(Zend_Db::FETCH_COLUMN),
            'ids'    => implode(',', App_Db::get()->query($sql3)->fetchAll(Zend_Db::FETCH_COLUMN)),
            'claimids'    => implode(',', App_Db::get()->query($sql7)->fetchAll(Zend_Db::FETCH_COLUMN)),
            'totalresult' => App_Db::get()->query($sql6)->fetchAll(Zend_Db::FETCH_OBJ),
            'totalWeightFilter' => App_Formatter::number(App_Db::get()->query($sql4)->fetch(Zend_Db::FETCH_COLUMN)),
            'totalWeightBlockFilter' => App_Formatter::number(App_Db::get()->query($sql5)->fetch(Zend_Db::FETCH_COLUMN)),
        );
    }


    protected static function _setConfigMask()
    {
        $configData = App_Config::get('depot');

        $tmp = new stdClass();

        for($i = 1; $i <= 9; $i++) {
            $field = 'field' . $i;
            $fieldData = $configData->$field;
            $tmpArray = array(
                'select'    => $fieldData->filterselect,
                'findField' => $fieldData->filterfindfield
            );
            if(isset($fieldData->filterext)) {
                $tmpArray['ext'] = $fieldData->filterext;
            }
            $tmp->{$fieldData->filterfname} = (object)$tmpArray;

        }

        $tmpArray = array(
            'select'    => 'IFNULL(bpp.price, bp.cur_price)',
            'findField' => 'IFNULL(bpp.price, bp.cur_price)',
            'ext'       => 'cur_price'
        );
        $tmp->cur_price = (object)$tmpArray;


        $tmpArray = array(
            'select'    => 'description_md5',
            'findField' => 'description_md5',
            'ext'       => 'description_md5'
        );
        $tmp->description_md5 = (object)$tmpArray;

//        Zend_Debug::dump($tmp); exit;
        return static::$config = $tmp;
    }


    public static function getConfigFilterJson()
    {
        $configData = App_Config::get('depot');
        $result = self::getResult();

        $config = array();
        for($i = 1; $i <= 9; $i++) {
            $fieldId = 'field' . $i;
            $fieldData = $configData->$fieldId;
            $tmp = new stdClass();
            $tmp->caption = $fieldData->title;
            $tmp->fieldName = $fieldData->filterfname;
            $tmp->filterType = $fieldData->filtertype;
            $tmp->filterUse = $fieldData->filteruse;
            $tmp->options = App_Config_Depot::getFieldOption($fieldData);
            $config[] = $tmp;
        }

        if (App_Access::get('access', 'depot>access>baseprice')) {
            $tmp = new stdClass();
            $tmp->caption = 'Текущая БЦ';
            $tmp->fieldName = 'cur_price';
            $tmp->filterType = 'number';
            $tmp->filterUse = 'combo';
            $tmp->options = '
                SELECT DISTINCT
                    IFNULL(bpp.price, bp.cur_price) AS v,
                    IFNULL(bpp.price, bp.cur_price) AS t
                FROM
                (SELECT
                    d.id
                    FROM depot_2 AS d
                ) AS ds
                LEFT JOIN
                    `base_prices` AS bp
                ON (bp.item_id = ds.id AND
                    bp.`bp_type` = 1 AND
                    cur_date = (
                        SELECT MAX(cur_date)
                        FROM `base_prices`
                        WHERE `base_prices`.item_id = ds.id AND
                            `base_prices`.`bp_type` = 1
                    )
                )
                LEFT JOIN
                    `base_prices_plans` AS bpp
                    ON (bpp.item_id = ds.id
                        AND bpp.type = 1
                        AND bpp.bp_type = 1
                        AND bpp.dateto > now()
                        AND bpp.datefrom < now()
                        AND cur_datetime = (SELECT MAX(cur_datetime) FROM `base_prices_plans` WHERE `base_prices_plans`.item_id = ds.id AND `base_prices_plans`.bp_type = 1))
                WHERE IFNULL(bpp.price, bp.cur_price) > 0 ORDER BY t';
            $config[] = $tmp;
        }

        // добавление фильтра по полю Примечание
        $config[] = static::_getConfigForDescriptionMd5();
        foreach($config as &$item) {
            if ($item->fieldName != 'cur_price') {
                $item->options = str_replace('ORDER',' AND d.id IN (' . ($result->ids ? $result->ids : '0') . ') ORDER',$item->options);
                if ($item->fieldName == 'description_md5') {
                    $item->options = str_replace(' AND d.id',' WHERE d.id',$item->options);
                }
            } else {
                $item->options = str_replace('depot_2 AS d','depot_2 AS d WHERE d.id IN (' . ($result->ids ? $result->ids : '0') . ')',$item->options);
            }
            $item->options = App_Db::get()->query($item->options)->fetchAll(Zend_Db::FETCH_OBJ);
        }
        echo json_encode($config);
    }


    protected static function _setConfigQuery()
    {
        $access = App_Access::get('access', 'photogallery>access>showbaseprice') ? 1 : 0;
        $search  = array("{CONFIGQUERY}", "{FIELDASCCESWHERE}","{ACCESS}");
        $replace = array(App_Config_Depot::getQueryPart(), App_Config_Depot::getFieldAccessRules(), $access);

        static::$sqlMask        = str_replace($search, $replace, static::$sqlMask);
        static::$sqlResult      = str_replace($search, $replace, static::$sqlResult);
        static::$sqlResultCount = str_replace($search, $replace, static::$sqlResultCount);
        static::$sqlResultids   = str_replace($search, $replace, static::$sqlResultids);
        static::$sqlResultclaimids   = str_replace($search, $replace, static::$sqlResultclaimids);

        $replace[1] = App_Config_Depot::queryMerge(
            array(
                App_Config_Depot::getFieldAccessRules(''),
                App_Config_Depot::ignoreTonnageCondition('')
            ),
            "WHERE", "AND", false
        );

        static::$sqlTotalWeight      = str_replace($search, $replace, static::$sqlTotalWeight);
        static::$sqlTotalWeightBlock = str_replace($search, $replace, static::$sqlTotalWeightBlock);

        static::_setManagersBlocksSelectPart();
    }


    /**
     * Учёт блокировок под менеджеров, ticket1051
     */
    protected static function _setManagersBlocksSelectPart()
    {
        foreach (array(
            'sqlResult' => array(
                'MANAGERS_BLOCKS_ROWS_COUNT' => Depot_Model_ManagersBlocks::MANAGERS_BLOCKS_ROWS_COUNT,
                'MANAGERS_BLOCKS_HIDDEN_AMOUNT' => Depot_Model_ManagersBlocks::MANAGERS_BLOCKS_HIDDEN_AMOUNT,
                'MANAGERS_BLOCKS_HIDDEN_BOXES' => Depot_Model_ManagersBlocks::MANAGERS_BLOCKS_HIDDEN_BOXES
            ),
            'sqlResultCount' => array('MANAGERS_BLOCKS_ROWS_COUNT' => Depot_Model_ManagersBlocks::MANAGERS_BLOCKS_ROWS_COUNT),
            'sqlResultids' => array('MANAGERS_BLOCKS_ROWS_COUNT' => Depot_Model_ManagersBlocks::MANAGERS_BLOCKS_ROWS_COUNT),
            'sqlTotalWeight' => array('MANAGERS_BLOCKS_ROWS_COUNT' => Depot_Model_ManagersBlocks::MANAGERS_BLOCKS_ROWS_COUNT),
            'sqlTotalWeightBlock' => array('MANAGERS_BLOCKS_ROWS_COUNT' => Depot_Model_ManagersBlocks::MANAGERS_BLOCKS_ROWS_COUNT)
        ) as $queryName => $replacings) {
            if (static::${$queryName}) {
                static::${$queryName} = Depot_Model_ManagersBlocks::getInstance()->replaceQueryFields(
                    static::${$queryName}, [2], $replacings, '`d`.`id`'
                );
            }
        }
    }
}
