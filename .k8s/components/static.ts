import env from "@kosko/env";
import { create } from "@socialgouv/kosko-charts/components/nginx";
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath";
import { getManifestByKind } from "@socialgouv/kosko-charts/utils/getManifestByKind";
import { Ingress } from "kubernetes-models/networking.k8s.io/v1beta1/Ingress";

import { addIngressAnnotations } from "../utils/addIngressAnnotations";

import Config from "../utils/config";

export default () => {
  const { name, type, subdomain, ingress } = Config();
  if (type === "static") {
    const manifests = create(name, {
      env,
      config: { subdomain },
      deployment: {
        image: getHarborImagePath({ name }),
      },
    });

    if (ingress && ingress.annotations) {
      const deploymentIngress = getManifestByKind(
        manifests,
        //@ts-expect-error
        Ingress
      ) as Ingress;
      addIngressAnnotations(deploymentIngress, ingress.annotations);
    }

    return manifests;
  }
  return [];
};
