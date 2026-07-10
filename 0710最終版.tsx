import React, { useState, useMemo } from 'react';
import { Plus, Trash2, AlertTriangle, HelpCircle, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const initialCategories = [
  { id: 1, name: '🏠 房租', amount: 12000, percentage: 40 },
  { id: 2, name: '🍱 生活', amount: 6000, percentage: 20 },
  { id: 3, name: '🚗 交通', amount: 1500, percentage: 5 },
  { id: 4, name: '❤️ 孝親', amount: 3000, percentage: 10 },
  { id: 5, name: '💰 投資', amount: 3000, percentage: 10 },
  { id: 6, name: '✈️ 旅遊基金', amount: 1500, percentage: 5 },
  { id: 7, name: '📚 進修', amount: 1500, percentage: 5 },
  { id: 8, name: '🎁 娛樂', amount: 1500, percentage: 5 },
];

const COLORS = ['#A8DADC', '#F1FAEE', '#457B9D', '#F4A261', '#E76F51', '#2A9D8F', '#E9C46A', '#D6A4A4'];

export default function App() {
  const [totalSalary, setTotalSalary] = useState(30000);
  const [categories, setCategories] = useState(initialCategories);
  const [activeCategory, setActiveCategory] = useState(null);

  const totalAllocated = useMemo(() => categories.reduce((sum, cat) => sum + cat.amount, 0), [categories]);
  const totalPercentage = useMemo(() => categories.reduce((sum, cat) => sum + cat.percentage, 0), [categories]);
  const unallocated = totalSalary - totalAllocated;
  const allocationRate = totalSalary > 0 ? Math.round((totalAllocated / totalSalary) * 100) : 0;

  const handleSalaryChange = (newSalary) => {
    setTotalSalary(newSalary);
    setCategories(prev => prev.map(cat => ({
      ...cat,
      percentage: newSalary > 0 ? Math.round((cat.amount / newSalary) * 100) : 0
    })));
  };

  const updateCategory = (id, field, value) => {
    setCategories(categories.map(cat => {
      if (cat.id !== id) return cat;
      const updated = { ...cat, [field]: value };
      if (field === 'amount') updated.percentage = totalSalary > 0 ? Math.round((value / totalSalary) * 100) : 0;
      if (field === 'percentage') updated.amount = Math.round((value / 100) * totalSalary);
      return updated;
    }));
  };

  const addCategory = () => setCategories([...categories, { id: Date.now(), name: '新項目', amount: 0, percentage: 0 }]);
  const deleteCategory = (id) => setCategories(categories.filter(c => c.id !== id));

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 font-sans text-[#5D5D5D]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 p-6 rounded-3xl bg-white shadow-sm border border-[#EAE7E1]">
            <div className="text-center mb-6">
                <p className="text-sm font-bold text-[#A8A8A8] uppercase mb-1">薪資分配狀態</p>
                {totalPercentage > 100 ? (
                    <div className="bg-[#FFF3F3] text-[#D6A4A4] p-4 rounded-xl flex items-center justify-center gap-2">
                        <AlertTriangle size={20} />
                        <span className="font-medium">分配比例總和已達 {totalPercentage}%。建議調降過高的項目百分比至總合 100% 以內。</span>
                    </div>
                ) : (
                    <p className="text-xl font-bold text-[#4A4A4A]">
                        {unallocated > 0 ? `還有 $${unallocated.toLocaleString()} 尚未分配` : '恭喜，分配完成！'}
                    </p>
                )}
            </div>
            <div className="flex flex-col items-center">
                <label className="text-xs text-[#A8A8A8] mb-1">本月薪資</label>
                <input type="number" value={totalSalary} onChange={(e) => handleSalaryChange(Number(e.target.value))} className="text-3xl font-bold text-[#4A4A4A] bg-transparent border-b-2 border-[#B4C6D3] text-center w-48 outline-none" />
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-[#EAE7E1] shadow-sm flex flex-col items-center relative">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categories} dataKey="amount" innerRadius={60} outerRadius={90} paddingAngle={5} onClick={(data) => setActiveCategory(data.payload)}>
                  {categories.map((entry, index) => <Cell key={entry.id} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* 中央顯示分配率 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-[#A8A8A8]">分配率</span>
              <span className="text-2xl font-bold text-[#4A4A4A]">{allocationRate}%</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#EAE7E1] shadow-sm flex flex-col justify-center">
            {activeCategory ? (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#4A4A4A]">{activeCategory.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F9F9F9] rounded-xl text-center"><p className="text-xs text-gray-400">金額</p><p className="font-bold">${activeCategory.amount}</p></div>
                  <div className="p-4 bg-[#F9F9F9] rounded-xl text-center"><p className="text-xs text-gray-400">百分比</p><p className="font-bold">{activeCategory.percentage}%</p></div>
                </div>
                <div className="flex items-center justify-center gap-2 font-bold text-[#2A9D8F]">
                    {activeCategory.amount > 0 ? <CheckCircle size={20}/> : <HelpCircle size={20}/>}
                    {activeCategory.amount > 0 ? '已完成設定' : '尚未設定'}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">點選圖表區塊以查看詳細資訊</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-bold text-lg text-[#4A4A4A]">薪資分配項目</h3>
            <button onClick={addCategory} className="bg-[#B4C6D3] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#A3B8C7]">新增項目</button>
          </div>
          {categories.map((cat, i) => (
            <div key={cat.id} className="bg-white p-5 rounded-2xl border border-[#EAE7E1] flex items-center justify-between shadow-sm min-h-[72px]">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <input value={cat.name} onChange={(e) => updateCategory(cat.id, 'name', e.target.value)} className="font-bold w-full outline-none border-b border-transparent focus:border-[#B4C6D3]" />
              </div>
              <div className="flex items-center gap-4">
                <input type="number" value={cat.amount} onChange={(e) => updateCategory(cat.id, 'amount', Number(e.target.value))} className="w-20 text-right bg-[#F9F9F9] p-2 rounded outline-none text-sm" />
                <input type="number" value={cat.percentage} onChange={(e) => updateCategory(cat.id, 'percentage', Number(e.target.value))} className="w-12 text-right bg-[#F9F9F9] p-2 rounded outline-none text-sm" />
                <span className="text-sm font-bold">%</span>
                <button onClick={() => deleteCategory(cat.id)} className="text-gray-300 hover:text-red-400 p-2"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}