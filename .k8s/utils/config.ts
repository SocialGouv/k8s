type Probes = {
  startupProbe?: object;
  livenessProbe?: object;
  readinessProbe?: object;
};

type ConfigTypes = {
  name: string;
  type: string;
  subdomain: string;
  hasura?: boolean;
  azurepg?: boolean;
  probes?: Probes;
  probesPath?: string;
  ingress?: {
    annotations?: Record<string, string>
  }
};

const Config = () => {
  const config = require(process.env.SOCIALGOUV_CONFIG_PATH ??
    "../../.socialgouv/config.json");

  return config as ConfigTypes;
};

export default Config;
