import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "vi" | "en";

interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Translations> = {
  vi: {
    // Nav
    "nav.home": "Trang chủ",
    "nav.mission": "Sứ mệnh",
    "nav.ecosystem": "Hệ sinh thái",
    "nav.mantras": "Thần chú",
    "nav.chat": "Chat với Angel AI",
    "nav.journal": "Nhật Ký Tâm Linh",
    "nav.profile": "Hồ Sơ",
    "nav.leaderboard": "Bảng Xếp Hạng",
    "nav.gallery": "Thư Viện Ánh Sáng",
    "nav.login": "Đăng nhập",
    
    // Common
    "common.loading": "Đang tải...",
    "common.back": "Quay lại",
    "common.save": "Lưu",
    "common.cancel": "Huỷ",
    "common.delete": "Xoá",
    "common.share": "Chia sẻ",
    "common.download": "Tải về",
    "common.search": "Tìm kiếm",
    "common.continue": "Tiếp tục",
    
    // Leaderboard
    "leaderboard.title": "Bảng Xếp Hạng Ánh Sáng",
    "leaderboard.subtitle": "Những Thiên Thần Ánh Sáng tỏa sáng nhất trong cộng đồng",
    "leaderboard.yourRank": "Thứ hạng của bạn",
    "leaderboard.keepShining": "Hãy tiếp tục tỏa sáng để leo hạng!",
    
    // Gallery
    "gallery.title": "Thư Viện Ánh Sáng",
    "gallery.all": "Tất cả",
    "gallery.mine": "Của tôi",
    "gallery.images": "Ảnh",
    "gallery.videos": "Video",
    "gallery.newest": "Mới nhất",
    "gallery.popular": "Phổ biến",
    "gallery.noItems": "Chưa có sáng tạo nào trong thư viện",
    "gallery.shareNow": "Hãy tạo và chia sẻ Ánh Sáng của bạn!",
    
    // Chat
    "chat.placeholder": "Chia sẻ với Angel AI...",
    "chat.newChat": "Cuộc trò chuyện mới",
    "chat.send": "Gửi",
    
    // Journal
    "journal.title": "Nhật Ký Tâm Linh",
    "journal.newEntry": "Bài viết mới",
    "journal.totalEntries": "Tổng số bài",
    "journal.thisMonth": "Tháng này",
    "journal.gratitude": "Biết ơn",
    "journal.search": "Tìm kiếm nhật ký...",
    "journal.noEntries": "Chưa có bài viết nào",
    "journal.startWriting": "Bắt đầu viết để ghi lại hành trình tâm linh của bạn",
    
    // Profile
    "profile.title": "Hồ Sơ Cá Nhân",
    "profile.displayName": "Tên hiển thị",
    "profile.lightScore": "Điểm Ánh Sáng",
    "profile.followers": "người theo dõi",
    "profile.following": "đang theo dõi",
    "profile.anonymous": "Ẩn danh",
    "profile.notFound": "Không tìm thấy người dùng",
    "profile.creations": "Sáng tạo",
    "profile.achievements": "Thành tích",
    "profile.noCreations": "Chưa có sáng tạo nào",
    "profile.noAchievements": "Chưa đạt được thành tích nào",
    
    // Light Score Levels
    "level.1": "Hạt Giống Ánh Sáng",
    "level.2": "Đệ Tử Ánh Sáng",
    "level.3": "Người Tìm Ánh Sáng",
    "level.4": "Người Giữ Ánh Sáng",
    "level.5": "Chiến Binh Ánh Sáng",
    "level.6": "Sứ Giả Ánh Sáng",
    "level.7": "Thiên Thần Ánh Sáng",
    
    // Share Modal
    "share.title": "Chia sẻ vào Thư Viện Ánh Sáng",
    "share.inputTitle": "Tiêu đề",
    "share.inputDescription": "Mô tả (tuỳ chọn)",
    "share.success": "Chia sẻ thành công!",
    "share.successDesc": "Sáng tạo của bạn đã được thêm vào Thư Viện Ánh Sáng.",
    
    // Creator
    "creator.imageTitle": "Đồng Sáng Tạo Ánh Sáng ✨",
    "creator.videoTitle": "Đồng Sáng Tạo Video ✨",
    "creator.generating": "Đang tạo...",
    "creator.generate": "Tạo Hình Ảnh Ánh Sáng",
    "creator.generateVideo": "Tạo Video Ánh Sáng",
    "creator.downloadLight": "Tải về Ánh Sáng",
    "creator.shareInFun": "Chia sẻ trong FUN",
    
    // Achievements
    "achievements.all": "Tất cả",
    "achievements.lightScore": "Điểm",
    "achievements.journal": "Nhật ký",
    "achievements.gallery": "Thư viện",
    "achievements.chat": "Chat",
    "achievements.likes": "Lượt thích",
    "achievements.streak": "Streak",
    "achievements.progress": "Tiến độ",
    "achievements.unlocked": "🎉 Mở khóa thành tích!",
    "achievements.bonusPoints": "điểm thưởng",
    
    // Challenges
    "challenges.daily": "Thử thách hôm nay",
    "challenges.completed": "Hoàn thành",
    "challenges.points": "điểm",
    
    // Streak
    "streak.days": "ngày",
    "streak.best": "Kỷ lục",
    
    // Notifications
    "notifications.title": "Thông báo",
    "notifications.markAllRead": "Đọc tất cả",
    "notifications.empty": "Không có thông báo mới",
    
    // Follow
    "follow.follow": "Theo dõi",
    "follow.unfollow": "Bỏ theo dõi",
  },
  en: {
    // Nav
    "nav.home": "Home",
    "nav.mission": "Mission",
    "nav.ecosystem": "Ecosystem",
    "nav.mantras": "Mantras",
    "nav.chat": "Chat with Angel AI",
    "nav.journal": "Spiritual Journal",
    "nav.profile": "Profile",
    "nav.leaderboard": "Leaderboard",
    "nav.gallery": "Light Gallery",
    "nav.login": "Login",
    
    // Common
    "common.loading": "Loading...",
    "common.back": "Back",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.share": "Share",
    "common.download": "Download",
    "common.search": "Search",
    "common.continue": "Continue",
    
    // Leaderboard
    "leaderboard.title": "Light Score Leaderboard",
    "leaderboard.subtitle": "The brightest Light Angels in the community",
    "leaderboard.yourRank": "Your rank",
    "leaderboard.keepShining": "Keep shining to climb the ranks!",
    
    // Gallery
    "gallery.title": "Light Gallery",
    "gallery.all": "All",
    "gallery.mine": "Mine",
    "gallery.images": "Images",
    "gallery.videos": "Videos",
    "gallery.newest": "Newest",
    "gallery.popular": "Popular",
    "gallery.noItems": "No creations in the gallery yet",
    "gallery.shareNow": "Create and share your Light!",
    
    // Chat
    "chat.placeholder": "Share with Angel AI...",
    "chat.newChat": "New conversation",
    "chat.send": "Send",
    
    // Journal
    "journal.title": "Spiritual Journal",
    "journal.newEntry": "New Entry",
    "journal.totalEntries": "Total entries",
    "journal.thisMonth": "This month",
    "journal.gratitude": "Gratitude",
    "journal.search": "Search journal...",
    "journal.noEntries": "No entries yet",
    "journal.startWriting": "Start writing to record your spiritual journey",
    
    // Profile
    "profile.title": "Personal Profile",
    "profile.displayName": "Display name",
    "profile.lightScore": "Light Score",
    "profile.followers": "followers",
    "profile.following": "following",
    "profile.anonymous": "Anonymous",
    "profile.notFound": "User not found",
    "profile.creations": "Creations",
    "profile.achievements": "Achievements",
    "profile.noCreations": "No creations yet",
    "profile.noAchievements": "No achievements earned yet",
    
    // Light Score Levels
    "level.1": "Light Seed",
    "level.2": "Light Disciple",
    "level.3": "Light Seeker",
    "level.4": "Light Keeper",
    "level.5": "Light Warrior",
    "level.6": "Light Messenger",
    "level.7": "Light Angel",
    
    // Share Modal
    "share.title": "Share to Light Gallery",
    "share.inputTitle": "Title",
    "share.inputDescription": "Description (optional)",
    "share.success": "Shared successfully!",
    "share.successDesc": "Your creation has been added to the Light Gallery.",
    
    // Creator
    "creator.imageTitle": "Co-Create Light ✨",
    "creator.videoTitle": "Co-Create Video ✨",
    "creator.generating": "Generating...",
    "creator.generate": "Generate Light Image",
    "creator.generateVideo": "Generate Light Video",
    "creator.downloadLight": "Download Light",
    "creator.shareInFun": "Share in FUN",
    
    // Achievements
    "achievements.all": "All",
    "achievements.lightScore": "Score",
    "achievements.journal": "Journal",
    "achievements.gallery": "Gallery",
    "achievements.chat": "Chat",
    "achievements.likes": "Likes",
    "achievements.streak": "Streak",
    "achievements.progress": "Progress",
    "achievements.unlocked": "🎉 Achievement Unlocked!",
    "achievements.bonusPoints": "bonus points",
    
    // Challenges
    "challenges.daily": "Daily Challenge",
    "challenges.completed": "Completed",
    "challenges.points": "points",
    
    // Streak
    "streak.days": "days",
    "streak.best": "Best",
    
    // Notifications
    "notifications.title": "Notifications",
    "notifications.markAllRead": "Mark all read",
    "notifications.empty": "No new notifications",
    
    // Follow
    "follow.follow": "Follow",
    "follow.unfollow": "Unfollow",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("angel-ai-language");
    return (saved as Language) || "vi";
  });

  useEffect(() => {
    localStorage.setItem("angel-ai-language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
