export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const payments: Payment[] = [
  { id: "728ed52f", amount: 100, status: "pending", email: "m@example.com" },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  { id: "a1b2c3d4", amount: 316, status: "success", email: "ken99@example.com" },
  { id: "b2c3d4e5", amount: 242, status: "success", email: "Abe45@example.com" },
  {
    id: "c3d4e5f6",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  { id: "d4e5f6a7", amount: 874, status: "success", email: "Silas22@example.com" },
  {
    id: "e5f6a7b8",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
  { id: "f6a7b8c9", amount: 450, status: "pending", email: "sara@example.com" },
  { id: "a7b8c9d0", amount: 199, status: "success", email: "leo@example.com" },
  {
    id: "b8c9d0e1",
    amount: 560,
    status: "processing",
    email: "nina@example.com",
  },
  { id: "c9d0e1f2", amount: 88, status: "failed", email: "omar@example.com" },
  { id: "d0e1f2a3", amount: 1020, status: "success", email: "priya@example.com" },
]
