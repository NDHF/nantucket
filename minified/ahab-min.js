document.onreadystatechange=function(){"complete"===document.readyState&&function(){function e(e){return document.getElementById(e)}function t(e){return document.getElementsByClassName(e)}function n(t){return e(t).contentDocument.documentElement}function o(t,o,l,i){void 0===i?e(t).addEventListener(o,l):"menuIcon"===i&&n(t).addEventListener(o,l)}function l(e){new Audio("http://www.ndhfilms.com/assets/audio/"+e+".mp3").play()}function i(t,n,o,l){let i;"byClass"!==l?i=e(t):"byClass"===l&&(i=t),i.classList.contains(n)?(i.classList.remove(n),i.classList.add(o)):i.classList.contains(o)&&(i.classList.remove(o),i.classList.add(n))}function c(){y=document.getElementById("audioElement").contentDocument.documentElement,!1===b&&(document.getElementById("audioElement").contentDocument.documentElement.addEventListener("click",E),b=!0),y.getElementById("runningTimeText").childNodes.length>0&&y.getElementById("runningTimeText").removeChild(y.getElementById("runningTimeText").childNodes[0]);let e="",t="";function n(n,o){let l=parseInt(n/60);l<10&&(l="0"+l);let i=parseInt(n%60);i<10&&(i="0"+i);let c=l+":"+i;"currentPosition"===o?e=c:"totalRunningTime"===o&&(t=c)}n(g.currentTime,"currentPosition"),n(g.duration,"totalRunningTime");let o=document.createTextNode(e+" / "+t);(e.includes("NaN")||t.includes("NaN"))&&(o=document.createTextNode("LOADING...")),y.getElementById("runningTimeText").appendChild(o);let l=(g.currentTime/g.duration).toFixed(2);Number.isNaN(l)&&(l=0);let i=300*l+50;y.getElementById("scrubberLine").x1.baseVal.value=i,y.getElementById("scrubberLine").x2.baseVal.value=i,g.currentTime===g.duration&&(g.pause(),(y=document.getElementById("audioElement").contentDocument.documentElement).getElementById("playSymbol").style.fill="rgb(0, 0, 0)",y.getElementById("pauseSymbol").style.stroke="rgba(0, 0, 0, 0)",g.currentTime=0,I())}function a(){i("audioDiv","standby","active"),e("audioDiv").classList.contains("active")&&""!==g&&setTimeout(c,1e3)}function r(e){let t=/MSIE 10/i.test(navigator.userAgent),o=/MSIE 9/i.test(navigator.userAgent)||/rv:11.0/i.test(navigator.userAgent),l=/Edge\/\d./i.test(navigator.userAgent);t||o||l||("turnWheels"===e?(n("cassetteAnimatedObject").children[2].children[0].beginElement(),n("cassetteAnimatedObject").children[3].children[0].beginElement()):"stopWheels"===e?(n("cassetteAnimatedObject").children[2].children[0].endElement(),n("cassetteAnimatedObject").children[3].children[0].endElement()):"starAnimation"===e&&document.getElementById("starObject").contentDocument.documentElement.children[1].children[0].beginElement())}let s="",u="",d=Array.from(document.getElementsByTagName("META"));function m(){d.forEach(function(e){"keyword"===e.name&&(s=e.content),"nameOfFavoritesArray"===e.name&&(u=e.content)})}m();let g="",y="",b=!1;function f(e,t){"setToZero"===e?localStorage.setItem(s+"scrollPosition",0):localStorage.setItem(s+"scrollPosition",window.scrollY),"noSound"!==t&&l("pageFlip")}function I(t){r("stopWheels"),function(){let t=g.currentTime;if(null!==e("audioSourceMenu")){let n=0;Array.from(e("audioSourceList").childNodes).forEach(function(t,o){t.innerHTML===e("currentAudio").innerHTML&&(n=o)});let o=0,l=5;t>l&&(o=t-l);let i=n+"|\\|"+o,c=s+"LastAudioPoint";localStorage.setItem(c,i)}}(),"closingDiv"!==t&&l("stopTape")}function E(e){y=document.getElementById("audioElement").contentDocument.documentElement;let t=e.target.id;if("playAndPauseOverlay"===t)"rgb(0, 0, 0)"===y.getElementById("playSymbol").style.fill&&"rgba(0, 0, 0, 0)"===y.getElementById("pauseSymbol").style.stroke?(y.getElementById("playSymbol").style.fill="rgba(0, 0, 0, 0)",y.getElementById("pauseSymbol").style.stroke="black",g.play(),l("startTape"),r("turnWheels"),timeInterval=setInterval(c,500)):(y.getElementById("playSymbol").style.fill="rgb(0, 0, 0)",y.getElementById("pauseSymbol").style.stroke="rgba(0, 0, 0, 0)",g.pause(),I(),clearInterval(timeInterval));else if("loudspeakerOverlay"===t)"rgba(255, 0, 0, 0)"===y.getElementById("mute-x").style.stroke?(y.getElementById("mute-x").style.stroke="rgba(255, 0, 0, 1)",g.muted=!0):(y.getElementById("mute-x").style.stroke="rgba(255, 0, 0, 0)",g.muted=!1);else if("scrubberOverlay"===t){let t=y.getElementById("scrubberOverlay").getBoundingClientRect(),n=e.clientX-t.left;if(n>=50&&n<=350){y.getElementById("scrubberLine").x1.baseVal.value=n,y.getElementById("scrubberLine").x2.baseVal.value=n;let e=(n-50)/300;g.currentTime=g.duration*e,c()}}}function h(){I("closingDiv"),g.pause(),(y=document.getElementById("audioElement").contentDocument.documentElement).getElementById("playSymbol").style.fill="rgb(0, 0, 0)",y.getElementById("pauseSymbol").style.stroke="rgba(0, 0, 0, 0)",a()}function S(e){let t="",o="",i="";if(null===localStorage.getItem(u)){let e=JSON.stringify([]);localStorage.setItem(u,e)}else i=!(o=(t=JSON.parse(localStorage.getItem(u))).includes(s));let c="rgba(255,215,0,1)";"retrieveMode"===e?o?document.getElementById("starObject").contentDocument.documentElement.children[1].style.fill=c:i&&(document.getElementById("starObject").contentDocument.documentElement.children[1].style.fill="rgba(255,215,0,0)"):i?(t.push(s),localStorage.setItem(u,JSON.stringify(t)),r("starAnimation"),document.getElementById("starObject").contentDocument.documentElement.children[1].style.fill=c,l("favorite")):o&&(t.splice(t.indexOf(s)),localStorage.setItem(u,JSON.stringify(t)),n("starObject").children[1].style.dur="1s",n("starObject").children[1].style.fill="rgba(255,215,0,0)")}function k(){e("audioSourceMenu").classList.contains("active")&&(""!==g&&g.pause(),(y=document.getElementById("audioElement").contentDocument.documentElement).getElementById("playSymbol").style.fill="rgb(0, 0, 0)",y.getElementById("pauseSymbol").style.stroke="rgba(0, 0, 0, 0)",function(t){"LI"===t.target.tagName&&(g=new Audio(t.target.title),setTimeout(c,500),g.muted=!0,g.play(),setTimeout(function(){g.pause(),g.muted=!1},100),e("currentAudio").innerHTML=t.target.innerHTML)}(event),I("closingDiv")),i("audioSourceMenu","audioSourceMenuStandby","active")}function v(e){Array.from(t(e)).forEach(function(n){!function(e,n){e.addEventListener("click",function(){let o=t(n),l=Array.from(o).indexOf(e);i(t("illustrationDiv")[l],"standby","active","byClass")})}(n,e)})}localStorage.setItem(s+"darkMode","darkModeOff"),o("menuIconDiv","click",function(){m(),i("buttonContainer","menuClosed","menuOpen");let t="http://www.ndhfilms.com/assets/images/",n=e("menuIconImg").src;n.includes("menuicon")?("darkModeOn"===localStorage.getItem(s+"darkMode")?e("menuIconImg").src=t+"collapseicon_white.svg":e("menuIconImg").src=t+"collapseicon_black.svg",window.innerWidth<window.innerHeight&&(e("menuIconImg").style.transform="rotate(180deg)")):n.includes("collapseicon")&&("darkModeOn"===localStorage.getItem(s+"darkMode")?e("menuIconImg").src=t+"menuicon_white.svg":e("menuIconImg").src=t+"menuicon_black.svg")}),o("lightbulbObject","click",function(){function o(o,l,i,c,a){document.body.style.backgroundColor=o,null!==e("audioDiv")&&(e("audioDiv").style.backgroundColor=o),null!==e("tableOfContents")&&(e("tableOfContents").style.backgroundColor=o),null!==e("audioSourceMenu")&&(e("audioSourceMenu").style.backgroundColor=o,e("audioSourceMenu").style.color=l),e("buttonContainer").style.backgroundColor=o,null!==e("tableOfContents")&&(e("tableOfContents").style.color=l),null!==e("tableOfContentsSection")&&(e("tableOfContentsSection").style.color=l),["HEADER","P","A","BLOCKQUOTE"].forEach(function(e){let t=function(e){return document.getElementsByTagName(e)}(e);Array.from(t).forEach(function(t){let n=!1===t.classList.contains("tocLink"),o="audioCreditsLink"!==t.id,c="currentAudio"!==t.id;"A"===e&&n?o&&(t.style.color=i):c&&(t.style.color=l)})}),["illustrationDiv","sectionHeader","illustrationCaption","mainTextUL","tocStandby","chapterHeading","enlargeIcon","style-two"].forEach(function(e){let n=t(e);Array.from(n).forEach(function(t){"tocStandby"===e?t.style.backgroundColor=c:"style-two"===e?t.style.backgroundImage=a:"enlargeIcon"===e?t.src="http://www.ndhfilms.com/assets/images/enlargeicon_"+l+".svg":t.style.color=l,"illustrationDiv"===e&&(t.style.backgroundColor=o)})}),null!==e("tocList")&&Array.from(document.getElementById("tocList").children).forEach(function(e){e.style.color=l}),null!==e("tocIconObject")&&(n("tocIconObject").children[0].style.stroke=l),n("lightbulbObject").children[1].style.stroke=l,n("bookmarkObject").children[2].style.stroke=l,null!==e("cassetteObject")&&(n("cassetteObject").style.stroke=l),null!==e("monetizationIcon")&&(e("monetizationIcon").src="http://www.ndhfilms.com/assets/images/monetization_"+l+".svg"),function(){let t="http://www.ndhfilms.com/assets/images/",n=e("menuIconImg").src;n.includes("menuicon")?e("menuIconImg").src=t+"menuicon_"+l+".svg":n.includes("collapseicon")&&(e("menuIconImg").src=t+"collapseicon_"+l+".svg")}()}m(),"darkModeOff"===localStorage.getItem(s+"darkMode")?(o("black","white","white","black","linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0))"),localStorage.setItem(s+"darkMode","darkModeOn")):"darkModeOn"===localStorage.getItem(s+"darkMode")&&(localStorage.setItem(s+"darkMode","darkModeOff"),o("seashell","black","blue","seashell","linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))")),l("lightswitch")},"menuIcon"),o("bookmarkObject","click",f,"menuIcon"),null!==e("cassetteObject")&&o("cassetteObject","click",a,"menuIcon"),null!==e("audioCreditsLink")&&o("audioCreditsLink","click",h),document.addEventListener("click",function(e){"audioCloseButton"===e.target.id&&h()}),null!==e("audioSourceMenu")&&(o("audioSourceMenu","click",k),e("audioSourceList").childNodes.length>1&&o("currentAudio","click",k)),null!==e("tableOfContents")&&o("tableOfContents","click",function(){i("tableOfContents","tocStandby","active");let t=e("tableOfContents");t.classList.contains("tocStandby")&&(t.scrollTop=0)}),null!==e("tocIconObject")&&(o("tocIconObject","click",function(){window.innerWidth>1201&&window.innerWidth>window.innerHeight?i("tocSelect","selectOpen","selectClosed"):i("tableOfContents","tocStandby","active")},"menuIcon"),o("tocSelect","change",function(){"placeholder"!==this.value&&(window.location=this.value,e("firstOption").selected="true")})),v("illustrationTarget"),v("enlargeIcon"),Array.from(document.getElementsByClassName("illustrationDiv")).forEach(function(e){e.addEventListener("click",function(){let n=t("illustrationDiv"),o=Array.from(n).indexOf(e);i(t("illustrationDiv")[o],"active","standby","byClass")})}),null!==e("starObject")&&o("starObject","click",S,"menuIcon"),setTimeout(function(){!function(){let e=localStorage.getItem(s+"scrollPosition");null===e?(f("setToZero","noSound"),localStorage.getItem(s+"scrollPosition")):window.scrollTo(0,e)}(),null!==e("starObject")&&S("retrieveMode"),function(){let t=localStorage.getItem(s+"LastAudioPoint");if(null!==t){let n=t.split("|\\|"),o=n[0];""===o&&(o=0);let l=parseFloat(n[1]);null!==e("audioSourceMenu")&&(e("currentAudio").innerHTML=e("audioSourceList").childNodes[o].innerHTML,(g=new Audio(e("audioSourceList").childNodes[o].title)).currentTime=l)}else 1===e("audioSourceList").childNodes.length&&(e("currentAudio").innerHTML=e("audioSourceList").childNodes[0].innerHTML,(g=new Audio(e("audioSourceList").childNodes[0].title)).currentTime=0)}()},50)}()};