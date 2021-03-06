import env from "@kosko/env";
import { create } from "@socialgouv/kosko-charts/components/app";
import { addEnv } from "@socialgouv/kosko-charts/utils/addEnv";
import { getGithubRegistryImagePath } from "@socialgouv/kosko-charts/utils/getGithubRegistryImagePath";
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath";
import { getIngressHost } from "@socialgouv/kosko-charts/utils/getIngressHost";
import { getManifestByKind } from "@socialgouv/kosko-charts/utils/getManifestByKind";
import { ok } from "assert";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { Ingress } from "kubernetes-models/networking.k8s.io/v1beta1/Ingress";
import { EnvVar } from "kubernetes-models/v1/EnvVar";
import { addIngressAnnotations } from "../utils/addIngressAnnotations";
import Config from "../utils/config";

export default async () => {
  const {
    name,
    subdomain,
    type,
    probes = {},
    probesPath,
    resources,
    azurepg,
    hasura,
    ingress,
    registry = "harbor",
    project,
  } = Config();

  const image =
    registry === "ghcr"
      ? getGithubRegistryImagePath({ name, project: project || name })
      : getHarborImagePath({ name });

  const podProbes = {
    ...(probesPath
      ? ["livenessProbe", "readinessProbe", "startupProbe"].reduce(
          (probes, probe) => ({
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
          {}
        )
      : {}),
    ...probes,
  };

  if (type && type === "app") {
    const manifests = await create(name, {
      env,
      config: {
        subdomain,
        containerPort: 3000,
        withPostgres: azurepg && !hasura,
      },
      deployment: {
        image,
        container: {
          resources: resources || {
            requests: {
              cpu: "50m",
              memory: "128Mi",
            },
            limits: {
              cpu: "200m",
              memory: "256Mi",
            },
          },
          ...podProbes,
        },
      },
    });

    //@ts-expect-error
    const deployment = getManifestByKind(manifests, Deployment) as Deployment;

    if (ingress && ingress.annotations) {
      const deploymentIngress = getManifestByKind(
        manifests,
        //@ts-expect-error
        Ingress
      ) as Ingress;
      addIngressAnnotations(deploymentIngress, ingress.annotations);
    }

    ok(deployment);

    /* pass dynamic deployment URL as env var to the container */
    const frontendUrl = new EnvVar({
      name: "APP_BASE_URL",
      value: `https://${getIngressHost(manifests)}`,
    });

    addEnv({ deployment, data: frontendUrl });

    return manifests;
  } else {
    return [];
  }
};
