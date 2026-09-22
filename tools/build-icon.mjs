// Deterministic 32px raster of the existing favicon.svg sigma mark.
import fs from "node:fs/promises";
const size=32;
const pixels=Buffer.alloc(size*size*4);
const points=[[22.5,7.5],[9,7.5],[17.5,16],[9,24.5],[22.5,24.5]];
function distance(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1];const t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);}
for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const white=points.slice(1).some((p,i)=>distance(x+.5,y+.5,points[i],p)<=1.5);
  const offset=((size-1-y)*size+x)*4;
  pixels.set(white?[255,255,255,255]:[129,46,49,255],offset);
}
const dib=Buffer.alloc(40);dib.writeUInt32LE(40);dib.writeInt32LE(size,4);dib.writeInt32LE(size*2,8);dib.writeUInt16LE(1,12);dib.writeUInt16LE(32,14);
const bitmap=Buffer.concat([dib,pixels,Buffer.alloc(4*size)]);
const header=Buffer.alloc(22);header.writeUInt16LE(1,2);header.writeUInt16LE(1,4);header[6]=size;header[7]=size;header.writeUInt16LE(1,10);header.writeUInt16LE(32,12);header.writeUInt32LE(bitmap.length,14);header.writeUInt32LE(22,18);
await fs.writeFile("public/favicon.ico",Buffer.concat([header,bitmap]));
console.log("Generated public/favicon.ico from the Mathinking sigma mark.");
