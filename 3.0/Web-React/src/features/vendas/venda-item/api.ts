import http from "../../../shared/api/http";
import type { VendaItem } from "./types";

export const vendaItemApi = {
  getByVenda: (idVenda: number) =>
    http
      .get<VendaItem[]>(`/venda-item/venda?id_venda=${idVenda}`)
      .then((r) => r.data),
  create: (data: Record<string, unknown>) =>
    http.post<VendaItem>("/venda-item", data).then((r) => r.data),
  delete: (id: number) => http.delete(`/venda-item/${id}`).then((r) => r.data),
};
