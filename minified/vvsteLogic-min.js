document.addEventListener("DOMContentLoaded",function(){function e(e){return document.getElementById(e)}function t(t,n){return e(t).addEventListener("click",n)}function n(e,t){return localStorage.setItem(e,t)}function a(e){return localStorage.getItem(e)}function l(t){e("fileNameContainer").innerHTML="";let n=document.createElement("H3"),l=document.createTextNode("Last File Opened:");n.appendChild(l),e("fileNameContainer").appendChild(n);let o=document.createElement("UL"),i=document.createElement("LI"),c=a("lastFileOpened");null===c&&(c="Nothing has been opened yet"),!0===t&&(c=c.concat(" (Not found)"));let r=document.createTextNode(c);i.appendChild(r),o.appendChild(i),e("fileNameContainer").appendChild(o);let s=document.createElement("H3"),d=document.createTextNode("Files:");s.appendChild(d),e("fileNameContainer").appendChild(s);let u=document.createElement("UL");JSON.parse(a("fileNameArray")).forEach(function(e){let t=document.createElement("LI"),n=document.createTextNode(e);t.appendChild(n),u.appendChild(t)}),e("fileNameContainer").appendChild(u)}function o(t,o){let i=!1,c="placeholder";"save"===t||"saveAs"===t?c="Save file as:":"open"===t?c="Please enter file name:":"delete"===t?c="Name of file to delete?":"new"===t?c="Name of new file:":console.error("invalid input");let r="";r=void 0===o?prompt(c):o;let s=a("fileNameArray"),d=JSON.parse(s),u="",m="A file with that name already exists. Do you want to proceed with overwrite?";if(d.includes(r))if("save"===t)n(r,e("textarea").value);else if("saveAs"===t)!0===(u=confirm(m))?(e("textarea").value="",n(r,e("textarea").value)):alert("Cancelled");else if("open"===t){let t=a(r);e("textarea").value=t,n("lastFileOpened",r)}else if("delete"===t){if(!0===confirm("Are you sure you want to delete '"+r+"'?")){let e=d.indexOf(r);d.splice(e,1);let t=JSON.stringify(d);f=r,localStorage.removeItem(f),n("fileNameArray",t)}}else"new"===t&&(!0===(u=confirm(m))?(n(r,e("textarea").value),n("lastFileOpened",r),l()):alert("Cancelled"));else if("save"===t||"saveAs"===t||"new"===t)if(null===r)alert("No filename specified");else{d.push(r),n("fileNameArray",JSON.stringify(d)),"new"===t&&(e("textarea").value=""),n(r,e("textarea").value),n("lastFileOpened",r)}else"open"===t?void 0===o?alert("No file found with that name."):(i=!0,alert("The attempt to open most-recent file "+o+" was unsuccessful.")):"delete"===t&&alert("No file found with that name");var f;l(i)}function i(){!function(e){let t=window.open("","","location=no,scrollbars=no,menubar=no,toolbar=no");t.document.open(),t.document.write("<html><body onload='print()'>"),t.document.write(e),t.document.write("</body></html>"),t.document.close()}(e("textarea").value)}function c(){let e=a("lastFileOpened");null!==e&&"null"!==e?o("save",a("lastFileOpened")):o("save")}function r(){o("saveAs")}function s(){o("open")}function d(){o("delete")}!function(){if(null===a("fileNameArray")){let e=[];n("fileNameArray",JSON.stringify(e))}else l()}(),function(){let e=a("lastFileOpened");null!==e&&"null"!==e&&o("open",e)}(),t("printButton",i),t("saveButton",c),t("saveAsButton",r),t("deleteButton",d),t("openButton",s),setInterval(function(){let t=a("fileNameArray"),n=JSON.parse(t),l=0;Array.isArray(n)&&n.forEach(function(e){let t=JSON.stringify(a(e)).length;l+=t});let o=(l/5242880*100).toFixed(3)+"% of storage used.";e("storageSpaceReadout").innerHTML=o},1e4);let u=[];document.addEventListener("keydown",function(t){let n=t.key,l="Alt"===u[0];l&&"a"===n?r():l&&"p"===n?i():l&&"s"===n?c():l&&"o"===n?s():l&&"d"===n?d():l&&"n"===n?o("new"):l&&"x"===n?function(t,n){let a=new Blob([n],{type:"text/plain;charset=UTF-8"}),l=URL.createObjectURL(a),o="";!function(){let e=new Date,t=e.getFullYear()+"-",n=e.getMonth()+1;n<10&&(n="0"+n+"-");let a=e.getDate();a<10&&(a="0"+a),o=o.concat(t,n,a)}();let i=document.createElement("A"),c=t+"_"+o+".txt";i.download=c,i.href=l,i.textContent=c,i.click(),e("inputOutputContainer").appendChild(i),e("inputOutputContainer").innerHTML=""}(a("lastFileOpened"),e("textarea").value):l&&"g"===n?runGam():l&&"w"===n?function(){let t=JSON.stringify(e("textarea").value).split("\n"),n=0;t.forEach(function(e){if("**"!==e.slice(0,2)&&"!!"!==e.slice(0,2)&&"@@"!==e.slice(0,2)&&"//"!==e.slice(0,2)&&""!==e){let t=e.split(" ").length;n+=t}}),alert("Words in text area: approximately "+n)}():l&&"c"===n?e("commandContainer").classList.contains("commandStandby")?(e("commandContainer").classList.remove("commandStandby"),e("commandContainer").classList.add("commandActive")):e("commandContainer").classList.contains("commandActive")?(e("commandContainer").classList.remove("commandActive"),e("commandContainer").classList.add("commandStandby")):alert("Something has gone wrong with toggleCommands"):l&&"m"===n&&function(){let t=JSON.stringify(e("textarea").value);if(!1===t.includes("@#@"))return void alert("Formatting error. Please review email syntax");'"'===t.charAt(0)&&(t=t.slice(1)),'"'===t.charAt(t.length-1)&&(t=t.slice(0,t.length-1));let n,a=t.split("\\n"),l={to:"",cc:"",bcc:"",subject:"",startPoint:0};for(n=0;n<a.length;n+=1)"TO:"===a[n].slice(0,3)?l.to=a[n].slice(3):"CC:"===a[n].slice(0,3)?l.cc=a[n].slice(3):"BCC:"===a[n].slice(0,4)?l.bcc=a[n].slice(4):"SUBJECT:"===a[n].slice(0,8)?l.subject=a[n].slice(8):"@#@"===a[n].slice(0,3)&&(l.startPoint=n+1);let o="mailto:";function i(){"?"!==o.charAt(o.length-1)&&(o=o.concat("&"))}o=o.concat(l.to,"?"),""!==l.cc&&(i(),o=o.concat("cc=",l.cc)),""!==l.bcc&&(i(),o=o.concat("bcc=",l.bcc)),""!==l.subject&&(i(),o=o.concat("subject=",l.subject));let c=a.slice(l.startPoint);""===c[0]&&c.shift();let r=c.join("%0D%0A").replace('"',"'");o=o.concat("&body=",r);let s=document.createElement("A");s.target="_blank",s.href=o,s.click()}(),1===u.length&&u.shift(),u.push(t.key)})});