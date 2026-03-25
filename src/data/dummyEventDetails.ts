// src/data/dummyEventDetails.ts

import { YEAR_GROUPS } from "./dummyEvents";
import type { EventCardData } from "../components/EventCard";

export interface EventDetailComment {
  id: string;
  author: string;
  avatar: "primary" | "secondary" | "tertiary";
  timeAgo: string;
  text: string;
}

export interface EventDetailData {
  id: string;
  category: string;
  date: string;
  title: string;
  description: string;
  image: string;
  status: "verified" | "pending";
  verifiedBy?: string;
  mediaTitle: string;
  mediaArtist: string;
  mediaYear: string;
  mediaDuration: string;
  mediaCurrentTime: string;
  mediaProgress: number;
  stats: { label: string; value: string }[];
  quote: string;
  quoteAttribution: string;
  contentTitle: string;
  contentParagraphs: string[];
  reactions: { icon: string; label: string; count: number; color: string }[];
  comments: EventDetailComment[];
  totalComments: number;
}

/* ── Seeded RNG (same approach as dummyEvents) ── */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Category-specific content templates ── */

const CATEGORY_TEMPLATES: Record<
  string,
  {
    quotes: { text: string; attribution: string }[];
    contentTitles: string[];
    paragraphs: string[][];
    statSets: { label: string; value: string }[][];
    mediaDurations: string[];
    verifiedBy: string[];
    commentPool: { author: string; text: string }[];
  }
> = {
  "Âm Nhạc": {
    quotes: [
      {
        text: '"Âm nhạc là ngôn ngữ chung của nhân loại, vượt qua mọi rào cản."',
        attribution: "— Nhà phê bình âm nhạc",
      },
      {
        text: '"Mỗi giai điệu là một trang nhật ký của thời đại."',
        attribution: "— Nhạc sĩ đương đại",
      },
      {
        text: '"Nhạc Việt đang bước vào thời kỳ hoàng kim mới."',
        attribution: "— Tạp chí Âm nhạc Việt Nam",
      },
    ],
    contentTitles: [
      "Dấu ấn trong nền âm nhạc Việt",
      "Âm nhạc và bản sắc dân tộc",
      "Hành trình chinh phục khán giả",
    ],
    paragraphs: [
      [
        "Sự kiện đánh dấu một bước ngoặt quan trọng trong lịch sử âm nhạc Việt Nam, nơi truyền thống và hiện đại giao thoa tạo nên những giai điệu đầy cảm xúc.",
        "Với sự phát triển không ngừng của công nghệ thu âm và nền tảng phát hành số, âm nhạc Việt Nam ngày càng tiếp cận được đông đảo khán giả trong và ngoài nước.",
      ],
      [
        "Giai điệu mang đậm bản sắc Việt kết hợp với xu hướng âm nhạc quốc tế đã tạo nên một phong cách độc đáo, được giới chuyên gia đánh giá cao.",
        "Sự thành công này không chỉ là niềm tự hào của nghệ sĩ mà còn là minh chứng cho tiềm năng to lớn của ngành công nghiệp âm nhạc Việt Nam.",
      ],
    ],
    statSets: [
      [
        { label: "Lượt nghe", value: "8.5M" },
        { label: "Thứ hạng Peak", value: "#3 (Zing MP3)" },
        { label: "Thời gian trending", value: "4 tuần" },
      ],
      [
        { label: "Lượt tải về", value: "2.1M" },
        { label: "Giải thưởng", value: "Cống Hiến 2020" },
        { label: "Quốc gia phát hành", value: "12 nước" },
      ],
    ],
    mediaDurations: ["3:45", "4:12", "3:58", "5:20", "4:35"],
    verifiedBy: [
      "Xác thực bởi Hội Nhạc sĩ Việt Nam",
      "Xác thực bởi cộng đồng",
      "Xác thực bởi Bảo tàng Kỹ thuật số",
    ],
    commentPool: [
      {
        author: "Minh Tú",
        text: "Giai điệu tuyệt vời! Nghe đi nghe lại không chán.",
      },
      {
        author: "Hoàng Anh",
        text: "Nhạc Việt cần nhiều hơn những tác phẩm chất lượng như thế này.",
      },
      {
        author: "Thu Hà",
        text: "Ca khúc này đã theo mình qua bao mùa hè.",
      },
      {
        author: "Đức Minh",
        text: "Sản xuất quá chất lượng, xứng đáng top 1.",
      },
      {
        author: "Lan Phương",
        text: "Mỗi lần nghe lại đều cảm thấy xúc động.",
      },
    ],
  },
  "Điện Ảnh": {
    quotes: [
      {
        text: '"Điện ảnh là tấm gương phản chiếu xã hội qua lăng kính nghệ thuật."',
        attribution: "— Đạo diễn nổi tiếng",
      },
      {
        text: '"Mỗi bộ phim là một hành trình cảm xúc không thể tái hiện."',
        attribution: "— Nhà phê bình điện ảnh",
      },
    ],
    contentTitles: [
      "Điện ảnh Việt vươn tầm quốc tế",
      "Nghệ thuật kể chuyện bằng hình ảnh",
      "Bước tiến của phim Việt",
    ],
    paragraphs: [
      [
        "Bộ phim đã chứng minh rằng điện ảnh Việt Nam hoàn toàn có thể cạnh tranh sòng phẳng trên trường quốc tế với những tác phẩm chất lượng cao.",
        "Sự kết hợp giữa kỹ thuật quay phim hiện đại và câu chuyện đậm chất Việt Nam đã tạo nên một tác phẩm điện ảnh đáng nhớ.",
      ],
      [
        "Phim đã mở ra một chương mới cho ngành công nghiệp điện ảnh nước nhà, thu hút sự chú ý từ các nhà phát hành quốc tế.",
        "Thành công phòng vé không chỉ mang lại lợi nhuận mà còn khẳng định vị thế của phim Việt trong lòng khán giả.",
      ],
    ],
    statSets: [
      [
        { label: "Doanh thu phòng vé", value: "120 tỷ VND" },
        { label: "Đánh giá", value: "7.5/10" },
        { label: "Rạp chiếu", value: "450+" },
      ],
      [
        { label: "Lượt xem online", value: "15M" },
        { label: "Giải thưởng", value: "Cánh Diều Vàng" },
        { label: "Quốc gia phát hành", value: "8 nước" },
      ],
    ],
    mediaDurations: ["1:45:00", "2:05:00", "1:32:00", "1:58:00"],
    verifiedBy: [
      "Xác thực bởi Viện Phim Việt Nam",
      "Xác thực bởi Hội Điện ảnh",
    ],
    commentPool: [
      {
        author: "Thanh Hùng",
        text: "Phim Việt chất lượng! Mong có thêm nhiều tác phẩm như vậy.",
      },
      {
        author: "Ngọc Trinh",
        text: "Xem xong mà xúc động không nói nên lời.",
      },
      {
        author: "Quang Vinh",
        text: "Đạo diễn quá tài năng, mỗi cảnh quay đều là một bức tranh.",
      },
      {
        author: "Mai Linh",
        text: "Rất tự hào về điện ảnh nước nhà!",
      },
    ],
  },
  "Văn Hóa": {
    quotes: [
      {
        text: '"Văn hóa là linh hồn của một dân tộc, là di sản quý giá nhất."',
        attribution: "— Nhà nghiên cứu văn hóa",
      },
      {
        text: '"Bảo tồn di sản là bảo vệ tương lai."',
        attribution: "— UNESCO Việt Nam",
      },
    ],
    contentTitles: [
      "Giữ gìn bản sắc dân tộc",
      "Di sản văn hóa trong thời đại số",
      "Hành trình bảo tồn và phát huy",
    ],
    paragraphs: [
      [
        "Sự kiện là minh chứng cho nỗ lực không ngừng trong việc bảo tồn và phát huy giá trị văn hóa truyền thống Việt Nam.",
        "Trong bối cảnh hội nhập quốc tế, việc giữ gìn bản sắc dân tộc càng trở nên quan trọng và cấp thiết hơn bao giờ hết.",
      ],
      [
        "Di sản văn hóa phi vật thể đang được số hóa và bảo tồn bằng công nghệ hiện đại, mở ra cơ hội tiếp cận cho thế hệ trẻ.",
        "Sự kiện thu hút đông đảo sự tham gia từ cộng đồng, khẳng định giá trị bền vững của văn hóa dân tộc.",
      ],
    ],
    statSets: [
      [
        { label: "Người tham dự", value: "25,000+" },
        { label: "Di sản được công nhận", value: "UNESCO" },
        { label: "Năm bảo tồn", value: "Từ 2005" },
      ],
      [
        { label: "Hiện vật trưng bày", value: "1,200+" },
        { label: "Quốc gia tham gia", value: "15" },
        { label: "Tư liệu số hóa", value: "8,500+" },
      ],
    ],
    mediaDurations: ["5:30", "8:15", "12:00", "6:45"],
    verifiedBy: ["Xác thực bởi Bộ Văn hóa", "Xác thực bởi UNESCO Việt Nam"],
    commentPool: [
      {
        author: "Hương Giang",
        text: "Rất tự hào về di sản văn hóa Việt Nam.",
      },
      {
        author: "Anh Tuấn",
        text: "Chúng ta cần bảo tồn những giá trị này cho thế hệ sau.",
      },
      {
        author: "Bích Ngọc",
        text: "Sự kiện tuyệt vời, mong có thêm nhiều hoạt động như vậy.",
      },
    ],
  },
  "Nghệ Thuật": {
    quotes: [
      {
        text: '"Nghệ thuật là tiếng nói thầm lặng nhưng mạnh mẽ nhất."',
        attribution: "— Họa sĩ đương đại",
      },
      {
        text: '"Mỗi tác phẩm là một cuộc đối thoại với thời gian."',
        attribution: "— Nhà phê bình nghệ thuật",
      },
    ],
    contentTitles: [
      "Nghệ thuật đương đại Việt Nam",
      "Từ truyền thống đến hiện đại",
      "Sáng tạo không giới hạn",
    ],
    paragraphs: [
      [
        "Tác phẩm thể hiện sự giao thoa đặc biệt giữa nghệ thuật truyền thống và xu hướng đương đại quốc tế.",
        "Nghệ sĩ Việt Nam đang ngày càng khẳng định vị thế trên bản đồ nghệ thuật thế giới với những sáng tạo độc đáo.",
      ],
      [
        "Triển lãm mang đến góc nhìn mới mẻ về mối quan hệ giữa con người, thiên nhiên và công nghệ thông qua lăng kính nghệ thuật.",
        "Không gian nghệ thuật mở ra cơ hội cho các nghệ sĩ trẻ thể hiện tài năng và tầm nhìn sáng tạo của mình.",
      ],
    ],
    statSets: [
      [
        { label: "Tác phẩm trưng bày", value: "85+" },
        { label: "Nghệ sĩ tham gia", value: "32" },
        { label: "Khách tham quan", value: "18,000+" },
      ],
      [
        { label: "Giá trị bán", value: "2.5 tỷ VND" },
        { label: "Quốc gia", value: "12" },
        { label: "Giải thưởng", value: "Venice Biennale" },
      ],
    ],
    mediaDurations: ["3:20", "4:50", "6:15", "2:45"],
    verifiedBy: [
      "Xác thực bởi Hội Mỹ thuật Việt Nam",
      "Xác thực bởi cộng đồng nghệ sĩ",
    ],
    commentPool: [
      {
        author: "Phương Anh",
        text: "Tác phẩm thực sự gây ấn tượng mạnh!",
      },
      {
        author: "Trung Kiên",
        text: "Nghệ thuật Việt Nam đang ở một tầm cao mới.",
      },
      {
        author: "Linh Chi",
        text: "Rất đáng để xem, mình đã quay lại triển lãm 3 lần.",
      },
    ],
  },
  "Công Nghệ": {
    quotes: [
      {
        text: '"Công nghệ là chìa khóa mở cánh cửa tương lai."',
        attribution: "— CEO startup Việt",
      },
      {
        text: '"Đổi mới sáng tạo bắt đầu từ dám thử, dám sai."',
        attribution: "— Diễn đàn công nghệ",
      },
    ],
    contentTitles: [
      "Việt Nam trên bản đồ công nghệ",
      "Chuyển đổi số và tương lai",
      "Startup Việt vươn xa",
    ],
    paragraphs: [
      [
        "Sự kiện đánh dấu bước tiến quan trọng của Việt Nam trong cuộc cách mạng công nghiệp 4.0 và chuyển đổi số toàn diện.",
        "Với đội ngũ kỹ sư tài năng và hệ sinh thái startup năng động, Việt Nam đang trở thành điểm đến hấp dẫn cho đầu tư công nghệ.",
      ],
      [
        "Giải pháp công nghệ Made in Vietnam đang chứng minh khả năng cạnh tranh toàn cầu với chất lượng vượt trội.",
        "Hệ sinh thái công nghệ ngày càng hoàn thiện, tạo điều kiện thuận lợi cho các doanh nghiệp khởi nghiệp.",
      ],
    ],
    statSets: [
      [
        { label: "Vốn đầu tư", value: "$25M" },
        { label: "Người dùng", value: "5M+" },
        { label: "Tăng trưởng", value: "300% YoY" },
      ],
      [
        { label: "Nhân sự", value: "500+" },
        { label: "Quốc gia phục vụ", value: "20+" },
        { label: "Đối tác", value: "Google, AWS" },
      ],
    ],
    mediaDurations: ["2:30", "3:15", "5:00", "4:20"],
    verifiedBy: ["Xác thực bởi Bộ KH&CN", "Xác thực bởi Vietnam Tech Summit"],
    commentPool: [
      {
        author: "Công Minh",
        text: "Tự hào về công nghệ Việt! Hy vọng ngày càng phát triển.",
      },
      {
        author: "Thảo Nguyên",
        text: "Đây là tương lai của Việt Nam, cần đầu tư nhiều hơn.",
      },
      {
        author: "Trọng Đại",
        text: "Sản phẩm quá tốt, không thua kém gì quốc tế.",
      },
    ],
  },
  "Thể Thao": {
    quotes: [
      {
        text: '"Chiến thắng không chỉ đến từ sức mạnh, mà từ ý chí và niềm tin."',
        attribution: "— HLV đội tuyển quốc gia",
      },
      {
        text: '"Thể thao là nơi khát vọng dân tộc được thắp sáng."',
        attribution: "— Bình luận viên thể thao",
      },
    ],
    contentTitles: [
      "Thể thao Việt Nam vươn tầm",
      "Chiến thắng lịch sử",
      "Tinh thần thể thao Việt",
    ],
    paragraphs: [
      [
        "Thành tích xuất sắc này là kết quả của nhiều năm nỗ lực đào tạo và phát triển thể thao chuyên nghiệp.",
        "Chiến thắng không chỉ mang lại niềm vui cho hàng triệu người hâm mộ mà còn khẳng định vị thế của thể thao Việt Nam trên đấu trường quốc tế.",
      ],
      [
        "Sự kiện thu hút sự chú ý từ truyền thông quốc tế, mở ra cơ hội hợp tác và phát triển cho thể thao Việt.",
        "Tinh thần thi đấu quả cảm và không bỏ cuộc đã truyền cảm hứng cho hàng triệu người Việt Nam.",
      ],
    ],
    statSets: [
      [
        { label: "Huy chương", value: "3 Vàng, 5 Bạc" },
        { label: "Kỷ lục", value: "Quốc gia mới" },
        { label: "Người xem", value: "50M+" },
      ],
      [
        { label: "VĐV tham gia", value: "250+" },
        { label: "Môn thi đấu", value: "18" },
        { label: "Quốc gia", value: "45" },
      ],
    ],
    mediaDurations: ["1:30:00", "2:00:00", "45:00", "1:15:00"],
    verifiedBy: [
      "Xác thực bởi Tổng cục TDTT",
      "Xác thực bởi Liên đoàn Thể thao",
    ],
    commentPool: [
      {
        author: "Quốc Hùng",
        text: "Tự hào quá! Việt Nam vô địch!",
      },
      {
        author: "Phương Thảo",
        text: "Các VĐV đã chiến đấu hết mình, xứng đáng được vinh danh.",
      },
      {
        author: "Văn Đức",
        text: "Mình đã khóc khi xem trực tiếp. Cảm xúc không thể tả!",
      },
    ],
  },
  "Giáo Dục": {
    quotes: [
      {
        text: '"Giáo dục là vũ khí mạnh nhất để thay đổi thế giới."',
        attribution: "— Nelson Mandela",
      },
      {
        text: '"Đầu tư vào giáo dục là đầu tư vào tương lai đất nước."',
        attribution: "— Bộ trưởng Giáo dục",
      },
    ],
    contentTitles: [
      "Giáo dục Việt Nam đổi mới",
      "Thế hệ trẻ và tri thức",
      "Chất lượng giáo dục vươn tầm",
    ],
    paragraphs: [
      [
        "Thành tựu giáo dục này là kết quả của quá trình đổi mới và hiện đại hóa hệ thống giáo dục quốc gia.",
        "Với chiến lược đầu tư đúng đắn vào nguồn nhân lực, Việt Nam đang dần khẳng định vị thế trong lĩnh vực giáo dục khu vực và quốc tế.",
      ],
      [
        "Chương trình đào tạo mới mang tính ứng dụng cao, đáp ứng nhu cầu thực tiễn của thị trường lao động.",
        "Sự hợp tác quốc tế ngày càng sâu rộng mở ra cơ hội học tập và phát triển cho sinh viên Việt Nam.",
      ],
    ],
    statSets: [
      [
        { label: "Sinh viên", value: "15,000+" },
        { label: "Xếp hạng QS", value: "Top 500" },
        { label: "Học bổng", value: "2,500+" },
      ],
      [
        { label: "Giảng viên quốc tế", value: "120+" },
        { label: "Chương trình liên kết", value: "45" },
        { label: "Tỷ lệ có việc", value: "95%" },
      ],
    ],
    mediaDurations: ["15:00", "20:00", "8:30", "12:00"],
    verifiedBy: ["Xác thực bởi Bộ GD&ĐT", "Xác thực bởi Hội đồng Giáo dục"],
    commentPool: [
      {
        author: "Hải Yến",
        text: "Giáo dục Việt Nam đang đi đúng hướng!",
      },
      {
        author: "Minh Quân",
        text: "Rất tự hào khi học sinh Việt Nam đạt giải quốc tế.",
      },
      {
        author: "Thu Trang",
        text: "Mong có thêm nhiều cơ hội cho các bạn trẻ vùng sâu vùng xa.",
      },
    ],
  },
  "Kiến Trúc": {
    quotes: [
      {
        text: '"Kiến trúc là nghệ thuật của không gian và ánh sáng."',
        attribution: "— Kiến trúc sư nổi tiếng",
      },
      {
        text: '"Mỗi công trình là một câu chuyện về con người và thời đại."',
        attribution: "— Hội Kiến trúc sư Việt Nam",
      },
    ],
    contentTitles: [
      "Kiến trúc Việt Nam đương đại",
      "Hài hòa giữa cũ và mới",
      "Xây dựng bền vững",
    ],
    paragraphs: [
      [
        "Công trình thể hiện sự kết hợp hài hòa giữa kiến trúc truyền thống Việt Nam và xu hướng thiết kế hiện đại bền vững.",
        "Với vật liệu thân thiện môi trường và thiết kế tối ưu năng lượng, đây là hình mẫu cho kiến trúc xanh tại Việt Nam.",
      ],
      [
        "Dự án đã nhận được nhiều giải thưởng kiến trúc quốc tế, khẳng định tài năng của kiến trúc sư Việt.",
        "Không gian sống được thiết kế hướng đến sự thoải mái và gắn kết cộng đồng.",
      ],
    ],
    statSets: [
      [
        { label: "Diện tích", value: "12,500 m²" },
        { label: "Chứng nhận", value: "LEED Gold" },
        { label: "Chi phí", value: "350 tỷ VND" },
      ],
      [
        { label: "Thời gian thi công", value: "24 tháng" },
        { label: "Giải thưởng", value: "A' Design Award" },
        { label: "Tiết kiệm năng lượng", value: "40%" },
      ],
    ],
    mediaDurations: ["3:00", "5:45", "8:20", "4:10"],
    verifiedBy: ["Xác thực bởi Hội Kiến trúc sư", "Xác thực bởi Bộ Xây dựng"],
    commentPool: [
      {
        author: "Trung Hiếu",
        text: "Công trình đẹp quá! Tự hào kiến trúc Việt.",
      },
      {
        author: "Thanh Vân",
        text: "Thiết kế xanh như thế này cần được nhân rộng.",
      },
      {
        author: "Hoàng Long",
        text: "Đi qua mỗi ngày mà lần nào cũng phải ngước nhìn.",
      },
    ],
  },
  "Xã Hội": {
    quotes: [
      {
        text: '"Một xã hội tốt đẹp bắt đầu từ những hành động nhỏ."',
        attribution: "— Nhà hoạt động xã hội",
      },
      {
        text: '"Phát triển bền vững là trách nhiệm của mỗi người."',
        attribution: "— UNDP Việt Nam",
      },
    ],
    contentTitles: [
      "Xã hội Việt Nam phát triển bền vững",
      "Cộng đồng và sẻ chia",
      "Hành trình đổi mới xã hội",
    ],
    paragraphs: [
      [
        "Chương trình đã mang lại lợi ích thiết thực cho hàng triệu người dân, góp phần thu hẹp khoảng cách phát triển giữa các vùng miền.",
        "Với sự tham gia tích cực từ cộng đồng và các tổ chức xã hội, dự án đã tạo ra tác động tích cực và lâu dài.",
      ],
      [
        "Mô hình phát triển cộng đồng được đánh giá cao bởi các tổ chức quốc tế như một ví dụ điển hình.",
        "Sự kiện truyền cảm hứng cho nhiều hoạt động tình nguyện và thiện nguyện trên cả nước.",
      ],
    ],
    statSets: [
      [
        { label: "Người hưởng lợi", value: "500,000+" },
        { label: "Tỉnh thành", value: "48/63" },
        { label: "Tình nguyện viên", value: "12,000+" },
      ],
      [
        { label: "Dự án triển khai", value: "85+" },
        { label: "Ngân sách", value: "120 tỷ VND" },
        { label: "Tỷ lệ thành công", value: "92%" },
      ],
    ],
    mediaDurations: ["10:00", "15:30", "22:00", "8:45"],
    verifiedBy: ["Xác thực bởi Mặt trận Tổ quốc", "Xác thực bởi UNDP Việt Nam"],
    commentPool: [
      {
        author: "Quốc Anh",
        text: "Chương trình ý nghĩa! Mong được nhân rộng.",
      },
      {
        author: "Ngọc Hân",
        text: "Xã hội cần nhiều hơn những hoạt động thiết thực như thế này.",
      },
      {
        author: "Văn Toàn",
        text: "Đã tham gia tình nguyện và cảm thấy rất ý nghĩa.",
      },
    ],
  },
};

/* ── Vietnamese category name mapping ── */
const CATEGORY_VI_MAP: Record<string, string> = {
  music: "Âm Nhạc",
  cinema: "Điện Ảnh",
  culture: "Văn Hóa",
  art: "Nghệ Thuật",
  technology: "Công Nghệ",
  sports: "Thể Thao",
  education: "Giáo Dục",
  architecture: "Kiến Trúc",
  society: "Xã Hội",
};

const AVATARS: ("primary" | "secondary" | "tertiary")[] = [
  "primary",
  "secondary",
  "tertiary",
];

const TIME_AGO = [
  "1 giờ trước",
  "2 giờ trước",
  "5 giờ trước",
  "1 ngày trước",
  "2 ngày trước",
  "3 ngày trước",
  "1 tuần trước",
  "2 tuần trước",
];

/* ── Generate EventDetailData from an EventCardData ── */
function generateDetail(
  event: EventCardData,
  rand: () => number,
): EventDetailData {
  const catVi = CATEGORY_VI_MAP[event.category] ?? "Âm Nhạc";
  const template = CATEGORY_TEMPLATES[catVi] ?? CATEGORY_TEMPLATES["Âm Nhạc"];

  const quoteIdx = Math.floor(rand() * template.quotes.length);
  const contentIdx = Math.floor(rand() * template.contentTitles.length);
  const paraIdx = Math.floor(rand() * template.paragraphs.length);
  const statIdx = Math.floor(rand() * template.statSets.length);
  const durIdx = Math.floor(rand() * template.mediaDurations.length);
  const verIdx = Math.floor(rand() * template.verifiedBy.length);

  const progress = Math.floor(rand() * 80);
  const commentCount = Math.floor(rand() * 3) + 2;
  const comments: EventDetailComment[] = [];
  const usedAuthors = new Set<number>();
  for (let i = 0; i < commentCount && i < template.commentPool.length; i++) {
    let cIdx = Math.floor(rand() * template.commentPool.length);
    while (
      usedAuthors.has(cIdx) &&
      usedAuthors.size < template.commentPool.length
    ) {
      cIdx = (cIdx + 1) % template.commentPool.length;
    }
    usedAuthors.add(cIdx);
    const c = template.commentPool[cIdx];
    comments.push({
      id: `c${i + 1}`,
      author: c.author,
      avatar: AVATARS[i % AVATARS.length],
      timeAgo: TIME_AGO[Math.floor(rand() * TIME_AGO.length)],
      text: c.text,
    });
  }

  return {
    id: event.id,
    category: catVi,
    date: event.date,
    title: event.title,
    description: event.description,
    image: event.image,
    status: event.status,
    verifiedBy:
      event.status === "verified" ? template.verifiedBy[verIdx] : undefined,
    mediaTitle: event.title,
    mediaArtist: `${catVi} • ${event.year}`,
    mediaYear: String(event.year),
    mediaDuration: template.mediaDurations[durIdx],
    mediaCurrentTime: "0:00",
    mediaProgress: progress,
    stats: template.statSets[statIdx],
    quote: template.quotes[quoteIdx].text,
    quoteAttribution: template.quotes[quoteIdx].attribution,
    contentTitle: template.contentTitles[contentIdx],
    contentParagraphs: template.paragraphs[paraIdx],
    reactions: [
      {
        icon: "thumb_up",
        label: "Like",
        count: event.likes,
        color: "secondary",
      },
      { icon: "favorite", label: "Love", count: event.loves, color: "error" },
      ...(event.sads
        ? [
            {
              icon: "sentiment_dissatisfied",
              label: "Sad",
              count: event.sads,
              color: "tertiary",
            },
          ]
        : []),
      {
        icon: "thumb_down",
        label: "Dislike",
        count: Math.floor(rand() * 50) + 5,
        color: "primary",
      },
    ],
    comments,
    totalComments: event.comments,
  };
}

/* ── Build full details map ── */
function buildAllDetails(): Record<string, EventDetailData> {
  const details: Record<string, EventDetailData> = {};

  // Keep handcrafted entries for IDs 1-4
  Object.assign(details, HANDCRAFTED_DETAILS);

  // Generate for all other events
  const rand = seededRandom(123);
  for (const group of YEAR_GROUPS) {
    for (const event of group.events) {
      if (!details[event.id]) {
        details[event.id] = generateDetail(event, rand);
      }
    }
    if (group.featuredEvent && !details[group.featuredEvent.id]) {
      details[group.featuredEvent.id] = generateDetail(
        group.featuredEvent,
        rand,
      );
    }
  }

  return details;
}

/* ── Handcrafted details (IDs 1-4) ── */
const HANDCRAFTED_DETAILS: Record<string, EventDetailData> = {
  "1": {
    id: "1",
    category: "Âm Nhạc",
    date: "15/05/2015",
    title: 'Phát hành album "Vợ Người Ta" - Phan Mạnh Quỳnh',
    description:
      "Một cột mốc âm nhạc đại chúng mang âm hưởng dân gian đương đại phối hợp với tiết tấu Pop hiện đại.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmAR2F1RufVlyGWUILlIlZV3Wa2TeNCaqcIgNc7IXA59ca-HijSv6QAeiNn3rTq9gD7g_xJXOhMw5zK6UFkwJ-3GOarh4ZebzNmgenRbir32BycxUPaq83wh0heGkJFOUHUDehgTrvJZWvTiUidzh1VwW8v-hfyGt5TgIqSWbB2_03z-A00wkeOltfksTDJDo7t6aoa7koCmyKkXrirya0xXBhGG-L5yD-wtTgKECUnFVwXUXvQXSIq6ZEvXfhqJYyT_d1ABwy-Kfo",
    status: "verified",
    verifiedBy: "Xác thực bởi Bảo tàng Kỹ thuật số",
    mediaTitle: "Vợ Người Ta",
    mediaArtist: "Phan Mạnh Quỳnh • 2015",
    mediaYear: "2015",
    mediaDuration: "3:58",
    mediaCurrentTime: "1:45",
    mediaProgress: 33,
    stats: [
      { label: "Lượt nghe lại", value: "12.4M" },
      { label: "Thứ hạng Peak", value: "#1 (Zing MP3)" },
      { label: "Năm thịnh hành", value: "2015-2016" },
    ],
    quote: '"Tấm thiệp mời trên bàn, thời gian địa điểm rõ ràng..."',
    quoteAttribution: "— Lời bài hát quốc dân",
    contentTitle: "Tác động văn hóa thập niên 2010",
    contentParagraphs: [
      '"Vợ Người Ta" không chỉ là một bài hát mà còn trở thành hiện tượng văn hóa đại chúng lớn nhất của âm nhạc Việt Nam trong thập niên 2010. Ra mắt vào tháng 5 năm 2015, ca khúc nhanh chóng chiếm lĩnh mọi bảng xếp hạng trong nước, từ Zing MP3 đến NhacCuaTui, và lan tỏa mạnh mẽ trên các nền tảng mạng xã hội. Giai điệu dân gian đương đại kết hợp với lời ca mộc mạc, chân thành đã chạm đến trái tim hàng triệu người nghe thuộc mọi thế hệ.',
      "Sự thành công vang dội của ca khúc đã mở ra một làn sóng mới trong nhạc Việt — nơi âm hưởng dân gian truyền thống được hòa quyện tài tình với sản xuất âm nhạc hiện đại. Phan Mạnh Quỳnh từ một cái tên ít được biết đến đã trở thành một trong những nhạc sĩ được tôn trọng nhất thế hệ, định hình lại cách người trẻ nhìn nhận về nhạc Việt đương đại.",
    ],
    reactions: [
      { icon: "thumb_up", label: "Like", count: 15200, color: "secondary" },
      { icon: "favorite", label: "Love", count: 8400, color: "error" },
      {
        icon: "sentiment_dissatisfied",
        label: "Sad",
        count: 245,
        color: "tertiary",
      },
      {
        icon: "sentiment_very_dissatisfied",
        label: "Angry",
        count: 12,
        color: "orange-400",
      },
      { icon: "thumb_down", label: "Dislike", count: 89, color: "primary" },
    ],
    comments: [
      {
        id: "c1",
        author: "Minh Tú",
        avatar: "primary",
        timeAgo: "2 giờ trước",
        text: "Bài hát này đã theo mình suốt những năm tháng đại học. Mỗi lần nghe lại đều xúc động như lần đầu.",
      },
      {
        id: "c2",
        author: "Hoàng Nam",
        avatar: "secondary",
        timeAgo: "5 giờ trước",
        text: "Phan Mạnh Quỳnh là thiên tài! Từ 'Vợ Người Ta' đến 'Có Chàng Trai Viết Lên Cây', bài nào cũng là kiệt tác.",
      },
      {
        id: "c3",
        author: "Hương Giang",
        avatar: "tertiary",
        timeAgo: "1 ngày trước",
        text: "Nhạc Việt cần nhiều hơn những nghệ sĩ như Phan Mạnh Quỳnh — người biết cách kể chuyện bằng âm nhạc.",
      },
    ],
    totalComments: 1240,
  },
  "2": {
    id: "2",
    category: "Điện Ảnh",
    date: "20/09/2010",
    title: "Phát hành phim 'Bẫy Rồng'",
    description:
      "Bộ phim hành động võ thuật đỉnh cao đánh dấu bước tiến mới của điện ảnh Việt Nam trong việc tiếp cận tiêu chuẩn quốc tế.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDASTFOKT4GU4QgoEbCyzeAcijsEpBqC6zv2-SjD1o_4O6zTHiXkIXeG20W0Aou_UcZFr7j1mmYAm70ncAGUgDkDX7eX4zZ_HNwxhOO5EsHuBYEYm0x7VAJIpyRA1NRhHQPOuT7CUbghnjkpwcLa4sQUnye2YpXXjwm6wInqXzhI6pD3h7wMlo2O16LnDt1zBS2Wrrz9pBZCvueW0_D7zzTC_7jnqeeSP5zSMUgdhvhiKNzt3-Sth0ZhL1iXHxgwPRzo5NRnc_Fqp1J",
    status: "verified",
    verifiedBy: "Xác thực bởi Viện Phim Việt Nam",
    mediaTitle: "Bẫy Rồng OST",
    mediaArtist: "Various Artists • 2010",
    mediaYear: "2010",
    mediaDuration: "4:22",
    mediaCurrentTime: "0:00",
    mediaProgress: 0,
    stats: [
      { label: "Doanh thu phòng vé", value: "68 tỷ VND" },
      { label: "Đánh giá IMDb", value: "6.8/10" },
      { label: "Giải thưởng", value: "Cánh Diều Vàng 2011" },
    ],
    quote: '"Hành động không chỉ nằm ở nắm đấm, mà ở trái tim người chiến sĩ."',
    quoteAttribution: "— Đạo diễn Lê Thanh Sơn",
    contentTitle: "Bước ngoặt của điện ảnh hành động Việt",
    contentParagraphs: [
      "Bẫy Rồng là một trong những bộ phim hành động võ thuật đầu tiên của Việt Nam đạt được tiêu chuẩn sản xuất quốc tế, mở ra kỷ nguyên mới cho dòng phim hành động trong nước.",
      "Bộ phim đã chứng minh rằng điện ảnh Việt Nam hoàn toàn có khả năng tạo ra những tác phẩm hành động đẳng cấp, thu hút khán giả trong và ngoài nước.",
    ],
    reactions: [
      { icon: "thumb_up", label: "Like", count: 3500, color: "secondary" },
      { icon: "favorite", label: "Love", count: 2100, color: "error" },
      {
        icon: "sentiment_dissatisfied",
        label: "Sad",
        count: 45,
        color: "tertiary",
      },
      { icon: "thumb_down", label: "Dislike", count: 23, color: "primary" },
    ],
    comments: [
      {
        id: "c1",
        author: "Thanh Hùng",
        avatar: "primary",
        timeAgo: "3 ngày trước",
        text: "Phim hành động Việt Nam thời đó hiếm lắm mà chất lượng thế này thì quá xuất sắc!",
      },
      {
        id: "c2",
        author: "Lan Phương",
        avatar: "secondary",
        timeAgo: "1 tuần trước",
        text: "Mình xem đi xem lại mấy lần rồi mà vẫn thấy hấp dẫn.",
      },
    ],
    totalComments: 356,
  },
  "3": {
    id: "3",
    category: "Âm Nhạc",
    date: "05/11/2014",
    title: 'Sơn Tùng M-TP & "Chắc Ai Đó Sẽ Về"',
    description:
      'Ca khúc chủ đề phim "Chàng Trai Năm Ấy" đã tạo nên một cơn sốt càn quét các bảng xếp hạng âm nhạc trong nước.',
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCz5B3k5MTLo5Rv4XxjBvs_BnYywzeKiQbyeiqclqYzBvBxU7gXDP-7KM2mOgGNdBVelzhJgbSOGwf5La3JVWtF2YEnyv9j6IfJVfGO4hbr2ZZui4cNkSC2ldq6cO4-pjhtiPCO0r-huZQM_-b-dGzEFUHQjIq9TQvZG4K_qpFhcwkB8Zo2vvmBzStKVBfBHcCGePRxK-ndqrXf8NI0048Bl6zh8sVI2PvQP4xdrlPSBc4GxcOMol4hNcFxlpXaW9IrqcKZiWSCGItO",
    status: "verified",
    verifiedBy: "Xác thực bởi cộng đồng",
    mediaTitle: "Chắc Ai Đó Sẽ Về",
    mediaArtist: "Sơn Tùng M-TP • 2014",
    mediaYear: "2014",
    mediaDuration: "5:10",
    mediaCurrentTime: "2:30",
    mediaProgress: 48,
    stats: [
      { label: "Lượt xem MV", value: "185M" },
      { label: "Thứ hạng Peak", value: "#1 (Zing MP3)" },
      { label: "Giải thưởng", value: "Làn Sóng Xanh 2015" },
    ],
    quote: '"Em ơi có bao giờ em nghĩ lại, rằng ai đó sẽ về thay anh..."',
    quoteAttribution: "— Lời bài hát",
    contentTitle: "Hiện tượng Sơn Tùng M-TP",
    contentParagraphs: [
      '"Chắc Ai Đó Sẽ Về" là ca khúc nhạc phim đã đưa Sơn Tùng M-TP lên đỉnh cao sự nghiệp, trở thành nghệ sĩ trẻ có sức ảnh hưởng lớn nhất Việt Nam thời điểm đó.',
      "Ca khúc đánh dấu sự chuyển mình của V-pop khi kết hợp thành công giữa ballad trữ tình và phong cách sản xuất hiện đại, mở đường cho thế hệ nghệ sĩ Gen Z sau này.",
    ],
    reactions: [
      { icon: "thumb_up", label: "Like", count: 15200, color: "secondary" },
      { icon: "favorite", label: "Love", count: 10100, color: "error" },
      {
        icon: "sentiment_dissatisfied",
        label: "Sad",
        count: 320,
        color: "tertiary",
      },
      { icon: "thumb_down", label: "Dislike", count: 156, color: "primary" },
    ],
    comments: [
      {
        id: "c1",
        author: "Bảo Ngọc",
        avatar: "tertiary",
        timeAgo: "6 giờ trước",
        text: "Sơn Tùng là huyền thoại sống của nhạc Việt! Bài này mình thuộc từng chữ.",
      },
      {
        id: "c2",
        author: "Đức Minh",
        avatar: "primary",
        timeAgo: "2 ngày trước",
        text: "MV này mình xem lúc còn học cấp 3, giờ nghe lại vẫn nổi da gà.",
      },
    ],
    totalComments: 2840,
  },
  "4": {
    id: "4",
    category: "Tư Liệu",
    date: "01/01/1945",
    title: 'Phim tài liệu "Những Năm Tháng Hào Hùng"',
    description:
      "Tuyển tập những thước phim tư liệu quý giá về quá trình phát triển văn hóa nghệ thuật Việt Nam qua các thời kỳ từ 1945.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD2ZLoc3Q3E4wyqKtHFMRtch3KSRTAkll7GZJezf6ZsvWTLQd87FyGD1W5m-0Pqwux4lQ7pCAQsqWA8HIcq_yF3jOV8OIYDK1dktZUtENga6JzGSeOOc1GA4ZHpTSTWmJK1sI2fWPco4CDvU9uQsEy0iNzPG2OO_s-3PxZgXPtQrvag5YUf7U0mCtEgwmAls_tNp4yCRTvq8fCVi8l8k27-okBuLq-we5ko99ZSdCwzCaaFjNxjfZG0hKHu6tw1k37u97wrQGzld2FA",
    status: "verified",
    verifiedBy: "Xác thực bởi Lưu trữ quốc gia",
    mediaTitle: "Những Năm Tháng Hào Hùng",
    mediaArtist: "Lưu trữ quốc gia • 1945-2000",
    mediaYear: "1945",
    mediaDuration: "1:28:00",
    mediaCurrentTime: "0:00",
    mediaProgress: 0,
    stats: [
      { label: "Thời lượng", value: "88 phút" },
      { label: "Năm sản xuất", value: "1998" },
      { label: "Lượt xem lưu trữ", value: "4.2M" },
    ],
    quote:
      '"Lịch sử không chỉ nằm trong sách vở, mà trong từng thước phim còn sót lại."',
    quoteAttribution: "— Lời dẫn phim tài liệu",
    contentTitle: "Di sản điện ảnh tư liệu Việt Nam",
    contentParagraphs: [
      "Bộ phim tài liệu này là một trong những nỗ lực bảo tồn quan trọng nhất, tập hợp những thước phim quý giá ghi lại quá trình phát triển văn hóa và nghệ thuật Việt Nam từ 1945 đến cuối thế kỷ 20.",
      "Thông qua những hình ảnh lịch sử được phục chế cẩn thận, bộ phim mang đến cái nhìn chân thực và sống động về hành trình xây dựng bản sắc văn hóa dân tộc qua các giai đoạn lịch sử khác nhau.",
    ],
    reactions: [
      { icon: "thumb_up", label: "Like", count: 890, color: "secondary" },
      { icon: "favorite", label: "Love", count: 1200, color: "error" },
      {
        icon: "sentiment_dissatisfied",
        label: "Sad",
        count: 67,
        color: "tertiary",
      },
    ],
    comments: [
      {
        id: "c1",
        author: "Quốc Anh",
        avatar: "secondary",
        timeAgo: "1 tuần trước",
        text: "Cảm ơn vì đã số hóa những thước phim quý giá này. Thế hệ trẻ cần được xem nhiều hơn.",
      },
    ],
    totalComments: 89,
  },
};

export const DUMMY_EVENT_DETAILS: Record<string, EventDetailData> =
  buildAllDetails();
