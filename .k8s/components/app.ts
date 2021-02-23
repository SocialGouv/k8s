import { ok } from "assert"
import env from "@kosko/env"
import { EnvVar } from "kubernetes-models/v1/EnvVar"
import { addEnv } from "@socialgouv/kosko-charts/utils/addEnv"
import { create } from "@socialgouv/kosko-charts/components/app"
import { getIngressHost } from "@socialgouv/kosko-charts/utils/getIngressHost"
import { getManifestByKind } from "@socialgouv/kosko-charts/utils/getManifestByKind"
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath"

import Config from "../utils/config"

export default () => {
  const { name, type, probesPath } = Config()

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

  if (type && type === "app") {
    const manifests = create(name, {
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

    /* pass dynamic deployment URL as env var to the container */
    //@ts-expect-error
    const deployment = getManifestByKind(manifests, Deployment) as Deployment

    ok(deployment)

    const frontendUrl = new EnvVar({
      name: "APP_BASE_URL",
      value: `https://${getIngressHost(manifests)}`,
    })

    addEnv({ deployment, data: frontendUrl })

    return manifests
  } else {
    return []
  }
}
