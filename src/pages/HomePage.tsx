/* HomePage — Main archive page with masonry event grid and floating action button */

import { useSearchParams } from "react-router-dom";
import { EventCard } from "../components/EventCard";
import { EventCardWide } from "../components/EventCardWide";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { EventDetailModal } from "../components/EventDetailModal";
import type { EventCardData } from "../components/EventCard";

/* ── Dummy data matching the design mockup ── */
const DUMMY_EVENTS: EventCardData[] = [
  {
    id: "1",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmAR2F1RufVlyGWUILlIlZV3Wa2TeNCaqcIgNc7IXA59ca-HijSv6QAeiNn3rTq9gD7g_xJXOhMw5zK6UFkwJ-3GOarh4ZebzNmgenRbir32BycxUPaq83wh0heGkJFOUHUDehgTrvJZWvTiUidzh1VwW8v-hfyGt5TgIqSWbB2_03z-A00wkeOltfksTDJDo7t6aoa7koCmyKkXrirya0xXBhGG-L5yD-wtTgKECUnFVwXUXvQXSIq6ZEvXfhqJYyT_d1ABwy-Kfo",
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
  {
    id: "2",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDASTFOKT4GU4QgoEbCyzeAcijsEpBqC6zv2-SjD1o_4O6zTHiXkIXeG20W0Aou_UcZFr7j1mmYAm70ncAGUgDkDX7eX4zZ_HNwxhOO5EsHuBYEYm0x7VAJIpyRA1NRhHQPOuT7CUbghnjkpwcLa4sQUnye2YpXXjwm6wInqXzhI6pD3h7wMlo2O16LnDt1zBS2Wrrz9pBZCvueW0_D7zzTC_7jnqeeSP5zSMUgdhvhiKNzt3-Sth0ZhL1iXHxgwPRzo5NRnc_Fqp1J",
    date: "20 Tháng 9, 2010",
    title: "Phát hành phim 'Bẫy Rồng'",
    description:
      "Bộ phim hành động võ thuật đỉnh cao đánh dấu bước tiến mới của điện ảnh Việt Nam trong việc tiếp cận tiêu chuẩn quốc tế.",
    likes: 3500,
    loves: 2100,
    sads: 5,
    comments: 128,
    status: "verified",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "3",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCz5B3k5MTLo5Rv4XxjBvs_BnYywzeKiQbyeiqclqYzBvBxU7gXDP-7KM2mOgGNdBVelzhJgbSOGwf5La3JVWtF2YEnyv9j6IfJVfGO4hbr2ZZui4cNkSC2ldq6cO4-pjhtiPCO0r-huZQM_-b-dGzEFUHQjIq9TQvZG4K_qpFhcwkB8Zo2vvmBzStKVBfBHcCGePRxK-ndqrXf8NI0048Bl6zh8sVI2PvQP4xdrlPSBc4GxcOMol4hNcFxlpXaW9IrqcKZiWSCGItO",
    date: "05 Tháng 11, 2014",
    title: 'Sơn Tùng M-TP & "Chắc Ai Đó Sẽ Về"',
    description:
      'Ca khúc chủ đề phim "Chàng Trai Năm Ấy" đã tạo nên một cơn sốt càn quét các bảng xếp hạng âm nhạc trong nước.',
    likes: 15200,
    loves: 10100,
    comments: 842,
    status: "verified",
  },
];

const FEATURED_EVENT: EventCardData = {
  id: "4",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD2ZLoc3Q3E4wyqKtHFMRtch3KSRTAkll7GZJezf6ZsvWTLQd87FyGD1W5m-0Pqwux4lQ7pCAQsqWA8HIcq_yF3jOV8OIYDK1dktZUtENga6JzGSeOOc1GA4ZHpTSTWmJK1sI2fWPco4CDvU9uQsEy0iNzPG2OO_s-3PxZgXPtQrvag5YUf7U0mCtEgwmAls_tNp4yCRTvq8fCVi8l8k27-okBuLq-we5ko99ZSdCwzCaaFjNxjfZG0hKHu6tw1k37u97wrQGzld2FA",
  date: "Sưu tầm: Lưu trữ quốc gia",
  title: 'Phim tài liệu "Những Năm Tháng Hào Hùng"',
  description:
    "Tuyển tập những thước phim tư liệu quý giá về quá trình phát triển văn hóa nghệ thuật Việt Nam qua các thời kỳ từ 1945.",
  likes: 0,
  loves: 0,
  comments: 0,
  status: "verified",
};

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeEventId = searchParams.get("event");

  const openEvent = (id: string) => setSearchParams({ event: id });
  const closeEvent = () => setSearchParams({});

  return (
    <main className="ml-0 md:ml-56 pt-24 pb-12 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page header — Serif title + uppercase Inter label */}
        <header className="mb-12 flex items-baseline gap-4">
          <h1 className="font-headline text-5xl font-bold text-on-surface m-0">
            Âm Nhạc
          </h1>
          <span className="font-label text-xs uppercase tracking-[0.2em] text-primary">
            The Archive / Music
          </span>
        </header>

        {/* Masonry-like grid — asymmetric card placement */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {/* Card 1: standard vertical */}
          <EventCard
            event={DUMMY_EVENTS[0]}
            onClick={() => openEvent(DUMMY_EVENTS[0].id)}
          />

          {/* Card 2: shifted down for intentional asymmetry */}
          <EventCard
            event={DUMMY_EVENTS[1]}
            className="lg:mt-12"
            onClick={() => openEvent(DUMMY_EVENTS[1].id)}
          />

          {/* Card 3: standard vertical */}
          <EventCard
            event={DUMMY_EVENTS[2]}
            onClick={() => openEvent(DUMMY_EVENTS[2].id)}
          />

          {/* Card 4: wide horizontal — spans 2 columns */}
          <EventCardWide
            event={FEATURED_EVENT}
            className="lg:col-span-2"
            onClick={() => openEvent(FEATURED_EVENT.id)}
          />
        </div>
      </div>

      <FloatingActionButton />

      {/* Event detail modal — driven by ?event=ID search param */}
      {activeEventId && (
        <EventDetailModal eventId={activeEventId} onClose={closeEvent} />
      )}
    </main>
  );
}
