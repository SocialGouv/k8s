import { GlobalEnvironment } from "@socialgouv/kosko-charts/types"

import config from "../../../socialgouv.json"

const { name, subdomain } = config

export default {
  subdomain: subdomain || name,
} as Partial<GlobalEnvironment>
