/* Measure the visible viewport and the room's own allocated cell after every transition. */
function fitSearchRoomSize(width,height){const ratio=1672/941;const w=Math.max(0,Math.floor(Math.min(width,height*ratio)));return {width:w,height:Math.max(0,Math.floor(w/ratio))}}
let searchViewportFrame=0,searchRoomObserver=null,searchObservedRoom=null;
function queueSearchViewport(){if(searchViewportFrame)cancelAnimationFrame(searchViewportFrame);searchViewportFrame=requestAnimationFrame(syncSearchViewport)}
function syncSearchViewport(){searchViewportFrame=0;const stage=document.querySelector('.immersive');if(!stage){searchRoomObserver?.disconnect();searchObservedRoom=null;return}const v=window.visualViewport;const values={'--search-viewport-width':v?.width||window.innerWidth,'--search-viewport-height':v?.height||window.innerHeight,'--search-viewport-top':v?.offsetTop||0,'--search-viewport-left':v?.offsetLeft||0};for(const [key,value] of Object.entries(values))stage.style.setProperty(key,`${value}px`);const cell=stage.querySelector('.board-scroll'),board=stage.querySelector('.search-board');if(cell!==searchObservedRoom){searchRoomObserver?.disconnect();searchObservedRoom=cell;if(cell&&typeof ResizeObserver!=='undefined'){searchRoomObserver=new ResizeObserver(queueSearchViewport);searchRoomObserver.observe(cell)}}if(cell&&board){const size=fitSearchRoomSize(cell.clientWidth,cell.clientHeight);board.style.width=size.width+'px';board.style.height=size.height+'px'}}
// Initial render, address-bar changes, rotation and native fullscreen all use the same sizing path.
window.addEventListener('resize',queueSearchViewport);
window.addEventListener('orientationchange',queueSearchViewport);
document.addEventListener('fullscreenchange',queueSearchViewport);
window.visualViewport?.addEventListener('resize',queueSearchViewport);
window.visualViewport?.addEventListener('scroll',queueSearchViewport);
new MutationObserver(queueSearchViewport).observe(document.querySelector('#app'),{childList:true});
queueSearchViewport();
