export const TICKETS = {
  individual: { label: "Individual", price: 25, quantity: 1 },
  casadinha: { label: "Casadinha", price: 40, quantity: 2 }
} as const;
export type TicketKind = keyof typeof TICKETS;
export function isTicketKind(value: unknown): value is TicketKind {
  return value === "individual" || value === "casadinha";
}
