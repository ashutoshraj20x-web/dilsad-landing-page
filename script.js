document.addEventListener("DOMContentLoaded", () => {
"use strict";

const WHATSAPP_NUMBER="917058626922"; // Replace with Dilsad's number: country code + number, no + or spaces.
const WHATSAPP_MESSAGE="Hi Dilsad, I saw your page and want to know more about the current offer.";
const link="https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(WHATSAPP_MESSAGE);

document.querySelectorAll(".wa-cta").forEach(a=>{
  a.href=link;
  a.target="_blank";
  a.rel="noopener noreferrer";
});

const year=document.getElementById("year");
if(year) year.textContent=new Date().getFullYear();

document.querySelectorAll(".faq-item button").forEach(btn=>{
  btn.setAttribute("aria-expanded","false");
  btn.addEventListener("click",()=>{
    const item=btn.closest(".faq-item");
    const open=item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach(x=>x.classList.remove("open"));
    if(!open) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded","true");
    } else {
      btn.setAttribute("aria-expanded","false");
    }
  });
});

const floating=document.querySelector(".floating-wa");
window.addEventListener("scroll",()=>{
  if(floating) floating.classList.toggle("show",window.scrollY>window.innerHeight*.55);
},{passive:true});

document.querySelectorAll(".hero-media,.photo-scroller,.team-snap,.proof-scroller").forEach(scroller=>{
  let down=false,startX,scrollLeft;
  scroller.addEventListener("pointerdown",e=>{
    down=true;startX=e.clientX;scrollLeft=scroller.scrollLeft;
    scroller.setPointerCapture?.(e.pointerId);
  });
  scroller.addEventListener("pointermove",e=>{
    if(!down)return;
    scroller.scrollLeft=scrollLeft-(e.clientX-startX);
  });
  ["pointerup","pointercancel","pointerleave"].forEach(ev=>{
    scroller.addEventListener(ev,()=>down=false);
  });
});

function autoScroll(scroller, delay){
  if(!scroller || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let timer, paused=false;
  const start=()=>{
    clearInterval(timer);
    timer=setInterval(()=>{
      if(paused || scroller.scrollWidth<=scroller.clientWidth) return;
      const step=scroller.clientWidth;
      const max=scroller.scrollWidth-scroller.clientWidth;
      scroller.scrollTo({left: scroller.scrollLeft+step>=max-5?0:scroller.scrollLeft+step,behavior:"smooth"});
    },delay);
  };
  scroller.addEventListener("pointerdown",()=>{paused=true;clearInterval(timer)});
  ["pointerup","pointercancel"].forEach(ev=>scroller.addEventListener(ev,()=>{paused=false;start()}));
  start();
}
// Hero auto-slider: photos first, then videos. Scrolls every 7 seconds.
const heroScroller=document.querySelector(".hero-media");
if(heroScroller && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  let heroTimer, heroPaused=false;
  const heroSlide=()=>{
    clearInterval(heroTimer);
    heroTimer=setInterval(()=>{
      if(heroPaused || heroScroller.scrollWidth<=heroScroller.clientWidth) return;
      const step=heroScroller.clientWidth;
      const max=heroScroller.scrollWidth-heroScroller.clientWidth;
      if(heroScroller.scrollLeft+step>=max-5){
        heroScroller.scrollTo({left:0,behavior:"smooth"});
      } else {
        heroScroller.scrollTo({left:heroScroller.scrollLeft+step,behavior:"smooth"});
      }
    },7000);
  };
  heroScroller.addEventListener("pointerdown",()=>{heroPaused=true;clearInterval(heroTimer)});
  ["pointerup","pointercancel","pointerleave"].forEach(ev=>heroScroller.addEventListener(ev,()=>{heroPaused=false;heroSlide()}));
  heroSlide();

  // Auto-play video when it scrolls into view, pause when it scrolls out
  const heroVideos=heroScroller.querySelectorAll(".hero-slide-video");
  const heroObserver=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const vid=entry.target;
      if(entry.isIntersecting){
        vid.play().catch(()=>{});
      } else {
        vid.pause();
      }
    });
  },{root:heroScroller,threshold:0.6});
  heroVideos.forEach(v=>heroObserver.observe(v));
}

// Hero video play/pause toggle buttons
document.querySelectorAll(".hero-vid-toggle").forEach(btn=>{
  const vid=btn.previousElementSibling;
  if(!vid || vid.tagName!=="VIDEO") return;
  btn.addEventListener("click",(e)=>{
    e.stopPropagation();
    if(vid.paused){
      vid.play().catch(()=>{});
      btn.textContent="❚❚";
    } else {
      vid.pause();
      btn.textContent="▶";
    }
  });
  vid.addEventListener("play",()=>{btn.textContent="❚❚"});
  vid.addEventListener("pause",()=>{btn.textContent="▶"});
});
autoScroll(document.querySelector(".video-scroller"),5000);

// Glass navbar gets a slightly stronger surface after scrolling.
const navbar=document.querySelector(".navbar");
const updateNav=()=>navbar?.classList.toggle("nav-scrolled",window.scrollY>24);
updateNav();
window.addEventListener("scroll",updateNav,{passive:true});

// Welcome gate — initialized after the DOM exists.
const welcomeOverlay=document.getElementById("welcomeOverlay");
const welcomeClose=document.getElementById("welcomeClose");

if(welcomeOverlay){
  document.body.classList.add("modal-open");

  const closeWelcome=()=>{
    welcomeOverlay.classList.add("hidden");
    document.body.classList.remove("modal-open");
    // Keep the hidden state for this page session.
    try { sessionStorage.setItem("welcomeClosed","1"); } catch(e) {}
  };

  // Close button is the primary way to enter the website.
  if(welcomeClose) welcomeClose.addEventListener("click", closeWelcome);

  // Clicking outside the card also closes it.
  welcomeOverlay.addEventListener("click",e=>{
    if(e.target===welcomeOverlay) closeWelcome();
  });

  document.addEventListener("keydown",e=>{
    if(e.key==="Escape" && !welcomeOverlay.classList.contains("hidden")) closeWelcome();
  });
}

// Photo click interaction with a clean full-screen preview effect.
const lightbox=document.getElementById("photoLightbox");
const lightboxInner=document.getElementById("lightboxInner");
const lightboxClose=document.getElementById("lightboxClose");

document.querySelectorAll(".photo-scroller figure").forEach(figure=>{
  figure.addEventListener("click",()=>{
    if(!lightbox || !lightboxInner) return;
    const visual=figure.querySelector(".photo-placeholder");
    if(visual){
      lightboxInner.innerHTML=visual.outerHTML;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden","false");
    }
  });
});

const closeLightbox=()=>{
  if(!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden","true");
};

if(lightboxClose) lightboxClose.addEventListener("click",closeLightbox);
if(lightbox) lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape" && lightbox?.classList.contains("open")) closeLightbox();
});

});
