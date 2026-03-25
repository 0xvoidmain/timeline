import { YearStat } from "../models/YearStat.ts";

export const yearRoutes = {
  "/api/years": {
    // GET — list year stats with event counts
    GET: async () => {
      const years = await YearStat.find({ eventCount: { $gt: 0 } }).sort({
        year: -1,
      });
      return Response.json({ years });
    },
  },
} as const;
