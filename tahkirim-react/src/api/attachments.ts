import type { ApiAttachment } from "../types/api";
import { API_BASE, http } from "./http";

export const attachmentsApi = {
  upload: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return http.post<ApiAttachment>("/attachments", fd);
  },
  url: (id: string) => `${API_BASE}/attachments/${id}`,
};
