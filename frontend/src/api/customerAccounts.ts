import type { components, paths } from "./generated/openapi";

export type CustomerAccountDto = components["schemas"]["CustomerAccount"];
export type CustomerContactDto = components["schemas"]["CustomerContact"];
export type CustomerAddressDto = components["schemas"]["CustomerAddress"];
export type CustomerExternalReferenceDto =
  components["schemas"]["CustomerExternalReference"];
export type CustomerClassificationDto =
  components["schemas"]["CustomerClassification"];
export type AccountRelationshipDto =
  components["schemas"]["AccountRelationship"];
export type BusinessAccountProfileDto =
  components["schemas"]["BusinessAccountProfile"];
export type PersonAccountProfileDto =
  components["schemas"]["PersonAccountProfile"];
export type AccountHierarchyNodeDto =
  components["schemas"]["AccountHierarchyNode"];
export type CreateCustomerAccountRequest =
  components["schemas"]["CreateCustomerAccountRequest"];
export type UpdateCustomerAccountRequest =
  components["schemas"]["UpdateCustomerAccountRequest"];
export type ListCustomerAccountsQuery = NonNullable<
  paths["/customer-accounts"]["get"]["parameters"]["query"]
>;

export type AccountKind = CustomerAccountDto["accountKind"];
export type CustomerSegment = CustomerAccountDto["customerSegment"];
export type AccountType = CustomerAccountDto["accountType"];
export type AccountStatus = CustomerAccountDto["status"];
export type RecordStatus = NonNullable<CustomerContactDto["status"]>;
export type AddressType = CustomerAddressDto["addressType"];
export type ContactRole = NonNullable<CustomerContactDto["contactRole"]>;
export type ClassificationType =
  CustomerClassificationDto["classificationType"];
export type AccountRelationshipType =
  AccountRelationshipDto["relationshipType"];

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function toSearchParams(query: ListCustomerAccountsQuery) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  return params.toString();
}

export const customerAccountsApi = {
  list(query: ListCustomerAccountsQuery) {
    const search = toSearchParams(query);
    return request<CustomerAccountDto[]>(
      `/customer-accounts${search ? `?${search}` : ""}`,
    );
  },
  create(body: CreateCustomerAccountRequest) {
    return request<CustomerAccountDto>("/customer-accounts", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  update(id: string, body: UpdateCustomerAccountRequest) {
    return request<CustomerAccountDto>(`/customer-accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },
  updateStatus(id: string, status: AccountStatus) {
    return request<CustomerAccountDto>(`/customer-accounts/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  findByCode(customerCode: string) {
    return request<CustomerAccountDto>(
      `/customer-accounts/by-code/${customerCode}`,
    );
  },
  hierarchy(id: string) {
    return request<AccountHierarchyNodeDto>(
      `/customer-accounts/${id}/hierarchy`,
    );
  },
};
