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

CREATE TABLE IF NOT EXISTS PPR_REPORT (
    id TEXT PRIMARY KEY,
    view_id TEXT NOT NULL,
    template_id TEXT,
    name TEXT NOT NULL,
    chart_type TEXT NOT NULL,
    polling_interval INTEGER NOT NULL DEFAULT 0,
    style_config TEXT,
    chart_config TEXT
);

CREATE TABLE IF NOT EXISTS PPR_PERMISSION (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL,
    auth_char TEXT NOT NULL,
    action TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS PPR_EXCEL_TEMPLATE (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    mapping_config TEXT
);

CREATE TABLE IF NOT EXISTS PPR_LOG (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    operator TEXT,
    ip TEXT,
    method TEXT,
    params TEXT,
    time INTEGER NOT NULL,
    cost_ms INTEGER,
    error_msg TEXT
);


