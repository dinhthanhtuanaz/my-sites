// Tình trạng bé & lời khuyên cho mẹ theo giai đoạn: [đến hết tuần, {baby: [ngủ, nghe, đạp], mom: [ăn uống, ngủ nghỉ]}]
// Thông tin tổng quát để tham khảo, không thay thế tư vấn của bác sĩ.
const STAGES = [
  [6, {
    baby: ["Chưa có chu kỳ ngủ - thức", "Chưa nghe được (tai chưa hình thành)", "Chưa cử động, tim bắt đầu đập"],
    mom: ["Uống axit folic, chia nhiều bữa nhỏ nếu buồn nôn, uống đủ nước", "Ngủ đủ 8 giờ. Buồn ngủ ban ngày là bình thường"]
  }],
  [13, {
    baby: ["Chưa có chu kỳ ngủ rõ ràng", "Tai trong đang hình thành, chưa nghe được", "Đã cử động nhưng mẹ chưa cảm nhận được"],
    mom: ["Chưa cần ăn thêm năng lượng; ưu tiên đủ chất, ăn nhiều bữa nhỏ", "Dễ mệt, ngủ trưa 20–30 phút nếu cần"]
  }],
  [17, {
    baby: ["Cử động xen kẽ lúc nghỉ, chưa thành chu kỳ rõ", "Tai đang hoàn thiện, chưa nghe rõ", "Mẹ có thể bắt đầu thấy nhẹ như bong bóng, cánh bướm (thường từ tuần 16–20)"],
    mom: ["Thêm khoảng 300 kcal/ngày; ưu tiên đạm, sắt, canxi", "Ngủ 7–9 giờ, tập nằm nghiêng"]
  }],
  [22, {
    baby: ["Ngủ phần lớn thời gian trong ngày, thức ngắn xen kẽ", "Bắt đầu nghe được nhịp tim mẹ và tiếng động lớn", "Thai máy rõ dần: đạp nhẹ, lăn, xoay"],
    mom: ["Thêm khoảng 340 kcal/ngày; đủ đạm (thịt, cá, trứng, sữa), sắt, canxi", "Ngủ 7–9 giờ, nằm nghiêng và kê gối giữa hai chân"]
  }],
  [27, {
    baby: ["Ngủ khoảng 90% thời gian, mỗi chu kỳ ngủ chỉ 20–40 phút", "Nghe được giọng mẹ, giật mình khi có tiếng động lớn", "Đạp và huých rõ; có thể giật nhịp đều khi bé nấc cụt"],
    mom: ["Thêm khoảng 340 kcal/ngày; chia 5–6 bữa nhỏ, ưu tiên đạm, sắt, canxi", "Ngủ 7–9 giờ, nằm nghiêng, kê gối đỡ bụng và lưng"]
  }],
  [31, {
    baby: ["Ngủ khoảng 90% ngày, chu kỳ ngủ - thức rõ ràng", "Phân biệt được giọng mẹ, phản ứng với tiếng nói và nhạc", "Đạp mạnh. Bắt đầu đếm thai máy: đủ 10 cử động trong 2 giờ"],
    mom: ["Thêm khoảng 450 kcal/ngày; ăn nhiều bữa nhỏ để tránh ợ nóng", "Nằm nghiêng trái, tránh nằm ngửa lâu, kê cao đầu khi ợ nóng"]
  }],
  [35, {
    baby: ["Ngủ khoảng 18–20 giờ/ngày", "Nhận ra giọng mẹ, thích nghe giọng quen thuộc", "Chật dần nên đạp ít rộng hơn, nhưng vẫn đều: huých, lăn, nhấp nhô"],
    mom: ["Ăn nhiều bữa nhỏ, đủ đạm và sắt, uống đủ nước, hạn chế đồ ngọt", "Nghỉ ngơi thêm ban ngày, nằm nghiêng trái, ngủ kê gối cao"]
  }],
  [40, {
    baby: ["Ngủ khoảng 18–20 giờ/ngày", "Nghe rõ, quen giọng mẹ và người thân", "Vẫn đạp đều; nếu giảm rõ rệt hoặc bất thường cần đi khám ngay"],
    mom: ["Ăn nhẹ, đủ chất, uống đủ nước; ăn đủ năng lượng trước khi chuyển dạ", "Ngủ nghỉ tối đa, nằm nghiêng trái, đi bộ nhẹ nhàng. Đến viện khi có dấu hiệu chuyển dạ"]
  }]
];

// Thông tin mẹ bầu. weights: danh sách cân nặng đã đo [tuần thai, kg] - thêm dòng mới mỗi lần cân.
const PROFILE = {
  name: "Đỗ Thị Chinh",
  birthYear: 2005,
  heightCm: 155,
  preWeightKg: 44.5,
  weights: [[25, 49]]
};

// Kỳ nghỉ của mẹ bầu và khoảng lịch hiển thị: [năm, tháng, ngày]
const LEAVE = { from: [2027, 1, 30], to: [2027, 2, 14] };
const HUSBAND_LEAVE = { from: [2027, 2, 4], to: [2027, 2, 10] }; // chồng nghỉ 7 ngày liên tục
const CAL_START = [2027, 1, 1]; // lịch bắt đầu từ ngày này, kết thúc hết tháng chứa ngày dự sinh

// Mốc khám quan trọng: [từ tuần, đến tuần, tên mốc]
const MILESTONES = [
  [11, 13, "Siêu âm độ mờ da gáy, sàng lọc"],
  [18, 22, "Siêu âm hình thái"],
  [24, 28, "Nghiệm pháp dung nạp đường"],
  [35, 37, "Xét nghiệm GBS"],
  [36, 40, "Khám thai hằng tuần"],
  [37, 37, "Thai đủ tháng"],
  [40, 40, "Ngày dự sinh"]
];

// Dữ liệu từng tuần: [kích thước so sánh, chiều dài cm, cân nặng g, mô tả phát triển, lưu ý cho mẹ]
const WEEKS = [
  ["🌸 Chưa mang thai", "", "", "Tuần 1 tính từ ngày đầu kỳ kinh cuối. Cơ thể chuẩn bị cho rụng trứng.", "Ghi lại ngày đầu kỳ kinh cuối để tính ngày dự sinh. Nếu đang dự định có thai, nên bắt đầu uống axit folic."],
  ["🥚 Chưa mang thai", "", "", "Nội mạc tử cung dày lên, trứng chín dần.", "Theo dõi dấu hiệu rụng trứng nếu đang cố có thai. Hạn chế rượu bia và thuốc lá."],
  ["✨ Hạt thụ tinh", "", "", "Rụng trứng và thụ tinh có thể xảy ra quanh thời điểm này.", "Tránh tự ý dùng thuốc vì có thể đã thụ thai. Ăn uống đủ chất, ngủ đủ giấc."],
  ["🌱 Hạt mè", "", "", "Phôi làm tổ trong tử cung. Có thể thử thai que.", "Nếu trễ kinh, thử thai que rồi đặt lịch khám để xác nhận. Giữ tinh thần thoải mái."],
  ["🌱 Hạt vừng", 0.2, "", "Ống thần kinh và tim bắt đầu hình thành.", "Uống axit folic đều mỗi ngày theo chỉ định. Tránh rượu bia, thuốc lá và thuốc không rõ nguồn gốc."],
  ["🫘 Hạt đậu lăng", 0.5, "", "Tim bắt đầu đập. Có thể ốm nghén.", "Ăn nhiều bữa nhỏ và uống đủ nước nếu buồn nôn. Báo bác sĩ ngay nếu đau bụng dữ dội hoặc ra máu."],
  ["🫐 Quả việt quất", 1, "", "Mặt, mắt, mũi hình thành. Siêu âm đầu tiên xác định thai trong tử cung.", "Tránh đồ sống, phô mai chưa tiệt trùng, hạn chế caffeine. Nghỉ ngơi nhiều hơn khi mệt."],
  ["🍓 Quả mâm xôi", 1.6, 1, "Tay chân nhú ra, các cơ quan chính tiếp tục phát triển.", "Hỏi bác sĩ về vitamin tổng hợp cho bà bầu. Tránh tắm nước quá nóng và xông hơi."],
  ["🍇 Quả nho", 2.3, 2, "Phôi chuyển sang giai đoạn thai nhi.", "Nên đi khám thai lần đầu, mang theo danh sách thuốc đang dùng. Làm các xét nghiệm máu, nước tiểu cơ bản."],
  ["🍊 Quả quất", 3.1, 4, "Xương và sụn hình thành, các ngón tay ngón chân tách rời.", "Ăn nhiều chất xơ và uống đủ nước để tránh táo bón. Mặc đồ rộng, thoải mái."],
  ["🍐 Quả sung", 4.1, 7, "Các cơ quan gần như đã đủ. Nguy cơ sảy thai giảm dần.", "Tìm hiểu lịch sàng lọc tuần 11–13 để đặt hẹn sớm. Ngủ nghiêng một bên cho dễ chịu."],
  ["🍋 Quả chanh", 5.4, 14, "Mốc quan trọng: siêu âm độ mờ da gáy (tuần 11–13) và xét nghiệm sàng lọc.", "Đặt lịch siêu âm sớm vì khung thời gian này khá ngắn. Hỏi bác sĩ nếu có thắc mắc về kết quả."],
  ["🍑 Quả đào", 7.4, 23, "Kết thúc 3 tháng đầu. Ốm nghén thường giảm, bụng bắt đầu lộ.", "Uống đủ nước, bắt đầu đi bộ nhẹ nếu bác sĩ đồng ý. Có thể báo tin vui với người thân."],
  ["🍋 Quả chanh vàng", 8.7, 43, "Bước vào 3 tháng giữa. Thai nhi có thể mút ngón tay.", "Bổ sung canxi và sắt theo chỉ định. Dùng kem chống nắng vì da dễ sạm."],
  ["🍎 Quả táo", 10.1, 70, "Da mỏng trong suốt, bắt đầu mọc lông tơ.", "Ngủ nghiêng trái giúp máu lưu thông tốt. Chọn áo ngực không gọng, thoải mái."],
  ["🥑 Quả bơ", 11.6, 100, "Thai nhi cử động nhiều, mẹ có thể bắt đầu cảm nhận thai máy nhẹ.", "Đứng dậy từ từ để tránh chóng mặt. Cân nặng nên tăng đều, theo dõi theo hướng dẫn của bác sĩ."],
  ["🍠 Củ khoai lang", 13, 140, "Xương cứng dần, thai nhi nghe được âm thanh bên ngoài.", "Dưỡng ẩm da bụng để giảm ngứa. Tránh nằm ngửa quá lâu."],
  ["🫑 Quả ớt chuông", 14.2, 190, "Thai nhi có dấu vân tay riêng. Có thể nhận biết giới tính qua siêu âm.", "Đặt lịch siêu âm hình thái sắp tới. Ăn cá ít thủy ngân như cá hồi, tránh cá kiếm, cá thu lớn."],
  ["🥭 Quả xoài nhỏ", 15.3, 240, "Mẹ thường cảm nhận rõ thai máy.", "Ăn đủ sắt kèm thực phẩm giàu vitamin C để hấp thu tốt. Bị chuột rút thì giãn cơ nhẹ trước khi ngủ."],
  ["🍌 Quả chuối", 25.6, 300, "Chạm mốc nửa thai kỳ! Siêu âm hình thái (tuần 18–22) kiểm tra dị tật.", "Đi siêu âm hình thái và lưu lại kết quả. Cân nhắc đăng ký lớp tiền sản."],
  ["🥕 Củ cà rốt", 26.7, 360, "Thai nhi nuốt nước ối, lông mày và mi mắt hình thành.", "Ăn nhiều bữa nhỏ nếu bị ợ nóng. Kê gối cao đầu khi ngủ."],
  ["🍈 Quả đu đủ nhỏ", 27.8, 430, "Giác quan phát triển mạnh: xúc giác, thính giác.", "Nói chuyện, hát cho bé nghe mỗi ngày. Chú ý phù chân, báo bác sĩ nếu phù nhanh."],
  ["🥭 Quả xoài", 28.9, 501, "Phổi bắt đầu tạo chất hoạt diện. Thai nhi có chu kỳ ngủ - thức.", "Kê cao chân khi nghỉ để bớt phù. Báo bác sĩ nếu phù mặt, tay đột ngột hoặc đau đầu dữ dội."],
  ["🌽 Bắp ngô", 30, 600, "Mốc nghiệm pháp dung nạp đường (tuần 24–28) để tầm soát tiểu đường thai kỳ.", "Làm theo hướng dẫn nhịn ăn trước khi thử đường huyết. Hạn chế nước ngọt và đồ nhiều đường."],
  ["🥦 Bông súp lơ", 34.6, 660, "Thai nhi phản ứng với giọng nói.", "Ăn đủ đạm, sắt và canxi để phòng thiếu máu. Đi bộ nhẹ mỗi ngày nếu bác sĩ cho phép."],
  ["🥬 Cây xà lách", 35.6, 760, "Mắt mở ra, thai nhi nhấp nháy mắt.", "Ngủ nghiêng và dùng gối ôm cho đỡ đau lưng. Chú ý tiểu buốt hoặc ra dịch bất thường."],
  ["🥦 Bông súp lơ lớn", 36.6, 875, "Sắp kết thúc 3 tháng giữa. Não phát triển nhanh.", "Hoàn tất nghiệm pháp đường huyết nếu chưa làm. Tìm hiểu nơi sinh và các lớp tiền sản."],
  ["🍆 Quả cà tím", 37.6, 1005, "Bước vào 3 tháng cuối.", "Bắt đầu đếm cử động thai mỗi ngày. Báo bác sĩ ngay nếu thai máy giảm rõ rệt."],
  ["🎃 Quả bí nhỏ", 38.6, 1153, "Xương cứng hơn, thai nhi tăng cân đều.", "Hỏi bác sĩ về các mũi tiêm phòng theo chỉ định. Chia nhỏ bữa ăn để tránh trào ngược."],
  ["🥬 Bắp cải", 39.9, 1319, "Thai nhi đã có thể điều chỉnh nhiệt độ cơ thể. Mẹ dễ mệt, khó ngủ.", "Tập thở và tìm tư thế ngủ thoải mái. Báo bác sĩ nếu đau đầu dữ dội, nhìn mờ hoặc phù nhiều."],
  ["🥥 Quả dừa", 41.1, 1502, "Thai nhi quay đầu dần xuống dưới. Mẹ có thể có cơn gò Braxton Hicks.", "Gò không đều, hết khi nghỉ là gò sinh lý; gò đều và đau tăng dần cần đi khám. Uống đủ nước."],
  ["🥒 Quả bí ngòi", 42.4, 1702, "Móng tay mọc đủ.", "Bắt đầu soạn đồ đi sinh cho mẹ và bé. Hỏi bác sĩ về tư thế thai."],
  ["🍍 Quả dứa", 43.7, 1918, "Xương sọ còn mềm để dễ sinh. Khám thai 2 tuần/lần.", "Hoàn thiện kế hoạch đi sinh và chọn nơi sinh. Hạn chế đi xa, luôn mang theo sổ khám thai."],
  ["🍈 Quả dưa vàng", 45, 2146, "Phổi gần như hoàn thiện. Thai nhi thường đã ở tư thế đầu hạ thấp.", "Lưu sẵn số điện thoại bác sĩ và nơi sinh. Đi lại nhẹ nhàng, tránh đứng lâu."],
  ["🍈 Quả dưa gang", 46.2, 2383, "Xét nghiệm GBS (tuần 35–37).", "Hoàn tất đồ đi sinh và để sẵn gần cửa. Sắp xếp người đưa đi sinh và đường đi."],
  ["🍈 Quả dưa lê", 47.4, 2622, "Thai gần đủ tháng. Khám thai hằng tuần.", "Hỏi bác sĩ về ngôi thai. Chuẩn bị ghế ô tô cho bé và nghỉ ngơi nhiều."],
  ["🥬 Cây cải romaine", 48.6, 2859, "Thai đủ tháng (từ 37 tuần). Có thể chuyển dạ bất cứ lúc nào.", "Nắm rõ dấu hiệu chuyển dạ và khi nào cần tới viện. Để sẵn sạc điện thoại, CCCD, thẻ BHYT và sổ khám."],
  ["🌿 Cây tỏi tây", 49.8, 3083, "Các cơ quan hoàn thiện, thai nhi sẵn sàng chào đời.", "Đi bộ nhẹ nhàng, ngủ đủ giấc. Đến viện ngay nếu vỡ ối, ra máu hoặc thai máy giảm."],
  ["🍉 Quả dưa hấu nhỏ", 50.7, 3288, "Chú ý dấu hiệu chuyển dạ: gò đều, vỡ ối, ra dịch nhầy hồng.", "Giữ bình tĩnh, ăn nhẹ và uống đủ nước. Kiểm tra lại đồ đi sinh và giấy tờ."],
  ["🎃 Quả bí ngô nhỏ", 51.2, 3462, "Ngày dự sinh! Chỉ khoảng 5% bé sinh đúng ngày, hãy kiên nhẫn chờ.", "Nếu quá ngày dự sinh, bác sĩ sẽ theo dõi sát và tư vấn hướng xử trí. Đừng tự ý dùng mẹo thúc sinh."]
];
