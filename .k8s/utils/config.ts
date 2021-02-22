type ConfigTypes = {
  name: string
  type: string
  subdomain: string
  hasura?: boolean
  azurepg?: boolean
  probesPath?: string
}

const Config = () => {
  const config = require(process.env.SOCIALGOUV_CONFIG_PATH ??
    "../../.socialgouv/config.json")

  return config as ConfigTypes
}

export default Config
