// src/data/dummyEventDetails.ts
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

export const DUMMY_EVENT_DETAILS: Record<string, EventDetailData> = {
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
