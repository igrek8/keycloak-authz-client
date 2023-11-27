// Common

/**
 * The decision strategy dictates how the policies associated with a given policy are evaluated and how a final decision is obtained.
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/representations/idm/authorization/Logic.html
 */
export enum Logic {
  /**
   * Defines that this policy uses a logical negation. In other words, the final decision would be a negative of the policy outcome.
   */
  NEGATIVE = "NEGATIVE",
  /**
   * Defines that this policy follows a positive logic. In other words, the final decision is the policy outcome.
   */
  POSITIVE = "POSITIVE",
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/authorization/Decision.Effect.html
 */
export enum DecisionEffect {
  DENY = "DENY",
  PERMIT = "PERMIT",
}

/**
 * The decision strategy dictates how the policies associated with a given policy are evaluated and how a final decision is obtained.
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/representations/idm/authorization/DecisionStrategy.html
 */
export enum DecisionStrategy {
  /**
   * Defines that at least one policy must evaluate to a positive decision in order to the overall decision be also positive.
   */
  AFFIRMATIVE = "AFFIRMATIVE",
  /**
   * Defines that the number of positive decisions must be greater than the number of negative decisions.
   */
  CONSENSUS = "CONSENSUS",
  /**
   * Defines that all policies must evaluate to a positive decision in order to the overall decision be also positive.
   */
  UNANIMOUS = "UNANIMOUS",
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/representations/idm/authorization/ResourceOwnerRepresentation.html
 */
export interface ResourceOwner {
  id: string;
  name: string;
}

/**
 * One or more resources that the resource server manages as a set of protected resources.
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/representations/idm/authorization/ResourceRepresentation.html
 */
export interface Resource {
  _id: string;
  /**
   * A human-readable string describing a set of one or more resources
   */
  name: string;
  displayName?: string;
  /**
   * A string uniquely identifying the semantics of the resource set
   */
  type?: string;
  /**
   * The available scopes for this resource set
   */
  scopes?: Scope[];
  attributes?: Record<string, string[]>;
  owner?: ResourceOwner;
  ownerManagedAccess?: boolean;
  /**
   * A list of URI that provides the network location for the resource set being registered
   */
  uris?: string[];
  icon_uri?: string;
}

/**
 * Represents a scope, which is usually associated with one or more resources in order to define the actions that can be performed or a specific access context.
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/authorization/model/Scope.html
 */
export interface Scope {
  /**
   * The unique identifier for this instance
   */
  id: string;
  /**
   * The name of this scope
   */
  name: string;
  /**
   * The friendly name for this scope
   */
  displayName?: string;
  /**
   * A uri for an icon
   */
  iconUri?: string;
}

/**
 * Represents an authorization policy and all the configuration associated with it.
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/authorization/model/Policy.html
 */
export interface Policy {
  /**
   * The unique identifier for this instance
   */
  id: string;
  /**
   * The type of this policy
   */
  name: string;
  /**
   * Description of this policy.
   */
  description?: string;
  /**
   * Type of this policy.
   */
  type?: string;
  /**
   * Logic for this policy.
   */
  logic: Logic;
  /**
   * DecisionStrategy for this policy.
   */
  decisionStrategy: DecisionStrategy;
  /**
   * Returns a Map holding string-based key/value pairs representing any additional configuration for this policy.
   */
  config: Record<string, string>;
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/representations/idm/authorization/ResourcePermissionRepresentation.html
 */
export interface ResourcePermission {
  id: string;
  name: string;
  description?: string;
  type: "resource";
  resources: string[];
  resourceType?: string;
  policies?: string[];
  decisionStrategy?: DecisionStrategy;
  config?: Record<string, string>;
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/representations/idm/authorization/ScopePermissionRepresentation.html
 */
export interface ScopePermission {
  id: string;
  name: string;
  description?: string;
  type: "scope";
  scopes: string[];
  resources?: string[];
  resourceType?: string;
  policies?: string[];
  decisionStrategy?: DecisionStrategy;
  config?: Record<string, string>;
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/representations/idm/authorization/PolicyEvaluationRequest.html
 */
export interface PolicyEvaluationRequest {
  userId: string;
  roleIds: string[];
  resources: Resource[];
  entitlements: boolean;
  context: Record<string, Record<string, string>>;
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/representations/idm/authorization/PolicyEvaluationResponse.html
 */
export interface PolicyEvaluationResponse {
  entitlements: boolean;
  results: EvaluationResult[];
  rpt: AccessToken;
  status: DecisionEffect;
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/representations/AccessToken.html
 */
export interface AccessToken {
  exp: number;
  iat: number;
  jti: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  "allowed-origins": string[];
  realm_access: Access;
  resource_access: Record<string, Access>;
  authorization: Authorization;
  scope: string;
  sid: string;
  email_verified: boolean;
  preferred_username: string;
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/representations/AccessToken.Access.html
 */
export interface Access {
  roles: string[];
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/representations/idm/authorization/Permission.html
 */
export interface Permission {
  claims: Record<string, string[]>;
  rsid: string;
  rsname: string;
  scopes: string[];
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/representations/AccessToken.Authorization.html
 */
export interface Authorization {
  permissions: Permission[];
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/representations/idm/authorization/PolicyEvaluationResponse.EvaluationResultRepresentation.html
 */
export interface EvaluationResult {
  allowedScopes: Scope[];
  policies: Policy[];
  resource: Resource;
  scopes: Scope[];
  status: DecisionEffect;
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/representations/idm/authorization/PolicyEvaluationResponse.PolicyResultRepresentation.html
 */
export interface PolicyResult {
  associatedPolicies: PolicyResult[];
  policy: ResourcePermission | ScopePermission | Policy;
  scopes: string[];
  status: DecisionEffect;
}

interface Pagination {
  first?: number;
  max?: number;
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/authorization/model/Resource.FilterOption.html
 */
export interface ResourceSearchableFields extends Pagination {
  name?: string;
  type?: string;
  scope?: string;
  owner?: string;
  uri?: string;
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/authorization/model/Scope.FilterOption.html
 */
export interface ScopeFilterOptions extends Pagination {
  name?: string;
}

/**
 * @see https://www.keycloak.org/docs-api/23.0.0/javadocs/org/keycloak/authorization/model/Policy.FilterOption.html
 */
export interface PolicyFilterOptions extends Pagination {
  name?: string;
  type?: string;
  scope?: string;
  resource?: string;
  permission?: boolean;
}

export interface PermissionFilterOptions extends Pagination {
  name?: string;
  type?: "resource" | "scope";
  scope?: string;
  resource?: string;
}
