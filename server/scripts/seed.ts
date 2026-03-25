/**
 * seed.ts — Populate the database with sample categories, events, year stats
 *
 * Usage: bun run server/scripts/seed.ts
 */

import mongoose from "mongoose";
import { connectDB } from "../config/db.ts";
import { Category } from "../models/Category.ts";
import { Event } from "../models/Event.ts";
import { Year } from "../models/Year.ts";
import { ReactionType } from "../models/ReactionType.ts";

await connectDB();

/* ── Helpers ── */

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

/* ── Image pool ── */
const IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBmAR2F1RufVlyGWUILlIlZV3Wa2TeNCaqcIgNc7IXA59ca-HijSv6QAeiNn3rTq9gD7g_xJXOhMw5zK6UFkwJ-3GOarh4ZebzNmgenRbir32BycxUPaq83wh0heGkJFOUHUDehgTrvJZWvTiUidzh1VwW8v-hfyGt5TgIqSWbB2_03z-A00wkeOltfksTDJDo7t6aoa7koCmyKkXrirya0xXBhGG-L5yD-wtTgKECUnFVwXUXvQXSIq6ZEvXfhqJYyT_d1ABwy-Kfo",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDASTFOKT4GU4QgoEbCyzeAcijsEpBqC6zv2-SjD1o_4O6zTHiXkIXeG20W0Aou_UcZFr7j1mmYAm70ncAGUgDkDX7eX4zZ_HNwxhOO5EsHuBYEYm0x7VAJIpyRA1NRhHQPOuT7CUbghnjkpwcLa4sQUnye2YpXXjwm6wInqXzhI6pD3h7wMlo2O16LnDt1zBS2Wrrz9pBZCvueW0_D7zzTC_7jnqeeSP5zSMUgdhvhiKNzt3-Sth0ZhL1iXHxgwPRzo5NRnc_Fqp1J",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCz5B3k5MTLo5Rv4XxjBvs_BnYywzeKiQbyeiqclqYzBvBxU7gXDP-7KM2mOgGNdBVelzhJgbSOGwf5La3JVWtF2YEnyv9j6IfJVfGO4hbr2ZZui4cNkSC2ldq6cO4-pjhtiPCO0r-huZQM_-b-dGzEFUHQjIq9TQvZG4K_qpFhcwkB8Zo2vvmBzStKVBfBHcCGePRxK-ndqrXf8NI0048Bl6zh8sVI2PvQP4xdrlPSBc4GxcOMol4hNcFxlpXaW9IrqcKZiWSCGItO",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD2ZLoc3Q3E4wyqKtHFMRtch3KSRTAkll7GZJezf6ZsvWTLQd87FyGD1W5m-0Pqwux4lQ7pCAQsqWA8HIcq_yF3jOV8OIYDK1dktZUtENga6JzGSeOOc1GA4ZHpTSTWmJK1sI2fWPco4CDvU9uQsEy0iNzPG2OO_s-3PxZgXPtQrvag5YUf7U0mCtEgwmAls_tNp4yCRTvq8fCVi8l8k27-okBuLq-we5ko99ZSdCwzCaaFjNxjfZG0hKHu6tw1k37u97wrQGzld2FA",
];

/* ── Categories ── */

const CATEGORY_DEFS = [
  { name: "Âm nhạc", icon: "music_note", color: "#e9c176", order: 1 },
  { name: "Điện ảnh", icon: "movie", color: "#71d7cd", order: 2 },
  { name: "Văn hóa", icon: "temple_buddhist", color: "#bac3ff", order: 3 },
  { name: "Nghệ thuật", icon: "palette", color: "#ffb4ab", order: 4 },
  { name: "Công nghệ", icon: "memory", color: "#8ef4e9", order: 5 },
  { name: "Thể thao", icon: "sports_soccer", color: "#ffd700", order: 6 },
  { name: "Giáo dục", icon: "school", color: "#90ee90", order: 7 },
  { name: "Kiến trúc", icon: "architecture", color: "#deb887", order: 8 },
  { name: "Xã hội", icon: "groups", color: "#f0e68c", order: 9 },
  { name: "Lịch sử", icon: "history_edu", color: "#c5a059", order: 10 },
];

/* ── Event templates per category slug ── */

const TEMPLATES: Record<string, { titles: string[]; descriptions: string[] }> =
  {
    "am-nhac": {
      titles: [
        "Concert hòa nhạc giao hưởng tại Nhà hát Lớn",
        'Album "Hành Trình Âm Thanh" phát hành',
        "Liên hoan Âm nhạc Quốc tế Việt Nam",
        "Ra mắt single mới đạt triệu view",
        "Hòa nhạc từ thiện gây quỹ phát triển âm nhạc",
        "Lễ trao giải Âm nhạc Cống hiến",
        "Festival nhạc điện tử ngoài trời đầu tiên",
      ],
      descriptions: [
        "Sự kiện âm nhạc đánh dấu bước phát triển mới của nền âm nhạc đương đại Việt Nam.",
        "Một tác phẩm âm nhạc mang đậm bản sắc dân tộc kết hợp xu hướng thế giới.",
        "Buổi hòa nhạc quy tụ các nghệ sĩ hàng đầu trong và ngoài nước.",
        "Ca khúc nhanh chóng trở thành hiện tượng trên các bảng xếp hạng âm nhạc.",
      ],
    },
    "dien-anh": {
      titles: [
        "Phim Việt Nam tranh giải tại LHP quốc tế",
        'Bộ phim "Ánh Sáng" ra mắt công chúng',
        "Kỷ lục phòng vé mới cho phim nội địa",
        "Phim hoạt hình Việt đầu tiên đạt giải quốc tế",
        "Ra mắt phim tài liệu về lịch sử Việt Nam",
        "Đạo diễn Việt được vinh danh tại Cannes",
      ],
      descriptions: [
        "Bộ phim đánh dấu sự phát triển vượt bậc của điện ảnh Việt Nam trên trường quốc tế.",
        "Tác phẩm điện ảnh mang đến góc nhìn mới mẻ về cuộc sống đương đại.",
        "Phim nhận được nhiều lời khen ngợi từ giới phê bình và khán giả.",
      ],
    },
    "van-hoa": {
      titles: [
        "UNESCO công nhận Di sản văn hóa phi vật thể",
        "Lễ hội truyền thống được phục dựng",
        "Triển lãm văn hóa Việt-Nhật tại Hà Nội",
        "Ngày hội Văn hóa các dân tộc Việt Nam",
        "Festival Áo dài Quốc tế lần đầu tiên",
        "Tuần lễ Văn hóa Việt Nam tại Paris",
      ],
      descriptions: [
        "Sự kiện góp phần bảo tồn và phát huy giá trị văn hóa truyền thống Việt Nam.",
        "Hoạt động văn hóa kết nối cộng đồng và gìn giữ di sản dân tộc.",
        "Một bước tiến quan trọng trong việc quảng bá văn hóa Việt ra thế giới.",
      ],
    },
    "nghe-thuat": {
      titles: [
        "Triển lãm tranh đương đại quy mô lớn",
        "Nghệ sĩ Việt trưng bày tại Venice Biennale",
        "Lễ hội Nghệ thuật đường phố đầu tiên",
        "Triển lãm nghệ thuật số và trí tuệ nhân tạo",
        "Nghệ sĩ trẻ Việt đoạt giải Art Basel",
      ],
      descriptions: [
        "Tác phẩm nghệ thuật mang đến góc nhìn mới mẻ và táo bạo về hiện thực.",
        "Sự kiện nghệ thuật kết nối các nghệ sĩ trong khu vực và quốc tế.",
        "Nghệ thuật đương đại Việt Nam tiếp tục ghi dấu ấn trên bản đồ thế giới.",
      ],
    },
    "cong-nghe": {
      titles: [
        "Startup Việt gọi vốn thành công triệu đô",
        "Ra mắt ứng dụng AI Made in Vietnam",
        "Chip bán dẫn đầu tiên sản xuất tại Việt Nam",
        "Việt Nam vào Top 10 quốc gia chuyển đổi số",
        "Robot AI phục vụ nhà hàng đầu tiên tại Hà Nội",
      ],
      descriptions: [
        "Cột mốc quan trọng đánh dấu vị thế của Việt Nam trên bản đồ công nghệ thế giới.",
        "Sản phẩm công nghệ Việt nhận được sự đón nhận tích cực từ thị trường.",
        "Bước đột phá mở ra kỷ nguyên mới cho ngành công nghệ nước nhà.",
      ],
    },
    "the-thao": {
      titles: [
        "Đội tuyển Việt Nam vào vòng chung kết World Cup",
        "VĐV Việt Nam giành HCV Olympic",
        "SEA Games tổ chức tại Việt Nam",
        "Ra mắt giải eSports chuyên nghiệp đầu tiên",
        "Đội tuyển nữ Việt Nam vô địch châu Á",
      ],
      descriptions: [
        "Thành tích thể thao đánh dấu bước phát triển ngoạn mục của thể thao Việt Nam.",
        "Sự kiện thể thao thu hút sự chú ý từ hàng triệu người hâm mộ.",
        "Chiến thắng lịch sử, ghi tên Việt Nam trên đấu trường quốc tế.",
      ],
    },
    "giao-duc": {
      titles: [
        "Đại học Việt Nam lọt Top 500 thế giới",
        "Chương trình đào tạo AI đầu tiên cho học sinh",
        "Học sinh Việt đoạt giải Olympiad Toán quốc tế",
        "Ra mắt nền tảng giáo dục trực tuyến quốc gia",
      ],
      descriptions: [
        "Thành tựu giáo dục góp phần nâng cao chất lượng nguồn nhân lực quốc gia.",
        "Sáng kiến giáo dục mở ra cơ hội mới cho thế hệ trẻ Việt Nam.",
        "Bước tiến quan trọng trong hiện đại hóa hệ thống giáo dục nước nhà.",
      ],
    },
    "kien-truc": {
      titles: [
        "Tòa nhà xanh đạt chứng nhận LEED Platinum",
        "Công trình kiến trúc Việt đoạt giải quốc tế",
        "Khu đô thị thông minh đầu tiên khai trương",
        "Phục dựng di tích kiến trúc cổ Hội An",
      ],
      descriptions: [
        "Công trình kiến trúc thể hiện sự kết hợp hài hòa giữa truyền thống và hiện đại.",
        "Thiết kế sáng tạo nhận được đánh giá cao từ giới chuyên gia.",
        "Dự án đánh dấu xu hướng phát triển bền vững trong kiến trúc Việt Nam.",
      ],
    },
    "xa-hoi": {
      titles: [
        "Chính sách mới hỗ trợ thanh niên khởi nghiệp",
        "Chương trình xóa đói giảm nghèo đạt mức kỷ lục",
        "Dự án cộng đồng giúp đỡ vùng sâu vùng xa",
        "Phong trào tình nguyện quy mô toàn quốc",
      ],
      descriptions: [
        "Chương trình xã hội mang lại lợi ích thiết thực cho cộng đồng.",
        "Nỗ lực chung tay xây dựng xã hội công bằng và phát triển bền vững.",
        "Hoạt động xã hội thu hút sự tham gia tích cực của mọi tầng lớp nhân dân.",
      ],
    },
    "lich-su": {
      titles: [
        "Kỷ niệm ngày thống nhất đất nước",
        "Phát hiện di tích khảo cổ mới tại Thăng Long",
        "Triển lãm tư liệu lịch sử chiến tranh",
        "Ra mắt bộ sách lịch sử Việt Nam toàn tập",
      ],
      descriptions: [
        "Sự kiện lịch sử quan trọng được tưởng nhớ và vinh danh.",
        "Phát hiện khảo cổ mở ra hiểu biết mới về lịch sử dân tộc.",
        "Tư liệu quý giá về những trang sử hào hùng của Việt Nam.",
      ],
    },
  };

/* ── Seed ── */

async function seed() {
  console.log("[seed] Clearing existing data...");
  await Promise.all([
    Category.deleteMany({}),
    Event.deleteMany({}),
    Year.deleteMany({}),
    ReactionType.deleteMany({}),
  ]);

  // 1. Seed categories
  console.log("[seed] Creating categories...");
  const categories = await Category.insertMany(
    CATEGORY_DEFS.map((c) => ({
      name: c.name,
      slug: slugify(c.name),
      description: `Sự kiện ${c.name.toLowerCase()} tại Việt Nam`,
      icon: c.icon,
      color: c.color,
      order: c.order,
      isActive: true,
      eventCount: 0,
    })),
  );

  const catSlugs = categories.map((c) => c.slug);

  // 2. Seed reaction types
  console.log("[seed] Creating reaction types...");
  await ReactionType.insertMany([
    {
      name: "like",
      icon: "thumb_up",
      label: "Thích",
      color: "#71d7cd",
      order: 1,
      isActive: true,
    },
    {
      name: "love",
      icon: "favorite",
      label: "Yêu thích",
      color: "#ffb4ab",
      order: 2,
      isActive: true,
    },
    {
      name: "sad",
      icon: "sentiment_sad",
      label: "Buồn",
      color: "#bac3ff",
      order: 3,
      isActive: true,
    },
    {
      name: "wow",
      icon: "emoji_objects",
      label: "Ngạc nhiên",
      color: "#ffd700",
      order: 4,
      isActive: true,
    },
    {
      name: "angry",
      icon: "sentiment_very_dissatisfied",
      label: "Phẫn nộ",
      color: "#ff6b6b",
      order: 5,
      isActive: true,
    },
  ]);

  // 3. Seed events across years (2026 → 2000)
  console.log("[seed] Creating events...");
  const events: Array<Record<string, unknown>> = [];
  const yearCounts: Record<number, number> = {};
  const catCounts: Record<string, number> = {};

  for (let year = 2026; year >= 2000; year--) {
    const catIdx = (2026 - year) % catSlugs.length;
    const catSlug = catSlugs[catIdx];
    const templates = TEMPLATES[catSlug] ?? TEMPLATES["am-nhac"];

    const eventCount = randInt(4, 8);
    yearCounts[year] = (yearCounts[year] ?? 0) + eventCount;
    catCounts[catSlug] = (catCounts[catSlug] ?? 0) + eventCount;

    for (let i = 0; i < eventCount; i++) {
      const title = pick(templates.titles);
      const desc = pick(templates.descriptions);
      const month = randInt(0, 11);
      const day = randInt(1, 28);
      const date = new Date(year, month, day);

      const score = randInt(0, 100);
      events.push({
        title,
        slug: slugify(title) + `-${year}-${i}`,
        description: desc,
        date,
        image: pick(IMAGES),
        category: catSlug,
        country: "Việt Nam",
        eventType: "event",
        status: rand() > 0.25 ? "verified" : "pending",
        visibility: "public",
        createdBy: new mongoose.Types.ObjectId(), // placeholder
        contributors: [],
        sources: [],
        metadata: [],
        baseScore: score,
        engagementScore: randInt(0, 50),
        score: score + randInt(0, 50),
        reactionCounts: [
          { type: "like", count: randInt(10, 5000) },
          { type: "love", count: randInt(5, 3000) },
          { type: "sad", count: randInt(0, 100) },
        ],
        commentCount: randInt(0, 500),
        viewCount: randInt(100, 50000),
        currentVersion: 1,
        media: [],
        tags: [],
      });
    }
  }

  await Event.insertMany(events);

  // 4. Seed year stats
  console.log("[seed] Creating year stats...");
  const yearDocs = Object.entries(yearCounts).map(([year, count]) => ({
    year: Number(year),
    eventCount: count,
  }));
  await Year.insertMany(yearDocs);

  // 5. Update category event counts
  console.log("[seed] Updating category counts...");
  for (const [slug, count] of Object.entries(catCounts)) {
    await Category.updateOne({ slug }, { $set: { eventCount: count } });
  }

  const totalEvents = events.length;
  const totalYears = Object.keys(yearCounts).length;
  console.log(
    `[seed] Done! Created ${categories.length} categories, ${totalEvents} events across ${totalYears} years.`,
  );

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[seed] Error:", err);
  process.exit(1);
});
