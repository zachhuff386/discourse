# frozen_string_literal: true

DB.exec 'CREATE EXTENSION IF NOT EXISTS hstore'
DB.exec 'CREATE EXTENSION IF NOT EXISTS pg_trgm'
DB.exec 'CREATE EXTENSION IF NOT EXISTS unaccent'
