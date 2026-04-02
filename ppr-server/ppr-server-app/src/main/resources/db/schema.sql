CREATE TABLE IF NOT EXISTS PPR_DATASOURCE (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    jdbc_url TEXT NOT NULL,
    username TEXT,
    password TEXT
);

CREATE TABLE IF NOT EXISTS PPR_VIEW (
    id TEXT PRIMARY KEY,
    datasource_id TEXT NOT NULL,
    name TEXT NOT NULL,
    sql_content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS PPR_VIEW_PARAM (
    id TEXT PRIMARY KEY,
    view_id TEXT NOT NULL,
    param_name TEXT NOT NULL,
    param_type TEXT NOT NULL,
    dict_code TEXT,
    is_required INTEGER NOT NULL DEFAULT 0
);

