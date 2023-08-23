declare module '@ioc:App/Services/MailingService' {

  export interface MailingServiceContract {
    data: object
    saveData(data:object): Promise<string>,

  }
}
