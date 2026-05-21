const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"';

const patchFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add companyProfile state if not present
  if (!content.includes('const [companyProfile, setCompanyProfile] = useState(null)')) {
    content = content.replace(
      /const \[(.*?)\] = useState\((.*?)\);/,
      `const [companyProfile, setCompanyProfile] = useState(null);\n  const [$1] = useState($2);`
    );
  }

  // 2. Add fetch logic in useEffect if not present
  if (!content.includes('/api/company/profile')) {
    const fetchProfileCode = `
      // Fetch company profile
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const res = await fetch(\`\${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/company/profile\`, {
            headers: { 'Authorization': \`Bearer \${session.access_token}\` }
          });
          if (res.ok) {
            const data = await res.json();
            setCompanyProfile(data);
          }
        }
      } catch (err) {
        console.error("Error fetching company profile:", err);
      }
    `;

    // Find the first useEffect that checks session
    if (content.includes('const check = async () => {') || content.includes('const checkAuth = async () => {')) {
       content = content.replace(
         /(const check.*? = async \(\) => \{\n\s*const \{ data: \{ session \} \} = await supabase.auth.getSession\(\);\n\s*if \(!session\) navigate\('\/signin\?role=company'\);)/,
         `$1\n${fetchProfileCode}`
       );
    } else if (content.includes('const fetchProfile = async () => {')) {
       // EngagementWorkspace has this maybe? We'll see.
    }
  }

  // 3. Replace Sidebar Brand
  const sidebarOld = /<div className="w-9 h-9 bg-\[#134e40\] rounded-xl flex items-center justify-center shrink-0">\s*<span className="text-white font-black text-sm">C<\/span>\s*<\/div>/;
  const sidebarNew = `<motion.div whileHover={{ scale: 1.05, rotate: 2 }} whileTap={{ scale: 0.95 }}
            className="w-9 h-9 bg-gradient-to-br from-[#134e40] to-[#0eb59a] rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md overflow-hidden shrink-0">
            {companyProfile?.logo_url ? (
              <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-black text-sm">
                {companyProfile?.company_name ? companyProfile.company_name.charAt(0).toUpperCase() : 'C'}
              </span>
            )}
          </motion.div>`;
  content = content.replace(sidebarOld, sidebarNew);
  
  // Also fix the text "CXO Connect" to be dynamic
  const textOld = /<p className="text-\[#134e40\] font-black text-sm leading-none">CXO Connect<\/p>/;
  const textNew = `<p className="text-[#134e40] font-black text-sm leading-none">{companyProfile?.company_name || 'CXO Connect'}</p>`;
  content = content.replace(textOld, textNew);
  
  // Make sure the flex col is applied to the title wrapper
  content = content.replace(/className="overflow-hidden whitespace-nowrap"\s*>\s*<p className="text-\[#134e40\]/g, 'className="overflow-hidden whitespace-nowrap flex flex-col"\n          >\n            <p className="text-[#134e40]');

  // 4. Replace Header Avatar
  const headerOld = /<button className="w-9 h-9 bg-\[#134e40\] rounded-xl flex items-center justify-center text-white text-xs font-black hover:ring-2 hover:ring-\[#0eb59a\] hover:ring-offset-2 transition-all">\s*AC\s*<\/button>/;
  const headerNew = `<motion.div
              whileHover={{ scale: 1.08, ringWidth: 2, ringColor: '#0eb59a', ringOffsetWidth: 2 }}
              whileTap={{ scale: 0.94 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-md transition-all duration-200 overflow-hidden"
              title="Account"
            >
              {companyProfile?.logo_url ? (
                <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                companyProfile?.company_name ? companyProfile.company_name.substring(0, 2).toUpperCase() : 'AC'
              )}
            </motion.div>`;
  content = content.replace(headerOld, headerNew);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Patched', filePath);
};

const files = [
  'Analytics.jsx',
  'Contracts.jsx',
  'EngagementWorkspace.jsx',
  'Payments.jsx'
];

files.forEach(f => patchFile(path.join('c:/Users/Suyash/CXO/frontend_1/src/pages', f)));
