const { isMainThread, parentPort } = require('worker_threads')

if (isMainThread) {
  throw new Error('Its not a worker');
}


function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

async function loop(){
    await delay(5000)
}



parentPort.on('message', (mailing: object) => {
  console.log('start mailing # ' + mailing.mailingId)

  loop().then(() => {
    parentPort.postMessage({botId: mailing.botId});
    console.log('END of mailing # '+ mailing.mailingId);
  })


});
