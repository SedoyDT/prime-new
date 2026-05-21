```SQL
SELECT DISTINCT s.debetTransactionType AS v
    	FROM (
    		SELECT DISTINCT
				`cash`.`id`,
				`cash`.`transaction_type`,
				`cash`.`date`,
				`cash`.`client_id`,
				ABS(`cash`.`summ`) AS `summ`,
				`cr`.`reason`,
				0 AS `cashType`,
				(`cash`.`type` - 1) AS `side`,
				IF(`ci`.`trans_id` IS NULL, 0, 1) AS `imaginary`,
				CONCAT('/cash/account/edittr/trId/', `cash`.`id`) AS `url`,
				'cash' AS `factsumm`,
				`cash`.`transaction_type` AS `debetTransactionType`,
				`cash`.`transaction_type` AS `creditTransactionType`,
				0 AS `debetCashType`,
				0 AS `creditCashType`,
				IF(`ci`.`trans_id` IS NULL, 0, 1) AS `debetImaginary`,
				IF(`ci`.`trans_id` IS NULL, 0, 1) AS `creditImaginary`,
				`cash`.`client_id` AS `debetClientId`,
				`cash`.`client_id` AS `creditClientId`
			FROM `cash_account` AS `cash`
			INNER JOIN `cash_reason` AS `cr`
				ON `cash`.`reason` = `cr`.`id`
			LEFT JOIN `cash_imaginary` AS `ci`
				ON `cash`.`id` = `ci`.`trans_id` AND `ci`.`cash_type` = '0'
			WHERE `cash`.`state` = '1' AND `cash`.`transaction_type` IN (1,2,3,4,8,11,26)

			UNION

			SELECT DISTINCT
				`cash`.`id`,
				`cash`.`transaction_type`,
				`cash`.`date`,
				`cash`.`client_id`,
				ABS(`cte`.`summ`) AS `summ`,
				`cr`.`reason`,
				0 AS `cashType`,
				ABS(`cash`.`type` - 2) AS `side`,
				-1 AS `imaginary`,
				CONCAT('/cash/account/edittr/trId/', `cash`.`id`) AS `url`,
				'cash' AS `factsumm`,
				`cash`.`transaction_type` AS `debetTransactionType`,
				`cash`.`transaction_type` AS `creditTransactionType`,
				0 AS `debetCashType`,
				0 AS `creditCashType`,
				-1 AS `debetImaginary`,
				-1 AS `creditImaginary`,
				`cash`.`client_id` AS `debetClientId`,
				`cash`.`client_id` AS `creditClientId`
			FROM `cash_account` AS `cash`
			INNER JOIN `cash_reason` AS `cr`
				ON `cash`.`reason` = `cr`.`id`
			INNER JOIN `cash_transaction_extended` AS `cte`
				ON `cash`.`id` = `cte`.`trans_id` AND `cte`.`trans_type` = '0'
			WHERE `cash`.`state` = '1' AND `cash`.`transaction_type` IN (1,2,3,4,8,11,26)

			UNION

			SELECT DISTINCT
				`cash`.`id`,
				`cash`.`transaction_type`,
				`cash`.`date`,
				`cash`.`client_id`,
				ABS(`cash`.`summ`) AS `summ`,
				`cr`.`reason`,
				1 AS `cashType`,
				(`cash`.`type` - 1) AS `side`,
				IF(`ci`.`trans_id` IS NULL, 0, 1) AS `imaginary`,
				CONCAT('/cash/money/edittr/trId/', `cash`.`id`) AS `url`,
				'cash' AS `factsumm`,
				`cash`.`transaction_type` AS `debetTransactionType`,
				`cash`.`transaction_type` AS `creditTransactionType`,
				1 AS `debetCashType`,
				1 AS `creditCashType`,
				IF(`ci`.`trans_id` IS NULL, 0, 1) AS `debetImaginary`,
				IF(`ci`.`trans_id` IS NULL, 0, 1) AS `creditImaginary`,
				`cash`.`client_id` AS `debetClientId`,
				`cash`.`client_id` AS `creditClientId`
			FROM `cash_money` AS `cash`
			INNER JOIN `cash_reason` AS `cr`
				ON `cash`.`reason` = `cr`.`id`
			LEFT JOIN `cash_imaginary` AS `ci`
				ON `cash`.`id` = `ci`.`trans_id` AND `ci`.`cash_type` = '1'
			WHERE `cash`.`state` = '1' AND `cash`.`transaction_type` IN (1,2,3,8,11,26)

			UNION

			SELECT DISTINCT
				`cash`.`id`,
				`cash`.`transaction_type`,
				`cash`.`date`,
				`cash`.`client_id`,
				ABS(`cte`.`summ`) AS `summ`,
				`cr`.`reason`,
				1 AS `cashType`,
				ABS(`cash`.`type` - 2) AS `side`,
				-1 AS `imaginary`,
				CONCAT('/cash/money/edittr/trId/', `cash`.`id`) AS `url`,
				'cash' AS `factsumm`,
				`cash`.`transaction_type` AS `debetTransactionType`,
				`cash`.`transaction_type` AS `creditTransactionType`,
				1 AS `debetCashType`,
				1 AS `creditCashType`,
				-1 AS `debetImaginary`,
				-1 AS `creditImaginary`,
				`cash`.`client_id` AS `debetClientId`,
				`cash`.`client_id` AS `creditClientId`
			FROM `cash_money` AS `cash`
			INNER JOIN `cash_reason` AS `cr`
				ON `cash`.`reason` = `cr`.`id`
			INNER JOIN `cash_transaction_extended` AS `cte`
				ON `cash`.`id` = `cte`.`trans_id` AND `cte`.`trans_type` = '1'
			WHERE `cash`.`state` = '1' AND `cash`.`transaction_type` IN (1,2,3,8,11,26)

			UNION ALL

			SELECT
				`a`.`id`,
				`a`.`claimType` AS `transaction_type`,
				`a`.`date`,
				`a`.`client_id`,
				`a`.`summ`,
				`a`.`full_id` AS `reason`,
				`a`.`payment` AS `cashType`,
				IF (`a`.`claimType` = '1', 1, 0) AS `side`,
				-1 AS `imaginary`,
				`a`.`url`,
				`b`.`factsumm`,
				`a`.`claimType` AS `debetTransactionType`,
				`a`.`claimType` AS `creditTransactionType`,
				`a`.`payment` AS `debetCashType`,
				`a`.`payment` AS `creditCashType`,
				-1 AS `debetImaginary`,
				-1 AS `creditImaginary`,
				`a`.`client_id` AS `debetClientId`,
				`a`.`client_id` AS `creditClientId`
			FROM `claims` AS `a`
			LEFT JOIN `claim_payment` AS `b`
				ON a.id = b.claim_id
			WHERE (a.claim_status = 0) AND (NOT a.claimType IN (3,4,6))
    	) AS `s`
        WHERE 1 {WHERE}

SELECT DISTINCT s.debetTransactionType AS v
    	FROM (
    		SELECT DISTINCT
				`cash`.`id`,
				`cash`.`transaction_type`,
				`cash`.`date`,
				`cash`.`client_id`,
				ABS(`cash`.`summ`) AS `summ`,
				`cr`.`reason`,
				0 AS `cashType`,
				(`cash`.`type` - 1) AS `side`,
				IF(`ci`.`trans_id` IS NULL, 0, 1) AS `imaginary`,
				CONCAT('/cash/account/edittr/trId/', `cash`.`id`) AS `url`,
				'cash' AS `factsumm`,
				`cash`.`transaction_type` AS `debetTransactionType`,
				`cash`.`transaction_type` AS `creditTransactionType`,
				0 AS `debetCashType`,
				0 AS `creditCashType`,
				IF(`ci`.`trans_id` IS NULL, 0, 1) AS `debetImaginary`,
				IF(`ci`.`trans_id` IS NULL, 0, 1) AS `creditImaginary`,
				`cash`.`client_id` AS `debetClientId`,
				`cash`.`client_id` AS `creditClientId`
			FROM `cash_account` AS `cash`
			INNER JOIN `cash_reason` AS `cr`
				ON `cash`.`reason` = `cr`.`id`
			LEFT JOIN `cash_imaginary` AS `ci`
				ON `cash`.`id` = `ci`.`trans_id` AND `ci`.`cash_type` = '0'
			WHERE `cash`.`state` = '1' AND `cash`.`transaction_type` IN (1,2,3,4,8,11,26)

			UNION

			SELECT DISTINCT
				`cash`.`id`,
				`cash`.`transaction_type`,
				`cash`.`date`,
				`cash`.`client_id`,
				ABS(`cte`.`summ`) AS `summ`,
				`cr`.`reason`,
				0 AS `cashType`,
				ABS(`cash`.`type` - 2) AS `side`,
				-1 AS `imaginary`,
				CONCAT('/cash/account/edittr/trId/', `cash`.`id`) AS `url`,
				'cash' AS `factsumm`,
				`cash`.`transaction_type` AS `debetTransactionType`,
				`cash`.`transaction_type` AS `creditTransactionType`,
				0 AS `debetCashType`,
				0 AS `creditCashType`,
				-1 AS `debetImaginary`,
				-1 AS `creditImaginary`,
				`cash`.`client_id` AS `debetClientId`,
				`cash`.`client_id` AS `creditClientId`
			FROM `cash_account` AS `cash`
			INNER JOIN `cash_reason` AS `cr`
				ON `cash`.`reason` = `cr`.`id`
			INNER JOIN `cash_transaction_extended` AS `cte`
				ON `cash`.`id` = `cte`.`trans_id` AND `cte`.`trans_type` = '0'
			WHERE `cash`.`state` = '1' AND `cash`.`transaction_type` IN (1,2,3,4,8,11,26)

			UNION

			SELECT DISTINCT
				`cash`.`id`,
				`cash`.`transaction_type`,
				`cash`.`date`,
				`cash`.`client_id`,
				ABS(`cash`.`summ`) AS `summ`,
				`cr`.`reason`,
				1 AS `cashType`,
				(`cash`.`type` - 1) AS `side`,
				IF(`ci`.`trans_id` IS NULL, 0, 1) AS `imaginary`,
				CONCAT('/cash/money/edittr/trId/', `cash`.`id`) AS `url`,
				'cash' AS `factsumm`,
				`cash`.`transaction_type` AS `debetTransactionType`,
				`cash`.`transaction_type` AS `creditTransactionType`,
				1 AS `debetCashType`,
				1 AS `creditCashType`,
				IF(`ci`.`trans_id` IS NULL, 0, 1) AS `debetImaginary`,
				IF(`ci`.`trans_id` IS NULL, 0, 1) AS `creditImaginary`,
				`cash`.`client_id` AS `debetClientId`,
				`cash`.`client_id` AS `creditClientId`
			FROM `cash_money` AS `cash`
			INNER JOIN `cash_reason` AS `cr`
				ON `cash`.`reason` = `cr`.`id`
			LEFT JOIN `cash_imaginary` AS `ci`
				ON `cash`.`id` = `ci`.`trans_id` AND `ci`.`cash_type` = '1'
			WHERE `cash`.`state` = '1' AND `cash`.`transaction_type` IN (1,2,3,8,11,26)

			UNION

			SELECT DISTINCT
				`cash`.`id`,
				`cash`.`transaction_type`,
				`cash`.`date`,
				`cash`.`client_id`,
				ABS(`cte`.`summ`) AS `summ`,
				`cr`.`reason`,
				1 AS `cashType`,
				ABS(`cash`.`type` - 2) AS `side`,
				-1 AS `imaginary`,
				CONCAT('/cash/money/edittr/trId/', `cash`.`id`) AS `url`,
				'cash' AS `factsumm`,
				`cash`.`transaction_type` AS `debetTransactionType`,
				`cash`.`transaction_type` AS `creditTransactionType`,
				1 AS `debetCashType`,
				1 AS `creditCashType`,
				-1 AS `debetImaginary`,
				-1 AS `creditImaginary`,
				`cash`.`client_id` AS `debetClientId`,
				`cash`.`client_id` AS `creditClientId`
			FROM `cash_money` AS `cash`
			INNER JOIN `cash_reason` AS `cr`
				ON `cash`.`reason` = `cr`.`id`
			INNER JOIN `cash_transaction_extended` AS `cte`
				ON `cash`.`id` = `cte`.`trans_id` AND `cte`.`trans_type` = '1'
			WHERE `cash`.`state` = '1' AND `cash`.`transaction_type` IN (1,2,3,8,11,26)

			UNION ALL

			SELECT
				`a`.`id`,
				`a`.`claimType` AS `transaction_type`,
				`a`.`date`,
				`a`.`client_id`,
				`a`.`summ`,
				`a`.`full_id` AS `reason`,
				`a`.`payment` AS `cashType`,
				IF (`a`.`claimType` = '1', 1, 0) AS `side`,
				-1 AS `imaginary`,
				`a`.`url`,
				`b`.`factsumm`,
				`a`.`claimType` AS `debetTransactionType`,
				`a`.`claimType` AS `creditTransactionType`,
				`a`.`payment` AS `debetCashType`,
				`a`.`payment` AS `creditCashType`,
				-1 AS `debetImaginary`,
				-1 AS `creditImaginary`,
				`a`.`client_id` AS `debetClientId`,
				`a`.`client_id` AS `creditClientId`
			FROM `claims` AS `a`
			LEFT JOIN `claim_payment` AS `b`
				ON a.id = b.claim_id
			WHERE (a.claim_status = 0) AND (NOT a.claimType IN (3,4,6))
    	) AS `s`
        WHERE 1  AND ( debetTransactionReasonId in ('adc4b23ce62b0c1b7d34d5c8dd7c9ce0'))
```