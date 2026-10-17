// ==================== PART 1 ====================
import React, { useState, useRef, useEffect } from "react";

const pad = (n) => String(n).padStart(2, "0");
const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseDateStr = (s) => {
  if (typeof s !== "string" || !s) return null;
  const parts = s.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d); // ლოკალური თარიღი, UTC გარეშე
};
const ordinal = (n) => {
  if (n % 100 >= 11 && n % 100 <= 13) return "th";
  return { 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th";
};

export default function InputField({
  label,
  type = "text", // text, number, select, tabs, date, time, textarea, file
  placeholder = "",
  options = [],
  isMulti = false,
  value,
  onChange,
  onAction,
  hint,
  disabled = false,
  maxFiles = 6,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [previews, setPreviews] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ტაბების (Result Tabs) ურთიერთგამომრიცხავი ლოგიკა (Win/Loss/Partial)
  const handleTabClick = (optionValue) => {
    const currentValues = Array.isArray(value) ? value : [];

    if (currentValues.includes(optionValue)) {
      onChange(currentValues.filter((v) => v !== optionValue));
      return;
    }

    let newValues = [...currentValues];

    if (optionValue === "win") {
      newValues = newValues.filter((v) => v !== "loss" && v !== "partial");
    } else if (optionValue === "loss") {
      newValues = newValues.filter((v) => v !== "win" && v !== "partial");
    } else if (optionValue === "partial") {
      newValues = newValues.filter((v) => v !== "win" && v !== "loss");
    }

    newValues.push(optionValue);
    onChange(newValues);
  };
  // ==================== PART 2 ====================
  // დროპდაუნის ოფციების მართვა (Single და Multi სელექტი)
  const handleSelectOption = (optionValue) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter((v) => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  // ფაილების ატვირთვის მართვა მაქსიმუმ 6 ფოტომდე და პრევიუების გენერაცია
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previews.length > maxFiles) {
      alert(`მაქსიმუმ შეგიძლიათ ატვირთოთ ${maxFiles} ფოტო`);
      return;
    }
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews([...previews, ...newPreviews]);
    if (onChange) onChange([...previews, ...newPreviews].map((p) => p.file));
  };

  // ატვირთული ფოტოს წაშლა სიიდან
  const removeFile = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    if (onChange) onChange(updated.map((p) => p.file));
  };

  // ==================== CUSTOM CALENDAR & TIME LOGIC (PART 1) ====================
  const initialDate = (type === "date" && parseDateStr(value)) || new Date();
  const [currentDate, setCurrentDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef(null);



  useEffect(() => {
    if (type !== "date") return;
    const d = parseDateStr(value);
    if (d) {
      setSelectedDate(d);
      setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }, [value, type]);

  // კალენდრის გარეთ დაკლიკებისას დახურვა
  useEffect(() => {
    function handleOutsideCalendar(e) {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideCalendar);
    return () => document.removeEventListener("mousedown", handleOutsideCalendar);
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // თვის დღეების გენერაცია
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();

    const days = [];

    // წინა თვის დღეები (ნაცრისფრად რომ გამოჩნდეს)
    for (let i = firstDayIndex; i > 0; i--) {
      days.push({ day: prevLastDay - i + 1, isCurrentMonth: false, date: new Date(year, month - 1, prevLastDay - i + 1) });
    }

    // მიმდინარე თვის დღეები
    for (let i = 1; i <= lastDay; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }

    // შემდეგი თვის დღეები, ბადის შესავსებად (42 უჯრა)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // const formatDisplayDate = (date) => {
  //   const day = date.getDate();
  //   const monthStr = months[date.getMonth()];
  //   const year = date.getFullYear();

  //   // სუფიქსის მინიჭება (13th, 1st, 2nd)
  //   let suffix = "th";
  //   if (day === 1 || day === 31) suffix = "st";
  //   else if (day === 2) suffix = "nd";
  //   else if (day === 3) suffix = "rd";

  //   return `${monthStr} ${day}${suffix}, ${year}`;
  // };

  const formatDisplayDate = (date) =>
    `${months[date.getMonth()]} ${date.getDate()}${ordinal(date.getDate())}, ${date.getFullYear()}`;


  // საერთო სტილების ბლოკი დიზაინის სისუფთავისთვის
  const baseInputStyles =
    "w-full bg-[#0d0d0e] text-[#f3f4f6] border border-[#1f2023] rounded-lg px-4 py-3 text-sm placeholder-[#4b5563] focus:outline-none transition-all";

  const activeInputStyles = disabled
    ? "bg-[#141517] text-[#6b7280] cursor-not-allowed border-[#1f2023]"
    : "focus:border-[#0ecb81] focus:ring-1 focus:ring-[#0ecb81]";
  // ==================== PART 3 ====================
  return (
    <div className="flex flex-col gap-1.5 w-full text-left font-sans">
      {/* 1. ინფუთის დასახელება (Label) */}
      {label && (
        <label className="text-xs font-semibold text-[#9ca3af] tracking-wide">
          {label}
        </label>
      )}

      {/* 2. ქეისი: ტაბები (Result) */}
      {type === "tabs" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
          {options.map((option) => {
            const isSelected = value?.includes(option.value);

            // დინამიური ფერები აქტიური ტაბების ბორდერისა და ტექსტისთვის (მწვანე აქცენტით)
            const activeBorder = option.value === 'win'
              ? 'border-[#0ecb81]'
              : option.value === 'loss'
                ? 'border-[#ef4444]'
                : 'border-[#0ecb81]'; // 'partial' და ნებისმიერი სხვა მნიშვნელობა ახლა ხდება მწვანე

            const activeText = option.value === 'win'
              ? 'text-[#0ecb81]'
              : option.value === 'loss'
                ? 'text-[#ef4444]'
                : 'text-[#0ecb81]'; // ტექსტიც მწვანე ხდება

            const activeBg = option.value === 'win'
              ? 'bg-[#0ecb81]/10' // ოდნავ გამჭვირვალე მწვანე ფონი, რომ ტექსტი იკითხებოდეს
              : option.value === 'loss'
                ? 'bg-[#ef4444]/5'
                : 'bg-[#0ecb81]/10'; // ფონიც მწვანე ხდება იისფერის ნაცვლად

            const activeRing = option.value === 'loss' ? 'ring-[#ef4444]' : 'ring-[#0ecb81]';

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleTabClick(option.value)}
                // მოვაწესრიგე კლასების სტრინგი (\$ ნიშნები და ფრჩხილები), რომ ცვლადები სწორად ჩაჯდეს
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all select-none ${isSelected
                  ? `${activeBorder} ${activeText} ${activeBg} ring-1 ${activeRing}`
                  : "border-[#1f2023] text-[#6b7280] bg-[#1f1f21] hover:text-[#f3f4f6] hover:border-[#2f3036]"
                  }`}
              >
                {/* წერტილის ფერისთვისაც თუ option.dotColor-ში იისფერი გეწერა, მწვანეზე გადავა თუ win/partial-ია */}
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: option.value === 'loss' ? '#ef4444' : '#0ecb81'
                  }}
                />
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. ქეისი: ტექსტარეა */}
      {type === "textarea" && (
        <textarea
          className={`${baseInputStyles} ${activeInputStyles} resize-none min-h-[100px]`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      )}

      {/* 4. ქეისი: ლამაზი დროპდაუნი */}
      {type === "select" && (
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => !disabled && setIsOpen(!isOpen)}
            // აქ იისფერი focus:border-[#a855f7] შევცვალეთ მწვანე focus:border-[#0ecb81]-ით
            className={`${baseInputStyles} ${disabled ? "bg-[#141517] text-[#6b7280] cursor-not-allowed" : "cursor-pointer focus:border-[#0ecb81]"} flex items-center justify-between min-h-[46px] select-none`}
          >
            <div className="flex flex-wrap gap-1.5">
              {isMulti ? (
                Array.isArray(value) && value.length > 0 ? (
                  value.map((v) => {
                    const opt = options.find((o) => o.value === v);
                    return (
                      <span key={v} className="bg-[#1f2023] text-xs px-2 py-0.5 rounded text-white border border-[#2f3036]">
                        {opt ? opt.label : v}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-[#4b5563]">{placeholder || "Select Option"}</span>
                )
              ) : (
                <span className="text-[#f3f4f6]">
                  {options.find((o) => o.value === value)?.label || placeholder || "Select Option"}
                </span>
              )}
            </div>
            <svg className={`w-4 h-4 text-[#6b7280] transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1.5 bg-[#0d0d0e] border border-[#1f2023] rounded-lg shadow-2xl p-1 max-h-60 overflow-y-auto">
              {options.map((option) => {
                const isSelected = isMulti ? value?.includes(option.value) : value === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      if (option.isAction) {
                        setIsOpen(false);
                        onAction && onAction(option.value);
                      } else {
                        handleSelectOption(option.value);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors text-left ${option.isAction ? "border-t border-[#1f2023] mt-1 font-bold hover:bg-[#151618]"
                        : isSelected ? "bg-[#1f2023] text-white" : "text-[#9ca3af] hover:bg-[#151618] hover:text-white"
                      }`}
                    style={option.isAction && option.textColor ? { color: option.textColor } : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {option.dotColor && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: option.dotColor }} />}
                      <span>{option.label}</span>
                    </div>
                    {isSelected && (
                      // აქ პტიჩკის ფერი text-[#a855f7] შევცვალეთ მწვანე text-[#0ecb81]-ით
                      <svg className="w-4 h-4 text-[#0ecb81]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. ქეისი: ფოტოების ჩამგდები პრევიუებით */}
      {type === "file" && (
        <div className="flex flex-col gap-3">
          <label className="border border-dashed border-[#1f2023] hover:border-[#0ecb81] bg-[#0d0d0e] transition-colors rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer group">
            <span className="text-sm text-[#9ca3af]">Drag and drop files here, or browse</span>
            <span className="text-xs text-[#4b5563]">Max {maxFiles} images (PNG, JPG)</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
          {previews.length > 0 && (
            <div className="grid grid-cols-6 gap-2">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-[#1f2023] group">
                  <img src={preview.url} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-black/75 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. ქეისი: ჩვეულებრივი სტანდარტული ინფუთები */}
      {/* 6. ქეისი: CUSTOM კალენდარი */}
      {type === "date" && (
        <div className="relative" ref={calendarRef}>
          {/* კალენდრის ინფუთი */}
          <div
            onClick={() => !disabled && setCalendarOpen(!calendarOpen)}
            className={`${baseInputStyles} ${disabled ? "bg-[#141517] text-[#6b7280] cursor-not-allowed" : "cursor-pointer focus:border-[#10b981]"} flex items-center gap-2.5 min-h-[46px] select-none`}
          >
            <svg className="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {/* <span className="text-[#f3f4f6]">
              {value ? formatDisplayDate(new Date(value)) : formatDisplayDate(selectedDate)}
            </span> */}
            <span className="text-[#f3f4f6]">
              {formatDisplayDate(parseDateStr(value) || selectedDate)}
            </span>
          </div>

          {/* კალენდრის მცურავი პოპაპი (ზუსტად როგორც სურათზეა) */}
          {calendarOpen && (
            <div className="absolute z-50 bottom-full mb-2 left-0 w-[340px] bg-[#09090b] border border-[#1f2023] rounded-xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">

              {/* კალენდრის ჰედერი: თვე, წელი და ისრები */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 border border-[#1f2023] rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#141517] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span className="text-sm font-bold text-[#f3f4f6]">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 border border-[#1f2023] rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#141517] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              {/* კვირის დღეები (Sun, Mon...) */}
              <div className="grid grid-cols-7 text-center mb-2">
                {daysOfWeek.map((day) => (
                  <span key={day} className="text-[11px] font-semibold text-[#4b5563]">
                    {day}
                  </span>
                ))}
              </div>

              {/* დღეების რიცხვების ბადე (Grid) */}
              <div className="grid grid-cols-7 text-center gap-y-1">
                {getDaysInMonth(currentDate).map((cell, idx) => {
                  const isSelected = selectedDate.getDate() === cell.date.getDate() &&
                    selectedDate.getMonth() === cell.date.getMonth() &&
                    selectedDate.getFullYear() === cell.date.getFullYear();

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedDate(cell.date);
                        if (onChange) onChange(toDateStr(cell.date)); // ლოკალური YYYY-MM-DD
                        setCalendarOpen(false);
                      }}
                      className={`h-9 w-9 mx-auto flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all relative ${!cell.isCurrentMonth
                        ? "text-[#2e3035] hover:text-[#4b5563]"
                        : isSelected
                          ? "bg-[#10b981] text-black font-bold shadow-md shadow-[#10b981]/20"
                          : "text-[#f3f4f6] hover:bg-[#141517]"
                        }`}
                    >
                      <span>{cell.day}</span>
                      {/* პატარა წერტილი მონიშნული დღის ქვემოთ (როგორც სურათზეა) */}
                      {isSelected && (
                        <span className="w-1 h-1 bg-black rounded-full absolute bottom-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ქვედა სექცია: მიმდინარე თარიღის ჩვენება (ზუსტად სურათის მსგავსად) */}
              <div className="mt-4 pt-3 border-t border-[#1f2023] flex items-center gap-2 text-left text-xs text-[#9ca3af] px-1">
                <svg className="w-3.5 h-3.5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDisplayDate(selectedDate)}</span>
              </div>

            </div>
          )}
        </div>
      )}

      {/* 7. ქეისი: CUSTOM დროის (Time) ინფუთი ციფრების ავტომატური ფორმატირებით */}
      {type === "time" && (
        <div className="relative flex items-center">
          <input
            type="text"
            maxLength={4}
            placeholder={placeholder || "0930"}
            value={value}
            onChange={(e) => {
              // მხოლოდ ციფრების შეყვანის ნება
              const val = e.target.value.replace(/\D/g, "");
              onChange(val);
            }}
            disabled={disabled}
            className={`${baseInputStyles} ${activeInputStyles} tracking-wider font-mono`}
          />
          {/* პატარა საათის აიქონი ინფუთის მარჯვენა მხარეს სისუფთავისთვის */}
          <div className="absolute right-4 text-[#4b5563]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* 8. ქეისი: სტანდარტული ინფუთები (TEXT და NUMBER) */}
      {["text", "number"].includes(type) && (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${baseInputStyles} ${activeInputStyles}`}
        />
      )}

      {hint && <span className="text-[11px] text-[#4b5563] pl-0.5">{hint}</span>}
    </div>
  );
}


