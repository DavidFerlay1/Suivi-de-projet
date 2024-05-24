<?php

declare(strict_types=1);

namespace DoctrineMigrations\Tenant;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240520092603 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE AccountRoleProfiles (id INT AUTO_INCREMENT NOT NULL, accountId INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE accountroleprofiles_roleprofile (accountroleprofiles_id INT NOT NULL, roleprofile_id INT NOT NULL, INDEX IDX_1955601540F67F58 (accountroleprofiles_id), INDEX IDX_19556015D0926079 (roleprofile_id), PRIMARY KEY(accountroleprofiles_id, roleprofile_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE accountroleprofiles_roleprofile ADD CONSTRAINT FK_1955601540F67F58 FOREIGN KEY (accountroleprofiles_id) REFERENCES AccountRoleProfiles (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE accountroleprofiles_roleprofile ADD CONSTRAINT FK_19556015D0926079 FOREIGN KEY (roleprofile_id) REFERENCES RoleProfile (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE accountroleprofiles_roleprofile DROP FOREIGN KEY FK_1955601540F67F58');
        $this->addSql('ALTER TABLE accountroleprofiles_roleprofile DROP FOREIGN KEY FK_19556015D0926079');
        $this->addSql('DROP TABLE AccountRoleProfiles');
        $this->addSql('DROP TABLE accountroleprofiles_roleprofile');
    }
}
