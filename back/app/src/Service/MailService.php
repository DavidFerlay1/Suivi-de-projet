<?php

namespace App\Service;

use App\Entity\Main\Account;
use App\Entity\Main\Profile;
use Symfony\Component\DependencyInjection\EnvVarProcessorInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class MailService {
    public function __construct(private MailerInterface $mailer){}

    public function sendMail(string $to, string $subject, string $htmlContent) {
        $email = (new Email())
                    ->from('no-reply@erp.com')
                    ->to($to)
                    ->subject($subject)
                    ->html($htmlContent);

        $this->mailer->send($email);
    }

    public function sendPasswordRequestEmail(Account $account, string $token) {
        $redirect_url = $_ENV['RESET_PASSWORD_REQUEST_REDIRECT_URL'] . "/$token";
        
        $template = "<p>Clickez sur le lien suivant: <a href='$redirect_url'>$redirect_url</a> </p>";
        $this->sendMail($account->getUsername(), 'Demande de réinitialisation de mot de passe', $template);
    }

    public function sendAccountCreatedByAdminConfirmation(Account $account) {
        $pwd = $account->getRawPassword();

        $template = "
            <p>
                Un compte a été créé pour vous sur notre plateforme.<br/>
                Vous pouvez vous y connecter avec le mot de passe suivant:
            </p>
            <span>$pwd</span><br/>
            <b>Pensez à modifier votre mot de passe dès que possible </b>
        ";

        $this->sendMail($account->getUsername(), 'Compte créé sur ERP', $template);
    }
}