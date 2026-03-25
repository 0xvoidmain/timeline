import { Year } from "../models/Year.ts";

export const yearRoutes = {
  "/api/years": {
    // GET — list years with event counts
    GET: async () => {
      const years = await Year.find({ eventCount: { $gt: 0 } }).sort({
        year: -1,
      });
      return Response.json({ years });
    },
  },
} as const;
