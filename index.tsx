import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// Declare Prism global to avoid TS errors
declare global {
  interface Window {
    Prism: any;
  }
}

// --- Icons ---
const IconCode = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);
const IconSmartphone = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
);
const IconMonitor = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
);
const IconHeart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);
const IconApple = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.09-1.28 1.83.37 2.92 1.34 3.65 2.41-3.21 1.91-2.67 5.75.59 7.13-.37 1.15-1.47 2.87-3.41 3.97zm-3.4-15.6c.62-1.29 2.05-1.92 2.05-1.92-.12 1.77-1.39 3.23-2.88 3.23-.33 0-.62-.04-.84-.1-.02-1.27.6-2.45 1.67-1.21z"/></svg>
);
const IconAndroid = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9996.4482.9996.9993.0001.5511-.4486.9997-.9996.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9996.4482.9996.9993 0 .5511-.4486.9997-.9996.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.0745 13.8533 7.5317 12 7.5317s-3.5902.5428-5.1368 1.418L4.8407 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/></svg>
);

// --- Default Project Data ---
const DEFAULT_HTML = `<!-- 
  Welcome to WebDev Studio! 
  Use window.projectData in JS to access your JSON.
-->
<div class="container">
  <h1>Hello World</h1>
  <p id="subtitle">Start editing to see magic happen.</p>
  <div class="card">
    <div class="skeleton"></div>
    <div class="content">
      <h3>Dynamic Content</h3>
      <ul id="json-list"></ul>
    </div>
  </div>
  <button onclick="alert('Hello from the emulator!')">Click Me</button>
</div>`;

const DEFAULT_CSS = `/* Classic Modern Reset */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.container {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h1 { color: #1a202c; margin-bottom: 0.5rem; }
#subtitle { color: #718096; margin-bottom: 2rem; }

button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s;
}

button:active { transform: scale(0.96); }

/* List Styles */
ul { list-style: none; text-align: left; margin-top: 1rem; }
li { padding: 0.5rem 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
li span.price { color: #10b981; font-weight: bold; }`;

const DEFAULT_JS = `// Access JSON data
const data = window.projectData || { items: [] };
const list = document.getElementById('json-list');

// Render data from JSON tab
if(data.items) {
  data.items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = \`
      \${item.name} 
      <span class="price">\$\${item.price}</span>
    \`;
    list.appendChild(li);
  });
}

console.log('App started on ' + navigator.userAgent);`;

const DEFAULT_JSON = `{
  "config": {
    "theme": "light"
  },
  "items": [
    { "id": 1, "name": "Premium Plan", "price": 29 },
    { "id": 2, "name": "Standard Plan", "price": 15 },
    { "id": 3, "name": "Basic Plan", "price": 5 }
  ]
}`;

// --- Components ---

const CodeEditor = ({ value, onChange, language }: { value: string, onChange: (val: string) => void, language: string }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Sync scroll between textarea (input) and pre (visual)
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Generate highlighted HTML
  const getHighlightedCode = () => {
    if (window.Prism && window.Prism.languages[language]) {
      return window.Prism.highlight(value, window.Prism.languages[language], language);
    }
    // Fallback simple escape
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  // Ensure trailing newline renders correctly in the visual layer
  // If the code ends with a newline, we add a space so the pre block height matches the textarea which allows scrolling to the next line
  const displayValue = value.endsWith('\n') ? value + ' ' : value;

  return (
    <div className="relative w-full h-full bg-[#1e1e1e] overflow-hidden group">
      {/* 
        This is the visual layer (Prism).
        It sits behind the textarea. Pointer events are disabled so clicks pass through to textarea.
      */}
      <pre
        ref={preRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full p-4 m-0 pointer-events-none overflow-hidden whitespace-pre editor-font"
      >
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: getHighlightedCode() }}
        />
      </pre>

      {/* 
        This is the interaction layer (Textarea).
        Text is transparent but caret is white.
        It handles all typing and scrolling.
      */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        spellCheck="false"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white resize-none focus:outline-none z-10 custom-scrollbar whitespace-pre editor-font"
        style={{ color: 'transparent' }} 
      />
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'json'>('html');
  const [device, setDevice] = useState<'desktop' | 'android' | 'ios'>('desktop');
  const [code, setCode] = useState({
    html: DEFAULT_HTML,
    css: DEFAULT_CSS,
    js: DEFAULT_JS,
    json: DEFAULT_JSON
  });
  const [srcDoc, setSrcDoc] = useState('');
  const [showDonate, setShowDonate] = useState(false);

  // Compile code to iframe srcDoc
  useEffect(() => {
    const timeout = setTimeout(() => {
      const jsonContent = code.json.trim() || '{}';
      
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${code.css}</style>
          </head>
          <body>
            ${code.html}
            <script>
              window.onerror = function(msg, url, line) {
                console.error("Error: " + msg + "\\nLine: " + line);
              };
              try {
                window.projectData = ${jsonContent};
              } catch(e) {
                console.warn("Invalid JSON Data");
              }
            </script>
            <script>
              try {
                ${code.js}
              } catch(e) {
                console.error(e);
              }
            </script>
          </body>
        </html>
      `;
      setSrcDoc(html);
    }, 600); // Debounce

    return () => clearTimeout(timeout);
  }, [code]);

  const updateCode = (val: string) => {
    setCode(prev => ({ ...prev, [activeTab]: val }));
  };

  // Helper to map tab names to Prism languages
  const getLanguage = (tab: string) => {
    switch(tab) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'js': return 'javascript';
      case 'json': return 'json';
      default: return 'html';
    }
  };

  const DonationModal = () => {
    if (!showDonate) return null;
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <IconHeart className="text-pink-500 fill-pink-500" /> Support Development
            </h2>
            <button onClick={() => setShowDonate(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <p className="text-slate-300 mb-6 text-sm leading-relaxed">
            Building free tools for the community takes time and coffee! If you like this editor, consider supporting.
          </p>
          
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold py-3 rounded-lg hover:opacity-90 transition flex justify-center items-center gap-2">
              <span>☕</span> Buy me a Coffee
            </button>
            <button className="w-full bg-[#5865F2] text-white font-bold py-3 rounded-lg hover:opacity-90 transition">
              Donate via PayPal
            </button>
            <div className="mt-4 p-3 bg-slate-900 rounded border border-slate-700">
              <p className="text-xs text-slate-500 font-mono mb-1">Bitcoin Address:</p>
              <div className="flex justify-between items-center">
                <code className="text-xs text-emerald-400 truncate mr-2">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</code>
                <span className="text-xs text-slate-500 cursor-pointer hover:text-white">Copy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-200 overflow-hidden font-sans">
      <DonationModal />

      {/* Header */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <IconCode />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-white">
            Dev<span className="text-blue-500">Studio</span>
          </h1>
        </div>

        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
          <button 
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 rounded flex items-center gap-2 text-xs font-medium transition ${device === 'desktop' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <IconMonitor /> Desktop
          </button>
          <button 
            onClick={() => setDevice('ios')}
            className={`px-3 py-1.5 rounded flex items-center gap-2 text-xs font-medium transition ${device === 'ios' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <IconApple /> iOS
          </button>
          <button 
            onClick={() => setDevice('android')}
            className={`px-3 py-1.5 rounded flex items-center gap-2 text-xs font-medium transition ${device === 'android' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <IconAndroid /> Android
          </button>
        </div>

        <button 
          onClick={() => setShowDonate(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold py-2 px-4 rounded-full flex items-center gap-2 transition"
        >
          <IconHeart /> Donate
        </button>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Editor Pane */}
        <div className="w-1/2 flex flex-col border-r border-slate-800">
          <div className="flex border-b border-slate-800 bg-slate-900">
            {['html', 'css', 'js', 'json'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-r border-slate-800 transition
                  ${activeTab === tab 
                    ? 'bg-slate-800 text-blue-400 border-b-2 border-b-blue-500' 
                    : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 relative bg-[#1e1e1e]">
            {/* Replaced Textarea with CodeEditor Component */}
            <CodeEditor 
              value={code[activeTab]} 
              onChange={(val) => updateCode(val)} 
              language={getLanguage(activeTab)}
            />
            
            {/* Simple status indicator */}
            <div className="absolute bottom-2 right-4 text-[10px] text-slate-500 pointer-events-none z-20">
              {activeTab.toUpperCase()} • {code[activeTab].length} chars
            </div>
          </div>
        </div>

        {/* Preview Pane */}
        <div className="w-1/2 bg-slate-950 relative flex items-center justify-center overflow-auto p-8 custom-scrollbar bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]">
          
          {device === 'desktop' && (
            <div className="w-full h-full bg-white shadow-xl rounded-md overflow-hidden border border-slate-800">
               <div className="h-6 bg-slate-200 flex items-center px-2 gap-1.5 border-b border-slate-300">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                 <div className="flex-1 mx-2 bg-white h-4 rounded text-[8px] flex items-center px-2 text-slate-400 font-mono">localhost:3000</div>
               </div>
               <iframe 
                 srcDoc={srcDoc} 
                 title="preview"
                 className="w-full h-[calc(100%-24px)] bg-white"
                 sandbox="allow-scripts allow-modals"
               />
            </div>
          )}

          {device === 'ios' && (
            <div className="relative w-[393px] h-[852px] bg-black rounded-[50px] shadow-2xl border-[8px] border-slate-800 ring-1 ring-slate-700 overflow-hidden transform scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.85] origin-center transition-all duration-300">
              {/* Notch / Dynamic Island */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[35px] w-[120px] bg-black rounded-b-2xl z-20 flex justify-center items-center">
                <div className="w-16 h-4 bg-[#1a1a1a] rounded-full"></div>
              </div>
              {/* Screen */}
              <iframe 
                srcDoc={srcDoc} 
                title="preview-ios"
                className="w-full h-full bg-white rounded-[42px]"
                sandbox="allow-scripts allow-modals"
              />
              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/20 backdrop-blur-md rounded-full z-20"></div>
            </div>
          )}

          {device === 'android' && (
            <div className="relative w-[412px] h-[915px] bg-slate-900 rounded-[24px] shadow-2xl border-[6px] border-slate-800 ring-1 ring-slate-700 overflow-hidden transform scale-[0.55] sm:scale-[0.65] md:scale-[0.75] lg:scale-[0.8] origin-center transition-all duration-300">
               {/* Camera Hole */}
               <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-20"></div>
               {/* Status Bar Mock */}
               <div className="absolute top-0 w-full h-8 bg-black/10 z-10"></div>
               {/* Screen */}
               <iframe 
                 srcDoc={srcDoc} 
                 title="preview-android"
                 className="w-full h-full bg-white rounded-[18px]"
                 sandbox="allow-scripts allow-modals"
               />
            </div>
          )}

          {/* Device Label */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur px-3 py-1 rounded-full text-xs text-slate-400 font-mono border border-slate-700">
             {device === 'desktop' ? 'Desktop View' : device === 'ios' ? 'iPhone 15 Pro Max' : 'Pixel 7 Pro'}
          </div>

        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);