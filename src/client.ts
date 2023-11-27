import { ResponseError } from "./response-error";
import {
  PermissionFilterOptions,
  Policy,
  PolicyEvaluationRequest,
  PolicyEvaluationResponse,
  PolicyFilterOptions,
  Resource,
  ResourcePermission,
  ResourceSearchableFields,
  Scope,
  ScopeFilterOptions,
  ScopePermission,
} from "./types";

export interface ClientOptions {
  baseUrl: string;
  realm: string;
  id: string;
}

export class Client {
  private baseUrl: string;

  constructor({ baseUrl, realm, id }: ClientOptions) {
    this.baseUrl = `${baseUrl}/admin/realms/${realm}/clients/${id}/authz/resource-server`;
  }

  async createResource(
    token: string,
    newResource: Omit<Resource, "_id">
  ): Promise<Resource> {
    const res = await fetch(`${this.baseUrl}/resource`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newResource),
    });
    if (res.status === 201) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async updateResource(
    token: string,
    updatedResource: Resource
  ): Promise<void> {
    const res = await fetch(`${this.baseUrl}/resource/${updatedResource._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedResource),
    });
    if (res.status === 204) {
      return;
    }
    throw new ResponseError(res);
  }

  async searchResources(
    token: string,
    query?: ResourceSearchableFields
  ): Promise<Resource[]> {
    const url = new URL(`${this.baseUrl}/resource`);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async getResource(token: string, id: string): Promise<Resource> {
    const res = await fetch(`${this.baseUrl}/resource/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async deleteResource(token: string, id: string) {
    const res = await fetch(`${this.baseUrl}/resource/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 204) {
      return;
    }
    throw new ResponseError(res);
  }

  async createScope(
    token: string,
    newScope: Omit<Scope, "id">
  ): Promise<Scope> {
    const res = await fetch(`${this.baseUrl}/scope`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newScope),
    });
    if (res.status === 201) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async updateScope(token: string, updatedScope: Scope): Promise<void> {
    const res = await fetch(`${this.baseUrl}/scope/${updatedScope.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedScope),
    });
    if (res.status === 204) {
      return;
    }
    throw new ResponseError(res);
  }

  async searchScopes(
    token: string,
    query?: ScopeFilterOptions
  ): Promise<Scope[]> {
    const url = new URL(`${this.baseUrl}/scope`);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async getScope(token: string, id: string): Promise<Scope> {
    const res = await fetch(`${this.baseUrl}/scope/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async deleteScope(token: string, id: string) {
    const res = await fetch(`${this.baseUrl}/scope/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 204) {
      return;
    }
    throw new ResponseError(res);
  }

  async createPolicy(
    token: string,
    newPolicy: Omit<Policy, "id">
  ): Promise<Policy> {
    const res = await fetch(`${this.baseUrl}/policy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPolicy),
    });
    if (res.status === 201) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async updatePolicy(token: string, updatedPolicy: Policy): Promise<void> {
    const res = await fetch(`${this.baseUrl}/policy/${updatedPolicy.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedPolicy),
    });
    if (res.status === 201) {
      return;
    }
    throw new ResponseError(res);
  }

  async getPolicy(token: string, id: string): Promise<Policy> {
    const res = await fetch(`${this.baseUrl}/policy/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async deletePolicy(token: string, id: string) {
    const res = await fetch(`${this.baseUrl}/policy/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 204) {
      return;
    }
    throw new ResponseError(res);
  }

  async searchPolicies(
    token: string,
    query: PolicyFilterOptions
  ): Promise<Policy[]> {
    const url = new URL(`${this.baseUrl}/policy`);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async createPermission(
    token: string,
    newPermission: Omit<ResourcePermission, "id"> | Omit<ScopePermission, "id">
  ): Promise<ResourcePermission | ScopePermission> {
    const res = await fetch(`${this.baseUrl}/permission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPermission),
    });
    if (res.status === 201) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async updatePermission(
    token: string,
    updatedPermission: ResourcePermission | ScopePermission
  ): Promise<void> {
    const res = await fetch(`${this.baseUrl}/policy/${updatedPermission.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedPermission),
    });
    if (res.status === 201) {
      return;
    }
    throw new ResponseError(res);
  }

  async searchPermissions(
    token: string,
    query: PermissionFilterOptions
  ): Promise<ResourcePermission | ScopePermission[]> {
    const url = new URL(`${this.baseUrl}/permission`);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async getPermission(token: string, id: string): Promise<ResourcePermission> {
    const res = await fetch(`${this.baseUrl}/permission/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async deletePermission(token: string, id: string) {
    const res = await fetch(`${this.baseUrl}/permission/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 204) {
      return;
    }
    throw new ResponseError(res);
  }

  /**
   * Returns the Policy instances associated with this policy and used to evaluate authorization decisions when this policy applies.
   */
  async getPermissionPolicies(
    token: string,
    permissionId: string
  ): Promise<Policy[]> {
    const res = await fetch(
      `${this.baseUrl}/policy/${permissionId}/associatedPolicies`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.status === 200) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async getPermissionScopes(
    token: string,
    permissionId: string
  ): Promise<Scope[]> {
    const res = await fetch(`${this.baseUrl}/policy/${permissionId}/scopes`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async getPermissionResources(
    token: string,
    permissionId: string
  ): Promise<Resource[]> {
    const res = await fetch(
      `${this.baseUrl}/policy/${permissionId}/resources`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.status === 200) {
      return res.json();
    }
    throw new ResponseError(res);
  }

  async evaluate(
    token: string,
    newEvaluate: PolicyEvaluationRequest
  ): Promise<PolicyEvaluationResponse> {
    const res = await fetch(`${this.baseUrl}/policy/evaluate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newEvaluate),
    });
    if (res.status === 200) {
      return res.json();
    }
    throw new ResponseError(res);
  }
}
