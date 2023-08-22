import { Worker } from 'worker_threads';
import path from "path";
import Env from "@ioc:Adonis/Core/Env";


type QueueCallback<N> = (err: any, result?: N) => void;

interface QueueItem<T, N> {
  callback: QueueCallback<N>;
  getData: () => T;
}

class WorkerPool<T, N> {
  private queue: QueueItem<T, N>[] = [];
  private workersById: { [key: number]: Worker } = {};
  private activeWorkersById: { [key: number]: boolean } = {};

  public constructor(public workerPath: string, public numberOfThreads: number) {
    this.init();
  }

  private init() {
    if (this.numberOfThreads < 1) {
      return null;
    }

    for (let i = 0; i < this.numberOfThreads; i += 1) {
      const worker = new Worker(this.workerPath);

      this.workersById[i] = worker;
      this.activeWorkersById[i] = false;
    }
  }

  private getInactiveWorkerId(): number {
    for (let i = 0; i < this.numberOfThreads; i += 1) {
      if (!this.activeWorkersById[i]) {
        return i;
      }
    }

    return -1;
  }

  private async runWorker(workerId: number, queueItem: QueueItem<T, N>) {
    const worker = this.workersById[workerId];

    this.activeWorkersById[workerId] = true;

    const messageCallback = (result: N) => {
      queueItem.callback(null, result);
      cleanUp();
    };

    const errorCallback = (error: any) => {
      queueItem.callback(error);
      console.log('thread '+ workerId + ' is exit with error ' + error)
      cleanUp();
    };

    const cleanUp = () => {
      worker.removeAllListeners('message');
      worker.removeAllListeners('error');

      this.activeWorkersById[workerId] = false;
      console.log('thread is already free '+ workerId)
      console.log(this.queue)
      if (!this.queue.length) {
        return null;
      }

      let itemQueue =  this.queue.shift()
      if(itemQueue !== undefined)
        this.runWorker(workerId, itemQueue);
    };

    worker.once('message', messageCallback);
    worker.once('error', errorCallback);

    worker.postMessage(await queueItem.getData());

  }

  public run(getData: () => T) {
    return new Promise<N>((resolve, reject) => {
      const availableWorkerId = this.getInactiveWorkerId();

      const queueItem: QueueItem<T, N> = {
        getData,
        callback: (error, result) => {
          if (error) {
            return reject(error);
          }
          if(result)
            return resolve(result);
        },
      };

      if (availableWorkerId === -1) {
        this.queue.push(queueItem);
        console.log('Mailing is in queue! ' + queueItem.getData().i)
        return null;
      }
      console.log('free thread '+ availableWorkerId)

      this.runWorker(availableWorkerId, queueItem);

      return null;
    });
  }

  public async getQueue() {
    return this.queue
  }
}

export default new WorkerPool<{ i: number }, number>(path.join(__dirname, './worker.ts'), Env.get('NUMBER_OF_THREADS'))
