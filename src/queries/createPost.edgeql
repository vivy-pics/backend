WITH
	hash := <str>$hash,
	owner := <int64>$owner
SELECT (
	INSERT Post {
		hash := hash,
		owner := (SELECT User FILTER .number = owner)
	}
) { number };
