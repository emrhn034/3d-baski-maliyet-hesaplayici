// Ara para tutarları, TL'nin milyonda biri cinsinden tamsayı tutulur.
const S=1000000n;
export function fixed(v){let t=String(v).replace(',','.');if(!/^\d+(\.\d{0,6})?$/.test(t))throw Error('Negatif olmayan geçerli bir sayı girin (en fazla 6 ondalık basamak).');let[a,b='']=t.split('.');let n=BigInt(a)*S+BigInt(b.padEnd(6,'0'));if(n>1000000000n*S)throw Error('Değer en fazla 1.000.000.000 olabilir.');return n;}
const div=(a,b)=>(a+b/2n)/b;
export function calculate(f,s){
 let price=fixed(f.price),grams=fixed(f.grams),h=fixed(f.hours),m=fixed(f.minutes),w=fixed(f.waste),p=fixed(f.profit),c=fixed(f.commission);
 if(h%S||m%S||m>59n*S)throw Error('Saat tam sayı, dakika 0–59 arasında tam sayı olmalıdır.');
 if(c>=100n*S)throw Error('Komisyon %100’den küçük olmalıdır.');
 let duration=h*60n+m,filament=div(price*grams,1000n*S),electricity=s.electricOn?div(fixed(s.watts)*fixed(s.kwh)*duration,60000n*S*S):0n,machine=s.machineOn?div(fixed(s.machine)*duration,60n*S):0n;
 let base=filament+electricity+machine,loss=div(base*w,100n*S),extras=f.extras.reduce((a,e)=>a+fixed(e.amount),0n),total=base+loss+extras,target=div(total*p,100n*S),before=total+target,sale=f.protect?div(before*100n*S,100n*S-c):before,fee=div(sale*c,100n*S),revenue=sale-fee,net=revenue-total;
 return Object.fromEntries(Object.entries({filament,electricity,machine,loss,extras,total,target,sale,fee,revenue,net}).map(([k,v])=>[k,Number(v)/1e6]));
}
