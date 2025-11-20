(function(){
  const root=document.querySelector('.veeaardvark');
  if(!root) return;

  /* ========================
     HERO CAROUSEL
     ======================== */
  const carousel=root.querySelector('.veeaardvark-carousel');
  const slidesWrap=root.querySelector('#veeaardvark-bannerSlides');
  const dotsWrap=root.querySelector('#veeaardvark-bannerDots');
  const carPrev=root.querySelector('[data-car-prev]');
  const carNext=root.querySelector('[data-car-next]');

  if(carousel && slidesWrap && dotsWrap && carPrev && carNext){
    const total=slidesWrap.children.length;
    let index=0, timer;

    function makeDots(){
      dotsWrap.innerHTML='';
      for(let i=0;i<total;i++){
        const b=document.createElement('button');
        b.className='veeaardvark-dot';
        b.type='button';
        b.setAttribute('aria-label','Go to slide '+(i+1));
        b.addEventListener('click',()=>go(i));
        dotsWrap.appendChild(b);
      }
    }

    function syncCarouselHeight(){
      if(!carousel.classList.contains('auto-size')) return;
      const active=slidesWrap.children[index];
      const img=active?active.querySelector('img'):null;
      if(!img) return;
      const cw=carousel.clientWidth||img.clientWidth;
      const nh=img.naturalHeight,nw=img.naturalWidth;
      if(nh && nw){
        const h=Math.round(cw*nh/nw);
        carousel.style.height=h+'px';
      }else{
        img.addEventListener('load',syncCarouselHeight,{once:true});
      }
    }

    function render(){
      slidesWrap.style.transform='translateX(-'+(index*100)+'%)';
      dotsWrap.querySelectorAll('.veeaardvark-dot').forEach((d,i)=>{
        d.setAttribute('aria-current',i===index);
      });
      syncCarouselHeight();
    }

    function go(i){
      index=(i+total)%total;
      render();
      restart();
    }

    function restart(){
      clearInterval(timer);
      timer=setInterval(()=>go(index+1),6000);
    }

    if(total<=1){
      carPrev.classList.add('is-hidden');
      carNext.classList.add('is-hidden');
    }

    makeDots();
    render();
    restart();

    carPrev.addEventListener('click',()=>go(index-1));
    carNext.addEventListener('click',()=>go(index+1));
    window.addEventListener('resize',syncCarouselHeight);
  }

  /* ========================
     GENERIC SLIDERS
     ======================== */
  function visibleCount(){
    const w=window.innerWidth;
    if(w<=720) return 1.5;
    if(w<=1024) return 3;
    return 4;
  }

  root.querySelectorAll('.vee-slider').forEach(slider=>{
    const track=slider.querySelector('.vee-slider-track');
    const cards=Array.from(track.children);
    const prev=slider.querySelector('[data-slider-prev]');
    const next=slider.querySelector('[data-slider-next]');
    if(!cards.length || !prev || !next) return;

    let index=0;

    function step(){
      const c0=cards[0];
      if(!c0) return 0;
      const r1=c0.getBoundingClientRect();
      let w=r1.width;
      if(cards.length>1){
        const r2=cards[1].getBoundingClientRect();
        const gap=r2.left-r1.right;
        if(gap>0) w+=gap;
      }
      return w;
    }

    function clamp(){
      const v=Math.ceil(visibleCount());
      const max=Math.max(0,cards.length-v);
      if(index<0) index=0;
      if(index>max) index=max;
    }

    function render(){
      clamp();
      const offset=step()*index;
      track.style.transform='translateX(-'+offset+'px)';
    }

    prev.addEventListener('click',()=>{index--;render();});
    next.addEventListener('click',()=>{index++;render();});
    window.addEventListener('resize',render);
    render();
  });
})();
