func run() {



	for _, statement := range []string{

		`CREATE TABLE IF NOT EXISTS products (

			id INTEGER PRIMARY KEY,

			name TEXT NOT NULL,

			price_cents INTEGER NOT NULL

		)`,

		`CREATE TABLE IF NOT EXISTS categories (

			id INTEGER PRIMARY KEY,

			name TEXT NOT NULL

		)`,

	} {

		if _, err := db.Exec(statement); err != nil {

			return err

		}

	}



}
 