import {Worker } from 'worker_threads'
import path from 'path'
import Env from '@ioc:Adonis/Core/Env'

class WorkerPool<N> {
    private queue: QueueItem<N>[] = [];
    private workersById: { [key: number]: Worker } = {};
    private activeWorkersById: { [key: number]: boolean } = {};
    private activeBots: number[] = []
    private workerDb: Worker | null = null
    private maxQueueLength: number = Env.get('QUEUE_SIZE')


    public constructor(public workerPath: string, public numberOfThreads: number) {
        this.init();
    }

    private init() {
        if (this.numberOfThreads < 1) {
            return null;
        }

        for (let i = 0; i < this.numberOfThreads; i += 1) {
            this.workersById[i] = new Worker(this.workerPath);
            this.activeWorkersById[i] = false;
        }
        this.workerDb = new Worker(path.join(__dirname, './workerDB.ts'))

        this.workerDb.on('message', (mailings) => {
            console.log('on message from dbWorker')
            console.log(mailings)
            mailings.forEach(mailing => {
                this.run({botId: mailing.bot_id, mailingId: mailing.id})
            })
        });
    }

    private getInactiveWorkerId(): number {
        for (let i = 0; i < this.numberOfThreads; i += 1) {
            if (!this.activeWorkersById[i]) {
                return i;
            }
        }

        return -1;
    }

    private async runWorker(workerId: number, queueItem: QueueItem<N>) {
        const worker = this.workersById[workerId];

        this.activeWorkersById[workerId] = true;

        const messageCallback = (result: N) => {
            queueItem.callback(null, result);

            cleanUp(result.botId);
        };

        const errorCallback = (error: any) => {
            queueItem.callback(error);
            console.log('thread ' + workerId + ' is exit with error ' + error)
            cleanUp();
        };

        const cleanUp = (botId?: number | null) => {
            worker.removeAllListeners('message');
            worker.removeAllListeners('error');
            if (typeof botId === "number") {
                this.activeWorkersById[workerId] = false;
                this.activeBots.splice(this.activeBots.indexOf(botId), 1)
            }
            console.log('thread is already free ' + workerId)
            if (!this.queue.length || this.queue.length < this.maxQueueLength) {
                this.workerDb.postMessage({activeBotsIds: this.activeBots, date: null});
            }

            let itemQueue = this.queue.shift()

            if (itemQueue !== undefined)
                this.runWorker(workerId, itemQueue)

        }

        worker.once('message', messageCallback);
        worker.once('error', errorCallback);

        worker.postMessage(queueItem.data);

        this.activeBots.push(queueItem.data.botId)


    }

    public run(data: { botId: number; mailingId: number; }) {

        const availableWorkerId = this.getInactiveWorkerId();

        const queueItem: QueueItem<N> = {
            data,
            callback: (error, result) => {
                return new Promise<N>((resolve, reject) => {
                    if (error) {
                        return reject(error);
                    }
                    if (result)
                        return resolve(result);
                })
            },
        };

        if (availableWorkerId === -1 || this.checkActiveBots(queueItem.data.botId)) {
            if (!this.checkActiveBots(queueItem.data.botId))
                this.queue.push(queueItem);
            console.log('Mailing is in queue! ' + queueItem.data)
            return 'The mailing has been added to the queue'
        }
        console.log('free thread ' + availableWorkerId)

        this.runWorker(availableWorkerId, queueItem);

        return 'Mailing is active'

    }

    private checkActiveBots(botId: number) {
        console.log('active Bots ', this.activeBots)
        return this.activeBots.includes(botId)
    }

    public updateDBWorkerTimer(date: string){
        this.workerDb?.postMessage({activeBotsIds: [], date: date})

    }

}

export default new WorkerPool<number>(path.join(__dirname, './worker.ts'), Env.get('NUMBER_OF_THREADS'))
