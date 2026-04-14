import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Activity, ArrowLeft, Microscope, ClipboardPlus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const IconMap: Record<string, any> = {
  Activity,
  Stethoscope,
  Microscope,
  ClipboardPlus
};

const ColorMap: Record<string, { bg: string, text: string, border: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100 hover:border-blue-300' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100 hover:border-rose-300' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100 hover:border-purple-300' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100 hover:border-indigo-300' },
};

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex justify-center my-4">
    <div className="bg-[#2b65b1] text-white px-6 py-1.5 rounded text-lg font-bold shadow-sm border border-[#1e4b85]">
      {title}
    </div>
  </div>
);

const ContentBox = ({ children }: { children: React.ReactNode }) => (
  <div className="border-4 border-[#2b65b1] bg-white p-4 text-sm text-slate-800 leading-relaxed mb-6">
    {children}
  </div>
);

const QuestionBlock = ({ 
  question, 
  selectedOptions, 
  onOptionToggle 
}: { 
  question: any, 
  selectedOptions: string[], 
  onOptionToggle: (id: string) => void 
}) => {
  return (
    <div className="mb-8">
      <p className="text-sm text-slate-800 font-medium mb-2 leading-relaxed">
        {question.title}
      </p>
      <p className="text-xs text-slate-500 mb-4">
        注：本题{question.type === 'multi' ? '可选择多个' : '最多能选择1个'}选项！
      </p>
      <div className="space-y-3">
        {question.options.map((opt: string, idx: number) => {
          const isSelected = selectedOptions.includes(opt);
          return (
            <button
              key={idx}
              onClick={() => onOptionToggle(opt)}
              className={`w-full text-left p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'
              }`}
            >
              <div className={`shrink-0 w-5 h-5 mt-0.5 border flex items-center justify-center bg-white
                ${question.type === 'multi' ? 'rounded-sm' : 'rounded-full'}
                ${isSelected ? 'border-blue-500' : 'border-slate-300'}
              `}>
                {isSelected && (
                  <div className={`w-3 h-3 bg-blue-500 ${question.type === 'multi' ? 'rounded-sm' : 'rounded-full'}`} />
                )}
              </div>
              <span className="text-sm leading-snug">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  const [cases, setCases] = useState<Record<string, any> | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch('/api/cases')
      .then(res => res.json())
      .then(data => setCases(data))
      .catch(err => console.error("Failed to fetch cases:", err));
  }, []);

  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
    setStep(0);
    setAnswers({});
    setComment("");
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setSelectedCaseId(null);
    setStep(0);
    setAnswers({});
    setComment("");
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    if (step < 5) {
      window.scrollTo(0, 0);
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      window.scrollTo(0, 0);
      setStep(step - 1);
    }
  };

  const handleOptionToggle = (questionId: number, option: string, type: string) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (type === 'multi') {
        if (current.includes(option)) {
          return { ...prev, [questionId]: current.filter(o => o !== option) };
        } else {
          return { ...prev, [questionId]: [...current, option] };
        }
      } else {
        return { ...prev, [questionId]: [option] };
      }
    });
  };

  const isNextDisabled = () => {
    if (!cases || !selectedCaseId) return false;
    const caseData = cases[selectedCaseId];
    if (!caseData || !caseData.questions) return false;

    const q1 = caseData.questions.find((q: any) => q.node === 1) || caseData.questions[0];
    const q2 = caseData.questions.find((q: any) => q.node === 2) || caseData.questions[1];
    const q3 = caseData.questions.find((q: any) => q.node === 3) || caseData.questions[2];
    const q4 = caseData.questions.find((q: any) => q.node === 4) || caseData.questions[3];

    if (step === 1 && q1) return (answers[q1.id] || []).length === 0;
    if (step === 2 && q2) return (answers[q2.id] || []).length === 0;
    if (step === 3 && q3) return (answers[q3.id] || []).length === 0;
    if (step === 4 && q4) return (answers[q4.id] || []).length === 0;
    return false;
  };

  if (!cases) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  const renderStepContent = () => {
    if (selectedCaseId === null) {
      return (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="min-h-full bg-slate-50 flex flex-col p-6 relative"
        >
          <Link to="/admin" className="absolute top-6 right-6 text-slate-400 hover:text-blue-600 transition-colors">
            <Settings size={24} />
          </Link>
          
          <div className="mt-12 mb-8 text-center">
            <h1 className="text-2xl font-black text-blue-900 mb-2">互动病例</h1>
            <p className="text-slate-500 text-sm">请选择您要查看的病例</p>
          </div>

          <div className="space-y-4">
            {Object.entries(cases).map(([id, caseData]) => {
              const Icon = IconMap[caseData.meta?.icon] || Activity;
              const colors = ColorMap[caseData.meta?.color] || ColorMap.blue;
              
              return (
                <button 
                  key={id}
                  onClick={() => handleSelectCase(id)}
                  className={`w-full bg-white p-6 rounded-2xl shadow-sm border flex flex-col items-center text-center hover:shadow-md transition-all ${colors.border}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${colors.bg} ${colors.text}`}>
                    <Icon size={32} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">{caseData.meta?.title || "未知领域"}</h2>
                  <p className="text-sm text-slate-500 line-clamp-2">{caseData.intro?.lead}</p>
                </button>
              );
            })}
          </div>
        </motion.div>
      );
    }

    const caseData = cases[selectedCaseId];
    if (!caseData) return null;

    switch (step) {
      case 0: // Intro
        return (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-full bg-white flex flex-col"
          >
            <button 
              onClick={handleBackToHome}
              className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="bg-gradient-to-b from-[#e6f4f1] to-white pt-16 pb-4 px-4 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
              <h2 className="text-3xl font-black text-[#1e88e5] mb-2 tracking-wider">
                {caseData.meta?.title}
              </h2>
              <p className="text-[#00897b] font-bold text-lg mb-6 tracking-widest">临床诊疗经验在线分享</p>
              
              <div className="bg-gradient-to-br from-[#dcedc8] to-[#f1f8e9] p-6 rounded-xl shadow-sm border border-[#c5e1a5] relative z-10 text-left">
                <h1 className="text-xl font-bold text-[#2e7d32] leading-snug mb-4">
                  {caseData.intro.title}
                </h1>
                <div className="bg-[#4caf50] text-white text-sm font-bold px-3 py-1 inline-block mb-3 rounded-sm shadow-sm">
                  导语：
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  <span className="text-[#4caf50] mr-1">●</span> {caseData.intro.lead}
                </p>
              </div>
            </div>

            <div className="px-6 py-8 flex-1">
              <div className="bg-[#4caf50] text-white text-sm font-bold px-3 py-1 inline-block mb-6 rounded-sm shadow-sm">
                作者简介：
              </div>
              
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#e8f5e9] shadow-md mb-4 bg-slate-100">
                  <img src={caseData.intro.author.avatar} alt="Author" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-[#2e7d32]">{caseData.intro.author.name} {caseData.intro.author.title}</h3>
                <p className="text-[#2e7d32] font-bold text-sm">{caseData.intro.author.hospital}</p>
              </div>

              <ul className="space-y-2 mb-8">
                {caseData.intro.author.credentials?.map((cred: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4caf50] mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{cred}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center mb-8">
                <p className="text-sm text-slate-600">本内容仅供医疗卫生专业人士参与</p>
              </div>

              <button 
                onClick={handleNext}
                className="w-full bg-[#42a5f5] hover:bg-[#2196f3] text-white font-bold py-3.5 rounded-lg shadow-md transition-colors text-lg"
              >
                马上开始
              </button>
            </div>
          </motion.div>
        );

      case 1: // Basic Info, Exam, Diag, Q1
        const q1 = caseData.questions?.find((q: any) => q.node === 1) || caseData.questions?.[0];
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 pb-24">
            <SectionHeader title="基础情况" />
            <ContentBox>
              <ul className="space-y-2">
                {caseData.basicInfo?.map((info: any, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-600 mr-1 font-bold shrink-0">•</span>
                    <span className="font-bold text-blue-800 shrink-0">{info.label}：</span>
                    <span className="ml-1">{info.value}</span>
                  </li>
                ))}
              </ul>
            </ContentBox>

            <SectionHeader title="检查" />
            <ContentBox>
              <div className="space-y-4">
                {caseData.examination?.map((section: any, idx: number) => (
                  <div key={idx}>
                    <p className="font-bold text-blue-800 mb-1 flex items-center">
                      <span className="text-blue-600 mr-1">•</span> {section.category}：
                    </p>
                    <div className="pl-3 space-y-1">
                      {section.items?.map((item: string, i: number) => {
                        let highlightedItem = item;
                        const redKeywords = ["150/90mmHg", "11.0mmol/L", "9.7%", "3.99mmol/L", "12.37mmol/L", "88.7ml/min.m²", "400mg/g", "减弱", "减退", "重度", "1.2×10^9/L", "65g/L", "25×10^9/L", "20%", "45%", "复发", "IDH1 R132C 突变（+）", "85.4 U/mL", "12.5 ng/mL", "ESR1 突变（+）", "多发异常放射性浓聚", "11.660 ng/ml", "0.05", "132g", "双肾积水", "SUVmax=9.1", "SUVmax=6.6", "PRIMARY 4分", "3+4=7分", "高度可疑恶性肿瘤"];
                        redKeywords.forEach(kw => {
                          if (highlightedItem.includes(kw)) {
                            highlightedItem = highlightedItem.replace(kw, `<span class="text-red-600 font-bold">${kw}</span>`);
                          }
                        });
                        return (
                          <p key={i} dangerouslySetInnerHTML={{ __html: highlightedItem }} />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ContentBox>

            <SectionHeader title="诊断" />
            <ContentBox>
              <ul className="space-y-1">
                {caseData.diagnosis?.map((diag: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold shrink-0">•</span>
                    <span>{diag}</span>
                  </li>
                ))}
              </ul>
            </ContentBox>

            <div className="mt-8">
              {q1 && (
                <QuestionBlock 
                  question={q1} 
                  selectedOptions={answers[q1.id] || []} 
                  onOptionToggle={(opt) => handleOptionToggle(q1.id, opt, q1.type)} 
                />
              )}
            </div>
          </motion.div>
        );

      case 2: // Q1 Exp, Q2
        const q1ForExp = caseData.questions?.find((q: any) => q.node === 1) || caseData.questions?.[0];
        const q2 = caseData.questions?.find((q: any) => q.node === 2) || caseData.questions?.[1];
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 pb-24">
            {q1ForExp && caseData.explanations?.[q1ForExp.id] && (
              <>
                <SectionHeader title="解析" />
                <ContentBox>
                  <div className="space-y-2">
                    {caseData.explanations[q1ForExp.id].content?.map((p: string, idx: number) => {
                      const isBold = p.includes("【") || p.startsWith("①") || p.startsWith("②") || p.startsWith("③") || p.startsWith("如前所述") || p.startsWith("正确答案：");
                      return (
                        <p key={idx} className={`flex items-start ${isBold ? 'font-bold' : ''}`}>
                          {p.startsWith("结合") || p.startsWith("如前所述") || p.startsWith("解析：") ? (
                            <span className="text-blue-800 mr-1 font-bold shrink-0">•</span>
                          ) : null}
                          <span>{p}</span>
                        </p>
                      );
                    })}
                  </div>
                </ContentBox>
              </>
            )}

            <div className="mt-8">
              {q2 && (
                <QuestionBlock 
                  question={q2} 
                  selectedOptions={answers[q2.id] || []} 
                  onOptionToggle={(opt) => handleOptionToggle(q2.id, opt, q2.type)} 
                />
              )}
            </div>
          </motion.div>
        );

      case 3: // Q2 Exp, Treatment, Follow-up, Exp, Q3
        const q2ForExp = caseData.questions?.find((q: any) => q.node === 2) || caseData.questions?.[1];
        const q3 = caseData.questions?.find((q: any) => q.node === 3) || caseData.questions?.[2];
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 pb-24">
            {q2ForExp && caseData.explanations?.[q2ForExp.id] && (
              <>
                <SectionHeader title="解析" />
                <ContentBox>
                  <div className="space-y-3">
                    {caseData.explanations[q2ForExp.id].content?.map((p: string, idx: number) => {
                      const isBold = p.startsWith("正确答案：");
                      return (
                        <p key={idx} className={`flex items-start ${isBold ? 'font-bold' : ''}`}>
                          {p.startsWith("解析：") ? (
                            <span className="text-blue-800 mr-1 font-bold shrink-0">•</span>
                          ) : null}
                          <span>{p}</span>
                        </p>
                      );
                    })}
                    
                    {selectedCaseId === 'diabetes' && (
                      <div className="mt-6 space-y-6">
                        <div className="bg-blue-50 p-3 border-l-4 border-blue-600 text-sm font-bold text-blue-900">
                          醛糖还原酶抑制剂--依帕司他，通过抑制多元醇通路，改善代谢紊乱
                        </div>
                        <div className="h-32 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs border border-slate-200">
                          [通路机制图表]
                        </div>
                        
                        <div className="bg-blue-50 p-3 border-l-4 border-blue-600 text-sm font-bold text-blue-900">
                          依帕司他单药可长期改善DPN患者神经传导速度，改善神经病变症状
                        </div>
                        <div className="h-32 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs border border-slate-200">
                          [神经传导速度改善图表]
                        </div>
                      </div>
                    )}
                  </div>
                </ContentBox>
              </>
            )}

            <SectionHeader title="治疗方案" />
            <ContentBox>
              <div className="space-y-3">
                {caseData.treatmentPlan?.map((plan: any, idx: number) => (
                  <div key={idx}>
                    <p className="font-bold text-blue-800 flex items-center">
                      <span className="text-blue-600 mr-1">•</span> {plan.category}：
                    </p>
                    <div className="pl-3">
                      {plan.items?.map((item: string, i: number) => (
                        <p key={i}>{item}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ContentBox>

            <SectionHeader title="随访/复查" />
            <ContentBox>
              <div className="space-y-4">
                {caseData.followUp?.map((fu: any, idx: number) => (
                  <div key={idx}>
                    <p className="font-bold text-blue-800 flex items-center mb-1">
                      <span className="text-blue-600 mr-1">•</span> {fu.title}
                    </p>
                    <div className="pl-3 space-y-1">
                      {fu.items?.map((item: string, i: number) => {
                        let highlightedItem = item;
                        const redKeywords = ["稍有好转", "减轻", "明显好转", "明显减轻", "睡眠有所改善", "睡眠明显改善", "降至 15%", "逐渐恢复", "脱离输血依赖", "<5%", "完全缓解", "部分恢复", "持续缓解", "显著改善", "明显缩小", "部分缓解（PR）", "降至 45.2 U/mL", "显著提高", "消退", "稳定", "延缓疾病进展"];
                        redKeywords.forEach(kw => {
                          if (highlightedItem.includes(kw)) {
                            highlightedItem = highlightedItem.replace(kw, `<span class="text-red-600 font-bold">${kw}</span>`);
                          }
                        });
                        return <p key={i} dangerouslySetInnerHTML={{ __html: highlightedItem }} />;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ContentBox>

            <SectionHeader title="治疗体会" />
            <ContentBox>
              <div className="space-y-2">
                {caseData.experience?.map((p: string, idx: number) => (
                  <p key={idx} className="flex items-start">
                    {idx === 0 || idx === 5 || idx === 6 || selectedCaseId !== 'diabetes' ? (
                      <span className="text-blue-800 mr-1 font-bold shrink-0">•</span>
                    ) : null}
                    <span className={idx === 5 || idx === 6 || selectedCaseId !== 'diabetes' ? "font-bold" : ""}>{p}</span>
                  </p>
                ))}
              </div>
            </ContentBox>

            <div className="mt-8">
              {q3 && (
                <QuestionBlock 
                  question={q3} 
                  selectedOptions={answers[q3.id] || []} 
                  onOptionToggle={(opt) => handleOptionToggle(q3.id, opt, q3.type)} 
                />
              )}
            </div>
          </motion.div>
        );

      case 4: // Q4 (and Q3 Exp)
        const q3ForExp = caseData.questions?.find((q: any) => q.node === 3) || caseData.questions?.[2];
        const q4 = caseData.questions?.find((q: any) => q.node === 4) || caseData.questions?.[3];
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 pb-24">
            {q3ForExp && caseData.explanations?.[q3ForExp.id] && (
              <>
                <SectionHeader title="解析" />
                <ContentBox>
                  <div className="space-y-3">
                    {caseData.explanations[q3ForExp.id].content?.map((p: string, idx: number) => {
                      const isBold = p.startsWith("正确答案：");
                      return (
                        <p key={idx} className={`flex items-start ${isBold ? 'font-bold' : ''}`}>
                          {p.startsWith("解析：") ? (
                            <span className="text-blue-800 mr-1 font-bold shrink-0">•</span>
                          ) : null}
                          <span>{p}</span>
                        </p>
                      );
                    })}
                  </div>
                </ContentBox>
              </>
            )}

            <div className="mt-4">
              {q4 && (
                <QuestionBlock 
                  question={q4} 
                  selectedOptions={answers[q4.id] || []} 
                  onOptionToggle={(opt) => handleOptionToggle(q4.id, opt, q4.type)} 
                />
              )}
            </div>
          </motion.div>
        );

      case 5: // Discussion
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-full bg-[#f5f5f5] flex flex-col">
            <div className="bg-gradient-to-br from-white to-[#e3f2fd] p-8 pb-12 rounded-b-[40px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-200 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4" />
              <h2 className="text-3xl font-black text-slate-800 mb-2 relative z-10">互动讨论区</h2>
              <p className="text-slate-500 text-sm relative z-10">感谢您的参与，请在文末点击"完成" 提交</p>
            </div>

            <div className="p-6 flex-1 -mt-6 relative z-20">
              <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-4 relative h-48">
                <textarea
                  className="w-full h-full resize-none outline-none text-sm text-slate-700 placeholder:text-slate-400 bg-transparent"
                  placeholder="对于这份病例，您有哪些问题希望与同道探讨？与本病例类似的患者，您有没有诊疗经验可以分享？对于病例提及的产品，您有哪些应用心得？欢迎在留言区分享！"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="absolute bottom-3 right-4 text-xs text-slate-400">
                  已输入{comment.length}字
                </div>
              </div>

              <button 
                onClick={() => {
                  alert("提交成功！感谢您的参与。");
                  handleBackToHome();
                }}
                className="w-full mt-8 bg-[#4fc3f7] hover:bg-[#29b6f6] text-white font-bold py-3.5 rounded-full shadow-md transition-colors text-lg"
              >
                完成
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-4 font-sans">
      <div className="w-full h-full sm:w-[390px] sm:h-[844px] bg-[#f8f9fa] relative overflow-hidden sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] border-slate-800 flex flex-col">
        
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </main>

        {selectedCaseId !== null && step > 0 && step < 5 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex justify-between gap-4">
            <button
              onClick={handlePrev}
              className="flex-1 bg-white border border-blue-300 text-blue-500 font-medium py-2.5 rounded shadow-sm hover:bg-blue-50 transition-colors"
            >
              上一步
            </button>
            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="flex-1 bg-white border border-blue-300 text-blue-500 font-medium py-2.5 rounded shadow-sm hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一步
            </button>
          </div>
        )}
        
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-300 rounded-full hidden sm:block pointer-events-none" />
      </div>
    </div>
  );
}
