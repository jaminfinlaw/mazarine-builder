import type { DockBoxConfig } from "@/lib/configuration";

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
}

export async function submitCustomBuild(
  config: DockBoxConfig,
  customerInfo: CustomerInfo,
) {
  return {
    ok: true,
    status: "mocked",
    submittedAt: new Date().toISOString(),
    config,
    customerInfo,
    message: "This submission is mocked and ready for MAZARINE OPS integration.",
  };
}
