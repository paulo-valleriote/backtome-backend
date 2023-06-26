import { PasswordRecoveryMailDTO } from '@infra/http/dtos/User/passwordRecovery.dto';
import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import env from 'src/env';

@Processor('mail')
export class MailProcessorService {
  constructor(private mailService: MailerService) {}
  @Process('mail-job')
  sendMailJob(job: Job<PasswordRecoveryMailDTO>) {
    this.mailService.sendMail({
      from: env.MAILER_SENDER,
      to: job.data.email,
      subject: 'Redefinição de senha',
      date: new Date(),
      html: `Olá! Nós sentimos sua falta, <a href={${job.data.recoveryLink}} clique aqui</a> para redefinir sua senha\n\nBem vindo(a) de volta!`,
    });
  }

  @OnQueueActive()
  logEmailBeeingSent() {
    console.log('O E-mail está sendo enviado');
  }

  @OnQueueCompleted()
  logEmailSended() {
    console.log('O E-mail foi enviado!');
  }
}