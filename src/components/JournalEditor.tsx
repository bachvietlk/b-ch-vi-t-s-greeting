import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { 
  X, 
  Save, 
  Heart, 
  Star, 
  Smile, 
  Frown, 
  Meh, 
  Sparkles, 
  Sun, 
  Cloud,
  Plus,
  Hash,
  BookOpen,
  Feather,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { JournalEntry, NewJournalEntry } from "@/hooks/useJournal";

interface JournalEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: NewJournalEntry) => Promise<any>;
  editingEntry?: JournalEntry | null;
}

const moods = [
  { id: "grateful", icon: Heart, color: "from-pink-400 to-rose-500", bgColor: "bg-pink-50", label: "Biết ơn", emoji: "🙏" },
  { id: "peaceful", icon: Sparkles, color: "from-purple-400 to-violet-500", bgColor: "bg-purple-50", label: "Bình an", emoji: "✨" },
  { id: "happy", icon: Smile, color: "from-yellow-400 to-amber-500", bgColor: "bg-yellow-50", label: "Vui vẻ", emoji: "😊" },
  { id: "reflective", icon: Star, color: "from-blue-400 to-indigo-500", bgColor: "bg-blue-50", label: "Suy tư", emoji: "💭" },
  { id: "hopeful", icon: Sun, color: "from-orange-400 to-amber-500", bgColor: "bg-orange-50", label: "Hy vọng", emoji: "🌟" },
  { id: "neutral", icon: Meh, color: "from-slate-400 to-gray-500", bgColor: "bg-slate-50", label: "Bình thường", emoji: "😐" },
  { id: "cloudy", icon: Cloud, color: "from-slate-300 to-gray-400", bgColor: "bg-gray-50", label: "U ám", emoji: "☁️" },
  { id: "sad", icon: Frown, color: "from-gray-400 to-slate-500", bgColor: "bg-gray-50", label: "Buồn", emoji: "😢" },
];

const JournalEditor = ({ isOpen, onClose, onSave, editingEntry }: JournalEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string>("");
  const [gratitude, setGratitude] = useState<string[]>([]);
  const [gratitudeInput, setGratitudeInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const today = format(new Date(), "EEEE, dd MMMM yyyy", { locale: vi });

  useEffect(() => {
    if (editingEntry) {
      setTitle(editingEntry.title);
      setContent(editingEntry.content);
      setMood(editingEntry.mood || "");
      setGratitude(editingEntry.gratitude || []);
      setTags(editingEntry.tags || []);
    } else {
      resetForm();
    }
  }, [editingEntry, isOpen]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setMood("");
    setGratitude([]);
    setGratitudeInput("");
    setTags([]);
    setTagInput("");
  };

  const handleAddGratitude = () => {
    if (gratitudeInput.trim() && gratitude.length < 3) {
      setGratitude([...gratitude, gratitudeInput.trim()]);
      setGratitudeInput("");
    }
  };

  const handleRemoveGratitude = (index: number) => {
    setGratitude(gratitude.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim().toLowerCase().replace(/[^a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/g, "");
    if (newTag && tags.length < 3 && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsSaving(true);
    try {
      const entry: NewJournalEntry = {
        title: title.trim(),
        content: content.trim(),
        mood: mood || undefined,
        gratitude: gratitude.length > 0 ? gratitude : undefined,
        tags: tags.length > 0 ? tags : undefined,
      };
      
      await onSave(entry);
      resetForm();
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const selectedMood = moods.find(m => m.id === mood);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[hsl(35_50%_10%/0.5)] backdrop-blur-md z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 m-auto w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-[95%] lg:w-[90%] max-w-5xl h-fit max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] bg-gradient-to-b from-[hsl(45_50%_99%)] to-[hsl(45_40%_97%)] rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden"
          >
            {/* Decorative Header */}
            <div className="relative bg-gradient-to-r from-[hsl(43_85%_55%)] via-[hsl(38_90%_60%)] to-[hsl(43_85%_55%)] p-5 pb-6">
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-4 w-8 h-8 border-2 border-white rounded-full" />
                <div className="absolute top-4 right-8 w-4 h-4 border border-white rounded-full" />
                <div className="absolute bottom-3 left-1/4 w-3 h-3 bg-white rounded-full" />
                <div className="absolute top-6 right-1/3 w-2 h-2 bg-white rounded-full" />
              </div>
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header content */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {editingEntry ? (
                    <Feather className="w-6 h-6 text-white" />
                  ) : (
                    <BookOpen className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingEntry ? "Sửa nhật ký" : "Viết nhật ký"}
                  </h2>
                  <p className="text-white/80 text-sm flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {today}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Title Input - Simplified */}
              <div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="✨ Tiêu đề hành trình hôm nay..."
                  className="bg-white/80 border-[hsl(43_50%_85%)] focus:border-[hsl(43_85%_50%)] focus:ring-2 focus:ring-[hsl(43_85%_50%/0.2)] text-base font-medium placeholder:text-[hsl(35_30%_60%)] rounded-xl h-12"
                  maxLength={100}
                />
              </div>

              {/* Mood Selection - Compact Grid */}
              <div>
                <p className="text-sm font-medium text-[hsl(35_40%_35%)] mb-2">Tâm trạng</p>
                <div className="grid grid-cols-4 gap-2">
                  {moods.map((m) => {
                    const isSelected = mood === m.id;
                    return (
                      <motion.button
                        key={m.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMood(isSelected ? "" : m.id)}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all ${
                          isSelected 
                            ? `bg-gradient-to-br ${m.color} text-white shadow-lg` 
                            : `${m.bgColor} text-[hsl(35_40%_40%)] hover:shadow-md border border-transparent hover:border-[hsl(43_50%_80%)]`
                        }`}
                      >
                        <span className="text-lg">{m.emoji}</span>
                        <span className="text-[10px] font-medium leading-tight">{m.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Content Textarea - Enhanced */}
              <div>
                <div className="relative">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Hôm nay, điều gì khiến tâm hồn con rung động?&#10;&#10;Hãy viết về những suy nghĩ, cảm xúc, hoặc bài học mà con nhận được..."
                    className="min-h-[140px] bg-white/80 border-[hsl(43_50%_85%)] focus:border-[hsl(43_85%_50%)] focus:ring-2 focus:ring-[hsl(43_85%_50%/0.2)] resize-none rounded-xl text-[15px] leading-relaxed placeholder:text-[hsl(35_30%_60%)] placeholder:leading-relaxed"
                    maxLength={5000}
                  />
                  <p className="absolute bottom-2 right-3 text-[10px] text-[hsl(35_30%_60%)]">
                    {content.length}/5000
                  </p>
                </div>
              </div>

              {/* Gratitude - Simplified */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-3 border border-pink-100">
                <p className="text-sm font-medium text-pink-700 mb-2 flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  Điều biết ơn
                  <span className="text-xs text-pink-400 font-normal">({gratitude.length}/3)</span>
                </p>
                <div className="flex gap-2">
                  <Input
                    value={gratitudeInput}
                    onChange={(e) => setGratitudeInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddGratitude())}
                    placeholder="Con biết ơn vì..."
                    className="flex-1 bg-white border-pink-200 focus:border-pink-400 rounded-lg text-sm h-9"
                    maxLength={80}
                    disabled={gratitude.length >= 3}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddGratitude}
                    disabled={!gratitudeInput.trim() || gratitude.length >= 3}
                    className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg h-9 px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {gratitude.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {gratitude.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-sm text-pink-800 bg-white rounded-lg px-3 py-1.5"
                      >
                        <span className="text-pink-500">♥</span>
                        <span className="flex-1 truncate">{item}</span>
                        <button
                          onClick={() => handleRemoveGratitude(index)}
                          className="text-pink-400 hover:text-pink-600 shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags - Compact */}
              <div>
                <p className="text-sm font-medium text-[hsl(35_40%_35%)] mb-2 flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-[hsl(43_85%_45%)]" />
                  Thẻ gắn
                  <span className="text-xs text-[hsl(35_30%_55%)] font-normal">({tags.length}/3)</span>
                </p>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="biếtơn, bìnhan..."
                    className="flex-1 bg-white/80 border-[hsl(43_50%_85%)] rounded-lg text-sm h-9"
                    maxLength={15}
                    disabled={tags.length >= 3}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || tags.length >= 3}
                    className="bg-[hsl(43_85%_50%)] hover:bg-[hsl(43_85%_45%)] text-white rounded-lg h-9 px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-[hsl(43_60%_92%)] text-[hsl(35_60%_30%)] cursor-pointer hover:bg-[hsl(43_50%_85%)] rounded-full px-2.5 py-0.5"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        #{tag} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Sticky */}
            <div className="p-4 border-t border-[hsl(43_40%_92%)] bg-[hsl(45_40%_98%)] flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-[hsl(43_40%_85%)] text-[hsl(35_40%_40%)] rounded-xl h-11"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                disabled={!title.trim() || !content.trim() || isSaving}
                className="flex-1 bg-gradient-to-r from-[hsl(43_85%_55%)] to-[hsl(38_90%_50%)] hover:from-[hsl(43_85%_50%)] hover:to-[hsl(38_90%_45%)] text-white rounded-xl h-11 font-medium shadow-lg shadow-[hsl(43_85%_50%/0.3)]"
              >
                {isSaving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu nhật ký
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JournalEditor;
