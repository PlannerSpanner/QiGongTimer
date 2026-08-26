// capture the exact SVG each app draws, per movement, per frame
const fs=require('fs'),path=require('path');const ROOT=path.join(__dirname,'..');
const out={};
for(const app of ['morning-flow','prenatal-stretch','prenatal-movement','daily-13']){
  const h=fs.readFileSync(path.join(ROOT,`${app}.html`),'utf8');
  const js=h.split('<script>')[1].split('</script>')[0];
  const core=js.slice(0, js.indexOf("const $=id=>document.getElementById(id);"));
  const stub={_html:'',attrs:{},setAttribute(k,v){this.attrs[k]=String(v);}};
  Object.defineProperty(stub,'innerHTML',{get(){return this._html;},set(v){this._html=v;}});
  const shadow={attrs:{},setAttribute(k,v){this.attrs[k]=String(v);}};
  const doc={getElementById:id=>id==='layer'?stub:shadow};
  const ctx=new Function('document', core+'\nreturn {MOVES,drawFig,placeGround,fitOf};')(doc);
  const app_out=[];
  ctx.MOVES.forEach(m=>{
    const fit=ctx.fitOf(m);
    ctx.placeGround(m,fit);
    const frames=[];
    for(const ph of [0,0.17,0.33,0.5,0.67,0.83]){
      ctx.drawFig(m,fit,ph);
      frames.push(stub._html);
    }
    app_out.push({n:m.n,shadow:{...shadow.attrs},frames});
  });
  out[app]=app_out;
}
fs.writeFileSync('frames.json',JSON.stringify(out));
console.log('dumped:',Object.entries(out).map(([k,v])=>k+':'+v.length).join('  '));
