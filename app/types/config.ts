export interface DataSourceConfig {
  _id: string;
  name: string;
  data_type: string;
  api_endpoint: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDataSourceConfig {
  name: string;
  data_type: string;
  api_endpoint: string;
  description?: string;
}

export interface UpdateDataSourceConfig {
  name?: string;
  data_type?: string;
  api_endpoint?: string;
  description?: string;
}
