import assert from "assert/strict";
import { stringify } from "querystring";

import { Client } from "./client";
import { DecisionStrategy, Logic } from "./types";

interface GetAccessOptions {
  baseUrl: string;
  realm: string;
  clientId: string;
  clientSecret: string;
}

function omit<T>(obj: T) {
  return JSON.parse(JSON.stringify(obj));
}

function rand() {
  return Math.random().toString(36).slice(2);
}

async function getAccessToken({
  baseUrl,
  realm,
  clientId,
  clientSecret,
}: GetAccessOptions) {
  const res = await fetch(
    `${baseUrl}/realms/${realm}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
    }
  );
  assert(res.status === 200, res.statusText);
  const json = await res.json();
  assert(typeof json.access_token === "string", "Failed to get access token");
  return json.access_token;
}

const JOHN_DOE_ID = "15a72d1b-d00b-4a40-b985-5db174d3dadf";

describe("Client", () => {
  let token: string;
  const seed = Date.now();

  const client = new Client({
    baseUrl: process.env.KEYCLOAK_SERVER!,
    realm: process.env.KEYCLOAK_REALM!,
    id: process.env.KEYCLOAK_CLIENT_ID!,
  });

  beforeAll(async () => {
    token = await getAccessToken({
      baseUrl: process.env.KEYCLOAK_SERVER!,
      realm: process.env.KEYCLOAK_REALM!,
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    });
  });

  it("manages resources", async () => {
    let resource = client.createResource(token, {
      name: `resource-${seed}`,
      displayName: `Resource ${seed}`,
      attributes: { key: ["1", "2", "3"] },
      icon_uri: "https://picsum.photos/50",
      uris: [`/resources/${seed}`],
      ownerManagedAccess: false,
      type: "Resource",
    });

    await expect(resource).resolves.toEqual({
      _id: expect.any(String),
      name: expect.any(String),
      displayName: expect.any(String),
      icon_uri: expect.any(String),
      attributes: expect.objectContaining({
        key: expect.arrayContaining([expect.any(String)]),
      }),
      owner: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
      }),
      type: expect.any(String),
      ownerManagedAccess: expect.any(Boolean),
      uris: expect.arrayContaining([expect.any(String)]),
    });

    resource = Promise.resolve({
      ...(await resource),
      displayName: `Resource ${seed} updated`,
    });

    await expect(
      client.updateResource(token, await resource)
    ).resolves.toBeUndefined();

    await expect(
      client.searchResources(token, {
        name: `resource-${seed}`,
        type: "Resource",
        max: 1,
        uri: `/resources/${seed}`,
      })
    ).resolves.toEqual([await resource]);

    await expect(
      client.getResource(token, (await resource)._id)
    ).resolves.toEqual(await resource);

    await expect(
      client.deleteResource(token, (await resource)._id)
    ).resolves.toBeUndefined();
  });

  it("manages scopes", async () => {
    let scope = client.createScope(token, {
      name: `scope-${seed}`,
      displayName: `Scope ${seed}`,
      iconUri: "https://picsum.photos/50",
    });

    await expect(scope).resolves.toEqual({
      displayName: expect.any(String),
      iconUri: expect.any(String),
      id: expect.any(String),
      name: expect.any(String),
    });

    scope = Promise.resolve({
      ...(await scope),
      displayName: `Scope ${seed} updated`,
    });

    await expect(
      client.updateScope(token, await scope)
    ).resolves.toBeUndefined();

    await expect(
      client.searchScopes(token, {
        name: `scope-${seed}`,
        max: 1,
      })
    ).resolves.toEqual([await scope]);

    await expect(client.getScope(token, (await scope).id)).resolves.toEqual(
      await scope
    );

    await expect(
      client.deleteScope(token, (await scope).id)
    ).resolves.toBeUndefined();
  });

  it("manages policies", async () => {
    let policy = client.createPolicy(token, {
      type: "user",
      name: `policy-${seed}`,
      description: `Policy ${seed}`,
      logic: Logic.POSITIVE,
      decisionStrategy: DecisionStrategy.UNANIMOUS,
      config: {
        users: JSON.stringify([JOHN_DOE_ID]),
      },
    });

    await expect(policy).resolves.toEqual({
      decisionStrategy: expect.any(String),
      description: expect.any(String),
      id: expect.any(String),
      logic: expect.any(String),
      name: expect.any(String),
      type: expect.any(String),
      config: expect.objectContaining({
        users: expect.any(String),
      }),
    });

    policy = Promise.resolve({
      ...(await policy),
      description: `Policy ${seed} updated`,
    });

    await expect(
      client.updatePolicy(token, await policy)
    ).resolves.toBeUndefined();

    await expect(client.getPolicy(token, (await policy).id)).resolves.toEqual(
      await policy
    );

    await expect(
      client.searchPolicies(token, {
        name: `policy-${seed}`,
        max: 1,
        type: "user",
      })
    ).resolves.toEqual([await policy]);

    await expect(
      client.deletePolicy(token, (await policy).id)
    ).resolves.toBeUndefined();
  });

  it("manages resource permissions", async () => {
    const [resource, policy] = await Promise.all([
      client.createResource(token, {
        name: `resource-${rand()}`,
      }),
      client.createPolicy(token, {
        type: "user",
        name: `policy-${rand()}`,
        logic: Logic.POSITIVE,
        decisionStrategy: DecisionStrategy.UNANIMOUS,
        config: {
          users: JSON.stringify([JOHN_DOE_ID]),
        },
      }),
    ]);

    let permission = client.createPermission(token, {
      type: "resource",
      name: `permission-${seed}`,
      decisionStrategy: DecisionStrategy.UNANIMOUS,
      resources: [resource._id],
      description: `Permission ${seed}`,
      policies: [policy.id],
      config: {},
    });

    await expect(permission).resolves.toEqual({
      config: expect.any(Object),
      decisionStrategy: expect.any(String),
      description: expect.any(String),
      id: expect.any(String),
      logic: expect.any(String),
      name: expect.any(String),
      type: expect.any(String),
      policies: expect.arrayContaining([expect.any(String)]),
      resources: expect.arrayContaining([expect.any(String)]),
    });

    permission = Promise.resolve({
      ...(await permission),
      description: `Permission ${seed} updated`,
    });

    await expect(
      client.updatePermission(token, await permission)
    ).resolves.toBeUndefined();

    await expect(
      client.searchPermissions(token, {
        name: `permission-${seed}`,
        max: 1,
      })
    ).resolves.toEqual([
      omit({
        ...(await permission),
        config: undefined,
        policies: undefined,
        resources: undefined,
      }),
    ]);

    await expect(
      client.getPermission(token, (await permission).id)
    ).resolves.toEqual(
      omit({
        ...(await permission),
        config: undefined,
        policies: undefined,
        resources: undefined,
      })
    );

    await expect(
      client.getPermissionPolicies(token, (await permission).id)
    ).resolves.toEqual([
      omit({
        ...policy,
        config: {},
        users: undefined,
      }),
    ]);

    await expect(
      client.getPermissionResources(token, (await permission).id)
    ).resolves.toEqual([
      {
        _id: resource._id,
        name: resource.name,
      },
    ]);

    await expect(
      client.deletePermission(token, (await permission).id)
    ).resolves.toBeUndefined();

    await expect(
      client.deletePolicy(token, policy.id)
    ).resolves.toBeUndefined();

    await expect(
      client.deleteResource(token, resource._id)
    ).resolves.toBeUndefined();
  });

  it("manages scope permissions", async () => {
    const [scope, policy] = await Promise.all([
      client.createScope(token, {
        name: `scope-${rand()}`,
      }),
      client.createPolicy(token, {
        type: "user",
        name: `policy-${rand()}`,
        logic: Logic.POSITIVE,
        decisionStrategy: DecisionStrategy.UNANIMOUS,
        config: {
          users: JSON.stringify([JOHN_DOE_ID]),
        },
      }),
    ]);

    const resource = await client.createResource(token, {
      name: `resource-${rand()}`,
      scopes: [scope],
    });

    let permission = client.createPermission(token, {
      type: "scope",
      name: `permission-${seed}`,
      description: `Permission ${seed}`,
      decisionStrategy: DecisionStrategy.UNANIMOUS,
      scopes: [scope.id],
      resources: [resource._id],
      policies: [policy.id],
    });

    await expect(permission).resolves.toEqual({
      config: expect.any(Object),
      decisionStrategy: expect.any(String),
      description: expect.any(String),
      id: expect.any(String),
      logic: expect.any(String),
      name: expect.any(String),
      type: expect.any(String),
      resources: expect.arrayContaining([expect.any(String)]),
      scopes: expect.arrayContaining([expect.any(String)]),
      policies: expect.arrayContaining([expect.any(String)]),
    });

    permission = Promise.resolve({
      ...(await permission),
      description: `Permission ${seed} updated`,
    });

    await expect(
      client.updatePermission(token, await permission)
    ).resolves.toBeUndefined();

    await expect(
      client.searchPermissions(token, {
        name: `permission-${seed}`,
        max: 1,
      })
    ).resolves.toEqual([
      omit({
        ...(await permission),
        config: undefined,
        policies: undefined,
        scopes: undefined,
        resources: undefined,
      }),
    ]);

    await expect(
      client.getPermission(token, (await permission).id)
    ).resolves.toEqual(
      omit({
        ...(await permission),
        config: undefined,
        policies: undefined,
        scopes: undefined,
        resources: undefined,
      })
    );

    await expect(
      client.getPermissionPolicies(token, (await permission).id)
    ).resolves.toEqual([
      omit({
        ...policy,
        config: {},
        users: undefined,
        resources: undefined,
      }),
    ]);

    await expect(
      client.getPermissionScopes(token, (await permission).id)
    ).resolves.toEqual([scope]);

    await expect(
      client.deletePermission(token, (await permission).id)
    ).resolves.toBeUndefined();

    await expect(
      client.deletePolicy(token, policy.id)
    ).resolves.toBeUndefined();

    await expect(
      client.deleteResource(token, resource._id)
    ).resolves.toBeUndefined();

    await expect(client.deleteScope(token, scope.id)).resolves.toBeUndefined();
  });

  it("evaluates permissions", async () => {
    const scope1 = await client.createScope(token, {
      name: `scope-${rand()}`,
    });

    const policy1 = await client.createPolicy(token, {
      type: "user",
      name: `policy-${rand()}`,
      logic: Logic.POSITIVE,
      decisionStrategy: DecisionStrategy.UNANIMOUS,
      config: {
        users: JSON.stringify([JOHN_DOE_ID]),
      },
    });

    const resource1 = await client.createResource(token, {
      name: `resource-${rand()}`,
      scopes: [scope1],
    });

    const permission1 = await client.createPermission(token, {
      type: "scope",
      name: `permission-${rand()}`,
      decisionStrategy: DecisionStrategy.UNANIMOUS,
      scopes: [scope1.id],
      resources: [resource1._id],
      policies: [policy1.id],
    });

    const resource2 = await client.createResource(token, {
      name: `resource-${rand()}`,
    });

    await expect(
      client.evaluate(token, {
        resources: [resource1],
        userId: JOHN_DOE_ID,
        context: {},
        entitlements: false,
        roleIds: [],
      })
    ).resolves.toMatchObject({
      results: expect.arrayContaining([
        expect.objectContaining({
          status: "PERMIT",
        }),
      ]),
      status: "PERMIT",
    });

    await expect(
      client.evaluate(token, {
        resources: [resource2],
        userId: JOHN_DOE_ID,
        context: {},
        entitlements: false,
        roleIds: [],
      })
    ).resolves.toMatchObject({
      results: [],
      status: "PERMIT",
    });

    await client.deletePermission(token, permission1.id);
    await client.deletePolicy(token, policy1.id);
    await client.deleteResource(token, resource1._id);
    await client.deleteScope(token, scope1.id);
    await client.deleteResource(token, resource2._id);
  });
});
