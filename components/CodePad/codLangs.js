import { cpp } from "@codemirror/lang-cpp";
import { csharp } from "@replit/codemirror-lang-csharp";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { javascript } from '@codemirror/lang-javascript';
import { json } from "@codemirror/lang-json";
import { less } from "@codemirror/lang-less";
import { markdown } from "@codemirror/lang-markdown";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sass } from "@codemirror/lang-sass";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";

// export const codLangs = {
//   'cpp': cpp(),
//   'csharp': csharp(),
//   'css': sass(),
//   'sass': sass(),
//   'html': html(),
//   'java': java(),
//   'js': javascript({ jsx: true, typescript: true }),
//   'ts': javascript({ jsx: true, typescript: true }),
//   'json': json(),
//   'less': less(),
//   'markdown': markdown(),
//   'php': php(),
//   'python': python(),
//   'rust': rust(),
//   'sql': sql(),
//   'xml': xml(),
//   'default': javascript({ jsx: true, typescript: true }),
// }

export const codLangs = (lang) => {
  switch (lang) {
    case 'cpp': return cpp();
    case 'csharp': return csharp();
    case 'css': case 'sass': return sass();
    case 'html': return html();
    case 'java': return java();
    case 'js': case 'ts': return javascript({ jsx: true, typescript: true });
    case 'json': return json();
    case 'less': return less();
    case 'markdown': return markdown();
    case 'php': return php();
    case 'python': return python();
    case 'rust': return rust();
    case 'sql': return sql();
    case 'xml': return xml();
    default: return javascript({ jsx: true, typescript: true });
  }
}


// const langCache = new Map();

// export const codLangs = async (lang) => {
//   // Если язык уже загружен и закэширован, возвращаем его
//   if (langCache.has(lang)) { return langCache.get(lang); }

//   // Карта с функциями для ленивой загрузки модулей
//   const langsMap = new Map([
//     ['cpp', () => import("@codemirror/lang-cpp").then(mod => mod.cpp())],
//     ['csharp', () => import("@replit/codemirror-lang-csharp").then(mod => mod.csharp())],
//     ['css', () => import("@codemirror/lang-sass").then(mod => mod.sass())],
//     ['sass', () => import("@codemirror/lang-sass").then(mod => mod.sass())],
//     ['html', () => import("@codemirror/lang-html").then(mod => mod.html())],
//     ['java', () => import("@codemirror/lang-java").then(mod => mod.java())],
//     ['js', () => import("@codemirror/lang-javascript").then(mod => mod.javascript({ jsx: true, typescript: true }))],
//     ['ts', () => import("@codemirror/lang-javascript").then(mod => mod.javascript({ jsx: true, typescript: true }))],
//     ['json', () => import("@codemirror/lang-json").then(mod => mod.json())],
//     ['less', () => import("@codemirror/lang-less").then(mod => mod.less())],
//     ['markdown', () => import("@codemirror/lang-markdown").then(mod => mod.markdown())],
//     ['php', () => import("@codemirror/lang-php").then(mod => mod.php())],
//     ['python', () => import("@codemirror/lang-python").then(mod => mod.python())],
//     ['rust', () => import("@codemirror/lang-rust").then(mod => mod.rust())],
//     ['sql', () => import("@codemirror/lang-sql").then(mod => mod.sql())],
//     ['xml', () => import("@codemirror/lang-xml").then(mod => mod.xml())]
//   ]);

//   // Загружаем язык или по умолчанию загружаем JavaScript
//   const result = langsMap.has(lang)
//     ? await langsMap.get(lang)()
//     : await import("@codemirror/lang-javascript").then(mod => mod.javascript({ jsx: true, typescript: true }));

//   // Кэшируем результат, чтобы не загружать повторно
//   langCache.set(lang, result);

//   return result;
// };
