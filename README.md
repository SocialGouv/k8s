# .k8s

A dynamic `.k8s` folder containing the configuration required by Kosko to generate Kubernetes manifests.

## Config

in `.socialgouv/config.json`

| Key        | Description                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| name       | application name                                                                                                                            |
| type       | app (Dockerfile), static                                                                                                                    |
| hasura     | add hasura container                                                                                                                        |
| azurepg    | add an azurepg connection                                                                                                                   |
| probesPath | The base url for [kubernetes probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) |
| probes     | Custom [probes configuration](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#probe-v1-core)                           |
| resources  | Custom [resources](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#resourcerequirements-v1-core)                       |
| subdomain  | force the default production subdomain.                                                                                                     |

Example :

```json
{
  "name": "myapp",
  "type": "app",
  "subdomain": "myapp-beta",
  "hasura": true,
  "probesPath": "/index.html"
}
```

### Kubernetes

in `.socialgouv/environments`, add your config maps and sealed-secrets :

dev
preprod
prod

You can also provided additionnal kube manifests in each environment `manifests`subfolder.

```
environments
 |-dev
    |-manifests
          |-another-ingress.yml
```
