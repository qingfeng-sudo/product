import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, ClipboardPlus } from 'lucide-react';

const StringArrayEditor = ({ items = [], onChange, label }: any) => (
  <div className="mb-4">
    {label && <label className="block font-bold mb-2 text-slate-700">{label}</label>}
    <div className="space-y-2">
      {items.map((item: string, idx: number) => (
        <div key={idx} className="flex gap-2">
          <textarea 
            className="border border-slate-300 p-2 flex-1 rounded focus:ring-2 focus:ring-blue-500 outline-none min-h-[40px]" 
            value={item} 
            onChange={e => {
              const newItems = [...items]; 
              newItems[idx] = e.target.value; 
              onChange(newItems);
            }} 
            rows={1}
          />
          <button onClick={() => onChange(items.filter((_: any, i: number) => i !== idx))} className="text-red-500 hover:bg-red-50 px-3 rounded transition-colors">删除</button>
        </div>
      ))}
    </div>
    <button onClick={() => onChange([...items, ""])} className="text-blue-600 font-medium text-sm flex items-center gap-1 mt-2 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
      <Plus size={16} /> 添加条目
    </button>
  </div>
);

const KeyValueEditor = ({ items = [], onChange, label }: any) => (
  <div className="mb-6">
    <label className="block text-lg font-bold mb-3 text-slate-800">{label}</label>
    <div className="space-y-2">
      {items.map((item: any, idx: number) => (
        <div key={idx} className="flex gap-2 items-start">
          <input 
            className="border border-slate-300 p-2 w-1/3 rounded focus:ring-2 focus:ring-blue-500 outline-none font-medium" 
            placeholder="标签 (如: 年龄)" 
            value={item.label || ''} 
            onChange={e => {
              const newItems = [...items]; 
              newItems[idx] = { ...newItems[idx], label: e.target.value }; 
              onChange(newItems);
            }} 
          />
          <textarea 
            className="border border-slate-300 p-2 flex-1 rounded focus:ring-2 focus:ring-blue-500 outline-none min-h-[40px]" 
            placeholder="内容" 
            value={item.value || ''} 
            onChange={e => {
              const newItems = [...items]; 
              newItems[idx] = { ...newItems[idx], value: e.target.value }; 
              onChange(newItems);
            }} 
            rows={1}
          />
          <button onClick={() => onChange(items.filter((_: any, i: number) => i !== idx))} className="text-red-500 hover:bg-red-50 px-3 py-2 rounded transition-colors">删除</button>
        </div>
      ))}
    </div>
    <button onClick={() => onChange([...items, { label: "", value: "" }])} className="text-blue-600 font-medium text-sm flex items-center gap-1 mt-2 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
      <Plus size={16} /> 添加信息项
    </button>
  </div>
);

const CategoryItemsEditor = ({ items = [], onChange, label, categoryKey = "category" }: any) => (
  <div className="mb-6">
    <label className="block text-lg font-bold mb-3 text-slate-800">{label}</label>
    {items.map((cat: any, idx: number) => (
      <div key={idx} className="border border-slate-200 p-4 mb-4 bg-slate-50 rounded-lg shadow-sm">
        <div className="flex gap-3 mb-4">
          <input 
            className="border border-slate-300 p-2 flex-1 rounded focus:ring-2 focus:ring-blue-500 outline-none font-bold bg-white" 
            placeholder="分类名称" 
            value={cat[categoryKey] || ''} 
            onChange={e => {
              const newItems = [...items]; 
              newItems[idx] = { ...newItems[idx], [categoryKey]: e.target.value }; 
              onChange(newItems);
            }} 
          />
          <button onClick={() => onChange(items.filter((_: any, i: number) => i !== idx))} className="text-red-500 hover:bg-red-100 bg-white border border-red-100 px-3 rounded transition-colors">删除分类</button>
        </div>
        <StringArrayEditor 
          items={cat.items || []} 
          onChange={(newSubItems: any) => {
            const newItems = [...items]; 
            newItems[idx] = { ...newItems[idx], items: newSubItems }; 
            onChange(newItems);
          }} 
          label="具体条目" 
        />
      </div>
    ))}
    <button onClick={() => onChange([...items, { [categoryKey]: "", items: [] }])} className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
      <Plus size={16} /> 添加分类
    </button>
  </div>
);

const QuestionsEditor = ({ questions = [], explanations = {}, onChangeQuestions, onChangeExplanations }: any) => (
  <div className="mb-6">
    <label className="block text-lg font-bold mb-3 text-slate-800">互动问答与解析</label>
    {questions.map((q: any, idx: number) => (
      <div key={idx} className="border border-slate-200 p-4 mb-6 bg-slate-50 rounded-lg shadow-sm">
        <div className="flex gap-3 mb-4 items-start">
          <div className="w-24">
            <label className="block text-xs text-slate-500 mb-1 font-bold">问题ID</label>
            <input 
              className="border border-slate-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
              type="number" 
              value={q.id || ''} 
              onChange={e => {
                const newId = Number(e.target.value);
                const oldId = q.id;
                const newQ = [...questions]; 
                newQ[idx] = { ...newQ[idx], id: newId }; 
                onChangeQuestions(newQ);
                
                if (oldId !== newId && explanations[oldId]) {
                  const newExp = { ...explanations };
                  newExp[newId] = newExp[oldId];
                  delete newExp[oldId];
                  onChangeExplanations(newExp);
                }
              }} 
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1 font-bold">问题题目</label>
            <textarea 
              className="border border-slate-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
              value={q.title || ''} 
              onChange={e => {
                const newQ = [...questions]; 
                newQ[idx] = { ...newQ[idx], title: e.target.value }; 
                onChangeQuestions(newQ);
              }} 
              rows={2}
            />
          </div>
          <div className="w-24">
            <label className="block text-xs text-slate-500 mb-1 font-bold">类型</label>
            <select 
              className="border border-slate-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
              value={q.type || 'single'} 
              onChange={e => {
                const newQ = [...questions]; 
                newQ[idx] = { ...newQ[idx], type: e.target.value }; 
                onChangeQuestions(newQ);
              }}
            >
              <option value="single">单选</option>
              <option value="multi">多选</option>
            </select>
          </div>
          <div className="w-48">
            <label className="block text-xs text-slate-500 mb-1 font-bold">绑定病例节点</label>
            <select 
              className="border border-slate-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
              value={q.node || (idx + 1)} 
              onChange={e => {
                const newQ = [...questions]; 
                newQ[idx] = { ...newQ[idx], node: Number(e.target.value) }; 
                onChangeQuestions(newQ);
              }}
            >
              <option value={1}>节点1: 基础情况与诊断</option>
              <option value={2}>节点2: 第一次解析</option>
              <option value={3}>节点3: 治疗方案与体会</option>
              <option value={4}>节点4: 最终意愿调查</option>
            </select>
          </div>
          <div className="pt-5">
            <button onClick={() => {
              onChangeQuestions(questions.filter((_: any, i: number) => i !== idx));
              const newExp = { ...explanations };
              delete newExp[q.id];
              onChangeExplanations(newExp);
            }} className="text-red-500 hover:bg-red-100 bg-white border border-red-100 px-3 py-2 rounded transition-colors">删除问题</button>
          </div>
        </div>
        
        <div className="pl-4 border-l-4 border-blue-200 mb-6 bg-white p-3 rounded-r">
          <StringArrayEditor 
            items={q.options || []} 
            onChange={(newOpts: any) => {
              const newQ = [...questions]; 
              newQ[idx] = { ...newQ[idx], options: newOpts }; 
              onChangeQuestions(newQ);
            }} 
            label="选项列表" 
          />
        </div>
        
        <div className="pl-4 border-l-4 border-green-200 bg-white p-3 rounded-r">
          <StringArrayEditor 
            items={explanations[q.id]?.content || []} 
            onChange={(newExpContent: any) => {
              onChangeExplanations({ ...explanations, [q.id]: { content: newExpContent } });
            }} 
            label={`问题 ${q.id} 解析内容`} 
          />
        </div>
      </div>
    ))}
    <button onClick={() => onChangeQuestions([...questions, { id: Date.now(), title: "", type: "single", node: questions.length + 1, options: [] }])} className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
      <Plus size={16} /> 添加问题
    </button>
  </div>
);

export default function Admin() {
  const [cases, setCases] = useState<Record<string, any>>({});
  const [selectedId, setSelectedId] = useState<string>("");
  const [currentCase, setCurrentCase] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/cases').then(res => res.json()).then(data => {
      setCases(data);
      if (Object.keys(data).length > 0) {
        setSelectedId(Object.keys(data)[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedId && cases[selectedId]) {
      setCurrentCase(JSON.parse(JSON.stringify(cases[selectedId])));
    } else {
      setCurrentCase(null);
    }
  }, [selectedId, cases]);

  const handleSave = async () => {
    if (!currentCase) return;
    try {
      await fetch(`/api/cases/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentCase)
      });
      setCases(prev => ({ ...prev, [selectedId]: currentCase }));
      alert("保存成功！");
    } catch (e: any) {
      alert("保存失败：" + e.message);
    }
  };

  const handleAdd = async () => {
    const newId = prompt("请输入新病例的ID（如：newCase）：");
    if (!newId || cases[newId]) return alert("ID无效或已存在");
    
    const newCase = {
      meta: { title: "新病例", icon: "Activity", color: "blue" },
      intro: { title: "新病例标题", lead: "导语...", author: { name: "医生", title: "职称", hospital: "医院", avatar: "https://picsum.photos/200", credentials: [] } },
      basicInfo: [],
      examination: [],
      diagnosis: [],
      questions: [],
      explanations: {},
      treatmentPlan: [],
      followUp: [],
      experience: []
    };

    await fetch(`/api/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: newId, data: newCase })
    });
    
    setCases(prev => ({ ...prev, [newId]: newCase }));
    setSelectedId(newId);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除此病例吗？")) return;
    await fetch(`/api/cases/${id}`, { method: 'DELETE' });
    const newCases = { ...cases };
    delete newCases[id];
    setCases(newCases);
    if (selectedId === id) {
      const first = Object.keys(newCases)[0];
      if (first) setSelectedId(first);
      else setSelectedId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-800">互动病例管理端 (可视化配置)</h1>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
          <Plus size={18} /> 新增病例
        </button>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-white border-r border-slate-200 overflow-y-auto p-4 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <h2 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">病例列表</h2>
          <div className="space-y-2">
            {Object.keys(cases).map(id => (
              <div 
                key={id} 
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${selectedId === id ? 'bg-blue-50 border-blue-200 border text-blue-800 shadow-sm' : 'hover:bg-slate-50 border border-transparent text-slate-600'}`} 
                onClick={() => setSelectedId(id)}
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate font-bold text-sm">{cases[id].meta?.title || id}</span>
                  <span className="text-xs opacity-60 truncate">{id}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(id); }} className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </aside>
        
        <main className="flex-1 p-6 overflow-y-auto bg-slate-50 relative">
          {currentCase ? (
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm sticky top-0 z-30 border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
                  正在编辑: <span className="text-blue-600">{selectedId}</span>
                </h2>
                <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 shadow-sm font-bold transition-colors">
                  <Save size={18} /> 保存更改
                </button>
              </div>

              {/* Meta Section */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">1. 基础配置 (Meta)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">领域名称</label>
                    <input className="border border-slate-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={currentCase.meta?.title || ''} onChange={e => setCurrentCase({...currentCase, meta: {...currentCase.meta, title: e.target.value}})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">图标 (Icon)</label>
                    <select className="border border-slate-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={currentCase.meta?.icon || 'Activity'} onChange={e => setCurrentCase({...currentCase, meta: {...currentCase.meta, icon: e.target.value}})}>
                      <option value="Activity">Activity (内分泌)</option>
                      <option value="Stethoscope">Stethoscope (肿瘤)</option>
                      <option value="Microscope">Microscope (乳腺癌)</option>
                      <option value="ClipboardPlus">ClipboardPlus (泌尿)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">主题色 (Color)</label>
                    <select className="border border-slate-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={currentCase.meta?.color || 'blue'} onChange={e => setCurrentCase({...currentCase, meta: {...currentCase.meta, color: e.target.value}})}>
                      <option value="blue">蓝色 (Blue)</option>
                      <option value="rose">玫瑰红 (Rose)</option>
                      <option value="purple">紫色 (Purple)</option>
                      <option value="indigo">靛青 (Indigo)</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Intro Section */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">2. 导语与作者 (Intro)</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">病例大标题</label>
                    <textarea className="border border-slate-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={currentCase.intro?.title || ''} onChange={e => setCurrentCase({...currentCase, intro: {...currentCase.intro, title: e.target.value}})} rows={2} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">导语内容</label>
                    <textarea className="border border-slate-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={currentCase.intro?.lead || ''} onChange={e => setCurrentCase({...currentCase, intro: {...currentCase.intro, lead: e.target.value}})} rows={3} />
                  </div>
                  
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mt-4">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-blue-400 rounded-full"></span>
                      作者信息
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">姓名</label>
                        <input className="border border-slate-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={currentCase.intro?.author?.name || ''} onChange={e => setCurrentCase({...currentCase, intro: {...currentCase.intro, author: {...currentCase.intro?.author, name: e.target.value}}})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">职称</label>
                        <input className="border border-slate-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={currentCase.intro?.author?.title || ''} onChange={e => setCurrentCase({...currentCase, intro: {...currentCase.intro, author: {...currentCase.intro?.author, title: e.target.value}}})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">医院/科室</label>
                        <input className="border border-slate-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={currentCase.intro?.author?.hospital || ''} onChange={e => setCurrentCase({...currentCase, intro: {...currentCase.intro, author: {...currentCase.intro?.author, hospital: e.target.value}}})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">头像URL</label>
                        <input className="border border-slate-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={currentCase.intro?.author?.avatar || ''} onChange={e => setCurrentCase({...currentCase, intro: {...currentCase.intro, author: {...currentCase.intro?.author, avatar: e.target.value}}})} />
                      </div>
                    </div>
                    <StringArrayEditor 
                      items={currentCase.intro?.author?.credentials || []} 
                      onChange={(newCreds: any) => setCurrentCase({...currentCase, intro: {...currentCase.intro, author: {...currentCase.intro?.author, credentials: newCreds}}})} 
                      label="个人简介/头衔列表" 
                    />
                  </div>
                </div>
              </section>

              {/* Basic Info */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <KeyValueEditor 
                  items={currentCase.basicInfo || []} 
                  onChange={(newInfo: any) => setCurrentCase({...currentCase, basicInfo: newInfo})} 
                  label="3. 基础情况 (Basic Info)" 
                />
              </section>

              {/* Examination */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <CategoryItemsEditor 
                  items={currentCase.examination || []} 
                  onChange={(newExam: any) => setCurrentCase({...currentCase, examination: newExam})} 
                  label="4. 检查结果 (Examination)" 
                  categoryKey="category"
                />
              </section>

              {/* Diagnosis */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">5. 诊断 (Diagnosis)</h3>
                <StringArrayEditor 
                  items={currentCase.diagnosis || []} 
                  onChange={(newDiag: any) => setCurrentCase({...currentCase, diagnosis: newDiag})} 
                />
              </section>

              {/* Questions & Explanations */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <QuestionsEditor 
                  questions={currentCase.questions || []} 
                  explanations={currentCase.explanations || {}} 
                  onChangeQuestions={(newQ: any) => setCurrentCase({...currentCase, questions: newQ})} 
                  onChangeExplanations={(newExp: any) => setCurrentCase({...currentCase, explanations: newExp})} 
                />
              </section>

              {/* Treatment Plan */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <CategoryItemsEditor 
                  items={currentCase.treatmentPlan || []} 
                  onChange={(newPlan: any) => setCurrentCase({...currentCase, treatmentPlan: newPlan})} 
                  label="7. 治疗方案 (Treatment Plan)" 
                  categoryKey="category"
                />
              </section>

              {/* Follow Up */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <CategoryItemsEditor 
                  items={currentCase.followUp || []} 
                  onChange={(newFollowUp: any) => setCurrentCase({...currentCase, followUp: newFollowUp})} 
                  label="8. 随访/复查 (Follow Up)" 
                  categoryKey="title"
                />
              </section>

              {/* Experience */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">9. 治疗体会 (Experience)</h3>
                <StringArrayEditor 
                  items={currentCase.experience || []} 
                  onChange={(newExp: any) => setCurrentCase({...currentCase, experience: newExp})} 
                />
              </section>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 h-full">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <ClipboardPlus size={40} className="text-slate-300" />
              </div>
              <p className="text-lg font-medium text-slate-500">请在左侧选择或创建一个病例进行配置</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
