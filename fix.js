const fs = require('fs');
const files = [
  'e:/Socrates/app/patient/dashboard/page.tsx',
  'e:/Socrates/app/patient/dashboard/book-appointment-button.tsx',
  'e:/Socrates/app/doctor/queue/page.tsx',
  'e:/Socrates/app/doctor/encounter/[id]/encounter-shell.tsx'
];

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');

  // Fix hover: and disabled: prefixes missing on dark: classes
  content = content.replace(/(hover|disabled):([a-z]+-[a-z0-9-\/]+)\s+dark:([a-z]+-[a-z0-9-\/]+)/g, '$1:$2 dark:$1:$3');
  
  // Fix specific mess up in encounter-shell.tsx hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-slate-800/50
  content = content.replace(/hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-slate-800\/50/g, 'hover:bg-slate-100 dark:hover:bg-slate-800/50');
  
  // Fix specific mess up in queue page: hover:bg-slate-100 dark:hover:bg-slate-100\/50 dark:bg-slate-800\/30
  content = content.replace(/hover:bg-slate-100 dark:hover:bg-slate-100\/50 dark:bg-slate-800\/30/g, 'hover:bg-slate-100/50 dark:hover:bg-slate-800/30');

  fs.writeFileSync(f, content);
}
console.log('Prefixes fixed');
