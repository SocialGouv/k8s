import env from "@kosko/env"
import { create } from "@socialgouv/kosko-charts/components/app"
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath"

import config from "../../.socialgouv/config.json"

export default () => {
  const { name, type, probesPath } = <Config>config

  const probes = probesPath
    ? ["livenessProbe", "readinessProbe", "startupProbe"].reduce(
        (probes, probe) => (
          (probes = {
            ...probes,
            [probe]: {
              httpGet: {
                path: probesPath,
                port: "http",
              },
              initialDelaySeconds: 30,
              periodSeconds: 15,
            },
          }),
          probes
        ),
        {}
      )
    : {}

  return config && type === "app"
    ? create(name, {
        env,
        config: { containerPort: 3000 },
        deployment: {
          image: getHarborImagePath({ name }),
          container: {
            resources: {
              requests: {
                cpu: "50m",
                memory: "128Mi",
              },
              limits: {
                cpu: "200m",
                memory: "256Mi",
              },
            },
            ...probes,
          },
        },
      })
    : []
}
