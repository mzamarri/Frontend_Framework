set PGPASSWORD=4021
set PGUSER=postgres
set PGDATABASE=test

psql -c "CALL clear_tables();"
psql -f create_tables.sql
node ../testBench.js