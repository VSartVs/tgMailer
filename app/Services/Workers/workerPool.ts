import {Worker} from 'worker_threads'
import path from 'path'
import Env from '@ioc:Adonis/Core/Env'
import Log from 'App/Models/Log'
import LogTypes from 'App/Enums/LogTypes'

class WorkerPool<N> {
    private queue: QueueItem<N>[] = []
    private workersById: { [key: number]: Worker } = {}
    private activeWorkersById: { [key: number]: boolean } = {}
    private activeBots: number[] = []
    private workerDb: Worker | null = null
    private maxQueueLength: number = Env.get('QUEUE_SIZE')

    public constructor(public workerPath: string, public numberOfThreads: number)
    {
        this.init()
    }

    private init()
    {
        if (this.numberOfThreads < 1)
            return null

        for (let i = 0; i < this.numberOfThreads; i += 1) {
            this.workersById[i] = new Worker(this.workerPath)
            this.activeWorkersById[i] = false
        }

        this.workerDb = new Worker(path.join(__dirname, './workerDB.ts'))
        this.workerDb.on('message', (mailings) => {
            mailings.forEach(mailing => {
                this.run(mailing)
            })
        })
    }

    private getInactiveWorkerId(): number
    {
        for (let i = 0; i < this.numberOfThreads; i += 1) {
            if (!this.activeWorkersById[i])
                return i
        }
        return -1
    }

    private async runWorker(workerId: number, queueItem: QueueItem<N>)
    {
        const worker = this.workersById[workerId]
        this.activeWorkersById[workerId] = true

        const messageCallback = (result: N) => {
            queueItem.callback(null, result)
            Log.create({message: 'Поток №' + workerId + ' освободился с результатом ' + result.message, type: LogTypes.SUCCESS })
            cleanUp(result.botId)
        }

        const errorCallback = (error: any) => {
            queueItem.callback(error)
            Log.create({message: 'Поток №' + workerId + ' завершился с ошибкой ' + error, type: LogTypes.ERROR })
            this.workersById[workerId] = new Worker(this.workerPath)
            cleanUp()
        }

        const cleanUp = (botId?: number | null) => {
            worker.removeAllListeners('message')
            worker.removeAllListeners('error')
            if (typeof botId === 'number') {
                this.activeWorkersById[workerId] = false
                this.activeBots.splice(this.activeBots.indexOf(botId), 1)
            }

            if (!this.queue.length || this.queue.length < this.maxQueueLength) {
                if(Env.get('NODE_ENV') !== 'production')
                    Log.create({message: 'Запрос к бд-потоку для получения новых рассылок, т.к размер очереди ' + this.queue.length, type: LogTypes.INFO })
                this.workerDb?.postMessage({activeBotsIds: this.activeBots, date: null})
            }

            let itemQueue = this.queue.shift()
            if (itemQueue !== undefined)
                this.runWorker(workerId, itemQueue)
        }

        worker.once('message', messageCallback)
        worker.once('error', errorCallback)

        worker.postMessage(queueItem.data)

        this.activeBots.push(queueItem.data.botId)

        if(Env.get('NODE_ENV') !== 'production')
            Log.create({message: 'Поток №' + workerId + ' взял в обработку рассылку ' + JSON.stringify(queueItem.data), type: LogTypes.INFO })
    }

    public run(data: { botId: number; mailingId: number; })
    {
        const availableWorkerId = this.getInactiveWorkerId()
        const queueItem: QueueItem<N> = {
            data,
            callback: (error, result) => {
                return new Promise<N>((resolve, reject) => {
                    if (error)
                        return reject(error)
                    if (result)
                        return resolve(result)
                })
            },
        }

        if (availableWorkerId === -1 || this.checkActiveBots(queueItem.data.botId)) {
            if (!this.checkActiveBots(queueItem.data.botId)) {
                this.queue.push(queueItem)
                if (Env.get('NODE_ENV') !== 'production')
                    Log.create({message: 'Рассылка '+JSON.stringify(data) + ' добавлена в очередь, т.к выполняются рассылки ботов '+this.activeBots, type: LogTypes.INFO})
            }
            if (Env.get('NODE_ENV') !== 'production')
                Log.create({message: 'Рассылка '+JSON.stringify(data) + ' не добавлена в очередь, т.к выполняются рассылки ботов '+this.activeBots, type: LogTypes.WARNING})
            return 'The mailing has been added to the queue'
        }

        this.runWorker(availableWorkerId, queueItem)
        return 'Mailing is active'
    }

    private checkActiveBots(botId: number)
    {
        return this.activeBots.includes(botId)
    }

    public updateDBWorkerTimer(date: string)
    {
        this.workerDb?.postMessage({activeBotsIds: [], date: date})
    }
}

export default new WorkerPool<number>(path.join(__dirname, './worker.ts'), Env.get('NUMBER_OF_THREADS'))
