
type QueueCallback<N> = (err: any, result?: N) => void;

type data = {botId: number, mailingId: number}
interface QueueItem<N> {
  callback: QueueCallback<N>;
  data: data;
}
