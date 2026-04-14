import fs from 'fs';
import { diabetesCase, oncologyCase, breastCancerCase, prostateCancerCase } from './src/data';

const cases = {
  diabetes: {
    meta: { title: "内分泌领域", icon: "Activity", color: "blue" },
    ...diabetesCase
  },
  oncology: {
    meta: { title: "肿瘤领域", icon: "Stethoscope", color: "rose" },
    ...oncologyCase
  },
  breastCancer: {
    meta: { title: "乳腺癌领域", icon: "Microscope", color: "purple" },
    ...breastCancerCase
  },
  prostateCancer: {
    meta: { title: "泌尿肿瘤领域", icon: "ClipboardPlus", color: "indigo" },
    ...prostateCancerCase
  }
};

fs.writeFileSync('cases.json', JSON.stringify(cases, null, 2));
console.log('cases.json created successfully');
