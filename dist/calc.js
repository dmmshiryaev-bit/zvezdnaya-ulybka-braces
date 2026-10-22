/* Prices are published line items, not a confirmed complete treatment package. */
(function(global){
  const systems = Object.freeze({
    metalLig:{name:'Металлические лигатурные',price:39500,unit:'1 челюсть',knownUnit:true},
    metalSelf:{name:'Металлические самолигирующие',price:75000,unit:'1 челюсть',knownUnit:true},
    ceramicLig:{name:'Керамические лигатурные',price:54000,unit:'объём уточняется',knownUnit:false},
    ceramicSelf:{name:'Керамические самолигирующие',price:95500,unit:'1 челюсть',knownUnit:true}
  });
  function paymentSchedule(total){
    if(!Number.isFinite(total)||total<=0)throw new Error('Сумма должна быть положительной');
    const totalKopecks=Math.round(total*100);
    const initial=Math.round(totalKopecks*.5);
    const balance=totalKopecks-initial;
    const monthly=Math.round(balance*.15);
    const last=balance-monthly*6;
    return {total:totalKopecks/100,initial:initial/100,monthly:monthly/100,last:last/100,payments:[initial,...Array(6).fill(monthly),last].map(x=>x/100)};
  }
  function quote(key,arches){
    const item=systems[key];if(!item)throw new Error('Неизвестная система');
    const count=item.knownUnit&&arches===2?2:1;
    const total=item.price*count;
    return {item,key,count,total,schedule:paymentSchedule(total),isFullTreatment:false,unitUnconfirmed:!item.knownUnit};
  }
  global.BracesCalc={systems,paymentSchedule,quote};
  if(typeof module!=='undefined'&&module.exports)module.exports=global.BracesCalc;
})(typeof window!=='undefined'?window:globalThis);
