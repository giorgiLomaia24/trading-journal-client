import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import MiniStat from "../components/MiniStat";
import CalendarCell from "../components/CalendarCell";
import DayDetailModal from "../components/DayDetailModal";

import { useTradeStore } from "../store/useTradeStore";
import { useAccountStore } from "../store/useAccountStore";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { monthlyCalendarTrades, fetchMonthlyCalendarTrades, loading } = useTradeStore();
  const activeAccount = useAccountStore((state) => state.activeAccount);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    fetchMonthlyCalendarTrades(year, month, activeAccount?._id || "");
  }, [year, month, activeAccount?._id, fetchMonthlyCalendarTrades]);

  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT", "WEEK"];

  const generateCalendarCells = () => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();
    const cells = [];

    for (let i = firstDayIndex; i > 0; i--) {
      cells.push({
        dayNumber: prevLastDay - i + 1,
        isCurrentMonth: false,
        dateString: `${year}-${String(month).padStart(2, "0")}-${String(prevLastDay - i + 1).padStart(2, "0")}`
      });
    }

    for (let i = 1; i <= lastDay; i++) {
      cells.push({
        dayNumber: i,
        isCurrentMonth: true,
        dateString: `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
      });
    }

    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        dayNumber: i,
        isCurrentMonth: false,
        dateString: `${year}-${String(month + 2).padStart(2, "0")}-${String(i).padStart(2, "0")}`
      });
    }

    return cells;
  };

  const handleCellClick = (dateString) => {
    setSelectedDateStr(dateString);
    setIsModalOpen(true);
  };

  const cells = generateCalendarCells();
  
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  // 🚀 სუპერ მათემატიკა: ჯამურ სტატისტიკას ვითვლით რეალურად დარენდერებული უჯრებიდან,
  // რაც გვერდს უსაფრთხოს ხდის ბექენდის ნებისმიერი პაგინაციის ლიმიტისგან!
  let totalMonthlyTrades = 0;
  let totalMonthlyPnl = 0;
  let winTradesCount = 0;

  weeks.forEach((weekDays) => {
    weekDays.forEach((cell) => {
      if (cell.isCurrentMonth && monthlyCalendarTrades[cell.dateString]) {
        const dayTrades = monthlyCalendarTrades[cell.dateString];
        totalMonthlyTrades += dayTrades.length;
        
        dayTrades.forEach(t => {
          totalMonthlyPnl += t.pnl || 0;
          if (t.pnl > 0) {
            winTradesCount++; // 🚀 მხოლოდ რეალური მოგება ითვლება (Breakeven აღარ ითვლება მოგებად!)
          }
        });
      }
    });
  });

  const monthlyWinRate = totalMonthlyTrades > 0 ? ((winTradesCount / totalMonthlyTrades) * 100).toFixed(0) : 0;

  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#040405] text-[#f3f4f6] p-3 sm:p-8 font-sans selection:bg-[#0ecb81]/30 text-left">
      <div className="max-w-7xl mx-auto bg-[#09090b] border border-[#1f2023] rounded-xl p-4 sm:p-6 shadow-2xl space-y-6">
        
        {/* 1. ზედა პანელი: თვის მართვა და სტატისტიკის ფილები */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f2023] pb-5">
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              icon="⬅️"
              className="!p-2.5"
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            />
            <h1 className="text-sm sm:text-md font-black tracking-tight min-w-[130px] text-center flex items-center justify-center gap-2">
              <span>📅</span> {monthsList[month]} {year}
            </h1>
            <Button
              variant="outline"
              icon="➡️"
              className="!p-2.5"
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <MiniStat label="Trades" value={totalMonthlyTrades} />
            <MiniStat 
              label="P&L" 
              value={totalMonthlyPnl >= 0 ? `+$${totalMonthlyPnl.toFixed(2)}` : `-$${Math.abs(totalMonthlyPnl).toFixed(2)}`} 
              variant={totalMonthlyPnl >= 0 ? "success" : "danger"}
            />
            <MiniStat label="Win" value={`${monthlyWinRate}%`} variant={monthlyWinRate >= 50 ? "success" : "danger"} />
            <Button
              variant="outline"
              icon="🗓️"
              className="!py-1.5 !px-3 !text-xs ml-auto sm:ml-0"
              onClick={() => setCurrentDate(new Date())} 
            >
              Today
            </Button>
          </div>
        </div>

        {/* 2. კალენდრის მთავარი ბადე */}
        <div className="w-full space-y-1.5">
          <div className="grid grid-cols-7 md:grid-cols-8 text-center gap-1.5 border-b border-[#1f2023]/40 pb-2">
            {daysOfWeek.map((day) => {
              if (day === "WEEK") {
                return (
                  <span key={day} className="hidden md:inline-block text-[10px] font-black text-[#4b5563] tracking-widest">
                    {day}
                  </span>
                );
              }
              return (
                <span key={day} className="text-[10px] font-black text-[#4b5563] tracking-widest">
                  {day[0]}
                </span>
              );
            })}
          </div>

          <div className="space-y-1.5">
            {weeks.map((weekDays, weekIdx) => {
              let weekPnl = 0;
              let weekTradesCount = 0;

              weekDays.forEach((cell) => {
                if (cell.isCurrentMonth && monthlyCalendarTrades[cell.dateString]) {
                  const dayTrades = monthlyCalendarTrades[cell.dateString];
                  weekPnl += dayTrades.reduce((sum, t) => sum + t.pnl, 0);
                  weekTradesCount += dayTrades.length;
                }
              });

              return (
                <div key={weekIdx} className="grid grid-cols-7 md:grid-cols-8 gap-1.5 items-center">
                  {weekDays.map((cell, dayIdx) => {
                    const dayTrades = monthlyCalendarTrades[cell.dateString] || [];
                    const dayPnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
                    const isTodayCell = cell.dateString === todayStr;

                    return (
                      <CalendarCell
                        key={dayIdx}
                        dayNumber={cell.dayNumber}
                        isCurrentMonth={cell.isCurrentMonth}
                        pnl={dayPnl}
                        tradesCount={dayTrades.length}
                        isToday={isTodayCell}
                        onClick={() => handleCellClick(cell.dateString)}
                      />
                    );
                  })}

                  <div className="hidden md:block">
                    <CalendarCell
                      isWeekSummary={true}
                      pnl={weekPnl}
                      tradesCount={weekTradesCount}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DayDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          dateStr={selectedDateStr}
          trades={monthlyCalendarTrades[selectedDateStr] || []}
        />

      </div>
    </div>
  );
}
