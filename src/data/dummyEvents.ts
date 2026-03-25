/* dummyEvents — Year-grouped event data for the timeline (2026 → 2000) */

import type { EventCardData } from "../components/EventCard";

/* ── Types ── */

export interface YearGroup {
  year: number;
  category: string;
  categoryEn: string;
  events: EventCardData[];
  featuredEvent?: EventCardData;
}

export type VirtualRow =
  | { type: "year-header"; year: number; category: string; categoryEn: string }
  | { type: "event-row"; events: EventCardData[] }
  | { type: "featured"; event: EventCardData };

/* ── Image pool (cycle through) ── */
const IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBmAR2F1RufVlyGWUILlIlZV3Wa2TeNCaqcIgNc7IXA59ca-HijSv6QAeiNn3rTq9gD7g_xJXOhMw5zK6UFkwJ-3GOarh4ZebzNmgenRbir32BycxUPaq83wh0heGkJFOUHUDehgTrvJZWvTiUidzh1VwW8v-hfyGt5TgIqSWbB2_03z-A00wkeOltfksTDJDo7t6aoa7koCmyKkXrirya0xXBhGG-L5yD-wtTgKECUnFVwXUXvQXSIq6ZEvXfhqJYyT_d1ABwy-Kfo",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDASTFOKT4GU4QgoEbCyzeAcijsEpBqC6zv2-SjD1o_4O6zTHiXkIXeG20W0Aou_UcZFr7j1mmYAm70ncAGUgDkDX7eX4zZ_HNwxhOO5EsHuBYEYm0x7VAJIpyRA1NRhHQPOuT7CUbghnjkpwcLa4sQUnye2YpXXjwm6wInqXzhI6pD3h7wMlo2O16LnDt1zBS2Wrrz9pBZCvueW0_D7zzTC_7jnqeeSP5zSMUgdhvhiKNzt3-Sth0ZhL1iXHxgwPRzo5NRnc_Fqp1J",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCz5B3k5MTLo5Rv4XxjBvs_BnYywzeKiQbyeiqclqYzBvBxU7gXDP-7KM2mOgGNdBVelzhJgbSOGwf5La3JVWtF2YEnyv9j6IfJVfGO4hbr2ZZui4cNkSC2ldq6cO4-pjhtiPCO0r-huZQM_-b-dGzEFUHQjIq9TQvZG4K_qpFhcwkB8Zo2vvmBzStKVBfBHcCGePRxK-ndqrXf8NI0048Bl6zh8sVI2PvQP4xdrlPSBc4GxcOMol4hNcFxlpXaW9IrqcKZiWSCGItO",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD2ZLoc3Q3E4wyqKtHFMRtch3KSRTAkll7GZJezf6ZsvWTLQd87FyGD1W5m-0Pqwux4lQ7pCAQsqWA8HIcq_yF3jOV8OIYDK1dktZUtENga6JzGSeOOc1GA4ZHpTSTWmJK1sI2fWPco4CDvU9uQsEy0iNzPG2OO_s-3PxZgXPtQrvag5YUf7U0mCtEgwmAls_tNp4yCRTvq8fCVi8l8k27-okBuLq-we5ko99ZSdCwzCaaFjNxjfZG0hKHu6tw1k37u97wrQGzld2FA",
];

/* ── Category rotation ── */
const CATEGORIES: { vi: string; en: string }[] = [
  { vi: "Âm Nhạc", en: "Music" },
  { vi: "Điện Ảnh", en: "Cinema" },
  { vi: "Văn Hóa", en: "Culture" },
  { vi: "Nghệ Thuật", en: "Art" },
  { vi: "Công Nghệ", en: "Technology" },
  { vi: "Thể Thao", en: "Sports" },
  { vi: "Giáo Dục", en: "Education" },
  { vi: "Kiến Trúc", en: "Architecture" },
  { vi: "Xã Hội", en: "Society" },
];

/* ── Vietnamese month names ── */
const MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

/* ── Event title/description templates per category ── */
const TEMPLATES: Record<string, { titles: string[]; descriptions: string[] }> =
  {
    "Âm Nhạc": {
      titles: [
        "Concert hòa nhạc giao hưởng tại Nhà hát Lớn",
        'Album "Hành Trình Âm Thanh" phát hành',
        "Liên hoan Âm nhạc Quốc tế Việt Nam",
        "Ra mắt single mới đạt triệu view",
        "Hòa nhạc từ thiện gây quỹ phát triển âm nhạc",
        "Ca sĩ Việt Nam lần đầu biểu diễn tại Grammy",
        "Lễ trao giải Âm nhạc Cống hiến",
        "Festival nhạc điện tử ngoài trời đầu tiên",
      ],
      descriptions: [
        "Sự kiện âm nhạc đánh dấu bước phát triển mới của nền âm nhạc đương đại Việt Nam.",
        "Một tác phẩm âm nhạc mang đậm bản sắc dân tộc kết hợp xu hướng thế giới.",
        "Buổi hòa nhạc quy tụ các nghệ sĩ hàng đầu trong và ngoài nước.",
        "Ca khúc nhanh chóng trở thành hiện tượng trên các bảng xếp hạng âm nhạc.",
        "Sự kiện âm nhạc thu hút hàng nghìn khán giả tham dự.",
        "Giai điệu mới mẻ mở ra chương mới cho âm nhạc Việt.",
      ],
    },
    "Điện Ảnh": {
      titles: [
        "Phim Việt Nam tranh giải tại LHP quốc tế",
        'Bộ phim "Ánh Sáng" ra mắt công chúng',
        "Kỷ lục phòng vé mới cho phim nội địa",
        "LHP Việt Nam lần thứ nhất tổ chức",
        "Phim hoạt hình Việt đầu tiên đạt giải quốc tế",
        "Ra mắt phim tài liệu về lịch sử Việt Nam",
        "Đạo diễn Việt được vinh danh tại Cannes",
        "Phim hợp tác quốc tế đầu tiên công chiếu",
      ],
      descriptions: [
        "Bộ phim đánh dấu sự phát triển vượt bậc của điện ảnh Việt Nam trên trường quốc tế.",
        "Tác phẩm điện ảnh mang đến góc nhìn mới mẻ về cuộc sống đương đại.",
        "Phim nhận được nhiều lời khen ngợi từ giới phê bình và khán giả.",
        "Một cột mốc quan trọng trong lịch sử phát triển điện ảnh nước nhà.",
        "Bộ phim thu hút hàng triệu lượt xem trong tuần đầu ra mắt.",
      ],
    },
    "Văn Hóa": {
      titles: [
        "UNESCO công nhận Di sản văn hóa phi vật thể",
        "Lễ hội truyền thống được phục dựng",
        "Triển lãm văn hóa Việt-Nhật tại Hà Nội",
        'Xuất bản sách "Bản sắc Việt" bán chạy nhất',
        "Ngày hội Văn hóa các dân tộc Việt Nam",
        "Khai trương Bảo tàng Văn hóa số",
        "Festival Áo dài Quốc tế lần đầu tiên",
        "Tuần lễ Văn hóa Việt Nam tại Paris",
      ],
      descriptions: [
        "Sự kiện góp phần bảo tồn và phát huy giá trị văn hóa truyền thống Việt Nam.",
        "Hoạt động văn hóa kết nối cộng đồng và gìn giữ di sản dân tộc.",
        "Một bước tiến quan trọng trong việc quảng bá văn hóa Việt ra thế giới.",
        "Sự kiện thu hút sự quan tâm lớn từ cộng đồng trong và ngoài nước.",
        "Nỗ lực bảo tồn di sản văn hóa trong thời đại số hóa.",
      ],
    },
    "Nghệ Thuật": {
      titles: [
        "Triển lãm tranh đương đại quy mô lớn",
        "Nghệ sĩ Việt trưng bày tại Venice Biennale",
        "Lễ hội Nghệ thuật đường phố đầu tiên",
        "Ra mắt bộ sưu tập điêu khắc hiện đại",
        "Triển lãm nghệ thuật số và trí tuệ nhân tạo",
        "Hội chợ Nghệ thuật Quốc tế tại TP.HCM",
        "Khai mạc không gian nghệ thuật cộng đồng",
        "Nghệ sĩ trẻ Việt đoạt giải Art Basel",
      ],
      descriptions: [
        "Tác phẩm nghệ thuật mang đến góc nhìn mới mẻ và táo bạo về hiện thực.",
        "Sự kiện nghệ thuật kết nối các nghệ sĩ trong khu vực và quốc tế.",
        "Triển lãm thu hút đông đảo người yêu nghệ thuật đến tham quan.",
        "Nghệ thuật đương đại Việt Nam tiếp tục ghi dấu ấn trên bản đồ thế giới.",
        "Không gian sáng tạo mới mở ra cơ hội cho các nghệ sĩ trẻ.",
      ],
    },
    "Công Nghệ": {
      titles: [
        "Startup Việt gọi vốn thành công triệu đô",
        "Ra mắt ứng dụng AI Made in Vietnam",
        "Hội nghị Công nghệ Việt Nam lần đầu",
        "Chip bán dẫn đầu tiên sản xuất tại Việt Nam",
        "Sàn giao dịch công nghệ số chính thức hoạt động",
        'Ứng dụng "Smart City" triển khai toàn quốc',
        "Việt Nam vào Top 10 quốc gia chuyển đổi số",
        "Robot AI phục vụ nhà hàng đầu tiên tại Hà Nội",
      ],
      descriptions: [
        "Cột mốc quan trọng đánh dấu vị thế của Việt Nam trên bản đồ công nghệ thế giới.",
        "Sản phẩm công nghệ Việt nhận được sự đón nhận tích cực từ thị trường.",
        "Bước đột phá mở ra kỷ nguyên mới cho ngành công nghệ nước nhà.",
        "Giải pháp công nghệ góp phần thay đổi cuộc sống người dân.",
        "Sự kiện thu hút sự quan tâm lớn từ cộng đồng công nghệ quốc tế.",
      ],
    },
    "Thể Thao": {
      titles: [
        "Đội tuyển Việt Nam vào vòng chung kết World Cup",
        "VĐV Việt Nam giành HCV Olympic",
        "SEA Games tổ chức tại Việt Nam",
        "Kỷ lục mới trong giải Marathon quốc tế",
        "Ra mắt giải eSports chuyên nghiệp đầu tiên",
        "Đội tuyển nữ Việt Nam vô địch châu Á",
        "Giải đua xe F1 tại Hà Nội chính thức khai mạc",
        "Phong trào thể thao quần chúng đạt kỷ lục",
      ],
      descriptions: [
        "Thành tích thể thao đánh dấu bước phát triển ngoạn mục của thể thao Việt Nam.",
        "Sự kiện thể thao thu hút sự chú ý từ hàng triệu người hâm mộ.",
        "Chiến thắng lịch sử, ghi tên Việt Nam trên đấu trường quốc tế.",
        "Hoạt động thể thao góp phần nâng cao sức khỏe cộng đồng.",
        "Kết quả xuất sắc khẳng định tiềm năng thể thao nước nhà.",
      ],
    },
    "Giáo Dục": {
      titles: [
        "Đại học Việt Nam lọt Top 500 thế giới",
        "Chương trình đào tạo AI đầu tiên cho học sinh",
        "Quỹ học bổng quốc tế cho sinh viên Việt",
        "Ra mắt nền tảng giáo dục trực tuyến quốc gia",
        "Học sinh Việt đoạt giải Olympiad Toán quốc tế",
        "Khai giảng trường đại học quốc tế tại Đà Nẵng",
        "Chương trình trao đổi học thuật Việt-Mỹ",
        "Hội thảo Giáo dục 4.0 quy mô toàn quốc",
      ],
      descriptions: [
        "Thành tựu giáo dục góp phần nâng cao chất lượng nguồn nhân lực quốc gia.",
        "Sáng kiến giáo dục mở ra cơ hội mới cho thế hệ trẻ Việt Nam.",
        "Chương trình đào tạo đạt chuẩn quốc tế, thu hút đông đảo học viên.",
        "Bước tiến quan trọng trong hiện đại hóa hệ thống giáo dục nước nhà.",
        "Kết quả xuất sắc khẳng định chất lượng giáo dục Việt Nam.",
      ],
    },
    "Kiến Trúc": {
      titles: [
        "Tòa nhà xanh đạt chứng nhận LEED Platinum",
        "Công trình kiến trúc Việt đoạt giải quốc tế",
        "Khu đô thị thông minh đầu tiên khai trương",
        "Phục dựng di tích kiến trúc cổ Hội An",
        "Cầu kính dài nhất Đông Nam Á khánh thành",
        "Bảo tàng kiến trúc bền vững mở cửa",
        "Dự án nhà ở xã hội thiết kế đẹp nhất châu Á",
        "Làng nghề truyền thống được quy hoạch lại",
      ],
      descriptions: [
        "Công trình kiến trúc thể hiện sự kết hợp hài hòa giữa truyền thống và hiện đại.",
        "Thiết kế sáng tạo nhận được đánh giá cao từ giới chuyên gia.",
        "Dự án đánh dấu xu hướng phát triển bền vững trong kiến trúc Việt Nam.",
        "Kiến trúc mới góp phần thay đổi diện mạo đô thị Việt Nam.",
        "Nỗ lực bảo tồn kiến trúc di sản trong quá trình phát triển.",
      ],
    },
    "Xã Hội": {
      titles: [
        "Chính sách mới hỗ trợ thanh niên khởi nghiệp",
        "Chương trình xóa đói giảm nghèo đạt mức kỷ lục",
        "Lễ kỷ niệm 50 năm thống nhất đất nước",
        "Dự án cộng đồng giúp đỡ vùng sâu vùng xa",
        "Tỷ lệ biết chữ đạt mức cao nhất lịch sử",
        "Phong trào tình nguyện quy mô toàn quốc",
        "Ra mắt hệ thống y tế từ xa phủ sóng cả nước",
        "Việt Nam đạt chỉ số phát triển con người cao nhất",
      ],
      descriptions: [
        "Chương trình xã hội mang lại lợi ích thiết thực cho cộng đồng.",
        "Nỗ lực chung tay xây dựng xã hội công bằng và phát triển bền vững.",
        "Hoạt động xã hội thu hút sự tham gia tích cực của mọi tầng lớp nhân dân.",
        "Bước tiến quan trọng trong việc nâng cao chất lượng cuộc sống.",
        "Kết quả đáng tự hào trong phát triển xã hội và con người.",
      ],
    },
  };

/* ── Slugify helper ── */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ── Seeded pseudo-random (deterministic, no Math.random) ── */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Featured event templates ── */
const FEATURED_TEMPLATES: Record<
  string,
  { title: string; description: string }[]
> = {
  "Âm Nhạc": [
    {
      title: 'Album "Hương Xưa" — Tuyển tập nhạc Việt kinh điển',
      description:
        "Bộ sưu tập các ca khúc bất hủ được hòa phối lại với âm thanh đương đại.",
    },
    {
      title: 'Phim tài liệu "Những Năm Tháng Hào Hùng"',
      description:
        "Tuyển tập những thước phim tư liệu quý giá về quá trình phát triển văn hóa nghệ thuật Việt Nam qua các thời kỳ.",
    },
  ],
  "Điện Ảnh": [
    {
      title: "Hồi ký Điện ảnh Việt — 100 năm hành trình",
      description:
        "Tư liệu phim ảnh quý giá ghi lại chặng đường phát triển của nền điện ảnh nước nhà.",
    },
    {
      title: 'Phim tài liệu "Ánh Đèn Sân Khấu"',
      description:
        "Khám phá hậu trường và câu chuyện đằng sau những bộ phim đình đám nhất.",
    },
  ],
  "Văn Hóa": [
    {
      title: "Lưu trữ Quốc gia — Di sản Văn hóa Số",
      description:
        "Kho tư liệu số hóa về di sản văn hóa phi vật thể của Việt Nam.",
    },
  ],
  "Nghệ Thuật": [
    {
      title: "Bộ sưu tập Mỹ thuật Đông Dương",
      description:
        "Các tác phẩm mỹ thuật quý hiếm từ thời kỳ Đông Dương được số hóa và bảo tồn.",
    },
  ],
  "Công Nghệ": [
    {
      title: 'Sách trắng "Chuyển đổi Số Việt Nam"',
      description:
        "Tổng quan toàn diện về quá trình chuyển đổi số và phát triển công nghệ tại Việt Nam.",
    },
  ],
  "Thể Thao": [
    {
      title: "Biên niên sử Thể thao Việt Nam",
      description:
        "Lịch sử phát triển thể thao nước nhà qua các thời kỳ, từ thành lập đến vươn tầm quốc tế.",
    },
  ],
  "Giáo Dục": [
    {
      title: "Tuyển tập Giáo dục Việt Nam qua các thời kỳ",
      description:
        "Tư liệu quý giá về hành trình phát triển giáo dục Việt Nam từ truyền thống đến hiện đại.",
    },
  ],
  "Kiến Trúc": [
    {
      title: "Di sản Kiến trúc Việt Nam — Album ảnh Lịch sử",
      description:
        "Bộ sưu tập ảnh quý về các công trình kiến trúc tiêu biểu qua từng giai đoạn lịch sử.",
    },
  ],
  "Xã Hội": [
    {
      title: 'Phim tài liệu "Đổi Mới — Hành trình 40 năm"',
      description:
        "Câu chuyện về quá trình đổi mới và phát triển xã hội Việt Nam.",
    },
  ],
};

/* ── Existing events (keep IDs 1-4 for dummyEventDetails compat) ── */
const EXISTING_EVENTS: Record<
  number,
  { events: EventCardData[]; featured?: EventCardData }
> = {
  2007: {
    events: [
      {
        id: "1",
        slug: "album-vo-nguoi-ta-phan-manh-quynh",
        category: "music",
        year: 2007,
        image: IMAGES[0],
        date: "15 Tháng 5, 2007",
        title: 'Album "Vợ Người Ta" - Phan Mạnh Quỳnh',
        description:
          "Một cột mốc âm nhạc đại chúng mang âm hưởng dân gian đương đại phối hợp với tiết tấu Pop hiện đại.",
        likes: 1200,
        loves: 840,
        sads: 12,
        comments: 45,
        status: "pending",
      },
    ],
  },
  2010: {
    events: [
      {
        id: "2",
        slug: "phat-hanh-phim-bay-rong",
        category: "cinema",
        year: 2010,
        image: IMAGES[1],
        date: "20 Tháng 9, 2010",
        title: "Phát hành phim 'Bẫy Rồng'",
        description:
          "Bộ phim hành động võ thuật đỉnh cao đánh dấu bước tiến mới của điện ảnh Việt Nam.",
        likes: 3500,
        loves: 2100,
        sads: 5,
        comments: 128,
        status: "verified",
        aspectRatio: "aspect-[4/5]",
      },
    ],
  },
  2014: {
    events: [
      {
        id: "3",
        slug: "son-tung-m-tp-chac-ai-do-se-ve",
        category: "music",
        year: 2014,
        image: IMAGES[2],
        date: "05 Tháng 11, 2014",
        title: 'Sơn Tùng M-TP & "Chắc Ai Đó Sẽ Về"',
        description:
          'Ca khúc chủ đề phim "Chàng Trai Năm Ấy" đã tạo nên một cơn sốt càn quét các bảng xếp hạng âm nhạc trong nước.',
        likes: 15200,
        loves: 10100,
        comments: 842,
        status: "verified",
      },
    ],
    featured: {
      id: "4",
      slug: "phim-tai-lieu-nhung-nam-thang-hao-hung",
      category: "music",
      year: 2014,
      image: IMAGES[3],
      date: "Sưu tầm: Lưu trữ quốc gia",
      title: 'Phim tài liệu "Những Năm Tháng Hào Hùng"',
      description:
        "Tuyển tập những thước phim tư liệu quý giá về quá trình phát triển văn hóa nghệ thuật Việt Nam qua các thời kỳ từ 1945.",
      likes: 0,
      loves: 0,
      comments: 0,
      status: "verified",
    },
  },
};

/* ── Generate events for a single year ── */
function generateYearEvents(
  year: number,
  category: string,
  categoryEn: string,
  rand: () => number,
): { events: EventCardData[]; featured?: EventCardData } {
  const catSlug = categoryEn.toLowerCase();

  // Use existing events for backward compat years
  if (EXISTING_EVENTS[year]) {
    const existing = EXISTING_EVENTS[year];
    // Pad with generated events to reach 5-8 total
    const templates = TEMPLATES[category] ?? TEMPLATES["Âm Nhạc"];
    const needed = Math.floor(rand() * 4) + 5 - existing.events.length;
    const extra: EventCardData[] = [];
    for (let i = 0; i < needed; i++) {
      const tIdx = Math.floor(rand() * templates.titles.length);
      const dIdx = Math.floor(rand() * templates.descriptions.length);
      const month = Math.floor(rand() * 12);
      const day = Math.floor(rand() * 28) + 1;
      const title = templates.titles[tIdx];
      extra.push({
        id: `${year}-${i}`,
        slug: slugify(title) + `-${i}`,
        category: catSlug,
        year,
        image: IMAGES[Math.floor(rand() * IMAGES.length)],
        date: `${String(day).padStart(2, "0")} ${MONTHS[month]}, ${year}`,
        title,
        description: templates.descriptions[dIdx],
        likes: Math.floor(rand() * 5000) + 100,
        loves: Math.floor(rand() * 3000) + 50,
        sads: rand() > 0.5 ? Math.floor(rand() * 50) : undefined,
        comments: Math.floor(rand() * 500) + 10,
        status: rand() > 0.3 ? "verified" : "pending",
      });
    }
    return {
      events: [...existing.events, ...extra],
      featured: existing.featured,
    };
  }

  const templates = TEMPLATES[category] ?? TEMPLATES["Âm Nhạc"];
  const count = Math.floor(rand() * 4) + 5; // 5-8 events
  const events: EventCardData[] = [];

  for (let i = 0; i < count; i++) {
    const tIdx = Math.floor(rand() * templates.titles.length);
    const dIdx = Math.floor(rand() * templates.descriptions.length);
    const month = Math.floor(rand() * 12);
    const day = Math.floor(rand() * 28) + 1;
    const title = templates.titles[tIdx];
    events.push({
      id: `${year}-${i}`,
      slug: slugify(title) + `-${i}`,
      category: catSlug,
      year,
      image: IMAGES[Math.floor(rand() * IMAGES.length)],
      date: `${String(day).padStart(2, "0")} ${MONTHS[month]}, ${year}`,
      title,
      description: templates.descriptions[dIdx],
      likes: Math.floor(rand() * 5000) + 100,
      loves: Math.floor(rand() * 3000) + 50,
      sads: rand() > 0.5 ? Math.floor(rand() * 50) : undefined,
      comments: Math.floor(rand() * 500) + 10,
      status: rand() > 0.3 ? "verified" : "pending",
    });
  }

  // ~40% chance of a featured event
  let featured: EventCardData | undefined;
  if (rand() > 0.6) {
    const ft =
      FEATURED_TEMPLATES[category]?.[
        Math.floor(rand() * (FEATURED_TEMPLATES[category]?.length ?? 1))
      ] ?? FEATURED_TEMPLATES["Âm Nhạc"][0];
    featured = {
      id: `${year}-featured`,
      slug: slugify(ft.title),
      category: catSlug,
      year,
      image: IMAGES[Math.floor(rand() * IMAGES.length)],
      date: `Sưu tầm: Lưu trữ ${year}`,
      title: ft.title,
      description: ft.description,
      likes: Math.floor(rand() * 1000),
      loves: Math.floor(rand() * 500),
      comments: Math.floor(rand() * 200),
      status: "verified",
    };
  }

  return { events, featured };
}

/* ── Build YEAR_GROUPS (2026 → 2000) ── */
function buildYearGroups(): YearGroup[] {
  const groups: YearGroup[] = [];
  const rand = seededRandom(42);

  for (let year = 2026; year >= 2000; year--) {
    const catIdx = (2026 - year) % CATEGORIES.length;
    const cat = CATEGORIES[catIdx];
    const { events, featured } = generateYearEvents(year, cat.vi, cat.en, rand);
    groups.push({
      year,
      category: cat.vi,
      categoryEn: cat.en,
      events,
      featuredEvent: featured,
    });
  }
  return groups;
}

export const YEAR_GROUPS: YearGroup[] = buildYearGroups();

/* ── Flatten into virtual rows ── */
function flattenToRows(groups: YearGroup[]): {
  rows: VirtualRow[];
  yearIndices: Map<number, number>;
} {
  const rows: VirtualRow[] = [];
  const yearIndices = new Map<number, number>();

  for (const group of groups) {
    // Year header row
    yearIndices.set(group.year, rows.length);
    rows.push({
      type: "year-header",
      year: group.year,
      category: group.category,
      categoryEn: group.categoryEn,
    });

    // Event rows: chunk into groups of 3 for the grid
    for (let i = 0; i < group.events.length; i += 3) {
      rows.push({
        type: "event-row",
        events: group.events.slice(i, i + 3),
      });
    }

    // Featured event row (if present)
    if (group.featuredEvent) {
      rows.push({ type: "featured", event: group.featuredEvent });
    }
  }

  return { rows, yearIndices };
}

const { rows, yearIndices } = flattenToRows(YEAR_GROUPS);

export const FLATTENED_ROWS: VirtualRow[] = rows;
export const YEAR_HEADER_INDICES: Map<number, number> = yearIndices;

/* ── Slug → Event lookup (for routing) ── */
function buildSlugIndex(groups: YearGroup[]): Map<string, EventCardData> {
  const index = new Map<string, EventCardData>();
  for (const group of groups) {
    for (const event of group.events) {
      index.set(event.slug, event);
    }
    if (group.featuredEvent) {
      index.set(group.featuredEvent.slug, group.featuredEvent);
    }
  }
  return index;
}

export const EVENT_BY_SLUG: Map<string, EventCardData> =
  buildSlugIndex(YEAR_GROUPS);
