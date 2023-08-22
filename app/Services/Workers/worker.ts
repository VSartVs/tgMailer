const { isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  throw new Error('Its not a worker');
}


function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

async function loop(){
  let i = 0;
  while (i < 30) {
    await delay(2000)
    i++
  }
}


parentPort.on('message', (data) => {
  console.log('START mailing # '+data.i);

  loop().then(() => {
    parentPort.postMessage('END of mailing # '+data.i);
    console.log('END of mailing # '+data.i);
  })

});
