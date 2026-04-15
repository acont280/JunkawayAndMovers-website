// NAV SCROLL
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>40));

// MOBILE NAV (full-width stacked cards)
const mobileMenu=document.getElementById('mobileMenu');
const mobilePanel=document.getElementById('mobileNavPanel');
const mobileOverlay=document.getElementById('mobileNavOverlay');
let mobileNavOpen=false;

if(mobileMenu && mobilePanel && mobileOverlay){
  mobileMenu.addEventListener('click',()=>{
    mobileNavOpen=!mobileNavOpen;
    mobilePanel.classList.toggle('open',mobileNavOpen);
    mobileOverlay.classList.toggle('visible',mobileNavOpen);
    mobileMenu.innerHTML=mobileNavOpen?'✕':'☰';
  });
  mobileOverlay.addEventListener('click',()=>{
    mobileNavOpen=false;
    mobilePanel.classList.remove('open');
    mobileOverlay.classList.remove('visible');
    mobileMenu.innerHTML='☰';
  });
  // Close on link click
  mobilePanel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    mobileNavOpen=false;
    mobilePanel.classList.remove('open');
    mobileOverlay.classList.remove('visible');
    mobileMenu.innerHTML='☰';
  }));
} else {
  // Fallback for pages without the mobile panel (services, reviews, about, faq)
  if(mobileMenu){
    mobileMenu.addEventListener('click',()=>{
      const l=document.getElementById('navLinks');
      if(l.style.display==='flex'){l.style.display='none';mobileMenu.innerHTML='☰';return}
      l.style.display='flex';l.style.flexDirection='column';l.style.position='absolute';
      l.style.top='60px';l.style.right='20px';l.style.background='var(--white)';
      l.style.padding='20px';l.style.borderRadius='12px';l.style.boxShadow='0 8px 30px rgba(0,0,0,0.1)';
      l.style.border='1px solid var(--border)';l.style.gap='16px';l.style.zIndex='200';
      mobileMenu.innerHTML='✕';
    });
  }
}

// FADE IN
const fadeEls=document.querySelectorAll('.fade-up');
const fadeObs=new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*80);fadeObs.unobserve(e.target)}});
},{threshold:0.15});
fadeEls.forEach(el=>fadeObs.observe(el));

// REVIEWS DATA
const ALL_REVIEWS=[
  {name:"Samantha Barnhill",text:"Adnen and his crew were fantastic! Very fast, professional, and respectful. They offered solutions we didn't even think about and advised us on the best way to move and secure our pieces."},
  {name:"Sheila Noye",text:"I had an excellent experience with Junkaway & Movers. They were fast, efficient, and extremely reliable. After dealing with several moving services in the past, this team truly stood out."},
  {name:"Wissal Jaballah",text:"Incredibly efficient and always on time, making the entire process smooth and stress-free. Pricing was fair and transparent, and the team was both polite and friendly."},
  {name:"Germán Méndez Bravo",text:"These guys were excellent. We had a large sectional sofa that wouldn't fit through the stairwell. They lifted it through the kitchen balcony. Not an easy job — handled with skill."},
  {name:"Violet Loncar",text:"These people were a godsend. My husband and me are seniors and very sick. Every time we call them they are very prompt, extremely reasonable, and very kind and helpful."},
  {name:"Erin M.M. Comolli",text:"Absolutely phenomenal — efficient, kind, respectful and a pleasure to work with. I would recommend this team to anyone!"},
  {name:"Slim",text:"Aymen responded quickly after my basement garage flooded from the king tides. He communicated clearly throughout and completed all the work efficiently and thoroughly."},
  {name:"Kimmie Lee",text:"First time using this company and they did a great job with moving and assembling my furniture. All my things are not damaged. Very satisfied with Aymen and his crew."},
  {name:"Lauren Gratsch",text:"Moved my whole 1 bedroom apartment in under three hours! So fast! Great job."},
  {name:"Omar Ja",text:"These guys did a fantastic job cleaning out my garage. Showed up on time and handled everything quickly and professionally."},
  {name:"Henry Mendez",text:"Aymen is super fast and efficient and a great communicator. He was responsive with a few pre-task questions. Will definitely hire again!"},
  {name:"Benjamin Lindquist",text:"Wonderful people! Removed couch and was very professional in installing new couch!"},
  {name:"Safa Ben abdallah",text:"Highly recommend Junkaway & Movers! Aymen was professional, reliable, and easy to work with from start to finish."},
  {name:"Brad Goodall",text:"These guys are amazing. Super professional and very quick!"},
  {name:"Emily Tran",text:"Good job with a last minute request for a very large item. They figured it out."},
  {name:"Nick Peterson",text:"They are unbelievable! If you want great work done quickly, you found them!"},
  {name:"Barbara Slocum",text:"We've used these guys a few times — hardest working team out there!"},
  {name:"Maci McCravy",text:"Hired for a mattress removal and recycling. Absolutely wonderful. On time, friendly, efficient. Highly recommend!"}
];

function renderReviewCards(containerId, count){
  const grid=document.getElementById(containerId);
  if(!grid) return;
  const reviews = count ? ALL_REVIEWS.slice(0,count) : ALL_REVIEWS;
  reviews.forEach(r=>{
    const initials=r.name.split(' ').map(w=>w[0]).join('').slice(0,2);
    const card=document.createElement('div');card.className='review-card fade-up visible';
    card.innerHTML='<div class="review-header"><div class="review-avatar">'+initials+'</div><div><div class="review-name">'+r.name+'</div><div class="review-date">Google Review</div></div></div><div class="review-stars">★★★★★</div><div class="review-text">"'+r.text+'"</div>';
    grid.appendChild(card);
  });
}

// Homepage: 3 reviews (desktop)
if(document.getElementById('reviewsGridHome')) renderReviewCards('reviewsGridHome',3);
// Reviews page: all reviews (desktop grid)
if(document.getElementById('reviewsGridFull')) renderReviewCards('reviewsGridFull');

// CAROUSEL LOGIC
function initCarousel(wrapperId){
  const wrap=document.getElementById(wrapperId);
  if(!wrap) return;
  const track=wrap.querySelector('.carousel-track');
  const prevBtn=wrap.querySelector('.carousel-prev');
  const nextBtn=wrap.querySelector('.carousel-next');
  let current=0;

  function getSlides(){ return wrap.querySelectorAll('.carousel-slide'); }
  function getDots(){ return wrap.querySelectorAll('.carousel-dots span'); }

  function updateDots(){
    getDots().forEach((d,idx)=>d.classList.toggle('active',idx===current));
  }

  function goTo(i){
    const slides=getSlides();
    const total=slides.length;
    if(total===0) return;
    if(i<0) i=0;
    if(i>=total) i=total-1;
    current=i;
    // Use the slide's offsetLeft for accurate positioning
    track.scrollTo({left:slides[current].offsetLeft,behavior:'smooth'});
    updateDots();
  }

  // Sync dots on manual swipe
  let scrollTimer;
  track.addEventListener('scroll',()=>{
    clearTimeout(scrollTimer);
    scrollTimer=setTimeout(()=>{
      const slides=getSlides();
      if(slides.length===0) return;
      const slideWidth=slides[0].offsetWidth;
      if(slideWidth===0) return;
      const newIndex=Math.round(track.scrollLeft/slideWidth);
      if(newIndex!==current && newIndex>=0 && newIndex<slides.length){
        current=newIndex;
        updateDots();
      }
    },150);
  });

  if(prevBtn) prevBtn.addEventListener('click',(e)=>{e.preventDefault();goTo(current-1);});
  if(nextBtn) nextBtn.addEventListener('click',(e)=>{e.preventDefault();goTo(current+1);});

  // Dot clicks — use event delegation since dots may be dynamic
  const dotsContainer=wrap.querySelector('.carousel-dots');
  if(dotsContainer){
    dotsContainer.addEventListener('click',(e)=>{
      if(e.target.tagName==='SPAN'){
        const dots=Array.from(dotsContainer.children);
        const idx=dots.indexOf(e.target);
        if(idx>=0) goTo(idx);
      }
    });
  }

  // Init first dot
  updateDots();
}

// BUILD REVIEWS CAROUSEL (mobile)
const reviewsTrack=document.getElementById('reviewsCarouselTrack');
const reviewsDots=document.getElementById('reviewsCarouselDots');
if(reviewsTrack && reviewsDots){
  ALL_REVIEWS.forEach((r,i)=>{
    const initials=r.name.split(' ').map(w=>w[0]).join('').slice(0,2);
    const slide=document.createElement('div');
    slide.className='carousel-slide';
    slide.innerHTML='<div class="review-card"><div class="review-header"><div class="review-avatar">'+initials+'</div><div><div class="review-name">'+r.name+'</div><div class="review-date">Google Review</div></div></div><div class="review-stars">★★★★★</div><div class="review-text">"'+r.text+'"</div></div>';
    reviewsTrack.appendChild(slide);
    const dot=document.createElement('span');
    reviewsDots.appendChild(dot);
  });
}

// Init carousels if they exist
initCarousel('servicesCarousel');
initCarousel('reviewsCarousel');
