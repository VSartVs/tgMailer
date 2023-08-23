import Mailing from '../Models/Mailing'
import MailingStatuses from '../Enums/MailingStatuses'

class TgService {

  mailingId: number

  constructor(mailingId:number) {
    this.mailingId = mailingId
  }

  public init(isActive: boolean){
    const mailing =  Mailing.find(this.mailingId)
    if(mailing){
      mailing.statusId = isActive ? MailingStatuses.ACTIVE : MailingStatuses.COMPLETED
      mailing.save()
    }
  }

}

module.exports = TgService

