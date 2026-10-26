import { applyA11y } from "@/lib/a11y/model";
import { THEME_KEY_SERVER, A11Y_KEY_SERVER } from "./keys";

/*
  Runs synchronously in <head>, before first paint (Next.js "preventing flash before
  hydration" pattern): resolves the theme and re-applies saved accessibility settings so
  the first frame is already correct. It contains no user data — only constant code — and
  reuses the exact `applyA11y` used at runtime, so the two can never disagree.
*/
export const headScript = `(function(){try{
var d=document.documentElement;
var t=localStorage.getItem(${JSON.stringify(THEME_KEY_SERVER)});
var dark=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);
d.setAttribute("data-theme",dark?"dark":"light");
var raw=localStorage.getItem(${JSON.stringify(A11Y_KEY_SERVER)});
if(raw){(${applyA11y.toString()})(JSON.parse(raw),d);}
}catch(e){}})();`;
